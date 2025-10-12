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

  'service_type' => [
    'created' => 'サービスタイプが正常に作成されました。',
    'updated' => 'サービスタイプが正常に更新されました。',
    'deleted' => 'サービスタイプが正常に削除されました。',
    'create_failed' => 'サービスタイプの作成に失敗しました。',
    'update_failed' => 'サービスタイプの更新に失敗しました。',
    'delete_failed' => 'サービスタイプの削除に失敗しました。',
    'not_found' => 'サービスタイプが見つかりません。',
    'bulk_deleted' => ':count件のサービスタイプが削除されました。',
    'bulk_updated' => ':count件のサービスタイプが更新されました。',
  ],

  'service_category' => [
    'created' => 'サービスカテゴリが正常に作成されました。',
    'updated' => 'サービスカテゴリが正常に更新されました。',
    'deleted' => 'サービスカテゴリが正常に削除されました。',
    'create_failed' => 'サービスカテゴリの作成に失敗しました。',
    'update_failed' => 'サービスカテゴリの更新に失敗しました。',
    'delete_failed' => 'サービスカテゴリの削除に失敗しました。',
    'not_found' => 'サービスカテゴリが見つかりません。',
  ],

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
    'unauthorized' => 'アクセス権限がありません。',
    'session_expired' => 'セッションが期限切れです。再度ログインしてください。',
    'password_changed' => 'パスワードが変更されました。',
    'password_change_failed' => 'パスワードの変更に失敗しました。',
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
];
