# Onboarding Flow - Revised Implementation Plan

## 概要（修正版）

既存の User/Company テーブルを活用する正しい設計

見積回答後のクライアントオンボーディングフロー：

- 見積回答済み → クライアント情報入力フォーム（User + Company を pending 状態で作成）
- Admin確認・承認 → User/Company status を pending → active に変更
- 複合メール送信（契約書承認 + アカウント作成 + 請求書+入金リクエスト）
- User ダッシュボードで請求書表示・入金完了報告
- Admin 確認 → プロジェクト開始

---

## フロー図

```
1. Quote Response (完了) ✅
   ↓
2. OnboardingForm (クライアント入力)
   - Quote Response の token を使用
   - ユーザーアカウント情報（名、姓、メール、パスワード）
   - 会社情報（会社名、住所、電話など）
   - User.status='pending' と Company.status='pending' で作成
   - QuoteResponse に user_id/company_id を関連付け
   ↓
3. Admin - Pending Onboarding 確認
   - User/Company/Quote 情報確認
   ↓
4. Admin - 承認処理
   - User.status: pending → active
   - Company.status: pending → active
   - Invoice 作成（見積金額の50%/30%）
   ↓
5. 複合メール送信（ShouldQueue）
   - ContractApprovedMail
   - AccountCreatedMail
   - PaymentRequestMail（Invoice PDF 添付）
   ↓
6. User Dashboard - Payment
   - Invoice 表示
   - 「入金完了」toggle switch
   ↓
7. Admin - 入金確認
   - Invoice.status: pending → paid
   - Project 作成開始通知メール
```

---

## Database スキーマ

### quote_responses テーブに追加

```php
$table->uuid('user_id')->nullable();  // 作成されたユーザー
$table->ulid('company_id')->nullable();  // 作成された会社
$table->foreign('user_id')->references('id')->on('users')->nullableOnDelete();
$table->foreign('company_id')->references('id')->on('companies')->nullableOnDelete();
```

### User テーブル（既存）

- status: ENUM('active','inactive','suspended','pending')
- pending: オンボーディング中のユーザー ✅

### Company テーブル（既存）

- status: ENUM('active','inactive','suspended')
- **問題**: pending がない
- **解決**: status に 'pending' を追加するか、pending_at を追加

### Invoice テーブル（既存）

- quote_id, status('draft','sent','viewed','paid','overdue','cancelled')
- 見積金額の50%/30%を Invoice.subtotal に計算

---

## 実装ステップ

### Step 1: Migrations

#### 1-1. quote_responses に user_id/company_id を追加

```
database/migrations/2026_06_27_xxxxx_add_user_company_to_quote_responses.php
```

#### 1-2. companies.status に 'pending' を追加

```
database/migrations/2026_06_27_xxxxx_update_company_status_enum.php
```

---

### Step 2: Models

#### QuoteResponse Model

```php
public function user() {
    return $this->belongsTo(User::class);
}

public function company() {
    return $this->belongsTo(Company::class);
}

public function createUserAndCompany($data) {
    // User 作成（pending 状態）
    $user = User::create([
        'email' => $data['email'],
        'password' => Hash::make($data['password']),
        'status' => 'pending',
    ]);

    // Company 作成（pending 状態）
    $company = Company::create([
        'name' => $data['company_name'],
        'phone' => $data['company_phone'],
        'status' => 'pending',
    ]);

    // QuoteResponse に関連付け
    $this->user_id = $user->id;
    $this->company_id = $company->id;
    $this->save();

    return [$user, $company];
}
```

---

### Step 3: Controllers

#### OnboardingController (Public - route: /onboarding/{token})

```php
// show($token)
// - QuoteResponse.token で検証
// - OnboardingForm.jsx を render

// store($token, Request $request)
// - validate: email, password, company_name, etc
// - QuoteResponse::where('token', $token)->where('responded_at', '!=', null)->firstOrFail()
// - $quoteResponse->createUserAndCompany($request->validated())
// - "ご登録ありがとうございます" ページ表示
```

#### Admin\OnboardingController (route: /admin/onboarding)

```php
// index()
// - pending User/Company を表示
// - User::where('status', 'pending')->with('company', 'quoteResponse.quote')->get()
// - Index.jsx: table with columns [name, company, email, created_at, actions]

// detail($userId)
// - User/Company/Quote/InvoicePreview を表示
// - Detail.jsx

// approve($userId)
// - User.status: pending → active
// - Company.status: pending → active
// - Invoice 作成
// - 複合メール送信
// - Admin notification: 承認完了

// reject($userId, Request $request)
// - 却下理由保存
// - 却下通知メール送信
// - User/Company 削除または inactive に
```

---

### Step 4: Mailers

#### ContractApprovedMail

- Subject: 契約書承認完了のお知らせ
- Content: 承認完了、今後のプロセス説明

#### AccountCreatedMail

- Subject: アカウント作成完了のお知らせ
- Content: ログイン情報、ダッシュボードリンク

#### PaymentRequestMail

- Subject: 請求書のご送付
- Content: 請求書の説明、支払い方法、期限
- Attachment: Invoice PDF

#### ProjectStartMail

- Subject: プロジェクト開始のお知らせ
- Content: プロジェクト詳細リンク

---

### Step 5: Frontend - Public

#### OnboardingForm.jsx

```jsx
// Quote Response のリンクから遷移
// Form Fields:
- first_name
- last_name
- email (auto-fill from quote response?)
- password
- password_confirmation
- company_name
- company_phone
- company_postal_code
- etc.

// Submit: POST /onboarding/{token}
// Success: "ご登録ありがとうございます"
// Error: validation errors
```

---

### Step 6: Frontend - Admin

#### Onboarding/Index.jsx

```jsx
// Table:
- Name (last_name + first_name)
- Company
- Email
- Status: pending
- Created at
- Actions: View

// Filters:
- Status (pending/active/rejected)
- Company
- Date range
```

#### Onboarding/Detail.jsx

```jsx
// Sections:
1. User Info (read-only)
   - Name, Email, Status: pending

2. Company Info (read-only)
   - Name, Phone, Address, etc.

3. Quote Info
   - Quote number
   - Total amount
   - Services

4. Invoice Preview
   - Calculation: Quote amount × 50% (or 30%)
   - Display: Subtotal, Tax, Total

5. Actions (if status=pending)
   - Approve button → confirm → send emails
   - Reject with reason textarea
```

---

### Step 7: Frontend - User Dashboard

#### Invoice/PaymentSection.jsx

```jsx
// Invoice Display:
- Invoice number
- Total amount
- Due date
- Status badge (pending/paid)
- PDF Download link

// Payment Action:
- "入金完了" toggle switch (if status=pending)
  → PUT /user/invoice/{invoiceId}/mark-paid
  → Loading state
  → Success: "Admin に通知しました"
  → Error: show error message
```

---

## 実装順序（優先順位）

1. **Migrations**
    - quote_responses に user_id/company_id 追加
    - companies.status に 'pending' 追加

2. **Models**
    - QuoteResponse.createUserAndCompany()
    - User/Company relationships

3. **Public Controller & View**
    - OnboardingController (show/store)
    - OnboardingForm.jsx

4. **Admin Controller & View**
    - Admin\OnboardingController (index/detail/approve/reject)
    - Index.jsx, Detail.jsx

5. **Mailers**
    - ContractApprovedMail, AccountCreatedMail, PaymentRequestMail

6. **User Dashboard**
    - Invoice section with toggle payment

7. **Notifications**
    - Admin notification on payment received

8. **Testing**
    - E2E: form submit → admin approve → emails → user payment

---

## 複雑さのポイント

1. **User/Company pending 状態**: status = 'pending' で一時的に保存
2. **支払い率の計算**: Quote type に基づく 50%/30% 自動計算
3. **複合メール送信**: ShouldQueue で非同期処理
4. **Invoice PDF生成・添付**: MailableクラスでPDF添付
5. **User dashboard toggle**: Invoice.status 更新 → Admin notification

---

## 送り先メール選択（将来実装）

現在: User.email 固定
将来: Company.email との選択肢を追加
