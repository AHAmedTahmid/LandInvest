import mysql from "mysql2/promise";
import { randomUUID } from "crypto";

async function seed() {
  console.log("Starting realistic seed data insertion for tenant_demo...");
  const conn = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "tenant_demo",
  });

  const ACTOR_ID = "00000000-0000-0000-0000-000000000001";

  async function audit(table, recordId, action = "INSERT", data = null) {
    await conn.query(
      `INSERT INTO audit_log (id, table_name, record_id, action, changed_by, new_values, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [randomUUID(), table, recordId, action, ACTOR_ID, data ? JSON.stringify(data) : null]
    );
  }

  // 1. Clean existing transactional tables while keeping roles & users
  console.log("Cleaning old tables...");
  const tables = [
    "customer_payments",
    "installment_schedule",
    "land_sales",
    "project_plots",
    "project_expenses",
    "treasury_ledger",
    "partner_transactions",
    "project_partners",
    "land_projects",
    "partners",
    "bank_accounts",
    "dashboard_settings",
    "audit_log",
  ];

  await conn.query("SET FOREIGN_KEY_CHECKS = 0;");
  for (const t of tables) {
    try {
      await conn.query(`TRUNCATE TABLE ${t};`);
    } catch (e) {
      // ignore
    }
  }
  await conn.query("SET FOREIGN_KEY_CHECKS = 1;");

  // 2. Bank Accounts
  console.log("Creating bank accounts...");
  const bank1 = { id: randomUUID(), name: "Dutch-Bangla Bank PLC", acc: "115.120.45892", branch: "Motijheel Branch", bal: 4250000.00 };
  const bank2 = { id: randomUUID(), name: "BRAC Bank PLC", acc: "206.554.89120", branch: "Gulshan Branch", bal: 2850000.00 };
  const bank3 = { id: randomUUID(), name: "City Bank PLC", acc: "310.229.74011", branch: "Dhanmondi Branch", bal: 950000.00 };

  for (const b of [bank1, bank2, bank3]) {
    await conn.query(
      `INSERT INTO bank_accounts (id, bank_name, account_number, branch_name, current_balance, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
      [b.id, b.name, b.acc, b.branch, b.bal]
    );
  }

  // 3. Partners & Capital
  console.log("Creating syndicate partners...");
  const p1 = { id: randomUUID(), name: "Engr. Rafiqul Islam", phone: "01713000001", nid: "1982269123456", openBal: 5000000.00 };
  const p2 = { id: randomUUID(), name: "Barrister Tariq Ahmed", phone: "01814000002", nid: "1985269654321", openBal: 3500000.00 };
  const p3 = { id: randomUUID(), name: "Haji Abdul Gafur", phone: "01915000003", nid: "1978269789012", openBal: 2500000.00 };
  const p4 = { id: randomUUID(), name: "Dr. Nusrat Jahan", phone: "01616000004", nid: "1989269345678", openBal: 2000000.00 };

  for (const p of [p1, p2, p3, p4]) {
    await conn.query(
      `INSERT INTO partners (id, name, phone, nid_number, opening_balance, created_at) VALUES (?, ?, ?, ?, ?, NOW())`,
      [p.id, p.name, p.phone, p.nid, p.openBal]
    );

    const ptId = randomUUID();
    await conn.query(
      `INSERT INTO partner_transactions (id, partner_id, txn_type, amount, txn_date, notes, created_at) VALUES (?, ?, 'DEPOSIT', ?, '2026-07-05', 'Initial syndicate equity deposit', NOW())`,
      [ptId, p.id, p.openBal]
    );
  }

  // 4. Land Projects
  console.log("Creating realistic land development projects...");
  const proj1 = {
    id: randomUUID(),
    name: "Green Valley City",
    mouza: "Savar",
    jl: "142",
    dag: "891, 892, 895",
    khatian: "SA-310, RS-542",
    shotok: 60.00,
    price: 12000000.00,
    bayna: 2500000.00,
    regCost: 1250000.00,
    taxCost: 220000.00,
    status: "PURCHASED",
  };

  const proj2 = {
    id: randomUUID(),
    name: "River View Township",
    mouza: "Keraniganj",
    jl: "88",
    dag: "450, 451, 453",
    khatian: "CS-120, RS-880",
    shotok: 80.00,
    price: 18000000.00,
    bayna: 4000000.00,
    regCost: 1850000.00,
    taxCost: 350000.00,
    status: "PURCHASED",
  };

  const proj3 = {
    id: randomUUID(),
    name: "Lake Garden Oasis",
    mouza: "Purbachal Sector 22",
    jl: "105",
    dag: "112, 114",
    khatian: "RS-990",
    shotok: 45.00,
    price: 9500000.00,
    bayna: 2000000.00,
    regCost: 0.00,
    taxCost: 0.00,
    status: "UNDER_BAYNA",
  };

  for (const pr of [proj1, proj2, proj3]) {
    await conn.query(
      `INSERT INTO land_projects (id, project_name, mouza, jl_number, dag_numbers, khatian_numbers, total_area_shotok, purchase_price, bayna_amount, registration_cost, mutation_tax_cost, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 70 DAY))`,
      [pr.id, pr.name, pr.mouza, pr.jl, pr.dag, pr.khatian, pr.shotok, pr.price, pr.bayna, pr.regCost, pr.taxCost, pr.status]
    );

    // Link Partners with Share %
    await conn.query(
      `INSERT INTO project_partners (id, project_id, partner_id, share_percentage) VALUES
       (?, ?, ?, 40.00),
       (?, ?, ?, 25.00),
       (?, ?, ?, 20.00),
       (?, ?, ?, 15.00)`,
      [randomUUID(), pr.id, p1.id, randomUUID(), pr.id, p2.id, randomUUID(), pr.id, p3.id, randomUUID(), pr.id, p4.id]
    );
  }

  // 5. Plots
  console.log("Generating plots for projects...");
  const plotsList = [];
  for (let i = 1; i <= 10; i++) {
    const status = i <= 6 ? "BOOKED" : i === 7 ? "SOLD" : "AVAILABLE";
    const plotId = randomUUID();
    plotsList.push({ id: plotId, projId: proj1.id, num: `GV-${String(i).padStart(2, "0")}`, shotok: 5.0, price: 2200000.00, status });
  }

  for (let i = 1; i <= 12; i++) {
    const status = i <= 4 ? "BOOKED" : i === 5 ? "SOLD" : "AVAILABLE";
    const plotId = randomUUID();
    plotsList.push({ id: plotId, projId: proj2.id, num: `RV-${String(i).padStart(2, "0")}`, shotok: 5.0, price: 2500000.00, status });
  }

  for (let i = 1; i <= 8; i++) {
    const plotId = randomUUID();
    plotsList.push({ id: plotId, projId: proj3.id, num: `LG-${String(i).padStart(2, "0")}`, shotok: 5.0, price: 2100000.00, status: "AVAILABLE" });
  }

  for (const pl of plotsList) {
    await conn.query(
      `INSERT INTO project_plots (id, project_id, plot_number, plot_size_shotok, asking_price, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [pl.id, pl.projId, pl.num, pl.shotok, pl.price, pl.status]
    );
  }

  // 6. Sales, Installments & Customer Payments
  console.log("Creating realistic plot sales and payment records with audit logs...");
  const buyers = [
    { name: "Mohammad Shahidullah", phone: "01720111222", nid: "5501234981" },
    { name: "Farhana Yasmin", phone: "01820222333", nid: "5502345872" },
    { name: "Kabir Hossain", phone: "01920333444", nid: "5503456763" },
    { name: "Nazmul Haque", phone: "01620444555", nid: "5504567654" },
    { name: "Sultana Razia", phone: "01730555666", nid: "5505678545" },
    { name: "Dr. Aminul Islam", phone: "01830666777", nid: "5506789436" },
    { name: "Tanvir Hasan", phone: "01930777888", nid: "5507890327" },
    { name: "Advocate Shafiul Alam", phone: "01630888999", nid: "5508901218" },
    { name: "Salma Begum", phone: "01740999000", nid: "5509012109" },
    { name: "Mahfuzur Rahman", phone: "01840000111", nid: "5500123090" },
    { name: "Jahangir Kabir", phone: "01940111222", nid: "5501234081" },
    { name: "Rehana Akter", phone: "01640222333", nid: "5502345072" },
  ];

  const soldOrBookedPlots = plotsList.filter((p) => p.status === "BOOKED" || p.status === "SOLD");

  for (let i = 0; i < soldOrBookedPlots.length; i++) {
    const pl = soldOrBookedPlots[i];
    const buyer = buyers[i % buyers.length];
    const saleId = randomUUID();
    const saleDate = i < 6 ? "2026-08-15" : "2026-09-10";
    const agreedPrice = pl.price;
    const bookingAdvance = 500000.00;
    const remaining = agreedPrice - bookingAdvance;
    const installmentCount = 10;
    const monthlyDue = Math.round(remaining / installmentCount);

    await conn.query(
      `INSERT INTO land_sales (id, project_id, plot_id, buyer_name, buyer_phone, buyer_nid, sale_date, total_agreed_price, advance_booking_amount, current_due_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [saleId, pl.projId, pl.id, buyer.name, buyer.phone, buyer.nid, saleDate, agreedPrice, bookingAdvance, remaining, pl.status]
    );
    await audit("land_sales", saleId, "INSERT", { buyerName: buyer.name, totalAgreedPrice: agreedPrice });

    // Initial Booking Payment
    const receiptNo = `RCT-2026-${String(i + 1).padStart(4, "0")}`;
    const pmtId = randomUUID();
    await conn.query(
      `INSERT INTO customer_payments (id, sale_id, payment_date, amount_paid, payment_method, bank_account_id, receiptNo, remarks)
       VALUES (?, ?, ?, ?, 'BANK', ?, ?, 'Plot advance booking deposit')`,
      [pmtId, saleId, saleDate, bookingAdvance, bank1.id, receiptNo]
    );
    await audit("customer_payments", pmtId, "INSERT", { amountPaid: bookingAdvance, receiptNo });

    // Installment Schedules (Monthly)
    for (let m = 1; m <= installmentCount; m++) {
      const scheduleId = randomUUID();
      const dueDate = new Date(2026, 7 + m, 10);
      const isPast = dueDate <= new Date();
      let status = "UPCOMING";

      if (isPast) {
        if (i % 3 === 0) {
          status = "OVERDUE";
        } else {
          status = "PAID";
          const instReceipt = `RCT-INST-${String(i + 1)}-${m}`;
          const instPmtId = randomUUID();
          await conn.query(
            `INSERT INTO customer_payments (id, sale_id, payment_date, amount_paid, payment_method, bank_account_id, receiptNo, remarks)
             VALUES (?, ?, ?, ?, 'BANK', ?, ?, 'Installment payment')`,
            [instPmtId, saleId, dueDate.toISOString().slice(0, 10), monthlyDue, bank2.id, instReceipt]
          );
          await audit("customer_payments", instPmtId, "INSERT", { amountPaid: monthlyDue, receiptNo: instReceipt });
        }
      }

      await conn.query(
        `INSERT INTO installment_schedule (id, sale_id, due_date, due_amount, status)
         VALUES (?, ?, ?, ?, ?)`,
        [scheduleId, saleId, dueDate.toISOString().slice(0, 10), monthlyDue, status]
      );
    }
  }

  // 7. Project Expenses & Vouchers
  console.log("Recording project development expenses, vouchers & audit records...");
  const expenseCategories = [
    { cat: "Registration", amt: 350000.00, pur: "Sub-registry stamp duty & document drafting" },
    { cat: "Mutation", amt: 120000.00, pur: "AC Land office official mutation fees" },
    { cat: "Survey", amt: 85000.00, pur: "Cadastral digital boundary demarcation by survey team" },
    { cat: "Labor", amt: 240000.00, pur: "Site clearing and boundary fence earthwork labor" },
    { cat: "Misc", amt: 65000.00, pur: "Site signboards, security bamboo posts, and tea hospitality" },
  ];

  for (const exp of expenseCategories) {
    const expId = randomUUID();
    await conn.query(
      `INSERT INTO project_expenses (id, project_id, expense_category, amount, expense_date, payment_channel, description, status, created_by, created_at)
       VALUES (?, ?, ?, ?, '2026-09-20', 'CASH', ?, 'APPROVED', ?, NOW())`,
      [expId, proj1.id, exp.cat, exp.amt, exp.pur, ACTOR_ID]
    );
    await audit("project_expenses", expId, "INSERT", { amount: exp.amt, category: exp.cat });

    // Ledger entry
    const ledId = randomUUID();
    await conn.query(
      `INSERT INTO treasury_ledger (id, txn_date, account_type, flow_type, amount, purpose, reference_type, reference_id, created_by, created_at)
       VALUES (?, '2026-09-20', 'CASH', 'OUT', ?, ?, 'EXPENSE', ?, ?, NOW())`,
      [ledId, exp.amt, exp.pur, expId, ACTOR_ID]
    );
    await audit("treasury_ledger", ledId, "INSERT", { amount: exp.amt, flowType: "OUT" });
  }

  // Add 3 Pending Vouchers
  const pendingVouchers = [
    { id: randomUUID(), prId: proj1.id, cat: "Labor", amt: 185000.00, desc: "Earth filling contractor 2nd bill", chan: "CASH", days: 5 },
    { id: randomUUID(), prId: proj2.id, cat: "Misc", amt: 45000.00, desc: "Site security guard monthly honorarium", chan: "CASH", days: 4 },
    { id: randomUUID(), prId: proj2.id, cat: "Misc", amt: 120000.00, desc: "Deep tube-well installation quotation", chan: "BANK", days: 2 },
  ];

  for (const pv of pendingVouchers) {
    await conn.query(
      `INSERT INTO project_expenses (id, project_id, expense_category, amount, expense_date, payment_channel, description, status, created_by, created_at)
       VALUES (?, ?, ?, ?, '2026-10-25', ?, ?, 'PENDING', ?, DATE_SUB(NOW(), INTERVAL ? DAY))`,
      [pv.id, pv.prId, pv.cat, pv.amt, pv.chan, pv.desc, ACTOR_ID, pv.days]
    );
    await audit("project_expenses", pv.id, "INSERT", { amount: pv.amt, status: "PENDING" });
  }

  // 8. Treasury Ledger Inflows (Cash & Bank)
  console.log("Populating treasury ledger entries...");
  const inflows = [
    { id: randomUUID(), date: "2026-08-01", type: "CASH", amt: 1500000.00, pur: "Cash in hand initial syndicate float", ref: "DEPOSIT" },
    { id: randomUUID(), date: "2026-09-01", type: "CASH", amt: 500000.00, pur: "Plot booking advance cash receipt", ref: "SALE" },
    { id: randomUUID(), date: "2026-10-15", type: "BANK", amt: 2850000.00, pur: "Customer installment collections batch", ref: "COLLECTION" },
  ];

  for (const inf of inflows) {
    await conn.query(
      `INSERT INTO treasury_ledger (id, txn_date, account_type, flow_type, amount, purpose, reference_type, created_by, created_at)
       VALUES (?, ?, ?, 'IN', ?, ?, ?, ?, NOW())`,
      [inf.id, inf.date, inf.type, inf.amt, inf.pur, inf.ref, ACTOR_ID]
    );
    await audit("treasury_ledger", inf.id, "INSERT", { amount: inf.amt, flowType: "IN" });
  }

  // 9. Dashboard Settings
  console.log("Configuring dashboard alert thresholds...");
  await conn.query(
    `INSERT INTO dashboard_settings (id, setting_key, setting_value, updated_at) VALUES
     (?, 'min_cash_balance', '500000', NOW()),
     (?, 'critical_cash_balance', '200000', NOW()),
     (?, 'voucher_pending_days', '3', NOW()),
     (?, 'voucher_pending_count', '3', NOW())`,
    [randomUUID(), randomUUID(), randomUUID(), randomUUID()]
  );

  await conn.end();
  console.log("✓ Realistic seed data successfully inserted with audit compliance!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
