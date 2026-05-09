<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminProfileController;
use App\Http\Controllers\Admin\AdminAddressController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UserProfileController;
use App\Http\Controllers\Admin\UserAddressController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\CompanyAddressController;

use App\Http\Controllers\Admin\Service\ServiceCategoryController;
use App\Http\Controllers\Admin\Service\ServiceController;
use App\Http\Controllers\Admin\Service\ServicePlanController;
use App\Http\Controllers\Admin\Service\ServiceItemController;

use App\Http\Controllers\Admin\Homepage\PageController;
use App\Http\Controllers\Admin\Homepage\BlogCategoryController;
use App\Http\Controllers\Admin\Homepage\BlogController;
use App\Http\Controllers\Admin\Homepage\FaqController;
use App\Http\Controllers\Admin\Homepage\ContactController;
use App\Http\Controllers\Admin\Homepage\SiteSettingController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\LogController;
use App\Http\Controllers\Admin\SystemSettingController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ContractController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\ProjectCategoryController;
use App\Http\Controllers\Admin\ProjectInquiryController;
use App\Http\Controllers\Admin\ProjectMilestoneController;
use App\Http\Controllers\Admin\ProjectUpdateController;
use Inertia\Inertia;

Route::middleware(['auth:admins', 'verified'])->group(function () {
    // 管理者ダッシュボード
    Route::get('/dashboard', function () {
        return Inertia::render('AdminDashboard', [
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    })->name('dashboard');

    // 自身のプロフィール
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

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

    // メディア管理
    Route::resource('media', MediaController::class);
    Route::post('/media/upload', [MediaController::class, 'upload'])->name('media.upload');
    Route::delete('/media/bulk-destroy', [MediaController::class, 'bulkDestroy'])->name('media.bulk-destroy');

    // サービス管理
    Route::prefix('service')->name('service.')->group(function () {
        Route::resource('category', ServiceCategoryController::class)->parameters(['category' => 'serviceCategory']);
        Route::resource('service-plan', ServicePlanController::class)->parameters(['service-plan' => 'servicePlan']);
        Route::resource('service-item', ServiceItemController::class)->parameters(['service-item' => 'serviceItem']);
    });

    // サービス一覧
    Route::resource('service', ServiceController::class);

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

        // FAQs管理
        Route::resource('faqs', FaqController::class);
        Route::delete('/faqs/bulk-destroy', [FaqController::class, 'bulkDestroy'])->name('faqs.bulk-destroy');
        Route::patch('/faqs/bulk-status', [FaqController::class, 'bulkUpdateStatus'])->name('faqs.bulk-status');

        // お問い合わせ管理
        Route::resource('contacts', ContactController::class)->only(['index', 'show', 'update', 'destroy']);
        Route::patch('/contacts/bulk-update', [ContactController::class, 'bulkUpdate'])->name('contacts.bulk-update');
        Route::get('/contacts/export', [ContactController::class, 'export'])->name('contacts.export');

        Route::resource('site-settings', SiteSettingController::class);
    });

    // プロジェクト問い合わせ管理
    Route::resource('project-inquiries', ProjectInquiryController::class);

    // プロジェクト管理
    Route::prefix('projects')->name('projects.')->group(function () {
        Route::get('/', [ProjectController::class, 'index'])->name('index');
        Route::get('/create', [ProjectController::class, 'create'])->name('create');
        Route::post('/', [ProjectController::class, 'store'])->name('store');
        Route::get('/{project}', [ProjectController::class, 'show'])->name('show');
        Route::get('/{project}/edit', [ProjectController::class, 'edit'])->name('edit');
        Route::put('/{project}', [ProjectController::class, 'update'])->name('update');
        Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('destroy');

        // Milestones
        Route::post('/{project}/milestones', [ProjectMilestoneController::class, 'store'])->name('milestones.store');
        Route::put('/{project}/milestones/{milestone}', [ProjectMilestoneController::class, 'update'])->name('milestones.update');
        Route::delete('/{project}/milestones/{milestone}', [ProjectMilestoneController::class, 'destroy'])->name('milestones.destroy');

        // Updates
        Route::post('/{project}/updates', [ProjectUpdateController::class, 'store'])->name('updates.store');
        Route::put('/{project}/updates/{update}', [ProjectUpdateController::class, 'update'])->name('updates.update');
        Route::delete('/{project}/updates/{update}', [ProjectUpdateController::class, 'destroy'])->name('updates.destroy');
    });

    // プロジェクトカテゴリ管理
    Route::resource('project-categories', ProjectCategoryController::class);

    // ガントチャート
    Route::prefix('gantt')->name('gantt.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/Projects/GanttChart/Index');
        })->name('index');
    });

    // 契約管理
    Route::prefix('contract')->name('contract.')->group(function () {
        Route::get('/', [ContractController::class, 'index'])->name('index');
        Route::get('/create', [ContractController::class, 'create'])->name('create');
        Route::post('/', [ContractController::class, 'store'])->name('store');
        Route::get('/{id}', [ContractController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [ContractController::class, 'edit'])->name('edit');
        Route::put('/{id}', [ContractController::class, 'update'])->name('update');
        Route::patch('/{id}/activate', [ContractController::class, 'activate'])->name('activate');
        Route::patch('/{id}/cancel', [ContractController::class, 'cancel'])->name('cancel');
        Route::post('/{id}/documents', [ContractController::class, 'uploadDocument'])->name('documents.upload');
    });

    // 請求書管理
    Route::prefix('invoices')->name('invoices.')->group(function () {
        Route::get('/', [InvoiceController::class, 'index'])->name('index');
        Route::get('/overdue', [InvoiceController::class, 'overdueList'])->name('overdue');
        Route::get('/create', [InvoiceController::class, 'create'])->name('create');
        Route::post('/', [InvoiceController::class, 'store'])->name('store');
        Route::get('/{id}', [InvoiceController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [InvoiceController::class, 'edit'])->name('edit');
        Route::put('/{id}', [InvoiceController::class, 'update'])->name('update');
        Route::patch('/{id}/send', [InvoiceController::class, 'send'])->name('send');
        Route::post('/{id}/payments', [InvoiceController::class, 'recordPayment'])->name('payments.store');
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
