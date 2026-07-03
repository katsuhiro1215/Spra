<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\Admin\AdminController;
use App\Http\Controllers\Admin\Admin\AdminProfileController;
use App\Http\Controllers\Admin\Admin\AdminAddressController;
use App\Http\Controllers\Admin\User\UserController;
use App\Http\Controllers\Admin\User\UserProfileController;
use App\Http\Controllers\Admin\User\UserAddressController;
use App\Http\Controllers\Admin\Company\CompanyController;
use App\Http\Controllers\Admin\Company\CompanyAddressController;
use App\Http\Controllers\Admin\MediaController;

use App\Http\Controllers\Admin\Service\ServiceCategoryController;
use App\Http\Controllers\Admin\Service\ServiceController;
use App\Http\Controllers\Admin\Service\ServicePlanController;
use App\Http\Controllers\Admin\Service\ServiceItemController;

use App\Http\Controllers\Admin\Contact\ContactController;
use App\Http\Controllers\Admin\Contact\ResponseController;
use App\Http\Controllers\Admin\Contact\ResponseTemplateController;

use App\Http\Controllers\Admin\UserInvitationController;
use App\Http\Controllers\Admin\OnboardingController;

use App\Http\Controllers\Admin\Project\ProjectCategoryController;
use App\Http\Controllers\Admin\Project\ProjectController;
use App\Http\Controllers\Admin\Project\ProjectInquiryController;
use App\Http\Controllers\Admin\Project\ProjectMilestoneController;
use App\Http\Controllers\Admin\Project\ProjectUpdateController;

use App\Http\Controllers\Admin\ContractController;
use App\Http\Controllers\Admin\ContractSignatureController;

use App\Http\Controllers\Admin\Quote\QuoteController;
use App\Http\Controllers\Admin\Quote\QuoteResponseController;

use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\ReceiptController;

use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\TermController;

use App\Http\Controllers\Admin\Homepage\PageController;
use App\Http\Controllers\Admin\Homepage\BlogCategoryController;
use App\Http\Controllers\Admin\Homepage\BlogController;
use App\Http\Controllers\Admin\Homepage\SiteSettingController;

use App\Http\Controllers\Admin\Schedule\HolidayController;
use App\Http\Controllers\Admin\Schedule\ScheduleDefaultController;
use App\Http\Controllers\Admin\Schedule\ScheduleExceptionController;

use App\Http\Controllers\Admin\AppointmentSlotController;
use App\Http\Controllers\Admin\AppointmentController;

use App\Http\Controllers\Admin\LogController;
use App\Http\Controllers\Admin\SystemSettingController;

use Inertia\Inertia;

Route::middleware(['auth:admins', 'verified'])->group(function () {
    // 管理者ダッシュボード
    Route::get('/dashboard', function () {
        $pendingResponses = \App\Models\QuoteResponse::whereNull('responded_at')->count();
        $respondedResponses = \App\Models\QuoteResponse::whereNotNull('responded_at')->count();
        // $unreadContacts = \App\Models\Contact::whereNull('read_at')->count();

        return Inertia::render('AdminDashboard', [
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'stats' => [
                'pendingResponses' => $pendingResponses,
                'respondedResponses' => $respondedResponses,
            ],
            'notifications' => [
                // 'unreadContacts' => $unreadContacts,
                'pendingResponses' => $pendingResponses,
            ],
        ]);
    })->name('dashboard');

    // 自身のプロフィール
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

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

    /**************************************
     * ユーザー
     **************************************/
    // ユーザー管理
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
    // 会社住所管理
    Route::controller(CompanyAddressController::class)->prefix('company/{company}/address')->name('company.address.')->group(function () {
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/{address}/edit', 'edit')->name('edit');
        Route::put('/{address}', 'update')->name('update');
        Route::delete('/{address}', 'destroy')->name('destroy');
    });

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
    // サービス管理
    Route::prefix('service')->name('service.')->group(function () {
        Route::resource('category', ServiceCategoryController::class)->parameters(['category' => 'serviceCategory']);
        Route::resource('plan', ServicePlanController::class)->parameters(['plan' => 'servicePlan']);
        Route::resource('item', ServiceItemController::class)->parameters(['item' => 'serviceItem']);
    });

    // サービス一覧
    Route::resource('service', ServiceController::class);

    /**************************************
     * お問い合わせ
     **************************************/
    // お問い合わせ管理
    Route::resource('contact', ContactController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::patch('/contact/bulk-update', [ContactController::class, 'bulkUpdate'])->name('contact.bulk-update');
    Route::get('/contact/export', [ContactController::class, 'export'])->name('contact.export');

    // 返信管理（グローバル一覧）
    Route::get('response', [ResponseController::class, 'index'])->name('response.index');

    // お問い合わせ返答管理（Contact配下）
    Route::prefix('contact/{contact}')->name('contact.')->group(function () {
        Route::resource('responses', ResponseController::class)->except(['index']);
        Route::post('responses/{response}/send', [ResponseController::class, 'send'])->name('responses.send');
        // ユーザー招待管理
        Route::post('invitations', [UserInvitationController::class, 'store'])->name('invitations.store');
    });
    // ユーザー招待管理（グローバル）
    Route::prefix('invitations')->name('invitations.')->group(function () {
        Route::post('{invitation}/resend', [UserInvitationController::class, 'resend'])->name('resend');
        Route::patch('{invitation}/revoke', [UserInvitationController::class, 'revoke'])->name('revoke');
    });

    // 返答テンプレート管理
    Route::resource('responseTemplate', ResponseTemplateController::class);

    /**************************************
     * プロジェクト
     **************************************/
    Route::prefix('project')->name('project.')->group(function () {
        // プロジェクトカテゴリ管理
        Route::resource('category', ProjectCategoryController::class)->parameters(['category' => 'projectCategory']);
        // プロジェクト問い合わせ管理
        Route::resource('inquiry', ProjectInquiryController::class)->parameters(['inquiries' => 'projectInquiry'])->only(['index', 'show', 'destroy']);
    });
    // プロジェクト管理
    Route::resource('project', ProjectController::class);
    // プロジェクト関連のマイルストーンとアップデート管理
    Route::prefix('project')->name('project.')->group(function () {
        // Milestones
        Route::post('/{project}/milestones', [ProjectMilestoneController::class, 'store'])->name('milestones.store');
        Route::put('/{project}/milestones/{milestone}', [ProjectMilestoneController::class, 'update'])->name('milestones.update');
        Route::delete('/{project}/milestones/{milestone}', [ProjectMilestoneController::class, 'destroy'])->name('milestones.destroy');
        // Updates
        Route::post('/{project}/updates', [ProjectUpdateController::class, 'store'])->name('updates.store');
        Route::put('/{project}/updates/{update}', [ProjectUpdateController::class, 'update'])->name('updates.update');
        Route::delete('/{project}/updates/{update}', [ProjectUpdateController::class, 'destroy'])->name('updates.destroy');
    });
    // ガントチャート
    Route::prefix('gantt')->name('gantt.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/Projects/GanttChart/Index');
        })->name('index');
    });

    // 契約管理
    Route::resource('contract', ContractController::class);
    Route::prefix('contract')->name('contract.')->group(function () {
        Route::patch('/{id}/activate', [ContractController::class, 'activate'])->name('activate');
        Route::patch('/{id}/cancel', [ContractController::class, 'cancel'])->name('cancel');
        Route::patch('/{id}/approve', [ContractController::class, 'approve'])->name('approve');
        Route::post('/{id}/send-reminder', [ContractController::class, 'sendReminder'])->name('send-reminder');
        Route::post('/{id}/documents', [ContractController::class, 'uploadDocument'])->name('documents.upload');
        Route::patch('/{id}/billing-settings', [ContractController::class, 'updateBillingSettings'])->name('billing-settings.update');
        Route::post('/{id}/send', [ContractController::class, 'send'])->name('send');
        Route::get('/{id}/pdf', [ContractController::class, 'generatePdf'])->name('pdf');
        Route::get('/{id}/pdf/preview', [ContractController::class, 'previewPdf'])->name('pdf.preview');

        // 署名関連ルート
        Route::post('/{id}/signature/user', [ContractSignatureController::class, 'storeUserSignature'])->name('signature.user.store');
        Route::post('/{id}/signature/verify-user', [ContractSignatureController::class, 'verifyUserSignature'])->name('signature.verify-user');
        Route::get('/{id}/signature/admin', [ContractSignatureController::class, 'showAdminSignaturePage'])->name('signature.admin.show');
        Route::post('/{id}/signature/admin', [ContractSignatureController::class, 'storeAdminSignature'])->name('signature.admin.store');
        Route::post('/{id}/signature/reject', [ContractSignatureController::class, 'rejectSignature'])->name('signature.reject');
    });

    // 見積もり管理
    Route::resource('quote', QuoteController::class);
    Route::prefix('quote')->name('quote.')->group(function () {
        Route::get('/{quote}/preview', [QuoteController::class, 'preview'])->name('preview');
        Route::post('/{quote}/send', [QuoteController::class, 'send'])->name('send');
        Route::post('/{quote}/approve', [QuoteController::class, 'approve'])->name('approve');
        Route::post('/{quote}/reject', [QuoteController::class, 'reject'])->name('reject');
        Route::get('/{quote}/pdf', [QuoteController::class, 'downloadPdf'])->name('pdf');
        Route::get('/{quote}/pdf/preview', [QuoteController::class, 'previewPdf'])->name('pdf.preview');
    });

    // お客様返信管理
    Route::prefix('quote-response')->name('quote-response.')->group(function () {
        Route::get('/', [QuoteResponseController::class, 'index'])->name('index');
        Route::get('/{quoteResponse}', [QuoteResponseController::class, 'show'])->name('show');
        Route::post('/{quoteResponse}/send-invitation', [QuoteResponseController::class, 'sendInvitation'])->name('send-invitation');
    });

    // オンボーディング管理
    Route::prefix('onboarding')->name('onboarding.')->controller(OnboardingController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{userId}', 'detail')->name('detail');
        Route::post('/{userId}/approve', 'approve')->name('approve');
        Route::post('/{userId}/reject', 'reject')->name('reject');
    });

    // 支払い管理
    Route::resource('payment', PaymentController::class);

    // 請求書管理
    Route::resource('invoice', InvoiceController::class);
    Route::prefix('invoice')->name('invoice.')->group(function () {
        Route::get('/overdue', [InvoiceController::class, 'overdueList'])->name('overdue');
        Route::patch('/{id}/send', [InvoiceController::class, 'send'])->name('send');
        Route::post('/{id}/payments', [InvoiceController::class, 'recordPayment'])->name('payments.store');
        Route::get('/{id}/pdf', [InvoiceController::class, 'downloadPdf'])->name('pdf');
        Route::get('/{id}/pdf/preview', [InvoiceController::class, 'previewPdf'])->name('pdf.preview');
        Route::post('/{id}/confirm-payment', [InvoiceController::class, 'confirmPayment'])->name('confirm-payment');
        Route::post('/{id}/resend', [InvoiceController::class, 'resend'])->name('resend');
    });

    // 契約から請求書を生成
    Route::post('contract/{contract}/create-invoice', [InvoiceController::class, 'createFromContract'])->name('invoice.create-from-contract');

    // 領収書管理
    Route::resource('receipt', ReceiptController::class);
    Route::prefix('receipts')->name('receipts.')->group(function () {
        Route::get('/{id}/download', [ReceiptController::class, 'download'])->name('download');
        Route::post('/{id}/send', [ReceiptController::class, 'send'])->name('send');
    });

    // FAQs管理
    Route::resource('faq', FaqController::class);
    Route::delete('/faqs/bulk-destroy', [FaqController::class, 'bulkDestroy'])->name('faq.bulk-destroy');
    Route::patch('/faqs/bulk-status', [FaqController::class, 'bulkUpdateStatus'])->name('faq.bulk-status');

    // Terms (規約) 管理
    Route::resource('terms', TermController::class);
    Route::post('/terms/{term}/activate', [TermController::class, 'activate'])->name('terms.activate');
    Route::post('/terms/{term}/revert-to-draft', [TermController::class, 'revertToDraft'])->name('terms.revertToDraft');
    Route::post('/terms/{term}/create-version', [TermController::class, 'createVersion'])->name('terms.createVersion');

    // スケジュール管理
    Route::prefix('schedules')->name('schedules.')->group(function () {
        // スケジュールカレンダー統合画面
        Route::get('/', [ScheduleDefaultController::class, 'calendar'])->name('index');

        // 祝日・休業日管理
        Route::resource('holidays', HolidayController::class);
        Route::post('/holidays/import', [HolidayController::class, 'import'])->name('holidays.import');
        Route::get('/holidays/export', [HolidayController::class, 'export'])->name('holidays.export');

        // デフォルトスケジュール管理
        Route::get('/defaults', [ScheduleDefaultController::class, 'index'])->name('defaults.index');
        Route::post('/defaults/bulk-update', [ScheduleDefaultController::class, 'bulkUpdate'])->name('defaults.bulk-update');

        // 例外スケジュール管理
        Route::resource('exceptions', ScheduleExceptionController::class);
    });

    // 予約枠管理
    Route::resource('appointment-slots', AppointmentSlotController::class);

    // 予約管理
    Route::resource('appointments', AppointmentController::class);
    Route::post('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm'])->name('appointments.confirm');
    Route::post('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel'])->name('appointments.cancel');
    Route::post('/appointments/{appointment}/complete', [AppointmentController::class, 'complete'])->name('appointments.complete');

    // ホームページ管理
    Route::prefix('homepage')->name('homepage.')->group(function () {
        Route::resource('pages', PageController::class);

        // TODO: サービス管理との競合を避けるため一旦コメントアウト
        // 後で 'homepage-services' など別名に変更する必要あり
        // Route::resource('services', ServicesController::class);

        Route::resource('blogCategories', BlogCategoryController::class);
        Route::post('/blogCategories/bulk-action', [BlogCategoryController::class, 'bulkAction'])->name('blogCategories.bulk-action');
        Route::post('/blogCategories/update-order', [BlogCategoryController::class, 'updateOrder'])->name('blogCategories.update-order');
        Route::resource('blogs', BlogController::class);
        Route::post('/blogs/bulk-action', [BlogController::class, 'bulkAction'])->name('blogs.bulk-action');
        Route::patch('/blogs/{blog}/status', [BlogController::class, 'changeStatus'])->name('blogs.change-status');
        Route::post('/blogs/upload-editor-image', [BlogController::class, 'uploadEditorImage'])->name('blogs.upload-editor-image');

        Route::resource('site-settings', SiteSettingController::class);
    });

    // ログ管理
    Route::get('/logs', [LogController::class, 'index'])->name('logs.index');

    // コンテンツ管理（一時的にダミー）
    Route::get('/content', function () {
        return Inertia::render('Admin/Content/Index');
    })->name('content.index');

    // 設定（一時的にダミー）
    Route::resource('systemSetting', SystemSettingController::class)->only(['index', 'edit', 'update']);
});

require __DIR__ . '/admin_auth.php';
