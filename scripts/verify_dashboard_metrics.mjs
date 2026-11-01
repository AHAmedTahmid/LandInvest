import mysql from "mysql2/promise";

async function main() {
  const conn = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "tenant_demo",
  });

  const [sales] = await conn.query("SELECT COUNT(*) as count, SUM(total_agreed_price) as agreed FROM land_sales WHERE status != 'CANCELLED'");
  const [payments] = await conn.query("SELECT COUNT(*) as count, SUM(amount_paid) as paid FROM customer_payments");
  const [plots] = await conn.query("SELECT COUNT(*) as count, SUM(asking_price) as unsold FROM project_plots WHERE status = 'AVAILABLE'");
  const [cash] = await conn.query("SELECT SUM(IF(flow_type='IN', amount, -amount)) as bal FROM treasury_ledger WHERE account_type = 'CASH'");
  const [bank] = await conn.query("SELECT SUM(current_balance) as bal FROM bank_accounts WHERE is_active = 1");
  const [overdue] = await conn.query("SELECT COUNT(*) as count, SUM(due_amount) as due FROM installment_schedule WHERE status = 'OVERDUE'");
  const [vouchers] = await conn.query("SELECT COUNT(*) as count, SUM(amount) as amt FROM project_expenses WHERE status = 'PENDING'");

  const agreed = Number(sales[0].agreed) || 0;
  const paid = Number(payments[0].paid) || 0;
  const receivables = agreed - paid;

  console.log("=== TENANT_DEMO REALISTIC AUDIT RESULTS ===");
  console.log(`Active Sales (${sales[0].count}): ৳ ${agreed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  console.log(`Collections (${payments[0].count}): ৳ ${paid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  console.log(`Computed Receivables: ৳ ${receivables.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  console.log(`Unsold Plots (${plots[0].count}): ৳ ${Number(plots[0].unsold).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  console.log(`Cash in Hand: ৳ ${Number(cash[0].bal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  console.log(`Bank Balances Total: ৳ ${Number(bank[0].bal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  console.log(`Overdue Installments (${overdue[0].count}): ৳ ${Number(overdue[0].due).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  console.log(`Pending Vouchers (${vouchers[0].count}): ৳ ${Number(vouchers[0].amt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  console.log("==========================================");

  await conn.end();
}

main().catch(console.error);

