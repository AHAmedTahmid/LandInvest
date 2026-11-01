import { toNum, formatBDT } from "@/lib/format";

export type InsightLevel = "info" | "warning" | "critical";

export interface DashboardInsight {
  id: string;
  rule: string;
  level: InsightLevel;
  title: { en: string; bn: string };
  message: { en: string; bn: string };
  metric?: string;
  threshold?: string;
  actionUrl?: string;
  actionLabel?: { en: string; bn: string };
}

export async function evaluateDashboardInsights(prisma: any): Promise<DashboardInsight[]> {
  const insights: DashboardInsight[] = [];
  const now = new Date();

  // 1. Load Settings / Thresholds from DB or defaults
  let settingsRows: any[] = [];
  try {
    if (prisma.dashboardSetting) {
      settingsRows = await prisma.dashboardSetting.findMany();
    } else {
      settingsRows = await prisma.$queryRaw`SELECT setting_key as settingKey, setting_value as settingValue FROM dashboard_settings`;
    }
  } catch (e) {
    console.warn("Could not load dashboard settings:", e);
  }
  const settings: Record<string, any> = {};
  for (const s of settingsRows) {
    settings[s.settingKey] = typeof s.settingValue === "string" ? JSON.parse(s.settingValue) : s.settingValue;
  }

  const minCashBalance = settings["min_cash_balance"] ?? 500000;
  const criticalCashBalance = settings["critical_cash_balance"] ?? 200000;
  const voucherPendingDays = settings["voucher_pending_days"] ?? 3;
  const voucherPendingCount = settings["voucher_pending_count"] ?? 5;

  // RULE 1: Low Liquidity Warning
  const ledgers = await prisma.treasuryLedger.findMany({ where: { txnDate: { lte: now } } });
  const totalLiquidity = ledgers.reduce(
    (s: number, l: any) => s + (l.flowType === "IN" ? toNum(l.amount) : -toNum(l.amount)),
    0
  );

  if (totalLiquidity < criticalCashBalance) {
    insights.push({
      id: "low_liquidity_critical",
      rule: "low_liquidity",
      level: "critical",
      title: { en: "Critical Liquidity Shortage", bn: "জরুরি তারল্য সংকট" },
      message: {
        en: `Current liquidity of ${formatBDT(totalLiquidity)} is below the critical threshold of ${formatBDT(criticalCashBalance)}. Urgent capital injection or collections required.`,
        bn: `বর্তমান তারল্য ${formatBDT(totalLiquidity, { lang: "bn" })}, যা জরুরি সীমা ${formatBDT(criticalCashBalance, { lang: "bn" })} এর নিচে। দ্রুত মূলধন জমা বা কিস্তি আদায় প্রয়োজন।`,
      },
      metric: formatBDT(totalLiquidity),
      threshold: formatBDT(criticalCashBalance),
      actionUrl: "/partners?action=deposit",
      actionLabel: { en: "Deposit Capital", bn: "মূলধন জমা করুন" },
    });
  } else if (totalLiquidity < minCashBalance) {
    insights.push({
      id: "low_liquidity_warning",
      rule: "low_liquidity",
      level: "warning",
      title: { en: "Low Liquidity Warning", bn: "স্বল্প তারল্য সতর্কতা" },
      message: {
        en: `Current liquidity (${formatBDT(totalLiquidity)}) is below safe operational reserves of ${formatBDT(minCashBalance)}.`,
        bn: `বর্তমান নগদ ও ব্যাংক স্থিতি (${formatBDT(totalLiquidity, { lang: "bn" })}) ন্যূনতম নিরাপদ রিজার্ভ ${formatBDT(minCashBalance, { lang: "bn" })} এর নিচে।`,
      },
      metric: formatBDT(totalLiquidity),
      threshold: formatBDT(minCashBalance),
      actionUrl: "/treasury",
      actionLabel: { en: "View Treasury", bn: "ট্রেজারি দেখুন" },
    });
  }

  // RULE 2: Overdue Receivables Spike
  const overdueSchedules = await prisma.installmentSchedule.findMany({
    where: {
      dueDate: { lt: now },
      status: { in: ["UPCOMING", "OVERDUE", "PARTIAL"] },
    },
    include: { sale: true },
  });
  const totalOverdue = overdueSchedules.reduce((s: number, i: any) => s + toNum(i.dueAmount), 0);
  const severeOverdue = overdueSchedules.filter((s: any) => {
    const diff = Math.floor((now.getTime() - new Date(s.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    return diff > 60;
  });

  if (totalOverdue > 1000000 || severeOverdue.length > 0) {
    insights.push({
      id: "overdue_spike",
      rule: "overdue_receivables",
      level: severeOverdue.length > 3 ? "critical" : "warning",
      title: { en: "Overdue Receivables Spike", bn: "মেয়াদোত্তীর্ণ বকেয়া বৃদ্ধি" },
      message: {
        en: `${overdueSchedules.length} installments totaling ${formatBDT(totalOverdue)} are overdue. ${severeOverdue.length} installment(s) exceed 60 days overdue.`,
        bn: `মোট ${overdueSchedules.length}টি কিস্তিতে ${formatBDT(totalOverdue, { lang: "bn" })} বকেয়া রয়েছে। ৬০ দিনের বেশি অতিক্রান্ত হয়েছে ${severeOverdue.length}টি কিস্তি।`,
      },
      metric: formatBDT(totalOverdue),
      actionUrl: "/sales",
      actionLabel: { en: "Call Buyers", bn: "ক্রেতাদের তাগিদ দিন" },
    });
  }

  // RULE 3: Pending Approvals Backlog
  const pendingVouchers = await prisma.projectExpense.findMany({
    where: { status: "PENDING" },
  });
  const oldPending = pendingVouchers.filter((v: any) => {
    const ageDays = Math.floor((now.getTime() - new Date(v.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    return ageDays >= voucherPendingDays;
  });

  if (pendingVouchers.length >= voucherPendingCount || oldPending.length > 0) {
    const totalPendingAmt = pendingVouchers.reduce((s: number, v: any) => s + toNum(v.amount), 0);
    insights.push({
      id: "pending_vouchers_backlog",
      rule: "pending_approvals",
      level: oldPending.length > 5 ? "warning" : "info",
      title: { en: "Voucher Approval Backlog", bn: "ভাউচার অনুমোদন অপেক্ষমাণ" },
      message: {
        en: `${pendingVouchers.length} voucher(s) totaling ${formatBDT(totalPendingAmt)} are awaiting approval (${oldPending.length} pending over ${voucherPendingDays} days).`,
        bn: `${pendingVouchers.length}টি ভাউচারে মোট ${formatBDT(totalPendingAmt, { lang: "bn" })} অনুমোদনের অপেক্ষায় রয়েছে (${voucherPendingDays} দিনের পুরনো ${oldPending.length}টি)।`,
      },
      metric: `${pendingVouchers.length} Vouchers`,
      actionUrl: "/vouchers",
      actionLabel: { en: "Review Vouchers", bn: "ভাউচার যাচাই করুন" },
    });
  }

  // RULE 4: Land Bayna Expiry Approaching
  const baynaProjects = await prisma.landProject.findMany({
    where: { status: "UNDER_BAYNA" },
  });
  for (const bp of baynaProjects) {
    const daysSince = Math.floor((now.getTime() - new Date(bp.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince >= 60) {
      insights.push({
        id: `bayna_expiry_${bp.id}`,
        rule: "bayna_expiry",
        level: "warning",
        title: { en: `Bayna Expiry Alert: ${bp.projectName}`, bn: `বায়না মেয়াদ সতর্কতা: ${bp.projectName}` },
        message: {
          en: `Project "${bp.projectName}" has been under Bayna for ${daysSince} days without final land registration deed. Verify bayna terms before contract expiration.`,
          bn: `"${bp.projectName}" প্রকল্পটি বায়না অবস্থায় ${daysSince} দিন অতিবাহিত হয়েছে, কিন্তু জমি দলিল রেজিস্ট্রেশন সম্পন্ন হয়নি।`,
        },
        metric: `${daysSince} Days`,
        actionUrl: `/projects`,
        actionLabel: { en: "Open Project", bn: "প্রকল্প খুলুন" },
      });
    }
  }

  // RULE 5: High Unsold Inventory Stagnation
  const allProjects = await prisma.landProject.findMany({
    include: { projectPlots: true },
  });
  for (const pr of allProjects) {
    const plots = pr.projectPlots || [];
    if (plots.length >= 3) {
      const available = plots.filter((p: any) => p.status === "AVAILABLE").length;
      const pctUnsold = (available / plots.length) * 100;
      const daysSinceLaunch = Math.floor((now.getTime() - new Date(pr.createdAt).getTime()) / (1000 * 60 * 60 * 24));

      if (pctUnsold > 50 && daysSinceLaunch > 180) {
        insights.push({
          id: `stagnant_inventory_${pr.id}`,
          rule: "inventory_stagnation",
          level: "info",
          title: { en: `Unsold Plots in ${pr.projectName}`, bn: `অবিক্রীত প্লট: ${pr.projectName}` },
          message: {
            en: `${pctUnsold.toFixed(0)}% of plots (${available}/${plots.length}) remain unsold after ${Math.floor(daysSinceLaunch / 30)} months. Consider promotional pricing.`,
            bn: `${Math.floor(daysSinceLaunch / 30)} মাস পরও ${pctUnsold.toFixed(0)}% প্লট (${available}/${plots.length}) অবিক্রীত রয়েছে। মূল্য ছাড় বা প্রচারের উদ্যোগ নিন।`,
          },
          actionUrl: `/projects`,
          actionLabel: { en: "Inspect Plots", bn: "প্লট দেখুন" },
        });
      }
    }
  }

  // RULE 6: Partner Share Imbalance
  const partners = await prisma.partner.findMany({
    include: { partnerTransactions: true, projectPartners: true },
  });
  const allTxns = await prisma.partnerTransaction.findMany();
  const totalSyndicateCapital = allTxns
    .filter((t: any) => t.txnType === "DEPOSIT" || t.txnType === "CAPITAL_IN")
    .reduce((s: number, t: any) => s + toNum(t.amount), 0);

  if (totalSyndicateCapital > 0 && partners.length > 1) {
    for (const p of partners) {
      const pDeposited = (p.partnerTransactions || [])
        .filter((t: any) => t.txnType === "DEPOSIT" || t.txnType === "CAPITAL_IN")
        .reduce((s: number, t: any) => s + toNum(t.amount), 0);
      const actualSharePct = (pDeposited / totalSyndicateCapital) * 100;

      const agreedShares = (p.projectPartners || []).map((pp: any) => toNum(pp.sharePercentage));
      if (agreedShares.length > 0) {
        const avgAgreed = agreedShares.reduce((a: number, b: number) => a + b, 0) / agreedShares.length;
        const diff = Math.abs(actualSharePct - avgAgreed);
        if (diff > 10) {
          insights.push({
            id: `partner_imbalance_${p.id}`,
            rule: "partner_share_imbalance",
            level: "info",
            title: { en: `Partner Capital Variance: ${p.name}`, bn: `অংশীদার বিনিয়োগ তারতম্য: ${p.name}` },
            message: {
              en: `${p.name} holds ${avgAgreed.toFixed(1)}% agreed project share but contributed ${actualSharePct.toFixed(1)}% of total deposited capital.`,
              bn: `${p.name}-এর নির্ধারিত প্রকল্পের শেয়ার ${avgAgreed.toFixed(1)}%, কিন্তু মোট জমার ${actualSharePct.toFixed(1)}% প্রদান করেছেন।`,
            },
            actionUrl: "/partners",
            actionLabel: { en: "View Partner Ledger", bn: "পার্টনার লেজার দেখুন" },
          });
          break; // alert once to avoid overwhelming
        }
      }
    }
  }

  // RULE 7: Missing Bank Reconciliation / Stale Accounts
  const bankAccounts = await prisma.bankAccount.findMany({ where: { isActive: true } });
  for (const b of bankAccounts) {
    const lastEntry = await prisma.treasuryLedger.findFirst({
      where: { bankAccountId: b.id },
      orderBy: { txnDate: "desc" },
    });
    if (lastEntry) {
      const daysSinceTxn = Math.floor((now.getTime() - new Date(lastEntry.txnDate).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceTxn > 30 && toNum(b.currentBalance) > 10000) {
        insights.push({
          id: `stale_bank_${b.id}`,
          rule: "stale_bank_account",
          level: "info",
          title: { en: `Stale Bank Account: ${b.bankName}`, bn: `নিষ্ক্রিয় ব্যাংক অ্যাকাউন্ট: ${b.bankName}` },
          message: {
            en: `Account ${b.accountNumber} has had no recorded ledger entries in ${daysSinceTxn} days with an active balance. Reconcile bank statements.`,
            bn: `অ্যাকাউন্ট ${b.accountNumber}-এ বিগত ${daysSinceTxn} দিনে কোনো লেনদেন এন্ট্রি হয়নি। ব্যাংক স্টেটমেন্ট মিলিয়ে নিন।`,
          },
          actionUrl: "/treasury",
          actionLabel: { en: "Reconcile Account", bn: "হিসাব মেলান" },
        });
      }
    }
  }

  // RULE 8: Cash Flow Forecast Deficit (90 Days)
  const futureSchedules = await prisma.installmentSchedule.findMany({
    where: {
      dueDate: { gt: now, lte: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000) },
      status: { not: "PAID" },
    },
  });
  const expectedInflows = futureSchedules.reduce((sum: number, s: any) => sum + toNum(s.dueAmount), 0);
  const pendingCommitments = pendingVouchers.reduce((s: number, v: any) => s + toNum(v.amount), 0);
  const netProjected = totalLiquidity + expectedInflows - pendingCommitments;

  if (netProjected < 0) {
    insights.push({
      id: "forecast_deficit",
      rule: "cash_flow_forecast_deficit",
      level: "critical",
      title: { en: "90-Day Cash Flow Deficit Warning", bn: "৯০ দিনের তারল্য ঘাটতি সতর্কতা" },
      message: {
        en: `Projected liquidity dips into a deficit of ${formatBDT(netProjected)} within 90 days considering pending commitments.`,
        bn: `অনিষ্পন্ন খরচের প্রতিশ্রুতির কারণে আগামী ৯০ দিনের মধ্যে ${formatBDT(netProjected, { lang: "bn" })} তারল্য ঘাটতির আশঙ্কা রয়েছে।`,
      },
      metric: formatBDT(netProjected),
      actionUrl: "/treasury",
      actionLabel: { en: "Plan Cash Flow", bn: "ক্যাশ ফ্লো পরিকল্পনা" },
    });
  }

  return insights;
}

