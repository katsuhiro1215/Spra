<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\Admin\AdminController;
use App\Http\Controllers\Admin\Admin\AdminProfileController;
use App\Http\Controllers\Admin\Admin\AdminAddressController;
use App\Http\Controllers\Admin\Admin\AdminEmploymentController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\SecuritySettingsController;
use App\Http\Controllers\Admin\AdminPermissionOverrideController;
use App\Http\Controllers\Admin\User\UserController;
use App\Http\Controllers\Admin\User\UserProfileController;
use App\Http\Controllers\Admin\User\UserAddressController;
use App\Http\Controllers\Admin\Company\CompanyController;
use App\Http\Controllers\Admin\Company\CompanyAddressController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\OnboardingController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\Document\DocumentController;
use App\Http\Controllers\Admin\Document\DocumentCategoryController;
use App\Http\Controllers\Admin\Document\UserAcceptanceController;
use App\Http\Controllers\Admin\AppointmentSlotController;
use App\Http\Controllers\Admin\AppointmentController;
use App\Http\Controllers\Admin\Batch\ReminderExecutionController;
use App\Http\Controllers\Admin\LogController;
use App\Http\Controllers\Admin\SearchController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\SystemSettingController;
use App\Http\Controllers\Admin\OrganizationController;
use App\Http\Controllers\Admin\Website\OrganizationHistoryController;
use Inertia\Inertia;

// ログイン・登録・パスワードリセットなど、ダッシュボード用の認証ミドルウェアより前に
// 解決される必要があるルート群を先頭で読み込む
require __DIR__ . '/admin_auth.php';

Route::middleware(['auth:admins', 'verified', 'admin.permission'])->group(function () {
    // 管理者ダッシュボード
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // 自身のプロフィール
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // セキュリティ（二段階認証）
    Route::get('/security', [SecuritySettingsController::class, 'edit'])->name('security.edit');
    Route::put('/security', [SecuritySettingsController::class, 'update'])->name('security.update');
    Route::post('/security/totp/setup', [SecuritySettingsController::class, 'setupTotp'])->name('security.totp.setup');
    Route::post('/security/totp/confirm', [SecuritySettingsController::class, 'confirmTotp'])->name('security.totp.confirm');
    Route::post('/security/recovery-codes/regenerate', [SecuritySettingsController::class, 'regenerateRecoveryCodes'])->name('security.recovery-codes.regenerate');

    /**************************************
     * 管理者
     **************************************/
    // 管理者管理
    Route::resource('admin', AdminController::class);
    // 管理者プロフィール管理
    Route::controller(AdminProfileController::class)->prefix('admin/{admin}/profile')->name('admin.profile.')->group(function () {
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/edit', 'edit')->name('edit');
        Route::put('/', 'update')->name('update');
        Route::post('/attach-media', 'attachMedia')->name('attachMedia');
        Route::delete('/detach-media', 'detachMedia')->name('detachMedia');
    });
    // 管理者住所管理
    Route::controller(AdminAddressController::class)->prefix('admin/{admin}/address')->name('admin.address.')->group(function () {
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/{address}/edit', 'edit')->name('edit');
        Route::put('/{address}', 'update')->name('update');
        Route::delete('/{address}', 'destroy')->name('destroy');
    });
    // 管理者の雇用条件・給与設定
    Route::put('/admin/{admin}/employment', [AdminEmploymentController::class, 'update'])->name('admin.employment.update');
    // 個別Admin向けの追加権限制限（owner/super_adminのみ操作可、対象はadmin/editorロールに限る）
    // 表示データは管理者詳細画面（AdminController@show）側で合わせて渡す
    Route::put('/admin/{admin}/permission-overrides', [AdminPermissionOverrideController::class, 'update'])
        ->name('permissionOverrides.update');

    /**************************************
     * 権限管理
     **************************************/
    // ロール別のデフォルト権限マトリクス（owner/super_adminのみ操作可）
    Route::controller(PermissionController::class)->prefix('permissions')->name('permissions.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::put('/', 'update')->name('update');
    });

    /**************************************
     * ユーザー
     **************************************/
    // ユーザー管理
    // ユーザー一覧のエクスポート（resourceのshowルートと競合しないよう先に登録する）
    Route::get('/user/export', [UserController::class, 'export'])->name('user.export');
    Route::resource('user', UserController::class);
    // ユーザープロフィール管理
    Route::controller(UserProfileController::class)->prefix('user/{user}/profile')->name('user.profile.')->group(function () {
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/edit', 'edit')->name('edit');
        Route::put('/', 'update')->name('update');
        Route::post('/attach-media', 'attachMedia')->name('attachMedia');
        Route::delete('/detach-media', 'detachMedia')->name('detachMedia');
    });
    // ユーザー住所管理
    Route::controller(UserAddressController::class)->prefix('user/{user}/address')->name('user.address.')->group(function () {
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/{address}/edit', 'edit')->name('edit');
        Route::put('/{address}', 'update')->name('update');
        Route::delete('/{address}', 'destroy')->name('destroy');
    });

    /**************************************
     * 会社
     **************************************/
    // 会社管理
    Route::resource('company', CompanyController::class);
    Route::post('/company/bulk-destroy', [CompanyController::class, 'bulkDestroy'])->name('company.bulk-destroy');
    Route::patch('/company/{company}/toggle-status', [CompanyController::class, 'toggleStatus'])->name('company.toggle-status');
    Route::post('/company/{company}/attach-media', [CompanyController::class, 'attachMedia'])->name('company.attach-media');
    Route::delete('/company/{company}/detach-media', [CompanyController::class, 'detachMedia'])->name('company.detach-media');
    Route::post('/company/{company}/points/grant', [CompanyController::class, 'grantPoints'])->name('company.points.grant');
    // 会社住所管理
    Route::controller(CompanyAddressController::class)->prefix('company/{company}/address')->name('company.address.')->group(function () {
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/{address}/edit', 'edit')->name('edit');
        Route::put('/{address}', 'update')->name('update');
        Route::delete('/{address}', 'destroy')->name('destroy');
    });

    /**************************************
     * 分析
     **************************************/
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');

    /**************************************
     * メディア
     **************************************/
    // メディア管理
    Route::resource('media', MediaController::class);
    Route::post('/media/upload', [MediaController::class, 'upload'])->name('media.upload');
    Route::delete('/media/bulk-destroy', [MediaController::class, 'bulkDestroy'])->name('media.bulk-destroy');

    /**************************************
     * サービス
     **************************************/
    require __DIR__ . '/admin/service.php';

    /**************************************
     * お問い合わせ
     **************************************/
    require __DIR__ . '/admin/contact.php';

    /**************************************
     * プロジェクト
     **************************************/
    require __DIR__ . '/admin/project.php';

    /**************************************
     * 契約
     **************************************/
    require __DIR__ . '/admin/contract.php';

    /**************************************
     * 見積もり
     **************************************/
    require __DIR__ . '/admin/quote.php';

    /**************************************
     * キャンペーン
     **************************************/
    require __DIR__ . '/admin/campaign.php';

    /**************************************
     * ポイント特典・紹介
     **************************************/
    require __DIR__ . '/admin/point.php';

    // オンボーディング管理
    Route::prefix('onboarding')->name('onboarding.')->controller(OnboardingController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{userId}', 'detail')->name('detail');
        Route::post('/{userId}/approve', 'approve')->name('approve');
        Route::post('/{userId}/reject', 'reject')->name('reject');
    });

    // 支払い管理
    Route::resource('payment', PaymentController::class);
    Route::post('payment/{payment}/confirm', [PaymentController::class, 'confirm'])->name('payment.confirm');

    /**************************************
     * 請求書
     **************************************/
    require __DIR__ . '/admin/invoice.php';

    /**************************************
     * 領収書
     **************************************/
    require __DIR__ . '/admin/receipt.php';

    // Documents (規約・ヘルプ・APIドキュメント等) 管理
    Route::resource('documents', DocumentController::class)->except(['show']);
    Route::controller(DocumentController::class)->group(function () {
        Route::post('/documents/{document}/versions', 'createVersion')->name('documents.versions.store');
        Route::put('/documents/{document}/versions/{version}', 'updateVersion')->name('documents.versions.update');
        Route::post('/documents/{document}/versions/{version}/activate', 'activateVersion')->name('documents.versions.activate');
        Route::post('/documents/{document}/versions/{version}/revert-to-draft', 'revertVersionToDraft')->name('documents.versions.revertToDraft');
    });

    Route::post('/document-categories', [DocumentCategoryController::class, 'store'])->name('documentCategories.store');
    Route::put('/document-categories/{documentCategory}', [DocumentCategoryController::class, 'update'])->name('documentCategories.update');
    Route::delete('/document-categories/{documentCategory}', [DocumentCategoryController::class, 'destroy'])->name('documentCategories.destroy');

    Route::get('/document-acceptances', [UserAcceptanceController::class, 'index'])->name('documentAcceptances.index');

    /**************************************
     * スケジュール
     **************************************/
    require __DIR__ . '/admin/schedule.php';

    /**************************************
     * 勤怠管理
     **************************************/
    require __DIR__ . '/admin/attendance.php';

    /**************************************
     * 給与計算
     **************************************/
    require __DIR__ . '/admin/payroll.php';

    // 予約枠管理
    Route::prefix('appointment-slots')->name('appointment-slots.')->group(function () {
        Route::get('/bulk-create', [AppointmentSlotController::class, 'bulkCreate'])->name('bulk-create');
        Route::post('/bulk-store', [AppointmentSlotController::class, 'bulkStore'])->name('bulk-store');
        Route::post('/quick-store', [AppointmentSlotController::class, 'quickStore'])->name('quick-store');
    });
    Route::resource('appointment-slots', AppointmentSlotController::class);

    // 予約管理
    Route::resource('appointments', AppointmentController::class);
    Route::post('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm'])->name('appointments.confirm');
    Route::post('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel'])->name('appointments.cancel');
    Route::post('/appointments/{appointment}/complete', [AppointmentController::class, 'complete'])->name('appointments.complete');

    // バッチ実行管理
    Route::prefix('batch')->name('batch.')->group(function () {
        Route::get('/reminders', [ReminderExecutionController::class, 'index'])->name('reminders.index');
    });

    /**************************************
     * ホームページ管理
     **************************************/
    require __DIR__ . '/admin/website.php';

    // ログ管理
    Route::get('/logs', [LogController::class, 'index'])->name('logs.index');

    // 全体検索
    Route::get('/search', [SearchController::class, 'index'])->name('search');

    // 通知
    Route::get('/notifications/{id}/read', [NotificationController::class, 'read'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'readAll'])->name('notifications.read-all');

    // コンテンツ管理（一時的にダミー）
    Route::get('/content', function () {
        return Inertia::render('Admin/Content/Index');
    })->name('content.index');

    // 設定（一時的にダミー）
    Route::resource('systemSetting', SystemSettingController::class)->only(['index', 'edit', 'update']);

    // 組織設定（自社情報・シングルトン）
    Route::get('/organization', [OrganizationController::class, 'edit'])->name('organization.edit');
    Route::put('/organization', [OrganizationController::class, 'update'])->name('organization.update');

    // 組織沿革
    Route::resource('organization/history', OrganizationHistoryController::class)
        ->names('organization.history')
        ->except(['show']);

    /**************************************
     * 外部サービス連携（SaaS等へのリンク・APIデータ取得）
     **************************************/
    require __DIR__ . '/admin/external-service.php';
});
