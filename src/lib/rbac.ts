export type Role = "super_admin" | "managing_partner" | "site_manager" | "accountant";
export type Feature = "viewDashboard" | "managePartners" | "addLand" | "createExpense" | "approveExpense" | "receiveSales" | "bankTransfer" | "distributeProfits" | "inviteUsers" | "manageBilling";

const matrix: Record<Feature, Role[]> = {
  viewDashboard: ["super_admin", "managing_partner"],
  managePartners: ["super_admin"],
  addLand: ["super_admin", "managing_partner"],
  createExpense: ["super_admin", "managing_partner", "site_manager", "accountant"],
  approveExpense: ["super_admin", "managing_partner"],
  receiveSales: ["super_admin", "managing_partner", "accountant"],
  bankTransfer: ["super_admin", "managing_partner", "accountant"],
  distributeProfits: ["super_admin", "managing_partner"],
  inviteUsers: ["super_admin"],
  manageBilling: ["super_admin"],
};

export function can(role: Role, feature: Feature): boolean {
  return (matrix[feature] ?? []).includes(role);
}

// special for addLand: full | draft | false
export function canAddLand(role: Role): "full" | "draft" | false {
  if (["super_admin", "managing_partner"].includes(role)) return "full";
  if (role === "site_manager") return "draft";
  return false;
}

export function assertOrThrow(role: string, feature: Feature) {
  if (!can(role as Role, feature)) throw new Error(`Forbidden: ${feature}`);
}
