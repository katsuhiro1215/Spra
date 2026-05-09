# DB 設計見直し計画

**作成日:** 2026-04-28  
**ブランチ:** `feature/db-redesign`  
**目的:** セキュリティ強化・データ整合性向上・プロジェクト/契約管理の拡充

---

## 1. 設計方針

| 項目                       | 方針                                         |
| -------------------------- | -------------------------------------------- |
| 認証テーブル(users/admins) | 主キー → **UUID**                            |
| その他すべてのテーブル     | 主キー → **ULID**                            |
| プロフィール・住所情報     | 認証テーブルから分離                         |
| 会社情報                   | Companyテーブルで一元管理                    |
| プロジェクト管理           | 問い合わせ → 見積 → 契約 → 開発 → 完了の流れ |
| 契約・請求管理             | Contract / Invoice / Payment テーブルで管理  |
| アーキテクチャ             | Controller / Service / Repository の3層構成  |

---

## 2. 全体テーブル構成

### 2-1. 認証 (UUID)

```
users
  - id: uuid (PK)
  - email: string unique
  - password: string
  - email_verified_at: timestamp nullable
  - status: enum(active, inactive, suspended, pending)
  - remember_token: string nullable
  - last_login_at: timestamp nullable
  - timestamps
  - softDeletes

admins
  - id: uuid (PK)
  - email: string unique
  - password: string
  - email_verified_at: timestamp nullable
  - role: enum(super_admin, admin, editor) default(admin)
  - is_active: boolean default(true)
  - remember_token: string nullable
  - last_login_at: timestamp nullable
  - timestamps
  - softDeletes
```

### 2-2. プロフィール (ULID)

```
user_profiles
  - id: ulid (PK)
  - user_id: uuid (FK → users.id) unique
  - first_name: string nullable
  - last_name: string nullable
  - first_name_kana: string nullable
  - last_name_kana: string nullable
  - display_name: string nullable
  - birth_date: date nullable
  - gender: enum(male, female, other, prefer_not_to_say) nullable
  - phone: string nullable
  - mobile: string nullable
  - avatar: string nullable
  - bio: text nullable
  - occupation: string nullable
  - job_title: string nullable
  - preferred_language: string(10) default(ja)
  - timezone: string default(Asia/Tokyo)
  - notification_preferences: json nullable
  - timestamps

admin_profiles
  - id: ulid (PK)
  - admin_id: uuid (FK → admins.id) unique
  - first_name: string nullable
  - last_name: string nullable
  - first_name_kana: string nullable
  - last_name_kana: string nullable
  - display_name: string nullable
  - phone: string nullable
  - avatar: string nullable
  - bio: text nullable
  - department: string nullable  ← 部署
  - timestamps
```

### 2-3. 住所 (ULID, ポリモーフィック)

```
addresses  ← 旧 user_addresses をリネーム・統合
  - id: ulid (PK)
  - addressable_type: string  ← User / Company / Admin
  - addressable_id: string    ← ポリモーフィック(UUIDかULID)
  - type: enum(home, office, billing, shipping, branch, other) default(home)
  - label: string nullable
  - postal_code: string(8)
  - prefecture: string
  - city: string
  - district: string nullable
  - address_other: string nullable
  - phone: string nullable
  - contact_person: string nullable
  - latitude: decimal(10,7) nullable
  - longitude: decimal(10,7) nullable
  - is_default: boolean default(false)
  - is_active: boolean default(true)
  - verified_at: timestamp nullable
  - notes: text nullable
  - timestamps
  - softDeletes
```

### 2-4. 会社 (ULID)

```
companies
  - id: ulid (PK)
  - name: string
  - company_type: enum(individual, corporate) default(individual)
  - legal_name: string nullable
  - registration_number: string nullable
  - tax_number: string nullable
  - phone: string nullable
  - fax: string nullable
  - email: string nullable
  - website: string nullable
  - representative_name: string nullable
  - representative_title: string nullable
  - representative_email: string nullable
  - representative_phone: string nullable
  - business_description: text nullable
  - industry: string nullable
  - employee_count: integer nullable
  - capital: decimal(15,2) nullable
  - established_date: date nullable
  - status: enum(active, inactive, suspended) default(active)
  - notes: text nullable
  - metadata: json nullable
  - timestamps
  - softDeletes

company_user  ← ユーザーと会社の関連(多対多)
  - id: ulid (PK)
  - user_id: uuid (FK → users.id)
  - company_id: ulid (FK → companies.id)
  - role: enum(owner, member, employee) default(member)
  - is_primary: boolean default(false)  ← メイン所属会社
  - joined_at: timestamp nullable
  - left_at: timestamp nullable
  - timestamps
```

### 2-5. サービス・見積 (ULID)

```
service_categories  ← 変更なし(ULID化)
service_types       ← 変更なし(ULID化)
service_type_price_items ← 変更なし(ULID化)
service_plans       ← 変更なし(ULID化)
plan_pricings       ← 変更なし(ULID化)

quotes (見積)
  - id: ulid (PK)
  - quote_number: string unique
  - user_id: uuid FK → users.id nullable   ← 既存ユーザーの場合
  - company_id: ulid FK → companies.id nullable
  - service_type_id: ulid FK → service_types.id
  - client_name: string
  - client_email: string
  - client_phone: string nullable
  - requirements: text nullable
  - custom_specifications: json nullable
  - base_amount: decimal(12,2)
  - discount_amount: decimal(12,2) default(0)
  - tax_rate: decimal(5,2) default(10)
  - tax_amount: decimal(12,2)
  - total_amount: decimal(12,2)
  - status: enum(draft, sent, reviewed, approved, rejected, expired) default(draft)
  - client_feedback: text nullable
  - sent_at: timestamp nullable
  - responded_at: timestamp nullable
  - expires_at: timestamp nullable
  - created_by: uuid FK → admins.id
  - updated_by: uuid FK → admins.id nullable
  - timestamps
```

### 2-6. プロジェクト管理 (ULID)

```
project_inquiries  ← 旧 project_drafts を改称・整理
  - id: ulid (PK)
  - inquiry_code: string unique
  - user_id: uuid FK → users.id
  - company_id: ulid FK → companies.id nullable
  - title: string
  - summary: text nullable
  - budget_min: decimal(12,2) nullable
  - budget_max: decimal(12,2) nullable
  - desired_delivery_date: date nullable
  - status: enum(new, in_discussion, estimated, contracted, cancelled) default(new)
  - hearing_notes: longtext nullable   ← ヒアリングメモ
  - admin_notes: longtext nullable     ← 管理者メモ
  - assigned_admin_id: uuid FK → admins.id nullable
  - quote_id: ulid FK → quotes.id nullable
  - created_by: uuid FK → admins.id nullable
  - timestamps
  - softDeletes

projects
  - id: ulid (PK)
  - project_code: string unique
  - inquiry_id: ulid FK → project_inquiries.id nullable
  - user_id: uuid FK → users.id
  - company_id: ulid FK → companies.id nullable
  - admin_id: uuid FK → admins.id nullable  ← 担当管理者
  - title: string
  - description: text nullable
  - thumbnail: string nullable
  - status: enum(planning, design, development, testing, review, completed, on_hold, cancelled) default(planning)
  - priority: enum(low, medium, high, urgent) default(medium)
  - start_date: date nullable
  - estimated_end_date: date nullable
  - actual_end_date: date nullable
  - sort_order: integer default(0)
  - is_public: boolean default(false)  ← クライアント向け公開設定
  - client_visible_notes: text nullable  ← クライアントに見せるメモ
  - internal_notes: text nullable        ← 内部メモ
  - created_by: uuid FK → admins.id nullable
  - updated_by: uuid FK → admins.id nullable
  - deleted_by: uuid FK → admins.id nullable
  - timestamps
  - softDeletes

project_milestones  ← 進捗管理
  - id: ulid (PK)
  - project_id: ulid FK → projects.id
  - title: string
  - description: text nullable
  - status: enum(pending, in_progress, completed, skipped) default(pending)
  - due_date: date nullable
  - completed_at: timestamp nullable
  - sort_order: integer default(0)
  - is_client_visible: boolean default(true)
  - timestamps

project_updates  ← クライアントへの進捗報告
  - id: ulid (PK)
  - project_id: ulid FK → projects.id
  - admin_id: uuid FK → admins.id
  - title: string
  - content: longtext
  - type: enum(progress, issue, milestone, general) default(progress)
  - is_client_visible: boolean default(true)
  - notified_at: timestamp nullable  ← クライアントへの通知日時
  - timestamps
```

### 2-7. 契約管理 (ULID)

```
contracts
  - id: ulid (PK)
  - contract_number: string unique
  - project_id: ulid FK → projects.id
  - user_id: uuid FK → users.id
  - company_id: ulid FK → companies.id nullable
  - quote_id: ulid FK → quotes.id nullable
  - title: string
  - description: text nullable
  - type: enum(one_time, monthly, annual) default(one_time)  ← 一括/月額/年額
  - amount: decimal(12,2)    ← 契約総額(一括)または月額
  - tax_rate: decimal(5,2) default(10)
  - start_date: date
  - end_date: date nullable   ← 月額の場合は自動更新
  - status: enum(draft, pending_signature, active, suspended, completed, cancelled) default(draft)
  - signed_at: timestamp nullable
  - terminated_at: timestamp nullable
  - termination_reason: text nullable
  - auto_renewal: boolean default(false)
  - renewal_notice_days: integer default(30)
  - terms_and_conditions: longtext nullable
  - notes: text nullable
  - created_by: uuid FK → admins.id nullable
  - timestamps
  - softDeletes

contract_documents  ← 契約書ファイル
  - id: ulid (PK)
  - contract_id: ulid FK → contracts.id
  - file_name: string
  - file_path: string
  - file_size: integer nullable
  - mime_type: string nullable
  - uploaded_by: uuid FK → admins.id nullable
  - timestamps
```

### 2-8. 請求・支払管理 (ULID)

```
invoices  ← 請求書
  - id: ulid (PK)
  - invoice_number: string unique
  - contract_id: ulid FK → contracts.id
  - user_id: uuid FK → users.id
  - company_id: ulid FK → companies.id nullable
  - billing_period_start: date nullable  ← 月額の請求対象期間
  - billing_period_end: date nullable
  - subtotal: decimal(12,2)
  - discount_amount: decimal(12,2) default(0)
  - tax_rate: decimal(5,2) default(10)
  - tax_amount: decimal(12,2)
  - total_amount: decimal(12,2)
  - status: enum(draft, sent, viewed, paid, overdue, cancelled) default(draft)
  - due_date: date
  - sent_at: timestamp nullable
  - viewed_at: timestamp nullable
  - paid_at: timestamp nullable
  - notes: text nullable
  - created_by: uuid FK → admins.id nullable
  - timestamps
  - softDeletes

invoice_items  ← 請求明細
  - id: ulid (PK)
  - invoice_id: ulid FK → invoices.id
  - description: string
  - quantity: decimal(10,2) default(1)
  - unit_price: decimal(12,2)
  - amount: decimal(12,2)
  - sort_order: integer default(0)
  - timestamps

payments  ← 入金記録
  - id: ulid (PK)
  - invoice_id: ulid FK → invoices.id
  - amount: decimal(12,2)
  - payment_method: enum(bank_transfer, credit_card, cash, other) default(bank_transfer)
  - payment_date: date
  - transaction_id: string nullable  ← 決済ID(外部決済の場合)
  - status: enum(pending, completed, failed, refunded) default(completed)
  - notes: text nullable
  - confirmed_by: uuid FK → admins.id nullable
  - timestamps
```

### 2-9. その他 (既存維持・ULID化)

```
pages               ← ホームページ管理
blogs               ← ブログ
blog_categories
blog_media
contacts            ← お問い合わせ
faq_categories
faqs
media               ← メディアライブラリ
site_settings       ← サイト設定
system_settings     ← システム設定
user_activity_logs  ← ユーザー活動ログ
user_login_histories ← ログイン履歴
```

---

## 3. マイグレーション実装順序

```
Phase 1: 認証テーブルの再構築
  [1] 0001_create_users_table          → UUID化、プロフィール列を削除
  [2] 0002_create_admins_table         → UUID化、シンプル化

Phase 2: プロフィール・住所
  [3] create_user_profiles_table       → ULID、user_id:uuid FK
  [4] create_admin_profiles_table      → ULID、admin_id:uuid FK
  [5] create_addresses_table           → ULID、ポリモーフィック(旧user_addressesを統合)

Phase 3: 会社
  [6] create_companies_table           → ULID
  [7] create_company_user_table        → ピボット

Phase 4: サービス・見積
  [8] create_service_categories_table  → ULID
  [9] create_services_table            → ULID
  [10] create_service_types_table      → ULID
  [11] create_service_type_price_items_table → ULID
  [12] create_service_plans_table      → ULID
  [13] create_plan_pricings_table      → ULID
  [14] create_quotes_table             → ULID

Phase 5: プロジェクト管理
  [15] create_project_categories_table → ULID
  [16] create_project_inquiries_table  → ULID (旧project_drafts)
  [17] create_projects_table           → ULID
  [18] create_project_milestones_table → ULID
  [19] create_project_updates_table    → ULID
  [20] create_project_category_project → ピボット(ULID)

Phase 6: 契約管理
  [21] create_contracts_table          → ULID
  [22] create_contract_documents_table → ULID

Phase 7: 請求・支払
  [23] create_invoices_table           → ULID
  [24] create_invoice_items_table      → ULID
  [25] create_payments_table           → ULID

Phase 8: ホームページ・コンテンツ管理
  [26] create_pages_table              → ULID
  [27] create_blogs_table              → ULID
  [28] create_blog_categories_table    → ULID
  [29] create_blog_media_table         → ULID
  [30] create_contacts_table           → ULID
  [31] create_faq_categories_table     → ULID
  [32] create_faqs_table               → ULID
  [33] create_media_table              → ULID
  [34] create_site_settings_table      → ULID
  [35] create_system_settings_table    → ULID
  [36] create_user_activity_logs_table → ULID
  [37] create_user_login_histories_table → ULID
```

---

## 4. モデル設計概要

### HasUuid トレイト

```php
// app/Models/Concerns/HasUuid.php
// - $incrementing = false
// - $keyType = 'string'
// - creating イベントで Str::uuid() をセット
```

### HasUlid トレイト

```php
// app/Models/Concerns/HasUlid.php
// - $incrementing = false
// - $keyType = 'string'
// - creating イベントで Str::ulid() をセット
```

---

## 5. アーキテクチャ (Controller / Service / Repository)

```
app/
  Http/Controllers/
    Admin/
      Dashboard/
      User/
        UserController.php
        UserProfileController.php
      Company/
        CompanyController.php
      Project/
        ProjectInquiryController.php
        ProjectController.php
        ProjectMilestoneController.php
        ProjectUpdateController.php
      Contract/
        ContractController.php
        ContractDocumentController.php
      Invoice/
        InvoiceController.php
        PaymentController.php
      Service/
        ...
      Homepage/
        ...
    User/  ← クライアント向けダッシュボード
      DashboardController.php
      Project/
        ProjectController.php
        ProjectUpdateController.php
      Contract/
        ContractController.php
      Invoice/
        InvoiceController.php

  Services/
    User/
      UserService.php
      UserProfileService.php
    Company/
      CompanyService.php
    Project/
      ProjectInquiryService.php
      ProjectService.php
      ProjectMilestoneService.php
      ProjectUpdateService.php
    Contract/
      ContractService.php
    Invoice/
      InvoiceService.php
      PaymentService.php

  Repositories/
    Contracts/
      UserRepositoryInterface.php
      ProjectRepositoryInterface.php
      ContractRepositoryInterface.php
      InvoiceRepositoryInterface.php
      ...
    UserRepository.php
    UserProfileRepository.php
    CompanyRepository.php
    ProjectInquiryRepository.php
    ProjectRepository.php
    ProjectMilestoneRepository.php
    ContractRepository.php
    InvoiceRepository.php
    PaymentRepository.php
```

---

## 6. 削除・廃止するテーブル/マイグレーション

| 旧テーブル/マイグレーション         | 対応                                 |
| ----------------------------------- | ------------------------------------ |
| `user_addresses`                    | `addresses` に統合(ポリモーフィック) |
| `project_drafts`                    | `project_inquiries` に改称           |
| `add_company_fields_to_users_table` | usersテーブルをシンプル化し削除      |
| `user_profiles` の住所フィールド    | `addresses`テーブルに移行            |
| `quotes` の `client_name/email`     | `user_id` / `company_id` で管理      |

---

## 7. 実装スケジュール

| Phase     | 内容                     | 優先度 |
| --------- | ------------------------ | ------ |
| Phase 1-2 | 認証・プロフィール再構築 | 最高   |
| Phase 3   | 会社管理                 | 高     |
| Phase 4   | サービス・見積           | 高     |
| Phase 5   | プロジェクト管理         | 高     |
| Phase 6   | 契約管理                 | 高     |
| Phase 7   | 請求・支払               | 中     |
| Phase 8   | コンテンツ管理ULID化     | 低     |

---

## 8. 重要フラグ・アラート対象アクション

クライアントダッシュボードで確認を促すアラートが必要なアクション：

| アクション                          | アラートレベル |
| ----------------------------------- | -------------- |
| 契約確定 (contract.status → active) | 危険 (赤)      |
| プロジェクト依頼キャンセル          | 警告 (黄)      |
| 請求書の確認完了                    | 情報 (青)      |
| 支払い完了登録                      | 成功 (緑)      |
| 契約解除                            | 危険 (赤)      |
| プロジェクト完了確認                | 成功 (緑)      |

---

_このドキュメントは実装の進行に合わせて更新します。_
