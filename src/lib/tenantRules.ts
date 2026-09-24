import { randomUUID } from "crypto";
// Rule helpers - call from server actions/API routes

// 1. PAID_BY_PARTNER -> only partner_transactions, never treasury_ledger
export function isPaidByPartner(channel: string) { return channel === "PAID_BY_PARTNER"; }

// 2. audit helper - must be called for every write on 5 tables
export async function writeAudit(tx: any, tableName: string, recordId: string, action: "CREATE"|"UPDATE"|"DELETE", changedBy: string, oldValues: any, newValues: any) {
  await tx.auditLog.create({ data: { id: randomUUID(), tableName, recordId, action, changedBy, oldValues, newValues } });
}

// 3. partner live balance - always compute, never cache
export async function getPartnerBalance(tx: any, partnerId: string): Promise<number> {
  const rows: any[] = await tx.$queryRaw`SELECT txn_type, SUM(amount) as s FROM partner_transactions WHERE partner_id=${partnerId} GROUP BY txn_type`;
  let bal = 0;
  for (const r of rows) {
    const s = Number(r.s);
    if (["DEPOSIT","DIRECT_EXPENSE","PROFIT_CREDIT"].includes(r.txn_type)) bal += s;
    else if (r.txn_type === "WITHDRAWAL") bal -= s;
  }
  return bal;
}

// 4. plot sale atomic - use in transaction
export async function sellPlot(tx: any, plotId: string, saleData: any, changedBy: string) {
  const plot = await tx.projectPlot.findUnique({ where: { id: plotId } });
  if (!plot || plot.status !== "AVAILABLE") throw new Error("Plot not available");
  await tx.projectPlot.update({ where: { id: plotId }, data: { status: "BOOKED" } });
  const sale = await tx.landSale.create({ data: saleData });
  await writeAudit(tx, "land_sales", sale.id, "CREATE", changedBy, null, saleData);
  await writeAudit(tx, "project_plots", plotId, "UPDATE", changedBy, { status: "AVAILABLE" }, { status: "BOOKED" });
  // also sync land_sales.status already BOOKED in same tx
  return sale;
}
