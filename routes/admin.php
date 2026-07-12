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
use App\Http\Controllers\Admin\AnalyticsController;

use App\Http\Controllers\Admin\Service\ServiceCategoryController;
use App\Http\Controllers\Admin\Service\ServiceController;
use App\Http\Controllers\Admin\Service\ServicePlanController;
use App\Http\Controllers\Admin\Service\ServicePlanItemController;
use App\Http\Controllers\Admin\Service\ServiceItemController;

use App\Http\Controllers\Admin\Contact\ContactController;
use App\Http\Controllers\Admin\Contact\ContactCategoryController;
use App\Http\Controllers\Admin\Contact\ContactApiClientController;
use App\Http\Controllers\Admin\Contact\ResponseController;
use App\Http\Controllers\Admin\Contact\ResponseTemplateController;

use App\Http\Controllers\Admin\UserInvitationController;
use App\Http\Controllers\Admin\OnboardingController;

use App\Http\Controllers\Admin\Project\ProjectTemplateController;
use App\Http\Controllers\Admin\Project\ProjectTemplateMilestoneController;
use App\Http\Controllers\Admin\Project\ProjectController;
use App\Http\Controllers\Admin\Project\ProjectVersionController;
use App\Http\Controllers\Admin\Project\ProjectMilestoneController;
use App\Http\Controllers\Admin\Project\ProjectItemController;
use App\Http\Controllers\Admin\Project\ProjectUpdateController;
use App\Http\Controllers\Admin\Project\GanttChartController;

use App\Http\Controllers\Admin\Quote\QuoteController;
use App\Http\Controllers\Admin\Quote\QuoteVersionController;
use App\Http\Controllers\Admin\Quote\QuoteItemController;
use App\Http\Controllers\Admin\Quote\QuoteResponseController;

use App\Http\Controllers\Admin\Contract\ContractController;
use App\Http\Controllers\Admin\Contract\ContractVersionController;
use App\Http\Controllers\Admin\Contract\ContractItemController;
use App\Http\Controllers\Admin\Contract\ContractSignatureController;
use App\Http\Controllers\Admin\Contract\ContractGroupController;

use App\Http\Controllers\Admin\Invoice\InvoiceController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\ReceiptController;

use App\Http\Controllers\Admin\Term\TermController;
use App\Http\Controllers\Admin\Term\TermVersionController;
use App\Http\Controllers\Admin\Term\TermItemController;

use App\Http\Controllers\Admin\Website\DashboardController;
use App\Http\Controllers\Admin\Website\PageTypeController;
use App\Http\Controllers\Admin\Website\PageController;
use App\Http\Controllers\Admin\Website\SectionController;
use App\Http\Controllers\Admin\Website\PostCategoryController;
use App\Http\Controllers\Admin\Website\PostController;
use App\Http\Controllers\Admin\Website\MenuController;
use App\Http\Controllers\Admin\Website\MenuItemController;
use App\Http\Controllers\Admin\Website\FaqCategoryController;
use App\Http\Controllers\Admin\Website\FaqController;
use App\Http\Controllers\Admin\Website\SiteSettingController;

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
    Route::post('/company/{company}/attach-media', [CompanyController::class, 'attachMedia'])->name('company.attach-media');
    Route::delete('/company/{company}/detach-media', [CompanyController::class, 'detachMedia'])->name('company.detach-media');
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
    // サービス管理
    Route::prefix('service')->name('service.')->group(function () {
        Route::resource('category', ServiceCategoryController::class)->parameters(['category' => 'serviceCategory']);
        Route::resource('plan', ServicePlanController::class)->parameters(['plan' => 'servicePlan']);

        // ServicePlanItemの管理ルート
        Route::prefix('plan/{servicePlan}')->name('plan.')->group(function () {
            Route::get('items/create', [ServicePlanItemController::class, 'addItems'])->name('items.create');
            Route::post('items', [ServicePlanItemController::class, 'storeItems'])->name('items.store');
            Route::get('items/edit', [ServicePlanItemController::class, 'editItems'])->name('items.edit');
            Route::put('items', [ServicePlanItemController::class, 'updateItems'])->name('items.update');
            Route::delete('items/{servicePlanItem}', [ServicePlanItemController::class, 'destroyItem'])->name('items.destroy');
        });

        Route::resource('item', ServiceItemController::class)->parameters(['item' => 'serviceItem']);
    });

    // サービス一覧
    Route::resource('service', ServiceController::class);

    /**************************************
     * お問い合わせ
     **************************************/
    // お問い合わせカテゴリ管理 / 外部API連携クライアント管理
    Route::prefix('contact')->name('contact.')->group(function () {
        Route::resource('category', ContactCategoryController::class)->except(['show']);
        Route::resource('api-client', ContactApiClientController::class)->except(['show']);
        Route::patch('api-client/{apiClient}/toggle-active', [ContactApiClientController::class, 'toggleActive'])->name('api-client.toggle-active');
        Route::post('api-client/{apiClient}/regenerate', [ContactApiClientController::class, 'regenerate'])->name('api-client.regenerate');
    });
    // お問い合わせ管理
    Route::resource('contact', ContactController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::patch('/contact/bulk-update', [ContactController::class, 'bulkUpdate'])->name('contact.bulk-update');
    Route::get('/contact/export', [ContactController::class, 'export'])->name('contact.export');

    // 返信管理（グローバル一覧）
    Route::get('response', [ResponseController::class, 'index'])->name('response.index');

    // お問い合わせ返答管理（Contact配下）
    Route::prefix('contact/{contact}')->name('contact.')->group(function () {
        Route::resource('response', ResponseController::class)->except(['index']);
        Route::post('response/{response}/send', [ResponseController::class, 'send'])->name('response.send');
        // ユーザー招待管理
        Route::post('invitation', [UserInvitationController::class, 'store'])->name('invitation.store');
    });
    // ユーザー招待管理（グローバル）
    Route::prefix('invitation')->name('invitation.')->group(function () {
        Route::post('{invitation}/resend', [UserInvitationController::class, 'resend'])->name('resend');
        Route::patch('{invitation}/revoke', [UserInvitationController::class, 'revoke'])->name('revoke');
    });

    // 返答テンプレート管理
    Route::prefix('response')->name('response.')->group(function () {
        Route::resource('template', ResponseTemplateController::class);
    });

    /**************************************
     * プロジェクト
     **************************************/
    // プロジェクト関連のマイルストーンとアップデート管理
    Route::prefix('project')->name('project.')->group(function () {
        // ProjectTemplate
        Route::resource('template', ProjectTemplateController::class);

        // ProjectTemplateMilestone (ネストされたリソース)
        Route::prefix('template/{projectTemplate}')->name('template.')->group(function () {
            Route::resource('milestone', ProjectTemplateMilestoneController::class)->except(['index']);
        });

        // ProjectMilestone
        Route::post('/{project}/milestones', [ProjectMilestoneController::class, 'store'])->name('milestones.store');
        Route::put('/{project}/milestones/{milestone}', [ProjectMilestoneController::class, 'update'])->name('milestones.update');
        Route::delete('/{project}/milestones/{milestone}', [ProjectMilestoneController::class, 'destroy'])->name('milestones.destroy');
        // Updates
        Route::post('/{project}/updates', [ProjectUpdateController::class, 'store'])->name('updates.store');
        Route::put('/{project}/updates/{update}', [ProjectUpdateController::class, 'update'])->name('updates.update');
        Route::delete('/{project}/updates/{update}', [ProjectUpdateController::class, 'destroy'])->name('updates.destroy');
        // ガントチャート
        Route::get('/gantt', [GanttChartController::class, 'index'])->name('gantt.index');
        Route::get('/{project}/gantt', [GanttChartController::class, 'show'])->name('gantt.show');
    });
    // Project
    Route::resource('project', ProjectController::class);

    // ProjectVersion ネストされたリソース
    Route::prefix('project/{project}')->name('project.')->group(function () {
        Route::resource('versions', ProjectVersionController::class);
        Route::post('versions/{version}/set-current', [ProjectVersionController::class, 'setCurrent'])->name('versions.setCurrent');

        // ProjectMilestone ネストされたリソース
        Route::prefix('versions/{version}')->name('versions.')->group(function () {
            Route::resource('milestones', ProjectMilestoneController::class)->except(['index']);
            // ProjectItem ネストされたリソース
            Route::resource('items', ProjectItemController::class)->except(['index']);
        });
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

        // 契約明細管理
        Route::get('/{contract}/item/create', [ContractItemController::class, 'create'])->name('item.create');
        Route::post('/{contract}/item', [ContractItemController::class, 'store'])->name('item.store');
        Route::get('/{contract}/item/edit', [ContractItemController::class, 'edit'])->name('item.edit');
        Route::put('/{contract}/item', [ContractItemController::class, 'update'])->name('item.update');
        Route::delete('/{contract}/item', [ContractItemController::class, 'destroy'])->name('item.destroy');

        // 手動で明細を追加/編集（QuoteItemがない場合）
        Route::get('/{contract}/item/add-manual', [ContractItemController::class, 'create'])->name('item.add-manual');
        Route::post('/{contract}/item/manual', [ContractItemController::class, 'store'])->name('item.store-manual');
        Route::get('/{contract}/item/edit', [ContractItemController::class, 'edit'])->name('item.edit');
        Route::put('/{contract}/item', [ContractItemController::class, 'update'])->name('item.update');
        Route::delete('/{contract}/item', [ContractItemController::class, 'destroy'])->name('item.destroy');

        // 契約条項編集
        Route::get('/{id}/terms/edit', [ContractController::class, 'editTerms'])->name('terms.edit');
        Route::post('/{id}/terms', [ContractController::class, 'updateTerms'])->name('terms.update');
        Route::get('/{id}/preview', [ContractController::class, 'preview'])->name('preview');

        // 署名関連ルート
        Route::post('/{id}/signature/user', [ContractSignatureController::class, 'storeUserSignature'])->name('signature.user.store');
        Route::post('/{id}/signature/verify-user', [ContractSignatureController::class, 'verifyUserSignature'])->name('signature.verify-user');
        Route::get('/{id}/signature/admin', [ContractSignatureController::class, 'showAdminSignaturePage'])->name('signature.admin.show');
        Route::post('/{id}/signature/admin', [ContractSignatureController::class, 'storeAdminSignature'])->name('signature.admin.store');
        Route::post('/{id}/signature/reject', [ContractSignatureController::class, 'rejectSignature'])->name('signature.reject');
    });

    // 契約グループ管理
    Route::prefix('contract-group')->name('contract-group.')->group(function () {
        Route::get('/', [ContractGroupController::class, 'index'])->name('index');
        Route::get('/create', [ContractGroupController::class, 'create'])->name('create');
        Route::post('/', [ContractGroupController::class, 'store'])->name('store');
        Route::get('/{id}', [ContractGroupController::class, 'show'])->name('show');
        Route::post('/{id}/send', [ContractGroupController::class, 'send'])->name('send');
        Route::post('/{id}/add-contract', [ContractGroupController::class, 'addContract'])->name('add-contract');
        Route::delete('/{id}/remove-contract/{contractId}', [ContractGroupController::class, 'removeContract'])->name('remove-contract');
        Route::delete('/{id}', [ContractGroupController::class, 'destroy'])->name('destroy');
    });

    // 見積もり管理
    Route::resource('quote', QuoteController::class);
    Route::prefix('quote')->name('quote.')->group(function () {
        // 見積明細管理
        Route::get('/{quote}/item/create', [QuoteItemController::class, 'create'])->name('item.create');
        Route::post('/{quote}/item', [QuoteItemController::class, 'store'])->name('item.store');
        Route::get('/{quote}/item/edit', [QuoteItemController::class, 'edit'])->name('item.edit');
        Route::put('/{quote}/item', [QuoteItemController::class, 'update'])->name('item.update');
        Route::delete('/{quote}/item', [QuoteItemController::class, 'destroy'])->name('item.destroy');

        // その他の見積もり機能
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
        Route::post('/{quoteResponse}/mark-declined', [QuoteResponseController::class, 'markDeclined'])->name('mark-declined');
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
        Route::post('/{id}/receipt/issue', [InvoiceController::class, 'issueReceipt'])->name('receipt.issue');
        Route::post('/{invoiceId}/payment-notification/{notificationId}/acknowledge', [InvoiceController::class, 'acknowledgePaymentNotification'])->name('payment-notification.acknowledge');
        Route::get('/{id}/receipt/download', [InvoiceController::class, 'downloadReceipt'])->name('receipt.download');
    });



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

    // ホームページ管理
    Route::prefix('website')->name('website.')->group(function () {
        // ダッシュボード
        Route::controller(DashboardController::class)->group(function () {
            Route::get('/', 'index')->name('dashboard');
        });
        // ページ管理
        Route::prefix('page')->name('page.')->group(function () {
            Route::resource('type', PageTypeController::class)->names('type');
            Route::resource('', PageController::class)->parameters(['' => 'page']);
            Route::post('/{page}/restore', [PageController::class, 'restore'])->name('restore')->withTrashed();
        });
        // セクション管理
        Route::resource('section', SectionController::class);
        // ポスト管理
        Route::prefix('post')->name('post.')->group(function () {
            // カテゴリ関連ルートは post/{post} などの動的ルートに
            // 食われないよう、Postリソースルートより先に登録する
            Route::resource('category', PostCategoryController::class);
            Route::controller(PostCategoryController::class)->name('category.')->group(function () {
                Route::post('/category/bulk-action', 'bulkAction')->name('bulk-action');
                Route::post('/category/update-order', 'updateOrder')->name('update-order');
            });
            Route::resource('', PostController::class)->parameters(['' => 'post']);
            Route::controller(PostController::class)->group(function () {
                Route::post('/bulk-action', 'bulkAction')->name('bulk-action');
                Route::patch('/{post}/status', 'changeStatus')->name('change-status');
                Route::post('/upload-editor-image', 'uploadEditorImage')->name('upload-editor-image');
            });
        });
        // FAQ管理
        Route::prefix('faq')->name('faq.')->group(function () {
            Route::resource('', FaqController::class)->parameters(['' => 'faq']);
            Route::controller(FaqController::class)->group(function () {
                Route::post('/bulk-action', 'bulkAction')->name('bulk-action');
                Route::patch('/{faq}/status', 'changeStatus')->name('change-status');
                Route::post('/upload-editor-image', 'uploadEditorImage')->name('upload-editor-image');
            });
            Route::resource('category', FaqCategoryController::class);
            Route::controller(FaqCategoryController::class)->name('category.')->group(function () {
                Route::post('/category/bulk-action', 'bulkAction')->name('bulk-action');
                Route::post('/category/update-order', 'updateOrder')->name('update-order');
            });
        });
        // メニュー管理
        Route::resource('menu', MenuController::class);
        Route::prefix('menu')->name('menu.')->group(function () {
            Route::resource('{menu}/item', MenuItemController::class)->parameters(['item' => 'menuItem']);
        });
        // サイト設定管理
        Route::prefix('siteSetting')->name('siteSetting.')->group(function () {
            // グループ別設定画面（表示・保存を同一ルートで受ける）
            Route::controller(SiteSettingController::class)->group(function () {
                Route::match(['get', 'post'], '/general', 'general')->name('general');
                Route::match(['get', 'post'], '/navigation', 'navigation')->name('navigation');
                Route::match(['get', 'post'], '/footer', 'footer')->name('footer');
                Route::match(['get', 'post'], '/seo', 'seo')->name('seo');
                Route::match(['get', 'post'], '/ogp', 'ogp')->name('ogp');
            });
            // 個別設定項目の汎用CRUD（プリセットにない項目向け）
            Route::resource('', SiteSettingController::class)->parameters(['' => 'siteSetting']);
        });
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
