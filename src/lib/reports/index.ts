import type { ReportFilters } from "./cash-book";
import type { ReportData } from "./pdf";

export type QueryFn = (prisma: any, filters: ReportFilters) => Promise<ReportData>;

import { queryCashBook } from "./cash-book";
import { queryBankBook } from "./bank-book";
import { queryDailySummary } from "./daily-summary";
import { queryReceiptsPayments } from "./receipts-payments";
import { queryContraRegister } from "./contra-register";
import { queryPartnerCapital } from "./partner-capital";
import { queryPartnersSummary } from "./partners-summary";
import { queryPartnerContribution } from "./partner-contribution";
import { queryProjectCost } from "./project-cost";
import { queryProjectPnl } from "./project-pnl";
import { queryProjectsComparison } from "./projects-comparison";
import { queryExpenseRegister } from "./expense-register";
import { queryPendingApproval } from "./pending-approval";
import { queryLandDocuments } from "./land-documents";
import { querySalesRegister } from "./sales-register";
import { queryPlotInventory } from "./plot-inventory";
import { queryBuyerStatement } from "./buyer-statement";
import { queryReceivablesAging } from "./receivables-aging";
import { queryInstallmentReport } from "./installment-report";
import { queryCollectionReport } from "./collection-report";
import { queryProfitAllocation } from "./profit-allocation";
import { queryProfitHistory } from "./profit-history";
import { queryAuditTrail } from "./audit-trail";
import { queryUserActivity } from "./user-activity";
import { queryReconciliation } from "./reconciliation";

export const REPORT_QUERIES: Record<string, QueryFn> = {
  "cash-book": queryCashBook,
  "bank-book": queryBankBook,
  "daily-summary": queryDailySummary,
  "receipts-payments": queryReceiptsPayments,
  "contra-register": queryContraRegister,
  "partner-capital": queryPartnerCapital,
  "partners-summary": queryPartnersSummary,
  "partner-contribution": queryPartnerContribution,
  "project-cost": queryProjectCost,
  "project-pnl": queryProjectPnl,
  "projects-comparison": queryProjectsComparison,
  "expense-register": queryExpenseRegister,
  "pending-approval": queryPendingApproval,
  "land-documents": queryLandDocuments,
  "sales-register": querySalesRegister,
  "plot-inventory": queryPlotInventory,
  "buyer-statement": queryBuyerStatement,
  "receivables-aging": queryReceivablesAging,
  "installment-report": queryInstallmentReport,
  "collection-report": queryCollectionReport,
  "profit-allocation": queryProfitAllocation,
  "profit-history": queryProfitHistory,
  "audit-trail": queryAuditTrail,
  "user-activity": queryUserActivity,
  "reconciliation": queryReconciliation,
};
