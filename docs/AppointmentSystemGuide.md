# 予約管理システム実装ガイド

## 概要

クライアント面談、進捗会、相談などの予約を管理するシステムです。予約枠の作成、予約の登録、ステータス管理、自動通知機能を提供します。

## 機能一覧

### 1. 予約枠管理 (Appointment Slots)

管理者が予約可能な時間枠を作成・管理します。

#### 機能

- **予約枠の作成**: 日時、開始/終了時刻、種類、定員、担当者を設定
- **予約枠の種類**:
    - `meeting`: 面談
    - `progress_review`: 進捗会
    - `consultation`: 相談
    - `other`: その他
- **ステータス管理**:
    - `available`: 予約可能
    - `blocked`: ブロック中
    - `full`: 満席（自動設定）
- **担当者割り当て**: 管理者を予約枠に割り当て可能
- **定員管理**: 最大予約数を設定、現在の予約数を自動追跡

#### ルート

- `GET /admin/appointment-slots` - 予約枠一覧
- `GET /admin/appointment-slots/create` - 予約枠作成フォーム
- `POST /admin/appointment-slots` - 予約枠保存
- `GET /admin/appointment-slots/{id}/edit` - 予約枠編集フォーム
- `PUT /admin/appointment-slots/{id}` - 予約枠更新
- `DELETE /admin/appointment-slots/{id}` - 予約枠削除

#### モデルメソッド

```php
$slot->isAvailable()         // 予約可能かチェック
$slot->isFull()              // 満席かチェック
$slot->updateBookingCount()  // 予約数を再計算
$slot->getSlotTypeLabel()    // 種類の日本語ラベル
$slot->getStatusLabel()      // ステータスの日本語ラベル
```

### 2. 予約管理 (Appointments)

クライアントからの予約を管理します。

#### 機能

- **予約の作成**: 予約枠選択、企業/プロジェクト選択、件名/詳細入力
- **ステータス管理**:
    - `pending`: 保留中（初期状態）
    - `confirmed`: 確定
    - `completed`: 完了
    - `cancelled`: キャンセル
    - `no_show`: 不参加
- **予約のライフサイクル**:
    - 作成時: `pending`として作成、自動通知送信
    - 確定時: `confirmed`に変更、確定メール送信
    - キャンセル時: `cancelled`に変更、キャンセル理由記録、通知送信
    - 完了時: `completed`に変更、参加フラグ設定
- **リマインダー機能**: 予約24時間前に自動メール送信（オプション）

#### ルート

- `GET /admin/appointments` - 予約一覧
- `GET /admin/appointments/create` - 予約作成フォーム
- `POST /admin/appointments` - 予約保存
- `GET /admin/appointments/{id}/edit` - 予約編集フォーム
- `PUT /admin/appointments/{id}` - 予約更新
- `DELETE /admin/appointments/{id}` - 予約削除
- `POST /admin/appointments/{id}/confirm` - 予約確定
- `POST /admin/appointments/{id}/cancel` - 予約キャンセル
- `POST /admin/appointments/{id}/complete` - 予約完了

#### モデルメソッド

```php
$appointment->confirm()                  // 予約を確定
$appointment->cancel($reason)            // 予約をキャンセル
$appointment->complete()                 // 予約を完了
$appointment->markAsNoShow()             // 不参加に設定
$appointment->getStatusLabel()           // ステータスの日本語ラベル
$appointment->getStatusColor()           // ステータスの色コード
```

### 3. 通知システム (Notifications)

予約の各種イベントで自動的にメール通知を送信します。

#### 通知タイプ

1. **新規予約通知** (`AppointmentNotificationMail`)
    - 送信先: 担当管理者、企業メールアドレス
    - タイミング: 予約作成時
    - 内容: 新規予約の詳細

2. **予約確定通知** (`AppointmentConfirmedMail`)
    - 送信先: 企業メールアドレス
    - タイミング: 予約確定時
    - 内容: 確定した予約の詳細

3. **予約キャンセル通知** (`AppointmentCancelledMail`)
    - 送信先: 企業メールアドレス、担当管理者
    - タイミング: 予約キャンセル時
    - 内容: キャンセルされた予約の詳細、キャンセル理由

4. **予約リマインダー** (`AppointmentReminderMail`)
    - 送信先: 企業メールアドレス
    - タイミング: 予約24時間前（自動実行）
    - 内容: 予約の再確認
    - 条件: `send_reminder`フラグがtrue、`status`がconfirmed

#### サービスメソッド

```php
// 新規予約時の通知（担当者と企業に送信）
$notificationService->sendNewAppointmentNotifications($appointment);

// 予約確定通知（企業に送信）
$notificationService->sendConfirmationNotification($appointment);

// キャンセル通知（企業と担当者に送信）
$notificationService->sendCancellationNotification($appointment);

// リマインダー通知（個別送信）
$notificationService->sendReminderNotification($appointment);

// リマインダー一括送信（指定時間前の予約）
$count = $notificationService->sendUpcomingReminders(24); // 24時間前
```

### 4. 自動リマインダー送信

Laravelのタスクスケジューラーで毎日自動実行されます。

#### コマンド

```bash
# 手動実行（24時間前の予約にリマインダー送信）
php artisan appointments:send-reminders

# カスタム時間指定（12時間前）
php artisan appointments:send-reminders --hours=12
```

#### スケジュール設定

`routes/console.php`で毎日午前9時に実行するように設定済み:

```php
Schedule::command('appointments:send-reminders')->dailyAt('09:00');
```

#### Cronの設定

サーバーでLaravelスケジューラーを動作させるには、以下のcronを設定:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

## データベース構造

### `appointment_slots` テーブル

```
- id (PK)
- date (日付)
- start_time (開始時刻)
- end_time (終了時刻)
- slot_type (種類: meeting/progress_review/consultation/other)
- max_capacity (最大予約数)
- current_bookings (現在の予約数)
- assigned_admin_id (担当管理者ID, FK -> admins)
- status (ステータス: available/blocked/full)
- notes (メモ)
- created_by/updated_by/deleted_by (監査用, FK -> admins)
- created_at/updated_at/deleted_at
```

### `appointments` テーブル

```
- id (PK)
- appointment_slot_id (FK -> appointment_slots)
- user_id (FK -> users, nullable)
- company_id (FK -> companies, nullable)
- project_id (FK -> projects, nullable)
- subject (件名)
- description (詳細)
- status (ステータス: pending/confirmed/completed/cancelled/no_show)
- attended (参加フラグ)
- confirmed_at (確定日時)
- cancelled_at (キャンセル日時)
- cancellation_reason (キャンセル理由)
- admin_notes (管理者メモ)
- client_notes (クライアントメモ)
- send_reminder (リマインダー送信フラグ)
- reminder_sent_at (リマインダー送信日時)
- created_by/updated_by/deleted_by (監査用, FK -> admins)
- created_at/updated_at/deleted_at
```

## UI構造

### スケジュール管理画面

`/admin/schedules`

#### レイアウト

- **左サイドバー**: ナビゲーションリンク
    - Default Schedule（通常スケジュール）
    - Exception（例外日）
    - Holiday（休日）
    - **予約枠管理** (新規追加)
- **メインエリア**: カレンダー表示
    - 表示モード切替: 年/月/週/日
    - 各モードに対応したカレンダーコンポーネント

### 予約枠管理画面

`/admin/appointment-slots`

#### 機能

- **フィルター**: 予約枠種類、ステータス、担当者、日付範囲
- **一覧表示**: 日時、種類、担当者、予約状況、ステータス
- **アクション**: 編集、削除

### 予約管理画面

`/admin/appointments`

#### 機能

- **フィルター**: ステータス、企業、プロジェクト、日付範囲
- **一覧表示**: 予約日時、件名、企業、プロジェクト、担当者、ステータス
- **クイックアクション**:
    - 確定ボタン（pendingの場合）
    - キャンセルボタン（pending/confirmedの場合）
    - 編集、削除

## 使用方法

### 予約枠の作成

1. `/admin/appointment-slots/create`にアクセス
2. 以下を入力:
    - 日付
    - 開始時刻・終了時刻
    - 予約枠の種類（面談/進捗会/相談/その他）
    - 最大予約数（デフォルト: 1）
    - 担当管理者（オプション）
    - ステータス（デフォルト: 予約可能）
    - メモ（オプション）
3. 保存

### 予約の作成

1. `/admin/appointments/create`にアクセス
2. 以下を選択/入力:
    - 予約枠（空き状況表示）
    - 企業（オプション）
    - プロジェクト（企業選択で絞り込み）
    - 件名（必須）
    - 詳細（オプション）
    - クライアントメモ（オプション）
    - リマインダー送信（チェックボックス、デフォルト: ON）
3. 保存
4. 自動的に通知メールが送信される

### 予約の確定

1. 予約一覧から「確認」ボタンをクリック
2. ステータスが「確定」に変更
3. 確定メールが自動送信

### 予約のキャンセル

1. 予約編集画面でステータスを「キャンセル」に変更
2. キャンセル理由を入力（オプション）
3. 保存
4. キャンセル通知メールが自動送信

### リマインダーの送信

- 自動: 毎日午前9時にスケジューラーが実行
- 手動: `php artisan appointments:send-reminders`コマンド実行

## メールテンプレート

すべてのメールテンプレートは`resources/views/emails/appointments/`に配置:

- `confirmed.blade.php` - 予約確定メール（青色テーマ）
- `reminder.blade.php` - リマインダーメール（オレンジ色テーマ）
- `cancelled.blade.php` - キャンセル通知メール（赤色テーマ）
- `notification.blade.php` - 新規予約通知メール（紫色テーマ）

各メールには以下の情報が含まれます:

- 予約日時
- 予約種類
- 件名・詳細
- 企業・プロジェクト情報
- 担当者情報
- クライアントメモ

## 環境設定

### メール送信設定

`.env`ファイルでメール設定を行います:

```env
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME="${APP_NAME}"
```

### スケジューラーの起動

開発環境（Sail）:

```bash
./vendor/bin/sail artisan schedule:work
```

本番環境:

```bash
# Cronに登録
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

## セキュリティ考慮事項

1. **認証・認可**: すべてのルートは`auth:admins`ミドルウェアで保護
2. **入力検証**: すべてのフォーム入力は適切にバリデーション
3. **監査ログ**: 作成者・更新者・削除者を記録
4. **ソフトデリート**: 物理削除せず論理削除を使用
5. **メール送信エラー処理**: try-catchで例外をキャッチし、ログに記録

## 今後の拡張可能性

### 実装済み機能

- ✅ 予約枠管理（CRUD）
- ✅ 予約管理（CRUD + ステータス管理）
- ✅ 担当者割り当て
- ✅ 自動通知システム
- ✅ リマインダー機能

### 保留中の機能

- ⏸️ 定期パターン予約枠（毎週火曜日など）
- ⏸️ クライアント側からの予約申込UI
- ⏸️ カレンダーへの予約表示統合
- ⏸️ Zoom/Google Meetリンク自動生成
- ⏸️ SMS通知
- ⏸️ 予約の一括インポート/エクスポート

## トラブルシューティング

### メールが送信されない

1. `.env`のメール設定を確認
2. `php artisan queue:work`でキューワーカーが起動しているか確認
3. `storage/logs/laravel.log`でエラーログを確認

### リマインダーが送信されない

1. スケジューラーが動作しているか確認: `php artisan schedule:work`
2. `reminder_sent_at`が既に設定されていないか確認
3. `send_reminder`フラグが`true`か確認
4. ステータスが`confirmed`か確認

### 予約枠が満席にならない

1. `current_bookings`が正しく更新されているか確認
2. `php artisan tinker`で手動確認:
    ```php
    $slot = AppointmentSlot::find(1);
    $slot->updateBookingCount();
    $slot->isFull(); // true/false
    ```

## 関連ファイル

### バックエンド

- `app/Models/AppointmentSlot.php`
- `app/Models/Appointment.php`
- `app/Http/Controllers/Admin/AppointmentSlotController.php`
- `app/Http/Controllers/Admin/AppointmentController.php`
- `app/Services/AppointmentNotificationService.php`
- `app/Mail/AppointmentConfirmedMail.php`
- `app/Mail/AppointmentReminderMail.php`
- `app/Mail/AppointmentCancelledMail.php`
- `app/Mail/AppointmentNotificationMail.php`
- `app/Console/Commands/SendAppointmentReminders.php`

### フロントエンド

- `resources/js/Pages/Admin/AppointmentSlots/Index.jsx`
- `resources/js/Pages/Admin/AppointmentSlots/Create.jsx`
- `resources/js/Pages/Admin/AppointmentSlots/Edit.jsx`
- `resources/js/Pages/Admin/Appointments/Index.jsx`
- `resources/js/Pages/Admin/Appointments/Create.jsx`
- `resources/js/Pages/Admin/Appointments/Edit.jsx`
- `resources/js/Pages/Admin/Schedules/Index.jsx`
- `resources/js/Constants/PageConfig.js`

### データベース

- `database/migrations/2026_06_21_000001_create_appointment_slots_table.php`
- `database/migrations/2026_06_21_000002_create_appointments_table.php`

### ルート・設定

- `routes/admin.php`
- `routes/console.php`

### メールテンプレート

- `resources/views/emails/appointments/confirmed.blade.php`
- `resources/views/emails/appointments/reminder.blade.php`
- `resources/views/emails/appointments/cancelled.blade.php`
- `resources/views/emails/appointments/notification.blade.php`
