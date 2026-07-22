<?php

return [
  /*
    |--------------------------------------------------------------------------
    | 一般メッセージ言語行
    |--------------------------------------------------------------------------
    |
    | アプリケーション全体で使用される一般的なメッセージを定義します。
    |
    */

  'general' => [
    'save' => '保存',
    'cancel' => 'キャンセル',
    'edit' => '編集',
    'delete' => '削除',
    'create' => '作成',
    'update' => '更新',
    'back' => '戻る',
    'search' => '検索',
    'reset' => 'リセット',
    'submit' => '送信',
    'close' => '閉じる',
    'loading' => '読み込み中...',
    'no_data' => 'データがありません。',
    'confirm_delete' => '本当に削除しますか？',
    'action_completed' => '処理が完了しました。',
    'action_failed' => '処理に失敗しました。',
    'please_wait' => 'しばらくお待ちください。',
  ],

  'form' => [
    'required_fields' => '必須項目を入力してください。',
    'invalid_data' => '入力データに不正があります。',
    'save_success' => '正常に保存されました。',
    'save_failed' => '保存に失敗しました。',
    'delete_success' => '正常に削除されました。',
    'validation_error' => '入力内容を確認してください。',
    'unsaved_changes' => '保存されていない変更があります。',
  ],

  'file' => [
    'upload_success' => 'ファイルが正常にアップロードされました。',
    'upload_failed' => 'ファイルのアップロードに失敗しました。',
    'invalid_format' => 'ファイル形式が正しくありません。',
    'too_large' => 'ファイルサイズが大きすぎます。',
    'not_found' => 'ファイルが見つかりません。',
  ],

  'auth' => [
    'login_success' => 'ログインしました。',
    'logout_success' => 'ログアウトしました。',
    'login_failed' => 'ログインに失敗しました。',
    'account_locked' => 'ログイン失敗が続いたため、アカウントを一時的にロックしました。:minutes分後に再度お試しください。',
    'registration_success' => 'アカウントが作成されました。',
    'registration_failed' => 'アカウントの作成に失敗しました。',
    'unauthorized' => 'アクセス権限がありません。',
    'session_expired' => 'セッションが期限切れです。再度ログインしてください。',
    'password_changed' => 'パスワードが変更されました。',
    'password_change_failed' => 'パスワードの変更に失敗しました。',
    'password_updated' => 'パスワードが正常に更新されました。',
    'password_confirmed' => 'パスワードが確認されました。',
    'email_verified' => 'メールアドレスが認証されました。',
    'email_already_verified' => 'メールアドレスは既に認証済みです。',
    'verification_link_sent' => '認証メールを送信しました。',
  ],

  'pagination' => [
    'showing' => ':total件中 :first件から:last件を表示',
    'per_page' => '1ページあたりの表示件数',
    'of' => '/',
    'results' => '件の結果',
    'no_results' => '該当するデータがありません。',
  ],

  'search' => [
    'placeholder' => '検索キーワードを入力してください',
    'no_results' => '検索結果が見つかりませんでした。',
    'results_found' => ':count件の結果が見つかりました。',
    'search_in' => ':nameで検索',
  ],

  'status' => [
    'active' => 'アクティブ',
    'inactive' => '非アクティブ',
    'draft' => '下書き',
    'published' => '公開',
    'archived' => 'アーカイブ',
    'pending' => '保留',
    'approved' => '承認済み',
    'rejected' => '拒否',
  ],

  'time' => [
    'created_at' => '作成日時',
    'updated_at' => '更新日時',
    'deleted_at' => '削除日時',
    'published_at' => '公開日時',
    'just_now' => 'たった今',
    'minutes_ago' => ':count分前',
    'hours_ago' => ':count時間前',
    'days_ago' => ':count日前',
    'weeks_ago' => ':count週間前',
    'months_ago' => ':countヶ月前',
    'years_ago' => ':count年前',
  ],

  'created' => ':attributeが正常に作成されました。',
  'updated' => ':attributeが正常に更新されました。',
  'deleted' => ':attributeが正常に削除されました。',
  'create_failed' => ':attributeの作成に失敗しました。',
  'update_failed' => ':attributeの更新に失敗しました。',
  'delete_failed' => ':attributeの削除に失敗しました。',
  'not_found' => ':attributeが見つかりません。',
  'bulk_deleted' => ':count件の:attributeが削除されました。',
  'bulk_updated' => ':count件の:attributeが更新されました。',
  'bulk_activated' => ':count件の:attributeがアクティブになりました。',
  'bulk_deactivated' => ':count件の:attributeが非アクティブになりました。',
  'bulk_featured' => ':count件の:attributeがおすすめに設定されました。',
  'bulk_unfeatured' => ':count件の:attributeがおすすめから外されました。',
  'bulk_action_failed' => '一括操作に失敗しました。',

  // 汎用アクション（コントローラーのフラッシュメッセージ共通テンプレート）
  'set' => ':attributeを設定しました。',
  'set_failed' => ':attributeの設定に失敗しました。',
  'sent' => ':attributeを送信しました。',
  'send_failed' => ':attributeの送信に失敗しました。',
  'delivered' => ':attributeを送付しました。',
  'deliver_failed' => ':attributeの送付に失敗しました。',
  'resent' => ':attributeを再送信しました。',
  'resend_failed' => ':attributeの再送信に失敗しました。',
  'approved' => ':attributeを承認しました。',
  'approve_failed' => ':attributeの承認に失敗しました。',
  'rejected' => ':attributeを却下しました。',
  'reject_failed' => ':attributeの却下に失敗しました。',
  'cancelled' => ':attributeをキャンセルしました。',
  'cancel_failed' => ':attributeのキャンセルに失敗しました。',
  'restored' => ':attributeを復元しました。',
  'restore_failed' => ':attributeの復元に失敗しました。',
  'registered' => ':attributeを登録しました。',
  'recorded' => ':attributeを記録しました。',
  'added' => ':attributeを追加しました。',
  'add_failed' => ':attributeの追加に失敗しました。',
  'saved' => ':attributeを保存しました。',
  'save_failed' => ':attributeの保存に失敗しました。',
  'confirmed' => ':attributeを確認しました。',
  'uploaded' => ':attributeをアップロードしました。',
  'upload_failed' => ':attributeのアップロードに失敗しました。',
  'activated' => ':attributeを有効化しました。',
  'status_changed' => 'ステータスを変更しました。',
  'status_change_failed' => 'ステータスの変更に失敗しました。',
  'draft_version_only_editable' => 'ドラフト状態のバージョンのみ編集できます。',
  'current_version_not_found' => '現在のバージョンが見つかりません。',

  // 例外メッセージ付き（動的な詳細をコロンの後ろに付与する）
  'action_failed_detail' => ':attributeに失敗しました: :message',
  'unexpected_error_detail' => 'エラーが発生しました: :message',

  // ページ
  // ブログカテゴリ
  'post_category' => [
    'has_posts' => 'このカテゴリには関連する投稿があるため削除できません。',
  ],
  // ブログ

  // サービスタイプ
  'service_type' => [
    'duplicated' => 'サービスタイプを複製しました。',
    'order_updated' => '表示順序を更新しました。',
    'duplicate_failed' => 'サービスタイプの複製に失敗しました。',
    'order_update_failed' => '表示順序の更新に失敗しました。',
    'bulk_action_failed' => '一括操作に失敗しました。',
  ],

  // サービスカテゴリ
  'service_category' => [
    'has_service_types' => 'このカテゴリには関連するサービスタイプがあるため削除できません。',
  ],

  // 価格項目
  'price_item' => [
    'order_updated' => '価格項目の表示順序を更新しました。',
    'template_applied' => 'テンプレートを適用しました。',
    'order_update_failed' => '価格項目の表示順序更新に失敗しました。',
    'template_apply_failed' => 'テンプレートの適用に失敗しました。',
  ],

  // お問い合わせ
  'contact' => [
    'export_failed' => 'お問い合わせのエクスポートに失敗しました。',
    'bulk_update_failed' => 'お問い合わせの一括更新に失敗しました。',
    'has_related' => '関連するお問い合わせが存在するため、削除できません。',
  ],

  // ユーザー招待
  'user_invitation' => [
    'already_invited' => 'このお問い合わせには既に有効な招待が存在します。',
    'already_used_or_expired' => 'この招待は既に使用されているか、期限切れです。',
    'already_approved' => 'この招待は既に承認済みのため、取り消すことができません。',
    'revoked' => '招待を取り消しました。',
    'email_send_failed' => 'メール送信に失敗しました。',
  ],

  // 契約
  'contract' => [
    'reminder_not_allowed_status' => 'このステータスではリマインダーを送信できません。',
    'client_email_missing' => 'クライアントのメールアドレスが登録されていません。',
    'draft_only_deletable' => '下書き状態の契約のみ削除できます。',
    'created_add_items' => '契約を作成しました。契約明細を追加してください。',
    'updated_new_version_created' => '契約を更新しました。新しいバージョンが作成されました。',
    'approved_and_activated' => '契約を承認し、有効化しました。請求書を自動生成しています。',
    'send_requirements_prefix' => '契約書を送信できません。以下が必要です: :requirements',
    'monthly_only_billing_update' => '月額契約のみ請求設定を更新できます。',
    'signature_incomplete_cannot_approve' => '署名が完了していない契約は承認できません。',
    'billing_user_must_belong_to_company' => '送付先ユーザーはこの契約の会社に所属しているユーザーから選択してください。',
  ],

  // 契約書グループ
  'contract_group' => [
    'not_in_group' => 'この契約書はグループに含まれていません',
    'removed_document' => 'グループから契約書を削除しました',
    'no_documents' => 'グループに契約書が含まれていません',
    'deleted' => 'グループを削除しました',
    'all_sent' => 'グループ内の全契約書を送信しました',
    'user_email_missing' => 'ユーザーのメールアドレスが登録されていません',
    'added_document' => '契約書をグループに追加しました',
    'created' => '契約書グループを作成しました',
  ],

  // 契約署名
  'contract_signature' => [
    'confirmed' => 'ユーザー署名を確認しました',
    'signed_and_notified' => '契約書に署名し、クライアントに完了通知を送信しました',
    'sent_await_admin' => '署名を送信しました。管理者の確認をお待ちください。',
  ],

  // 見積もり
  'quote' => [
    'approved_cannot_edit' => '承認済みの見積もりは編集できません。',
    'created_add_items' => '見積もりを作成しました。見積明細を追加してください。',
    'no_response_recorded' => '未回答の見積を見送り(NG)として記録しました。',
  ],

  // 請求書
  'invoice' => [
    'already_paid' => 'この請求書はすでに支払い済みです。',
    'cannot_edit' => 'この請求書は編集できません。',
    'paid_cannot_resend' => 'すでに支払い済みの請求書は再送信できません。',
    'draft_only_deletable' => '下書きの請求書のみ削除できます。',
    'draft_cannot_resend' => '下書きの請求書は再送信できません。',
    'draft_only_deliverable' => '下書き状態の請求書のみ送付できます。',
    'payment_confirmed_receipt_created' => '入金を確認しました。請求額に達したため領収書を作成しました。内容を確認して送付してください。',
    'payment_recorded_receipt_created' => '入金を記録しました。請求額に達したため領収書を作成しました。内容を確認して送付してください。',
  ],

  // 領収書
  'receipt' => [
    'already_delivered' => 'この領収書はすでに送付済みです。',
    'delivered_cannot_delete' => '送付済みの領収書は削除できません。',
    'delivered_cannot_edit' => '送付済みの領収書は編集できません。',
    'issued_and_delivered' => '領収書を発行・送付しました。',
  ],

  // 入金
  'payment' => [
    'not_awaiting_confirmation' => 'この入金は確認待ちの状態ではありません。',
  ],

  // お問い合わせ返答
  'response' => [
    'already_sent' => 'この返答は既に送信済みです。',
    'sent_cannot_edit' => '送信済みの返答は編集できません。',
    'saved_as_draft' => '返答を下書き保存しました。',
  ],

  // 会社
  'company' => [
    'has_users' => 'この会社には関連するユーザーが存在するため削除できません。',
    'point_grant_failed' => 'ポイントの付与に失敗しました。特典が無効になっていないか確認してください。',
    'has_users_selected' => '選択した会社の中に関連するユーザーが存在するものがあるため削除できません。',
  ],

  // 技術
  'technology' => [
    'in_use' => 'この技術は使用中のサービスがあるため削除できません。',
  ],

  // オンボーディング
  'onboarding' => [
    'already_processed' => 'この登録は既に処理されているか無効です。',
    'related_quote_not_found' => '関連する見積が見つかりません。',
  ],

  // プロジェクト
  'project' => [
    'version_set_as_current' => 'このバージョンを現在のバージョンに設定しました。',
    'active_version_cannot_delete' => 'アクティブなバージョンは削除できません。',
    'update_changed' => '更新情報を変更しました。',
  ],

  // メディア
  'media' => [
    'uploaded_variants_processing' => 'メディアをアップロードしました。バリアントは自動生成中です。',
  ],

  // ユーザー
  'user' => [
    'created_with_password' => 'ユーザーを作成しました。初期パスワード: :password',
    'email_missing' => 'ユーザーメールアドレスが登録されていません。',
  ],

  // 管理者
  'admin' => [
    'created_with_password' => '管理者を作成しました。初期パスワード: :password',
  ],

  // 二段階認証
  'two_factor' => [
    'recovery_codes_regenerated' => 'リカバリーコードを再発行しました。以前のコードは無効になりました。',
    'already_enabled_authenticator' => '二段階認証は認証アプリ方式で有効になっています。',
    'disabled' => '二段階認証を無効にしました。',
    'authenticator_enabled' => '認証アプリによる二段階認証を有効にしました。',
  ],

  // 予約
  'appointment' => [
    'cancelled' => '予約がキャンセルされました。',
    'completed' => '予約が完了しました。',
    'confirmed' => '予約が確定されました。',
    'complete_failed' => '予約の完了処理に失敗しました。',
    'confirm_failed' => '予約の確定に失敗しました。',
  ],

  // 予約枠
  'appointment_slot' => [
    'has_appointments' => '予約が入っている予約枠は削除できません。',
    'bulk_create_failed' => '予約枠の一括作成に失敗しました。',
    'bulk_create_period_max' => 'まとめて作成できる期間は最大:days日間までです。',
  ],

  // ポイント交換
  'point_redemption' => [
    'approved_and_consumed' => '交換申請を承認し、ポイントを消費しました。',
  ],

  // 紹介
  'referral' => [
    'confirmed_and_granted' => '紹介を成立にし、ポイントを付与しました。',
  ],

  // 勤怠
  'attendance' => [
    'record_corrected' => '勤怠記録を修正しました。',
    'not_working' => '勤務中でないため休憩を開始できません。',
    'not_on_break' => '休憩中でないため休憩を終了できません。',
  ],

  // 文書
  'document' => [
    'reverted_to_draft' => 'ドラフト状態に戻しました。',
  ],

  // Webサイトページ
  'website_page' => [
    'created_continue_edit_sections' => 'ページを作成しました。続けてセクションの内容を編集してください。',
  ],

  /*
    |--------------------------------------------------------------------------
    | カスタムメッセージ属性
    |--------------------------------------------------------------------------
    */

    'attributes' => [
      'page' => 'ページ',
      'post_category' => '投稿カテゴリ',
      'service_type' => 'サービスタイプ',
      'service_category' => 'サービスカテゴリ',
      'price_item' => '価格項目',
    ],
];
