# 04b. Control Plane Data Dictionary (`control_plane`)

**Purpose:** Column-level data dictionary for all 7 tables in `control_plane`.
**Intended Reader:** Backend Developer, DBA.
**Last Verified:** 2026-11-12

---

### `billing_invoices`
- **Module:** Billing
- **Purpose:** Subscription invoices per tenant (currently stubbed manual/mock payment flow).
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `tenant_id` | `char(36)` | NO | NULL | FK -> `tenants.id` | - |
| `subscription_id` | `char(36)` | YES | NULL | FK -> `subscriptions.id` | - |
| `amount` | `decimal(10,2)` | NO | NULL | - | - |
| `currency` | `varchar(10)` | NO | `BDT` | - | - |
| `status` | `varchar(20)` | YES | NULL | - | - |
| `invoice_date` | `date` | NO | NULL | - | - |
| `provider_invoice_id` | `varchar(255)` | YES | NULL | - | - |

### `global_users`
- **Module:** Auth & Tenant Management
- **Purpose:** Global login identities mapped to a single tenant, storing password hash and owner/active flags.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `tenant_id` | `char(36)` | NO | NULL | FK -> `tenants.id` | - |
| `full_name` | `varchar(150)` | NO | NULL | - | - |
| `email` | `varchar(255)` | NO | NULL | UNIQUE | - |
| `password_hash` | `text` | NO | NULL | - | - |
| `is_owner` | `tinyint(1)` | NO | `0` | - | - |
| `is_active` | `tinyint(1)` | NO | `1` | - | - |
| `must_change_password` | `tinyint(1)` | NO | `0` | - | - |
| `last_login_at` | `timestamp` | YES | NULL | - | - |
| `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | - | - |

### `password_reset_tokens`
- **Module:** Auth & Tenant Management
- **Purpose:** One-time hashed tokens for self-service password resets.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `user_id` | `char(36)` | NO | NULL | - | - |
| `token` | `varchar(255)` | NO | NULL | UNIQUE | - |
| `expires_at` | `timestamp` | NO | NULL | - | - |
| `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | - | - |

### `plans`
- **Module:** General
- **Purpose:** Database table.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `name` | `varchar(50)` | NO | NULL | - | - |
| `price_monthly` | `decimal(10,2)` | NO | NULL | - | - |
| `price_yearly` | `decimal(10,2)` | YES | NULL | - | - |
| `max_users` | `int` | NO | `5` | - | - |
| `max_projects` | `int` | NO | `10` | - | - |
| `features` | `json` | YES | NULL | - | - |

### `subscriptions`
- **Module:** General
- **Purpose:** Database table.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `tenant_id` | `char(36)` | NO | NULL | FK -> `tenants.id` | - |
| `plan_id` | `char(36)` | NO | NULL | FK -> `plans.id` | - |
| `billing_cycle` | `varchar(20)` | NO | NULL | - | - |
| `current_period_start` | `date` | YES | NULL | - | - |
| `current_period_end` | `date` | YES | NULL | - | - |
| `payment_provider` | `varchar(30)` | YES | NULL | - | - |
| `provider_subscription_id` | `varchar(255)` | YES | NULL | - | - |
| `status` | `varchar(20)` | NO | `active` | - | - |

### `tenants`
- **Module:** Auth & Tenant Management
- **Purpose:** Registered customer organizations (tenants), database connection metadata, and subscription status.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `company_name` | `varchar(200)` | NO | NULL | - | - |
| `db_host` | `varchar(255)` | NO | NULL | - | - |
| `db_name` | `varchar(100)` | NO | NULL | UNIQUE | - |
| `db_user` | `varchar(100)` | NO | NULL | - | - |
| `db_password_encrypted` | `text` | NO | NULL | - | - |
| `status` | `varchar(20)` | NO | `trial` | - | - |
| `created_at` | `timestamp` | NO | `CURRENT_TIMESTAMP` | - | - |

### `user_invitations`
- **Module:** Users & Invitations
- **Purpose:** Pending email/token invitations for onboarding new users into a tenant.
- **Primary Key:** `id` (char(36)) | **Engine:** InnoDB | **Collation:** utf8mb4_unicode_ci

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
| `id` | `char(36)` | NO | NULL | PK | - |
| `tenant_id` | `char(36)` | NO | NULL | FK -> `tenants.id` | - |
| `email` | `varchar(255)` | NO | NULL | - | - |
| `role_id` | `char(36)` | NO | NULL | - | - |
| `invite_token` | `varchar(255)` | NO | NULL | UNIQUE | - |
| `expires_at` | `timestamp` | NO | NULL | - | - |
| `accepted` | `tinyint(1)` | NO | `0` | - | - |
