# Onboarding Flow Implementation Plan

## 概要

見積回答後のクライアントオンボーディングフロー：

- ユーザーアカウント＆会社情報入力
- Admin承認
- 契約書＋請求書の送信
- 支払い完了確認
- プロジェクト開始

---

## フロー図

```
1. Quote Response (完了)
   ↓
2. Onboarding Form (クライアント入力)
   ├─ ユーザーアカウント情報（名前、メール、パスワード）
   └─ 会社情報（会社名、住所、電話など）
   ↓
3. Admin確認・承認
   ↓
4. 複合通知送信（3メール）
   ├─ 契約書承認の通知
   ├─ アカウント作成完了・今後の利用方法
   └─ 請求書送付+入金リクエスト（50%/30%自動計算）
   ↓
5. User Dashboard (請求書表示)
   └─ 「入金完了」スイッチ切り替え
   ↓
6. Admin通知 (入金完了)
   ↓
7. プロジェクト開始通知 → User
```

---

## 実装ステップ

### Step 1: Database スキーマ

#### onboardings テーブル

```sql
CREATE TABLE onboardings (
    id CHAR(26) PRIMARY KEY,  // ULID
    quote_response_id CHAR(26) NOT NULL,
    token VARCHAR(60) NOT NULL UNIQUE,

    // クライアント入力情報
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    company_name VARCHAR(255) NOT NULL,
    company_address TEXT NOT NULL,
    company_phone VARCHAR(20) NOT NULL,
    company_postal_code VARCHAR(10),

    // 状態管理
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_notes TEXT,
    approved_by CHAR(26) NULLABLE,  // Admin ID
    approved_at TIMESTAMP NULLABLE,
    rejected_at TIMESTAMP NULLABLE,

    // ユーザーアカウント
    user_id CHAR(26) NULLABLE,  // 承認時に自動作成

    // 支払い
    invoice_id CHAR(26) NULLABLE,
    payment_percentage INT DEFAULT 50,  // 50% or 30% or manual
    payment_status ENUM('pending', 'paid') DEFAULT 'pending',
    paid_at TIMESTAMP NULLABLE,

    // プロジェクト
    project_id CHAR(26) NULLABLE,
    project_started_at TIMESTAMP NULLABLE,

    timestamps

    FOREIGN KEY quote_response_id → quote_responses(id) CASCADE
    FOREIGN KEY approved_by → admins(id)
    FOREIGN KEY user_id → users(id) CASCADE
    FOREIGN KEY invoice_id → invoices(id)
    FOREIGN KEY project_id → projects(id)
}
```

#### invoices テーブル（既存確認後）

- quote_id, amount, payment_percentage, status
- 見積の50%/30%を自動計算

---

### Step 2: Models

#### Onboarding Model

```php
class Onboarding extends Model {
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';

    const PAYMENT_PERCENTAGE = [50, 30]; // web: 50%, system: 30%

    // Relations
    belongsTo(QuoteResponse)
    belongsTo(Admin, 'approved_by')
    belongsTo(User)
    belongsTo(Invoice)
    belongsTo(Project)

    // Methods
    getPaymentAmount() // 見積の50%or30%
    markAsApproved(Admin)
    markAsRejected(Admin)
    markAsPaid()
    createUserAccount()
    createProject()
}
```

---

### Step 3: Controllers

#### QuoteResponseController

- `show()`: add link to onboarding form
- `detail()`: add onboarding status display

#### OnboardingController (Public)

```php
class OnboardingController {
    public function show($token) {
        // OnboardingForm.jsx表示
        // quote_response_token で検証
    }

    public function store($token) {
        // クライアント情報を保存
        // Onboarding モデル作成
        // "お疲れ様でした" メッセージ表示
    }
}
```

#### Admin\OnboardingController

```php
class OnboardingController {
    public function index() {
        // pending, approved, rejected でフィルタリング
    }

    public function detail($id) {
        // 入力内容確認ページ
        // 承認/却下ボタン
    }

    public function approve(Onboarding $onboarding) {
        // 1. Onboarding status → 'approved'
        // 2. User account 作成
        // 3. Invoice 作成（50% or 30%）
        // 4. 複合メール送信
        //    - ContractApprovedMail
        //    - AccountCreatedMail
        //    - PaymentRequestMail (invoice attach)
    }

    public function reject(Onboarding $onboarding, Request $request) {
        // 却下理由をコメント保存
        // クライアントへ却下通知メール送信
    }
}
```

---

### Step 4: Mails

#### ContractApprovedMail

- 契約書承認完了のお知らせ
- 今後の進め方の案内

#### AccountCreatedMail

- ユーザーアカウント作成完了
- ログイン方法
- アカウントから確認できることを案内

#### PaymentRequestMail

- 請求書を添付
- 入金先銀行情報
- 支払い期限
- User Dashboard で入金完了を報告するよう案内

#### ProjectStartMail

- プロジェクト開始の通知
- プロジェクト詳細ページへのリンク

---

### Step 5: Frontend Components

#### Public - OnboardingForm.jsx

```jsx
Form Fields:
- ユーザー名（名）
- ユーザー名（姓）
- メールアドレス
- パスワード（確認付き）
- 会社名
- 住所
- 電話番号
- 郵便番号

Actions:
- Submit → POST /onboarding/{token}
- Success → "ご登録ありがとうございます" ページ
```

#### Admin - Onboarding Index

```jsx
Table:
- Company name
- First/Last name
- Email
- Status (badge: pending/approved/rejected)
- Payment status
- Created at
- Actions: View detail
```

#### Admin - Onboarding Detail

```jsx
Sections:
1. クライアント情報（入力内容表示）
   - User info
   - Company info

2. Payment Info
   - Quote amount
   - Payment percentage
   - Invoice amount
   - Invoice (PDF download)

3. Actions (if status=pending)
   - Approve button (→複合メール送信)
   - Reject with reason textarea

4. Timeline
   - Created at
   - Approved/Rejected at (with Admin name, notes)
```

#### User Dashboard - Payment Section

```jsx
当初は Payment/Invoice 表示
- Invoice amount
- Payment deadline
- "入金完了" toggle switch
  → PUT /user/payment/{invoice_id}/mark-paid
  → Admin notification 送信
```

---

### Step 6: Invoice Model (確認・拡張)

#### 要件

- `quote_id` との関連
- 自動生成: Quote approve 時 or Onboarding approve 時
- 金額: 見積の50% or 30%
- Status: pending/paid

```php
class Invoice extends Model {
    belongsTo(Quote)
    belongsTo(Onboarding)

    markAsPaid() {
        // Notification 送信
        // Project 自動作成？
    }
}
```

---

### Step 7: Notification Chain on Onboarding Approval

```
Admin.OnboardingController.approve()
  ↓
1. Onboarding::status = 'approved'
2. User::create() with onboarding data
3. Invoice::create() with payment_percentage
4. 複合メール送信:
   - To: client_email
     - ContractApprovedMail
     - AccountCreatedMail
     - PaymentRequestMail (+ invoice PDF)
5. Admin notification: 承認完了
```

---

### 実装順序

1. **マイグレーション**: onboardings テーブル
2. **Model**: Onboarding, Invoice (拡張)
3. **Controller**: OnboardingController (public) → form show, store
4. **Frontend**: OnboardingForm.jsx
5. **Mailer**: 複合メール群
6. **Admin Controller**: OnboardingController (admin) → 承認/却下
7. **Admin Frontend**: Onboarding Index, Detail
8. **User Frontend**: Payment Section
9. **E2E**: 全フロー確認

---

### 複雑さのポイント

1. **複合メール送信**: Notification::send() で複数メール (ShouldQueue)
2. **自動金額計算**: Quote type に応じた50%/30%判定
3. **ユーザー作成**: Admin approve 時に自動生成、初期パスワード
4. **請求書PDF**: Invoice を PDF 添付
5. **支払い確認**: User 側 toggle → Admin notification → Project start

---

### 送り先メール選択（将来実装）

現在: `onboarding.email` 固定
将来:

```php
$sendTo = $request->input('send_to'); // 'client_email' or 'company_email'
```
