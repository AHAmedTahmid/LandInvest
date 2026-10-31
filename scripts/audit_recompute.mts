// Report recomputation vs raw SQL (Section 7). Run via: npx tsx scripts/audit_recompute.mts [tenantDb]
import { queryCashBook } from "../src/lib/reports/cash-book";
import { queryPartnerCapital } from "../src/lib/reports/partner-capital";
import { querySalesRegister } from "../src/lib/reports/sales-register";
import { PrismaClient } from "../src/generated/tenant/index.js";

const DB = process.argv[2] || "tenant_alpha";
const prisma = new PrismaClient({ datasources: { db: { url: `mysql://root:@localhost:3306/${DB}` } } });
let pass = 0, fail = 0;
const check = (n: string, ok: boolean, d = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${n}${d ? "  --  " + d : ""}`); };
const r2 = (n: number) => Math.round(n * 100) / 100;

// cash-book totals vs SQL
const cash = await queryCashBook(prisma, {});
const [sqlCash]: any = await prisma.$queryRawUnsafe(
  "SELECT COALESCE(SUM(CASE WHEN flow_type='IN' THEN amount ELSE 0 END),0) tin, COALESCE(SUM(CASE WHEN flow_type='OUT' THEN amount ELSE 0 END),0) tout FROM treasury_ledger WHERE account_type='CASH'"
);
check("cash-book totalIn == SQL IN", r2((cash.totals as any)?.in ?? 0) === r2(Number(sqlCash?.tin)), `report=${r2((cash.totals as any)?.in ?? 0)} sql=${r2(Number(sqlCash?.tin))}`);
check("cash-book totalOut == SQL OUT", r2((cash.totals as any)?.out ?? 0) === r2(Number(sqlCash?.tout)), `report=${r2((cash.totals as any)?.out ?? 0)} sql=${r2(Number(sqlCash?.tout))}`);
check("cash-book closing == IN-OUT", r2((cash.totals as any)?.balance ?? 0) === r2(Number(sqlCash?.tin) - Number(sqlCash?.tout)));
check("cash-book rowcount == SQL", cash.rows.length === Number(((await prisma.$queryRawUnsafe("SELECT COUNT(*) c FROM treasury_ledger WHERE account_type='CASH'")) as any[])[0]?.c));

// partner-capital closing balances vs SQL
const partners = await prisma.partner.findMany();
const sqlPartners: any = await prisma.$queryRawUnsafe(
  "SELECT p.id, p.opening_balance + COALESCE((SELECT SUM(CASE WHEN t.txn_type IN ('DEPOSIT','DIRECT_EXPENSE','PROFIT_CREDIT') THEN t.amount WHEN t.txn_type='WITHDRAWAL' THEN -t.amount ELSE 0 END) FROM partner_transactions t WHERE t.partner_id=p.id),0) bal FROM partners p"
);
const sqlById = new Map((sqlPartners as any[]).map((s: any) => [s.id, r2(Number(s.bal))]));
let pm = 0, pt = 0;
for (const p of partners) {
  const rep = await queryPartnerCapital(prisma, { partnerId: p.id });
  pt++;
  if (sqlById.has(p.id) && Math.abs((sqlById.get(p.id) ?? 0) - r2(Number(rep.totals?.balance ?? 0))) < 0.01) pm++;
  else console.log(`   mismatch ${p.name}: report=${r2(Number(rep.totals?.balance ?? 0))} sql=${sqlById.get(p.id)}`);
}
check("partner-capital balances match SQL", pt > 0 && pm === pt, `${pm}/${pt}`);

// sales-register totals vs SQL
const sr = await querySalesRegister(prisma, {});
const [sqlSales]: any = await prisma.$queryRawUnsafe(
  "SELECT COALESCE(SUM(total_agreed_price),0) agg, COALESCE((SELECT SUM(amount_paid) FROM customer_payments),0) paid FROM land_sales"
);
check("sales-register agreed == SQL", r2(sr.totals?.agreedPrice ?? 0) === r2(Number(sqlSales?.agg)));
check("sales-register paid == SQL", r2(sr.totals?.paid ?? 0) === r2(Number(sqlSales?.paid)));
check("sales-register due == agreed-paid", r2(sr.totals?.due ?? 0) === r2(Number(sqlSales?.agg) - Number(sqlSales?.paid)));
check("sales-register rowcount == SQL", sr.rows.length === Number(((await prisma.$queryRawUnsafe("SELECT COUNT(*) c FROM land_sales")) as any[])[0]?.c));

await prisma.$disconnect();
console.log(`REPORT_RECOMPUTE ${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
