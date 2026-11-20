import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export const receiptsPaymentsColumns: ReportColumn[] = [
  { key: "category", labelEn: "Head of Account / Particulars", labelBn: "হিসাব খাত / বিবরণ" },
  { key: "classification", labelEn: "Nature / Class", labelBn: "শ্রেণী" },
  { key: "cashAmount", labelEn: "Cash (৳)", labelBn: "নগদ (৳)", type: "number", align: "right" },
  { key: "bankAmount", labelEn: "Bank & MFS (৳)", labelBn: "ব্যাংক ও এমএফএস (৳)", type: "number", align: "right" },
  { key: "totalAmount", labelEn: "Total Amount (৳)", labelBn: "মোট পরিমাণ (৳)", type: "number", align: "right" },
];

export async function queryReceiptsPayments(prisma: any, filters: ReportFilters): Promise<ReportData> {
  // 1. Calculate Opening Balances (Cash and Bank & MFS) prior to filters.from
  let openingCash = 0;
  let openingBank = 0;

  if (filters.from) {
    const fromDate = new Date(filters.from);
    const priorRows = await prisma.treasuryLedger.findMany({
      where: {
        txnDate: { lt: fromDate },
      },
      select: {
        accountType: true,
        flowType: true,
        amount: true,
      },
    });

    for (const r of priorRows) {
      const amt = toNum(r.amount);
      if (r.accountType === "CASH") {
        openingCash += r.flowType === "IN" ? amt : -amt;
      } else {
        openingBank += r.flowType === "IN" ? amt : -amt;
      }
    }
  }

  const openingTreasury = openingCash + openingBank;

  // 2. Fetch period transactions
  const where: any = {};
  if (filters.from || filters.to) {
    where.txnDate = {};
    if (filters.from) where.txnDate.gte = new Date(filters.from);
    if (filters.to) {
      const toDate = new Date(filters.to);
      if (filters.to.length <= 10) toDate.setHours(23, 59, 59, 999);
      where.txnDate.lte = toDate;
    }
  }

  const rows = await prisma.treasuryLedger.findMany({
    where,
    orderBy: [{ txnDate: "asc" }],
    select: {
      id: true,
      txnDate: true,
      accountType: true,
      flowType: true,
      amount: true,
      purpose: true,
      referenceType: true,
      referenceId: true,
    },
  });

  // 3. Resolve project expense categories for any expense reference
  const expenseIds = rows
    .filter((r: any) => r.referenceType === "EXPENSE" && r.referenceId)
    .map((r: any) => r.referenceId);

  const expenseCategoryMap = new Map<string, string>();
  if (expenseIds.length > 0) {
    const expenses = await prisma.projectExpense.findMany({
      where: { id: { in: expenseIds } },
      select: { id: true, expenseCategory: true },
    });
    for (const e of expenses) {
      expenseCategoryMap.set(e.id, e.expenseCategory);
    }
  }

  // 4. Categorize Receipts & Payments with Cash vs Bank split
  type SubCatAccumulator = {
    categoryEn: string;
    categoryBn: string;
    classificationEn: string;
    classificationBn: string;
    cash: number;
    bank: number;
    count: number;
  };

  const receiptsMap = new Map<string, SubCatAccumulator>();
  const paymentsMap = new Map<string, SubCatAccumulator>();

  let periodCashIn = 0;
  let periodCashOut = 0;
  let periodBankIn = 0;
  let periodBankOut = 0;

  for (const r of rows) {
    const amt = toNum(r.amount);
    const isCash = r.accountType === "CASH";

    if (r.flowType === "IN") {
      if (isCash) periodCashIn += amt;
      else periodBankIn += amt;

      let key = "OTHER";
      let catEn = "Other Operational Inflows";
      let catBn = "অন্যান্য পরিচালনা আদায়";
      let classEn = "Operating Receipts";
      let classBn = "পরিচালনা আদায়";

      if (r.referenceType === "COLLECTION") {
        key = "COLLECTION";
        catEn = "Plot Sales & Buyer Installment Collections";
        catBn = "প্লট বিক্রয় ও ক্রেতা কিস্তি আদায়";
        classEn = "Sales & Customer Receipts";
        classBn = "বিক্রয় ও গ্রাহক আদায়";
      } else if (r.referenceType === "DEPOSIT") {
        key = "DEPOSIT";
        catEn = "Partner Capital Injections & Deposits";
        catBn = "অংশীদার মূলধন বিনিয়োগ ও আমানত";
        classEn = "Capital Receipts";
        classBn = "মূলধন আদায়";
      } else if (r.referenceType === "CONTRA") {
        key = "CONTRA_IN";
        catEn = "Inter-Account Fund Transfers (Contra In)";
        catBn = "কন্ট্রা তহবিল স্থানান্তর (জমা)";
        classEn = "Liquidity Transfer";
        classBn = "তারল্য স্থানান্তর";
      }

      const existing = receiptsMap.get(key) || {
        categoryEn: catEn,
        categoryBn: catBn,
        classificationEn: classEn,
        classificationBn: classBn,
        cash: 0,
        bank: 0,
        count: 0,
      };
      if (isCash) existing.cash += amt;
      else existing.bank += amt;
      existing.count += 1;
      receiptsMap.set(key, existing);
    } else {
      if (isCash) periodCashOut += amt;
      else periodBankOut += amt;

      let key = "OTHER";
      let catEn = "General Project Disbursements";
      let catBn = "সাধারণ প্রকল্প ব্যয়";
      let classEn = "Project Development";
      let classBn = "প্রকল্প উন্নয়ন";

      if (r.referenceType === "EXPENSE") {
        const rawCategory = (r.referenceId && expenseCategoryMap.get(r.referenceId)) || r.purpose || "General Expense";
        key = rawCategory;
        catEn = rawCategory;
        catBn = getBengaliExpenseCategory(rawCategory);
        classEn = getExpenseClassification(rawCategory);
        classBn = getBengaliClassification(classEn);
      } else if (r.referenceType === "WITHDRAWAL") {
        key = "WITHDRAWAL";
        catEn = "Partner Profit & Capital Distributions";
        catBn = "অংশীদার মুনাফা ও মূলধন উত্তোলন";
        classEn = "Equity Distributions";
        classBn = "ইক্যুইটি বণ্টন";
      } else if (r.referenceType === "CONTRA") {
        key = "CONTRA_OUT";
        catEn = "Inter-Account Fund Transfers (Contra Out)";
        catBn = "কন্ট্রা তহবিল স্থানান্তর (উত্তোলন)";
        classEn = "Liquidity Transfer";
        classBn = "তারল্য স্থানান্তর";
      }

      const existing = paymentsMap.get(key) || {
        categoryEn: catEn,
        categoryBn: catBn,
        classificationEn: classEn,
        classificationBn: classBn,
        cash: 0,
        bank: 0,
        count: 0,
      };
      if (isCash) existing.cash += amt;
      else existing.bank += amt;
      existing.count += 1;
      paymentsMap.set(key, existing);
    }
  }

  // 5. Structure table rows with Opening, Receipts, Payments, and Closing
  const rowsData: any[] = [];

  // Opening Balance Row
  rowsData.push({
    type: "OPENING",
    group: "Opening Liquid Balance (B/F)",
    groupBn: "প্রারম্ভিক তরল তহবিল (পূর্বানীত - B/F)",
    category: "Opening Cash & Bank Reserves",
    categoryBn: "প্রারম্ভিক নগদ ও ব্যাংক তহবিল",
    classification: "Opening Liquid Position",
    classificationBn: "প্রারম্ভিক তরল অবস্থান",
    cashAmount: openingCash,
    bankAmount: openingBank,
    totalAmount: openingTreasury,
  });

  // Receipts rows
  const sortedReceipts = [...receiptsMap.values()].sort((a, b) => (b.cash + b.bank) - (a.cash + a.bank));
  for (const r of sortedReceipts) {
    rowsData.push({
      type: "RECEIPT",
      group: "Receipts (Inflows)",
      groupBn: "আদায়সমূহ (ইনফ্লো)",
      category: r.categoryEn,
      categoryBn: r.categoryBn,
      classification: r.classificationEn,
      classificationBn: r.classificationBn,
      cashAmount: r.cash,
      bankAmount: r.bank,
      totalAmount: r.cash + r.bank,
      count: r.count,
    });
  }

  // Payments rows
  const sortedPayments = [...paymentsMap.values()].sort((a, b) => (b.cash + b.bank) - (a.cash + a.bank));
  for (const p of sortedPayments) {
    rowsData.push({
      type: "PAYMENT",
      group: "Payments (Outflows)",
      groupBn: "পরিশোধসমূহ (আউটফ্লো)",
      category: p.categoryEn,
      categoryBn: p.categoryBn,
      classification: p.classificationEn,
      classificationBn: p.classificationBn,
      cashAmount: p.cash,
      bankAmount: p.bank,
      totalAmount: p.cash + p.bank,
      count: p.count,
    });
  }

  // Closing Balance Row
  const closingCash = openingCash + periodCashIn - periodCashOut;
  const closingBank = openingBank + periodBankIn - periodBankOut;
  const closingTreasury = closingCash + closingBank;

  rowsData.push({
    type: "CLOSING",
    group: "Closing Liquid Balance (C/D)",
    groupBn: "সমাপনী তরল তহবিল (স্থানান্তরিত - C/D)",
    category: "Closing Cash & Bank Reserves",
    categoryBn: "সমাপনী নগদ ও ব্যাংক তহবিল",
    classification: "Closing Liquid Position",
    classificationBn: "সমাপনী তরল অবস্থান",
    cashAmount: closingCash,
    bankAmount: closingBank,
    totalAmount: closingTreasury,
  });

  const totalReceipts = sortedReceipts.reduce((sum, r) => sum + r.cash + r.bank, 0);
  const totalPayments = sortedPayments.reduce((sum, p) => sum + p.cash + p.bank, 0);
  const netSurplus = totalReceipts - totalPayments;
  const receiptsSideTotal = openingTreasury + totalReceipts;
  const paymentsSideTotal = totalPayments + closingTreasury;

  return {
    columns: receiptsPaymentsColumns,
    rows: rowsData,
    totals: {
      openingCash,
      openingBank,
      openingTreasury,
      totalReceipts,
      totalPayments,
      netSurplus,
      closingCash,
      closingBank,
      closingTreasury,
      receiptsSideTotal,
      paymentsSideTotal,
      periodCashIn,
      periodCashOut,
      periodBankIn,
      periodBankOut,
      totalTxns: rows.length,
    },
    summary: [
      {
        labelEn: "Opening Liquid Balance (B/F)",
        labelBn: "প্রারম্ভিক তরল তহবিল (পূর্বানীত - B/F)",
        value: openingTreasury.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
      },
      {
        labelEn: "Total Receipts during Period",
        labelBn: "সময়কালীন মোট সংগৃহীত আদায়",
        value: totalReceipts.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
      },
      {
        labelEn: "Total Payments during Period",
        labelBn: "সময়কালীন মোট পরিশোধ",
        value: totalPayments.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
      },
      {
        labelEn: "Net Period Surplus / (Deficit)",
        labelBn: "সময়কালীন নিট উদ্বৃত্ত / (ঘাটতি)",
        value: netSurplus.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
      },
      {
        labelEn: "Closing Liquid Balance (C/D)",
        labelBn: "সমাপনী তরল তহবিল (স্থানান্তরিত - C/D)",
        value: closingTreasury.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
      },
    ],
  };
}

function getExpenseClassification(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes("bayna") || c.includes("registration") || c.includes("stamp") || c.includes("mutation") || c.includes("drafting")) {
    return "Land Acquisition & Legal Title";
  }
  if (c.includes("earth") || c.includes("road") || c.includes("boundary") || c.includes("drainage") || c.includes("survey") || c.includes("labor")) {
    return "Project Infrastructure & Development";
  }
  if (c.includes("salary") || c.includes("rent") || c.includes("security") || c.includes("marketing") || c.includes("misc")) {
    return "Operational & Site Administration";
  }
  return "General Project Expenses";
}

function getBengaliClassification(cls: string): string {
  if (cls.includes("Land Acquisition")) return "জমি ক্রয় ও আইনি দলিলপত্র";
  if (cls.includes("Project Infrastructure")) return "প্রকল্প অবকাঠামো ও উন্নয়ন";
  if (cls.includes("Operational & Site")) return "সাইট পরিচালনা ও প্রশাসনিক";
  if (cls.includes("Equity Distributions")) return "অংশীদার মুনাফা ও মূলধন বণ্টন";
  if (cls.includes("Liquidity Transfer")) return "তারল্য তহবিল স্থানান্তর";
  return "সাধারণ প্রকল্প ব্যয়";
}

function getBengaliExpenseCategory(cat: string): string {
  const map: Record<string, string> = {
    "Registration": "দলিল রেজিস্ট্রেশন খরচ",
    "Bayna Advance": "জমি বায়না অগ্রিম",
    "Stamp Duty": "স্ট্যাম্প ডিউটি ও সরকারি ফি",
    "Earth Filling": "মাটি ভরাট ও সমতলকরণ",
    "Access Road": "সংযোগ সড়ক ও রাস্তা নির্মাণ",
    "Boundary Wall": "সীমানা প্রাচীর ও বেড়া",
    "Drainage": "ড্রেনেজ ও কালভার্ট নির্মাণ",
    "Staff Salary": "সাইট কর্মকর্তা-কর্মচারীদের বেতন",
    "Mutation": "নামজারি ও খাজনা খারিজ",
    "Cadastral Survey": "ক্যাডাস্ট্রাল সার্ভে ও প্ল্যানিং",
    "Sub-Registry Drafting": "সাব-রেজিস্ট্রি দলিল ড্রাফটিং",
    "Marketing Signboard": "মার্কেটিং ও সাইনবোর্ড স্থাপন",
    "Office Rent": "সাইট অফিস ভাড়া",
    "Security Honorarium": "নিরাপত্তা ও গার্ড অনারিয়াম",
    "Labor": "সাইট শ্রমিক মজুরি",
    "Misc": "বিবিধ সাধারণ ব্যয়",
  };
  return map[cat] || cat;
}
