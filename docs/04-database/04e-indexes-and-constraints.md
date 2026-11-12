# 04e. Indexes and Foreign Key Constraints

**Purpose:** Complete reference of all physical MySQL foreign keys, unique constraints, indexes, and logical cross-database links.  
**Intended Reader:** Database Administrator, Backend Developer.  
**Last Verified:** 2026-11-12

---

## Control Plane Foreign Keys (`control_plane`: 6)

| Child Table | Child Column | Parent Table | Parent Column | ON DELETE | ON UPDATE | Constraint Name |
|---|---|---|---|---|---|---|
| `billing_invoices` | `subscription_id` | `subscriptions` | `id` | SET NULL | CASCADE | `billing_invoices_subscription_id_fkey` |
| `billing_invoices` | `tenant_id` | `tenants` | `id` | RESTRICT | CASCADE | `billing_invoices_tenant_id_fkey` |
| `global_users` | `tenant_id` | `tenants` | `id` | RESTRICT | CASCADE | `global_users_tenant_id_fkey` |
| `subscriptions` | `plan_id` | `plans` | `id` | RESTRICT | CASCADE | `subscriptions_plan_id_fkey` |
| `subscriptions` | `tenant_id` | `tenants` | `id` | RESTRICT | CASCADE | `subscriptions_tenant_id_fkey` |
| `user_invitations` | `tenant_id` | `tenants` | `id` | RESTRICT | CASCADE | `user_invitations_tenant_id_fkey` |

## Tenant Database Foreign Keys (`tenant_demo`: 17)

| Child Table | Child Column | Parent Table | Parent Column | ON DELETE | ON UPDATE | Constraint Name |
|---|---|---|---|---|---|---|
| `customer_payments` | `bank_account_id` | `bank_accounts` | `id` | SET NULL | CASCADE | `customer_payments_bank_account_id_fkey` |
| `customer_payments` | `sale_id` | `land_sales` | `id` | RESTRICT | CASCADE | `customer_payments_sale_id_fkey` |
| `installment_schedule` | `sale_id` | `land_sales` | `id` | RESTRICT | CASCADE | `installment_schedule_sale_id_fkey` |
| `land_sales` | `plot_id` | `project_plots` | `id` | SET NULL | CASCADE | `land_sales_plot_id_fkey` |
| `land_sales` | `project_id` | `land_projects` | `id` | RESTRICT | CASCADE | `land_sales_project_id_fkey` |
| `partner_transactions` | `partner_id` | `partners` | `id` | RESTRICT | CASCADE | `partner_transactions_partner_id_fkey` |
| `profit_distributions` | `partner_id` | `partners` | `id` | RESTRICT | CASCADE | `profit_distributions_partner_id_fkey` |
| `profit_distributions` | `project_id` | `land_projects` | `id` | RESTRICT | CASCADE | `profit_distributions_project_id_fkey` |
| `project_expenses` | `bank_account_id` | `bank_accounts` | `id` | SET NULL | CASCADE | `project_expenses_bank_account_id_fkey` |
| `project_expenses` | `paid_by_partner_id` | `partners` | `id` | SET NULL | CASCADE | `project_expenses_paid_by_partner_id_fkey` |
| `project_expenses` | `project_id` | `land_projects` | `id` | SET NULL | CASCADE | `project_expenses_project_id_fkey` |
| `project_partners` | `partner_id` | `partners` | `id` | RESTRICT | CASCADE | `project_partners_partner_id_fkey` |
| `project_partners` | `project_id` | `land_projects` | `id` | RESTRICT | CASCADE | `project_partners_project_id_fkey` |
| `project_plots` | `project_id` | `land_projects` | `id` | RESTRICT | CASCADE | `project_plots_project_id_fkey` |
| `role_permissions` | `role_id` | `roles` | `id` | CASCADE | CASCADE | `role_permissions_role_id_fkey` |
| `treasury_ledger` | `bank_account_id` | `bank_accounts` | `id` | SET NULL | CASCADE | `treasury_ledger_bank_account_id_fkey` |
| `user_roles` | `role_id` | `roles` | `id` | RESTRICT | CASCADE | `user_roles_role_id_fkey` |

---

## Logical Cross-Database Links (Not Physical Foreign Keys)

| Tenant Table & Column | Target Table & Column | Enforced By |
|---|---|---|
| `user_roles.user_id` | `control_plane.global_users.id` | Application RBAC & session resolution |
| `partners.global_user_id` | `control_plane.global_users.id` | Partner account linking logic |
| `project_expenses.created_by` / `approved_by` | `control_plane.global_users.id` | Session user ID from JWT |
| `treasury_ledger.created_by` | `control_plane.global_users.id` | Session user ID from JWT |
| `treasury_transfer_requests.requested_by` / `approved_by` | `control_plane.global_users.id` | Session user ID from JWT |
| `audit_log.changed_by` | `control_plane.global_users.id` | `writeAudit()` in `src/lib/tenantRules.ts` |
| `dashboard_settings.updated_by` | `control_plane.global_users.id` | API route session user ID |

---

## Control Plane Indexes (`18` indexes)

| Table | Index Name | Kind | Columns | Type |
|---|---|---|---|---|
| `billing_invoices` | `billing_invoices_subscription_id_idx` | INDEX | `subscription_id` | BTREE |
| `billing_invoices` | `billing_invoices_tenant_id_idx` | INDEX | `tenant_id` | BTREE |
| `billing_invoices` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `global_users` | `global_users_email_key` | UNIQUE | `email` | BTREE |
| `global_users` | `global_users_tenant_id_idx` | INDEX | `tenant_id` | BTREE |
| `global_users` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `password_reset_tokens` | `password_reset_tokens_token_key` | UNIQUE | `token` | BTREE |
| `password_reset_tokens` | `password_reset_tokens_user_id_idx` | INDEX | `user_id` | BTREE |
| `password_reset_tokens` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `plans` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `subscriptions` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `subscriptions` | `subscriptions_plan_id_idx` | INDEX | `plan_id` | BTREE |
| `subscriptions` | `subscriptions_tenant_id_idx` | INDEX | `tenant_id` | BTREE |
| `tenants` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `tenants` | `tenants_db_name_key` | UNIQUE | `db_name` | BTREE |
| `user_invitations` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `user_invitations` | `user_invitations_invite_token_key` | UNIQUE | `invite_token` | BTREE |
| `user_invitations` | `user_invitations_tenant_id_idx` | INDEX | `tenant_id` | BTREE |

## Tenant Database Indexes (`57` indexes)

| Table | Index Name | Kind | Columns | Type |
|---|---|---|---|---|
| `audit_log` | `audit_log_changed_by_idx` | INDEX | `changed_by` | BTREE |
| `audit_log` | `audit_log_created_at_idx` | INDEX | `created_at` | BTREE |
| `audit_log` | `audit_log_table_name_created_at_idx` | INDEX | `table_name`, `created_at` | BTREE |
| `audit_log` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `bank_accounts` | `bank_accounts_account_number_key` | UNIQUE | `account_number` | BTREE |
| `bank_accounts` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `customer_payments` | `customer_payments_bank_account_id_fkey` | INDEX | `bank_account_id` | BTREE |
| `customer_payments` | `customer_payments_payment_date_idx` | INDEX | `payment_date` | BTREE |
| `customer_payments` | `customer_payments_receiptNo_key` | UNIQUE | `receiptNo` | BTREE |
| `customer_payments` | `customer_payments_sale_id_idx` | INDEX | `sale_id` | BTREE |
| `customer_payments` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `dashboard_layouts` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `dashboard_layouts` | `uq_scope_scope_id` | UNIQUE | `scope`, `scope_id` | BTREE |
| `dashboard_settings` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `dashboard_settings` | `setting_key` | UNIQUE | `setting_key` | BTREE |
| `default_categories` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `default_categories` | `uq_cat_name` | UNIQUE | `name` | BTREE |
| `installment_schedule` | `installment_schedule_due_date_idx` | INDEX | `due_date` | BTREE |
| `installment_schedule` | `installment_schedule_sale_id_idx` | INDEX | `sale_id` | BTREE |
| `installment_schedule` | `installment_schedule_status_due_date_idx` | INDEX | `status`, `due_date` | BTREE |
| `installment_schedule` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `land_projects` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `land_sales` | `land_sales_plot_id_idx` | INDEX | `plot_id` | BTREE |
| `land_sales` | `land_sales_project_id_idx` | INDEX | `project_id` | BTREE |
| `land_sales` | `land_sales_sale_date_idx` | INDEX | `sale_date` | BTREE |
| `land_sales` | `land_sales_status_sale_date_idx` | INDEX | `status`, `sale_date` | BTREE |
| `land_sales` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `partner_transactions` | `partner_transactions_partner_id_idx` | INDEX | `partner_id` | BTREE |
| `partner_transactions` | `partner_transactions_txn_date_idx` | INDEX | `txn_date` | BTREE |
| `partner_transactions` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `partners` | `partners_nid_number_key` | UNIQUE | `nid_number` | BTREE |
| `partners` | `partners_phone_key` | UNIQUE | `phone` | BTREE |
| `partners` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `profit_distributions` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `profit_distributions` | `profit_distributions_partner_id_idx` | INDEX | `partner_id` | BTREE |
| `profit_distributions` | `profit_distributions_project_id_idx` | INDEX | `project_id` | BTREE |
| `project_expenses` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `project_expenses` | `project_expenses_bank_account_id_idx` | INDEX | `bank_account_id` | BTREE |
| `project_expenses` | `project_expenses_expense_date_idx` | INDEX | `expense_date` | BTREE |
| `project_expenses` | `project_expenses_paid_by_partner_id_idx` | INDEX | `paid_by_partner_id` | BTREE |
| `project_expenses` | `project_expenses_project_id_idx` | INDEX | `project_id` | BTREE |
| `project_expenses` | `project_expenses_status_expense_date_idx` | INDEX | `status`, `expense_date` | BTREE |
| `project_partners` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `project_partners` | `project_partners_partner_id_idx` | INDEX | `partner_id` | BTREE |
| `project_partners` | `project_partners_project_id_partner_id_key` | UNIQUE | `project_id`, `partner_id` | BTREE |
| `project_plots` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `project_plots` | `project_plots_project_id_idx` | INDEX | `project_id` | BTREE |
| `role_permissions` | `PRIMARY` | UNIQUE | `role_id`, `permission_key` | BTREE |
| `roles` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `roles` | `roles_name_key` | UNIQUE | `name` | BTREE |
| `treasury_ledger` | `PRIMARY` | UNIQUE | `id` | BTREE |
| `treasury_ledger` | `treasury_ledger_account_type_txn_date_idx` | INDEX | `account_type`, `txn_date` | BTREE |
| `treasury_ledger` | `treasury_ledger_bank_account_id_idx` | INDEX | `bank_account_id` | BTREE |
| `treasury_ledger` | `treasury_ledger_reference_type_reference_id_idx` | INDEX | `reference_type`, `reference_id` | BTREE |
| `treasury_ledger` | `treasury_ledger_txn_date_idx` | INDEX | `txn_date` | BTREE |
| `user_roles` | `PRIMARY` | UNIQUE | `user_id` | BTREE |
| `user_roles` | `user_roles_role_id_fkey` | INDEX | `role_id` | BTREE |
