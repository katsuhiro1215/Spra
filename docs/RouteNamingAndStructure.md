# ルート命名とネーミング規約

## 概要

Spra プロジェクトでは、ルート命名にプレフィックスを使用して、ルートの役割と認証レベルを区別しています。

## ルート構造

### 1. Public Routes（パブリック・ウェブサイト）

- **プレフィックス**: `public.`
- **認証**: 不要
- **用途**: 一般ユーザーがアクセスするウェブサイトページ
- **例**:
    - `public.home` - ホームページ
    - `public.about` - 企業情報
    - `public.contact.store` - お問い合わせ送信
    - `public.quote.response.show` - 見積回答フォーム表示
    - `public.quote.response.store` - 見積回答送信

### 2. User Registration via Invitation Token

- **プレフィックス**: `user.`
- **認証**: 不要（ただしトークンベース）
- **用途**: 招待メール経由でのユーザー登録
- **特徴**: 有効期限付きのトークンで保護
- **例**:
    - `user.quote.response.register` - ユーザー登録フォーム表示
    - `user.quote.response.register.store` - ユーザー登録処理

### 3. User Authenticated Routes

- **プレフィックス**: `user.` または プレフィックスなし
- **認証**: 必須（`auth:users` middleware）
- **用途**: ログイン済みユーザー用の機能
- **例**:
    - `dashboard` - ダッシュボード
    - `projects.index` - プロジェクト一覧
    - `contracts.index` - 契約一覧

### 4. Admin Routes

- **プレフィックス**: `admin.`
- **認証**: 必須（`auth:admin` middleware）
- **用途**: 管理画面
- **例**:
    - `admin.quote-response.index` - 見積回答管理・一覧
    - `admin.quote-response.detail` - 見積回答詳細
    - `admin.quote-response.send-invitation` - 招待メール送信

## 既知の問題と改善予定

### Issue: Route::name() の動作

**問題コード**:

```php
Route::name('user.')->group(function () {
    Route::get('/quote-response/{token}/register', ...)->name('quote.response.register');
});
```

**実際の動作**:

- `Route::name('user.')` の新しい `name` 定義がグループ全体に適用される
- グループ内の `->name()` の定義が上書きされる
- 結果として、ルート名が正しく生成されない

**解決策**:

```php
Route::group(['prefix' => '', 'name' => 'user.'], function () {
    Route::get('/quote-response/{token}/register', ...)->name('quote.response.register');
});
```

このアプローチでは、`name` オプションを配列内で指定することで、PHP 側での予約語競合を回避できます。

**リファクタリング予定**:

- 全ルート定義の統一的な構文化
- `Route::prefix()` と `Route::name()` の混在を避ける
- テンプレート内の `route()` ヘルパー呼び出しが正しく解決されることを確認

## Blade テンプレート内でのルート参照

### 注意点

ルート参照時に、定義済みのルート名を正確に指定する必要があります。

**例**:

```blade
<a href="{{ route('user.quote.response.register', ['token' => $token]) }}">
    登録ページへ
</a>
```

## 今後の改善案

1. **ルート命名のドキュメント化**: このドキュメント自体が改善に従って更新される
2. **ルート構造の統一化**: 新しいフィーチャーはこの規約に従う
3. **テスト**: `Route::has()` を使用したルート存在確認テストを追加
4. **キャッシュクリア**: ルート定義変更後は必ず `artisan optimize:clear` を実行
