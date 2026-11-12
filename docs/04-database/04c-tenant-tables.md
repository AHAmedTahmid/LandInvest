# 04c. Tenant Database Data Dictionary (`tenant_*`)

**Purpose:** Column-level data dictionary for all 19 tables in a provisioned tenant database (verified against `tenant_demo`).
**Intended Reader:** Backend Developer, DBA.
**Last Verified:** 2026-11-12

---

### `audit_log`
- **Module:** Audit Trail
- **Purpose:** Tenant-level immutable audit trail recording table, record ID, action, actor, old/new JSON.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `table_name` | `varchar(100)` | NO | NULL | - | - |
| `record_id` | `char(36)` | NO | NULL | - | - |
| `action` | `varchar(20)` | NO | NULL | - | - |
| `changed_by` | `char(36)` | NO | NULL | - | - |
| `old_values` | `json` | YES | NULL | - | - |
| `new_values` | `json` | YES | NULL | - | - |
| `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | - | - |

### `bank_accounts`
- **Module:** Cash & Bank Ledger
- **Purpose:** Company bank accounts with cached current_balance synced from treasury_ledger.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `account_type` | `varchar(20)` | NO | `BANK` | - | - |
| `bank_name` | `varchar(100)` | NO | NULL | - | - |
| `account_name` | `varchar(150)` | YES | NULL | - | - |
| `account_number` | `varchar(50)` | NO | NULL | UNIQUE | - |
| `branch_name` | `varchar(100)` | YES | NULL | - | - |
| `routing_number` | `varchar(50)` | YES | NULL | - | - |
| `opening_balance` | `decimal(15,2)` | NO | `0.00` | - | - |
| `current_balance` | `decimal(15,2)` | NO | `0.00` | - | - |
| `is_active` | `tinyint(1)` | NO | `1` | - | - |
| `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | - | - |

### `customer_payments`
- **Module:** Plot Sales & Dues
- **Purpose:** Customer receipts (advance and installments) linked to land_sales and bank/cash.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `sale_id` | `char(36)` | NO | NULL | FK -> `land_sales.id` | - |
| `payment_date` | `date` | NO | NULL | - | - |
| `amount_paid` | `decimal(15,2)` | NO | NULL | - | - |
| `payment_method` | `varchar(20)` | NO | NULL | - | - |
| `bank_account_id` | `char(36)` | YES | NULL | FK -> `bank_accounts.id` | - |
| `receiptNo` | `varchar(50)` | NO | NULL | UNIQUE | - |
| `remarks` | `varchar(255)` | YES | NULL | - | - |

### `dashboard_layouts`
- **Module:** Dashboard
- **Purpose:** Saved per-role or per-user dashboard tab and widget layout JSON.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `scope` | `varchar(10)` | NO | NULL | - | - |
| `scope_id` | `char(36)` | NO | NULL | - | - |
| `layout` | `json` | NO | NULL | - | - |
| `updated_by` | `char(36)` | YES | NULL | - | - |
| `updated_at` | `timestamp` | YES | `CURRENT_TIMESTAMP` | - | - |

### `dashboard_settings`
- **Module:** Configuration
- **Purpose:** Tenant-scoped JSON settings store (alert thresholds, fiscal_years, etc.).
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `setting_key` | `varchar(100)` | NO | NULL | UNIQUE | - |
| `setting_value` | `json` | NO | NULL | - | - |
| `updated_by` | `char(36)` | YES | NULL | - | - |
| `updated_at` | `timestamp` | YES | `CURRENT_TIMESTAMP` | - | - |

### `default_categories`
- **Module:** Project Expenses
- **Purpose:** Seeded default expense categories created by provisioning worker (exists in MySQL, not in Prisma schema).
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `name` | `varchar(100)` | NO | NULL | UNIQUE | - |
| `kind` | `varchar(20)` | NO | NULL | - | - |

### `installment_schedule`
- **Module:** Plot Sales & Dues
- **Purpose:** Scheduled installment due dates and amounts settled FIFO by customer payments.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `sale_id` | `char(36)` | NO | NULL | FK -> `land_sales.id` | - |
| `due_date` | `date` | NO | NULL | - | - |
| `due_amount` | `decimal(15,2)` | NO | NULL | - | - |
| `status` | `varchar(20)` | NO | `UPCOMING` | - | - |

### `land_projects`
- **Module:** Land & Acquisition
- **Purpose:** Real estate / land development projects with mouza, khatian, area, and status.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `project_name` | `varchar(200)` | NO | NULL | - | - |
| `mouza` | `varchar(100)` | NO | NULL | - | - |
| `jl_number` | `varchar(50)` | YES | NULL | - | - |
| `dag_numbers` | `text` | NO | NULL | - | - |
| `khatian_numbers` | `text` | NO | NULL | - | - |
| `total_area_shotok` | `decimal(10,2)` | NO | NULL | - | - |
| `purchase_price` | `decimal(15,2)` | NO | NULL | - | - |
| `bayna_amount` | `decimal(15,2)` | NO | `0.00` | - | - |
| `registration_cost` | `decimal(15,2)` | NO | `0.00` | - | - |
| `mutation_tax_cost` | `decimal(15,2)` | NO | `0.00` | - | - |
| `status` | `varchar(30)` | NO | `UNDER_BAYNA` | - | - |
| `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | - | - |

### `land_sales`
- **Module:** Plot Sales & Dues
- **Purpose:** Buyer sale contracts (single plot, multi-plot, or whole-project) tracking agreed price and due amount.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `project_id` | `char(36)` | NO | NULL | FK -> `land_projects.id` | - |
| `plot_id` | `char(36)` | YES | NULL | FK -> `project_plots.id` | - |
| `buyer_name` | `varchar(150)` | NO | NULL | - | - |
| `buyer_phone` | `varchar(20)` | NO | NULL | - | - |
| `buyer_nid` | `varchar(50)` | YES | NULL | - | - |
| `sale_date` | `date` | NO | NULL | - | - |
| `total_agreed_price` | `decimal(15,2)` | NO | NULL | - | - |
| `advance_booking_amount` | `decimal(15,2)` | NO | `0.00` | - | - |
| `current_due_amount` | `decimal(15,2)` | NO | NULL | - | - |
| `status` | `varchar(30)` | NO | `BOOKED` | - | - |

### `partner_transactions`
- **Module:** Partners & Capital
- **Purpose:** Ledger of partner capital deposits, withdrawals, direct expenses, and profit credits.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `partner_id` | `char(36)` | NO | NULL | FK -> `partners.id` | - |
| `txn_type` | `varchar(30)` | NO | NULL | - | - |
| `amount` | `decimal(15,2)` | NO | NULL | - | - |
| `txn_date` | `date` | NO | NULL | - | - |
| `reference_id` | `char(36)` | YES | NULL | - | - |
| `notes` | `text` | YES | NULL | - | - |
| `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | - | - |

### `partners`
- **Module:** Partners & Capital
- **Purpose:** Syndicate investors/partners with opening balances, payout bank details, and active status.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `global_user_id` | `char(36)` | YES | NULL | - | - |
| `name` | `varchar(150)` | NO | NULL | - | - |
| `phone` | `varchar(20)` | NO | NULL | UNIQUE | - |
| `nid_number` | `varchar(50)` | YES | NULL | UNIQUE | - |
| `bank_name` | `varchar(100)` | YES | NULL | - | - |
| `bank_account_name` | `varchar(150)` | YES | NULL | - | - |
| `bank_account_number` | `varchar(50)` | YES | NULL | - | - |
| `bank_branch` | `varchar(100)` | YES | NULL | - | - |
| `bank_routing_number` | `varchar(50)` | YES | NULL | - | - |
| `is_active` | `tinyint(1)` | NO | `1` | - | - |
| `opening_balance` | `decimal(15,2)` | NO | `0.00` | - | - |
| `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | - | - |

### `profit_distributions`
- **Module:** Reports & Profit
- **Purpose:** Recorded profit distribution payouts per project and partner.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `project_id` | `char(36)` | NO | NULL | FK -> `land_projects.id` | - |
| `distribution_date` | `date` | NO | NULL | - | - |
| `realization_basis` | `varchar(20)` | NO | NULL | - | - |
| `total_project_net_profit` | `decimal(15,2)` | NO | NULL | - | - |
| `partner_id` | `char(36)` | NO | NULL | FK -> `partners.id` | - |
| `partner_share_percent` | `decimal(5,2)` | NO | NULL | - | - |
| `payout_amount` | `decimal(15,2)` | NO | NULL | - | - |

### `project_expenses`
- **Module:** Project Expenses
- **Purpose:** Project acquisition, legal, development, and overhead expense vouchers (PENDING/APPROVED/REJECTED).
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `project_id` | `char(36)` | YES | NULL | FK -> `land_projects.id` | - |
| `expense_category` | `varchar(100)` | NO | NULL | - | - |
| `amount` | `decimal(15,2)` | NO | NULL | - | - |
| `expense_date` | `date` | NO | NULL | - | - |
| `description` | `text` | YES | NULL | - | - |
| `payment_channel` | `varchar(20)` | NO | NULL | - | - |
| `bank_account_id` | `char(36)` | YES | NULL | FK -> `bank_accounts.id` | - |
| `paid_by_partner_id` | `char(36)` | YES | NULL | FK -> `partners.id` | - |
| `voucher_image_url` | `text` | YES | NULL | - | - |
| `status` | `varchar(20)` | NO | `PENDING` | - | - |
| `approved_by` | `char(36)` | YES | NULL | - | - |
| `created_by` | `char(36)` | NO | NULL | - | - |
| `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | - | - |

### `project_partners`
- **Module:** Land & Acquisition
- **Purpose:** Shareholding split (%) of partners per land project (must sum to 100%).
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `project_id` | `char(36)` | NO | NULL | FK -> `land_projects.id` | - |
| `partner_id` | `char(36)` | NO | NULL | FK -> `partners.id` | - |
| `share_percentage` | `decimal(5,2)` | NO | NULL | - | - |

### `project_plots`
- **Module:** Plots
- **Purpose:** Individual subdivided plots within a project with Shotok size, asking price, and status.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `project_id` | `char(36)` | NO | NULL | FK -> `land_projects.id` | - |
| `plot_number` | `varchar(50)` | NO | NULL | - | - |
| `plot_size_shotok` | `decimal(10,2)` | NO | NULL | - | - |
| `asking_price` | `decimal(15,2)` | NO | NULL | - | - |
| `status` | `varchar(20)` | NO | `AVAILABLE` | - | - |

### `role_permissions`
- **Module:** Roles & Permissions
- **Purpose:** Permission keys assigned to each role.
- **Primary Key:** `role_id` (char(36)), `permission_key` (varchar(100)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `role_id` | `char(36)` | NO | NULL | PK, FK -> `roles.id` | - |
| `permission_key` | `varchar(100)` | NO | NULL | PK | - |

### `roles`
- **Module:** Roles & Permissions
- **Purpose:** Tenant-scoped RBAC roles (Owner, Managing Partner, Accountant, Site Manager, custom roles).
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `name` | `varchar(100)` | NO | NULL | UNIQUE | - |
| `description` | `varchar(255)` | YES | NULL | - | - |
| `is_system` | `tinyint(1)` | NO | `0` | - | - |
| `created_by` | `char(36)` | YES | NULL | - | - |
| `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | - | - |
| `updated_at` | `timestamp` | NO | NULL | - | - |

### `treasury_ledger`
- **Module:** Cash & Bank Ledger
- **Purpose:** Immutable cash and bank cashbook ledger (CREDIT/DEBIT) for all treasury movements.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `txn_date` | `date` | NO | NULL | - | - |
| `account_type` | `varchar(20)` | NO | NULL | - | - |
| `bank_account_id` | `char(36)` | YES | NULL | FK -> `bank_accounts.id` | - |
| `flow_type` | `varchar(10)` | NO | NULL | - | - |
| `amount` | `decimal(15,2)` | NO | NULL | - | - |
| `purpose` | `varchar(255)` | NO | NULL | - | - |
| `reference_type` | `varchar(30)` | NO | NULL | - | - |
| `reference_id` | `char(36)` | YES | NULL | - | - |
| `created_by` | `char(36)` | NO | NULL | - | - |
| `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | - | - |

### `user_roles`
- **Module:** Users & Roles
- **Purpose:** Maps control-plane global_users.id to a tenant role.
- **Primary Key:** `user_id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `user_id` | `char(36)` | NO | NULL | PK | - |
| `role_id` | `char(36)` | NO | NULL | FK -> `roles.id` | - |
| `assigned_by` | `char(36)` | YES | NULL | - | - |
| `assigned_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | - | - |
