# オンボーディングシステム ガイド

見積回答後、クライアント（User/Company）が本登録され、管理者承認を経て契約準備に進むまでの一連の流れをまとめる。

> 本ドキュメントは `OnboardingFlowRevised.md` と `QuoteResponseRegistrationFlow.md`（いずれも初期の設計案）を、実装済みコードの内容で検証・統合したもの。設計案の一部（詳細メール文面、支払い50%/30%の分割請求など）は簡略化されて実装されているため、実装済みの内容を優先して記載する。

## 全体フロー

```
1. 見積回答（QuoteResponse）完了
   ↓
2. 【第一段階】招待トークン経由の本登録（Public・ログイン不要）
   GET/POST /quote-response/{token}/register
   → QuoteResponseController::registerShow / registerStore
   → User(status=pending) + Company を作成、QuoteResponse.user_id を紐付け
   → トークンは発行から7日で失効
   ↓
3. 【第二段階】ログイン後の追加情報登録（User認証必須）
   /onboarding/profile → /onboarding/company → /onboarding/address
   → UserProfileController / CompanyController / AddressController
   ↓
4. 管理者による承認
   /admin/onboarding → Admin\OnboardingController
   → User.status: pending → active、請求書(Invoice)発行、通知メール送信
   ↓
5. （却下の場合）User/Companyを削除
```

## 第一段階: 招待トークンからの本登録

- ルート: `routes/web.php` の `quote.response.register` / `quote.response.register.store`
- コントローラー: `App\Http\Controllers\QuoteResponseController::registerShow/registerStore`
- 入力項目: `password`（8文字以上、確認あり）、`company_name`、`company_type`（individual/corporate）
- 処理: `User::create(['status' => 'pending', ...])` + `Company::create([...])` を作成し、中間テーブルで紐付け。`QuoteResponse.user_id`を設定。
- トークンは発行から7日で失効、既に登録済みのトークンは再利用不可。

## 第二段階: ログイン後の追加情報登録

`routes/web.php`内、`auth:users`ミドルウェア配下:

| ルート | コントローラー | 登録内容 |
|---|---|---|
| `/onboarding/profile` | `UserProfileController` | 氏名・カナ・電話番号等（`Profile`テーブル） |
| `/onboarding/company` | `CompanyController` | 法人正式名称・法人番号・資本金等（`Company`テーブル） |
| `/onboarding/address` | `AddressController` | 会社住所（`Address`テーブル、`type=business`） |

各ステップは独立して保存でき、完了後は次のステップへ遷移する（住所登録完了で`user.dashboard`へ）。

> ⚠️ 未使用コード: `App\Http\Controllers\User\OnboardingController`(`profileShow`/`companyShow`/`addressShow`等)が別途存在するが、どのルートからも参照されていない（実際に上記フォームを処理しているのは`UserProfileController`/`CompanyController`/`AddressController`）。将来的な削除候補。

## 管理者承認フロー

- コントローラー: `App\Http\Controllers\Admin\OnboardingController`(`routes/admin.php`の`onboarding`グループ)
- `index()`: `User.status='pending'`の一覧を表示
- `detail($userId)`: 対象User・Company・関連する最新QuoteResponse/Quoteの詳細を表示
- `approve($userId)`:
  - `User.status`・`Company.status`を`active`に更新
  - `Quote.currentVersion.total_amount`の50%でInvoiceを作成（`INV-00000001`形式の連番）
  - `ContractApprovedMail`（代表者宛）、`AccountApprovedMail`（本人宛）、`PaymentRequestMail`を送信
- `reject($userId, reason)`: **User/Companyを削除する**(却下 = 論理的な状態変更ではなく物理削除。設計案にあった「却下理由を保存してinactiveにする」という挙動ではないので注意)

> ⚠️ 要確認: `Company`テーブルの`status` enumには`'pending'`が定義されておらず(`active`/`inactive`/`suspended`のみ)、第一段階の登録時にも`Company.status`は`'active'`で作成される。一方`approve()`は`$company->status !== 'pending'`を却下条件にしている。この条件の実際の挙動(常にtrueになり承認できないのでは、等)は未検証。実際に承認フローを通す際は要動作確認。

## 関連ドキュメント

- 見積回答自体のフローは`QuoteResponseController`の他メソッド（回答受付等）を参照
- 契約書作成以降は`ProjectWorkflowGuide.md`を参照
