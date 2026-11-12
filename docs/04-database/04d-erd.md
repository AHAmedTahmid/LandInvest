# 04d. Entity Relationship Diagrams (ERD)

**Purpose:** Visual Mermaid ERDs for `control_plane`, the full `tenant_*` database, and each functional module.  
**Intended Reader:** Technical Lead, Database Administrator, Backend Developer.  
**Last Verified:** 2026-11-12

---

## 1. Control Plane ERD (\`control_plane\`)

```mermaid
erDiagram
  tenants ||--o{ global_users : "has users"
  tenants ||--o{ user_invitations : "has invites"
  tenants ||--o{ billing_invoices : "billed via"
  tenants ||--o{ audit_logs : "logs"
  subscription_plans ||--o{ tenants : "subscribed to"
  global_users ||--o{ password_reset_tokens : "resets password"

  tenants {
    char36 id PK
    varchar slug UK
    varchar db_name UK
    varchar status
  }
  global_users {
    char36 id PK
    char36 tenant_id FK
    varchar email UK
    tinyint is_owner
    tinyint is_active
  }
  subscription_plans {
    char36 id PK
    varchar code UK
    decimal price_bdt
  }
  billing_invoices {
    char36 id PK
    char36 tenant_id FK
    varchar status
  }
```

---

## 2. Full Tenant Database Overview ERD (\`tenant_*\`)

```mermaid
erDiagram
  partners ||--o{ partner_transactions : "ledger"
  partners ||--o{ project_partners : "owns share %"
  partners ||--o{ project_expenses : "paid directly"
  partners ||--o{ profit_distributions : "receives"

  land_projects ||--o{ project_partners : "syndicate split"
  land_projects ||--o{ project_plots : "subdivided into"
  land_projects ||--o{ project_expenses : "incurs"
  land_projects ||--o{ land_sales : "sells"
  land_projects ||--o{ profit_distributions : "distributes"

  project_plots ||--o{ land_sales : "sold via"
  land_sales ||--o{ installment_schedule : "scheduled"
  land_sales ||--o{ customer_payments : "settled by"

  bank_accounts ||--o{ treasury_ledger : "tracks"
  bank_accounts ||--o{ project_expenses : "pays"
  bank_accounts ||--o{ customer_payments : "receives"
  bank_accounts ||--o{ treasury_transfer_requests : "contra"

  roles ||--o{ role_permissions : "grants"
  roles ||--o{ user_roles : "assigned to"
```

---

## 3. Module ERDs

### Partners & Capital
```mermaid
erDiagram
  partners ||--o{ partner_transactions : "DEPOSIT / WITHDRAWAL / DIRECT_EXPENSE / PROFIT_CREDIT"
  partners {
    char36 id PK
    varchar name
    decimal opening_balance
    char36 global_user_id "Logical link to control_plane.global_users"
  }
  partner_transactions {
    char36 id PK
    char36 partner_id FK
    varchar txn_type
    decimal amount
    date txn_date
  }
```

### Treasury (Cash & Bank)
```mermaid
erDiagram
  bank_accounts ||--o{ treasury_ledger : "bank entries"
  bank_accounts ||--o{ treasury_transfer_requests : "contra target/source"
  bank_accounts {
    char36 id PK
    varchar bank_name
    varchar account_number UK
    decimal current_balance
  }
  treasury_ledger {
    char36 id PK
    varchar source_type "CASH or BANK"
    char36 bank_account_id FK
    varchar txn_type "CREDIT or DEBIT"
    decimal amount
    varchar reference_type
    char36 reference_id
  }
  treasury_transfer_requests {
    char36 id PK
    varchar from_type
    varchar to_type
    decimal amount
    varchar status "PENDING / APPROVED / REJECTED"
  }
```

### Plots, Sales & Collections
```mermaid
erDiagram
  land_projects ||--o{ project_plots : "has"
  project_plots ||--o{ land_sales : "primary plot"
  land_sales ||--o{ installment_schedule : "installments"
  land_sales ||--o{ customer_payments : "payments"
  land_sales {
    char36 id PK
    char36 project_id FK
    char36 plot_id FK
    decimal total_agreed_price
    decimal current_due_amount
    varchar status "BOOKED / PARTIAL / PAID_IN_FULL"
  }
  project_plots {
    char36 id PK
    varchar plot_number
    decimal plot_size_shotok
    varchar status "AVAILABLE / BOOKED / SOLD"
  }
```

### RBAC & Dashboard
```mermaid
erDiagram
  roles ||--o{ role_permissions : "has"
  roles ||--o{ user_roles : "assigned"
  roles {
    char36 id PK
    varchar name UK
    tinyint is_system
  }
  role_permissions {
    char36 id PK
    char36 role_id FK
    varchar permission_key
  }
  user_roles {
    char36 id PK
    char36 user_id "Logical link to global_users.id"
    char36 role_id FK
  }
  dashboard_layouts {
    char36 id PK
    varchar target_type "ROLE or USER"
    char36 target_id
    json layout_json
  }
```
`;
writeDoc("04-database/04d-erd.md", ...)`
