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
