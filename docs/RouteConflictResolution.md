# ルート競合解決メモ

## 問題の概要

`admin.homepage.services` と `admin.service.categories` の間でルート競合が発生していました。

## 実施した対応

### 1. routes/admin.php の修正

```php
// コメントアウト
// Route::resource('services', ServicesController::class);
```

**理由**: `admin.service.*` 配下の新しいサービス管理機能（カテゴリ、タイプ、プランなど）を優先するため

### 2. AdminSidebar.jsx の修正

```javascript
// コメントアウト
// { name: "サービス管理", href: "admin.homepage.services.index" },
```

### 3. 影響を受けるファイル（一時的にエラーになる）

以下のファイルで `admin.homepage.services.*` を使用しているため、一時的にアクセス不可：

- `/resources/js/Pages/Admin/Homepage/Services/Index.jsx`
- `/resources/js/Pages/Admin/Homepage/Services/Create.jsx`
- `/resources/js/Pages/Admin/Homepage/Services/Edit.jsx`
- `/resources/js/Pages/Admin/Homepage/Services/Show.jsx`

## 今後の対応計画

### Option 1: ルート名を変更する（推奨）

```php
// homepage/services を homepage-services に変更
Route::prefix('homepage')->name('homepage.')->group(function () {
    Route::resource('homepage-services', ServicesController::class);
    // ルート名: admin.homepage.homepage-services.*
});
```

**必要な作業**:

- 上記4ファイルで `admin.homepage.services.*` を `admin.homepage.homepage-services.*` に一括置換
- AdminSidebar.jsx のコメントアウトを解除し、新しいルート名に変更

### Option 2: コントローラーを統合する

ホームページ用のServicesControllerと新しいServiceCategoryControllerの機能を整理し、必要に応じて統合する。

## 現在の状態

✅ `admin.service.categories.*` - 正常動作
❌ `admin.homepage.services.*` - 一時的に無効化（コメントアウト）

## 確認すべきこと

1. ServiceCategoryの詳細・編集画面が正常に動作するか
2. パラメータエラーが解消されたか
3. 新しいサービス管理機能が意図通り動作するか

## 実装日

2026年4月29日
