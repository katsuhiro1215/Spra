<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Services\ContactCategoryService;
use App\Http\Controllers\QuoteResponseController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\EstimateSimulatorController;
use App\Http\Controllers\PublicServiceController;
use App\Http\Controllers\PublicFaqController;
use App\Http\Controllers\PublicPageController;
use App\Http\Controllers\PublicDocumentController;
use App\Http\Controllers\PublicPostController;
use App\Models\Post;
use App\Services\ServiceService;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\ProjectController as UserProjectController;
use App\Http\Controllers\User\NotificationController;
use App\Http\Controllers\User\SecuritySettingsController;
use App\Http\Controllers\User\ContractController;
use App\Http\Controllers\User\ReceiptController;
use App\Http\Controllers\User\PointController;
use App\Http\Controllers\User\PointRedemptionController;
use App\Http\Controllers\User\ProfileController as UserProfileController;
use App\Http\Controllers\User\MediaController as UserMediaController;
use App\Http\Controllers\User\CompanyController;
use App\Http\Controllers\User\AddressController;
use App\Http\Controllers\User\UserAddressController;
use App\Http\Controllers\User\AppointmentController as UserAppointmentController;
use Inertia\Inertia;

Route::get('/', function (ServiceService $serviceService) {
    $summarize = fn ($post) => [
        'id' => $post->id,
        'slug' => $post->slug,
        'title' => $post->title,
        'category' => $post->postCategory?->name,
        'date' => $post->published_at?->format('Y.m.d'),
        'excerpt' => $post->excerpt,
        'image' => $post->thumbnail,
    ];

    return Inertia::render('Public/Home', [
        'canLogin' => Route::has('user.login'),
        'canRegister' => Route::has('user.register'),
        'services' => $serviceService->getPublicList(),
        'newsItems' => Post::published()
            ->whereHas('postCategory', fn ($q) => $q->where('slug', 'news'))
            ->with('postCategory')
            ->recent(3)
            ->get()
            ->map($summarize),
        'blogPosts' => Post::published()
            ->whereHas('postCategory', fn ($q) => $q->where('slug', '!=', 'news'))
            ->with('postCategory')
            ->recent(3)
            ->get()
            ->map($summarize),
    ]);
})->name('home');
Route::get('/about', fn() => Inertia::render('Public/About'))->name('about');
Route::get('/service', [PublicServiceController::class, 'index'])->name('service');
Route::get('/services/{slug}', [PublicServiceController::class, 'show'])->name('service.detail');
Route::get('/blog', [PublicPostController::class, 'index'])->name('blog');
Route::get('/blog/{slug}', [PublicPostController::class, 'show'])->name('blog.detail');
Route::get('/news', [PublicPostController::class, 'newsIndex'])->name('news');
Route::get('/news/{slug}', [PublicPostController::class, 'show'])->name('news.detail');
Route::get('/faq', [PublicFaqController::class, 'show'])->name('faq');
Route::get('/flow', fn() => Inertia::render('Public/Flow'))->name('flow');
Route::get('/company', function () {
    return Inertia::render('Public/Company', [
        'histories' => \App\Models\OrganizationHistory::published()->ordered()->get(),
    ]);
})->name('company');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::get('/privacy-policy', [PublicDocumentController::class, 'privacyPolicy'])->name('privacy.policy');
Route::get('/terms', [PublicDocumentController::class, 'terms'])->name('terms');
Route::get('/documents/{slug}', [PublicDocumentController::class, 'show'])->name('documents.show');

// Contact 送信
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
// 見積もりシミュレーター
Route::get('/estimate-simulator', [EstimateSimulatorController::class, 'index'])->name('estimate.simulator');

// Quote Response (public, no auth required) - Display & Submit
Route::get('/quote-response/{token}', [QuoteResponseController::class, 'show'])->name('quote.response.show');
Route::post('/quote-response/{token}', [QuoteResponseController::class, 'store'])->name('quote.response.store');
Route::get('/quote-response/{token}/register', [QuoteResponseController::class, 'registerShow'])->name('quote.response.register');
Route::post('/quote-response/{token}/register', [QuoteResponseController::class, 'registerStore'])->name('quote.response.register.store');


// Public routes - define authenticated routes FIRST before public routes
Route::middleware(['auth:users', 'verified'])->name('user.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Onboarding routes (登録情報の完成)
    Route::get('/onboarding/profile', [UserProfileController::class, 'create'])->name('onboarding.profile');
    Route::post('/onboarding/profile', [UserProfileController::class, 'store'])->name('onboarding.profile.store');
    Route::get('/onboarding/company', [CompanyController::class, 'create'])->name('onboarding.company');
    Route::post('/onboarding/company', [CompanyController::class, 'store'])->name('onboarding.company.store');
    Route::get('/onboarding/address', [AddressController::class, 'create'])->name('onboarding.address');
    Route::post('/onboarding/address', [AddressController::class, 'store'])->name('onboarding.address.store');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // プロジェクト（クライアント向け）
    Route::get('/my/projects', [UserProjectController::class, 'index'])->name('projects.index');
    Route::get('/my/projects/{id}', [UserProjectController::class, 'show'])->name('projects.show');

    // 契約
    Route::get('/contracts', [ContractController::class, 'index'])->name('contract.index');
    Route::get('/contracts/{id}', [ContractController::class, 'show'])->name('contract.show');
    Route::post('/contracts/{id}/sign', [ContractController::class, 'sign'])->name('contract.sign');
    Route::get('/contracts/{id}/pdf', [ContractController::class, 'generatePdf'])->name('contract.pdf');
    Route::get('/contracts/{id}/pdf/preview', [ContractController::class, 'previewPdf'])->name('contract.pdf.preview');

    /**************************************
     * 請求書
     **************************************/
    require __DIR__ . '/user/invoice.php';

    // 領収書（クライアント向け）
    Route::resource('/receipt', ReceiptController::class)->only(['index', 'show']);
    Route::get('/receipt/{receipt}/download', [ReceiptController::class, 'download'])->name('receipt.download');

    // ポイント（クライアント向け）
    Route::get('/points', [PointController::class, 'index'])->name('points.index');

    // ポイント交換（クライアント向け）
    Route::get('/point-redemptions', [PointRedemptionController::class, 'index'])->name('point-redemptions.index');
    Route::post('/point-redemptions', [PointRedemptionController::class, 'store'])->name('point-redemptions.store');

    /**************************************
     * 見積もり
     **************************************/
    require __DIR__ . '/user/quote.php';

    // 進捗状況（クライアント向け）
    Route::get('/progress', [UserProjectController::class, 'progress'])->name('progress.index');

    // 通知（クライアント向け）
    Route::get('/notifications/{id}/read', [NotificationController::class, 'read'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'readAll'])->name('notifications.read-all');

    // メディア（プロフィール画像アップロード用）
    Route::post('/media', [UserMediaController::class, 'store'])->name('media.store');

    // 設定（クライアント向け）
    Route::get('/settings', function () {
        return Inertia::render('User/Settings/Index');
    })->name('settings.index');

    Route::prefix('settings')->name('settings.')->group(function () {
        // 個人情報（Profile）
        Route::get('/profile', [UserProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [UserProfileController::class, 'update'])->name('profile.update');
        Route::post('/profile/attach-media', [UserProfileController::class, 'attachMedia'])->name('profile.attach-media');
        Route::delete('/profile/detach-media', [UserProfileController::class, 'detachMedia'])->name('profile.detach-media');

        // 会社情報（Company）
        Route::get('/company', [CompanyController::class, 'edit'])->name('company.edit');
        Route::put('/company', [CompanyController::class, 'update'])->name('company.update');

        // 会社住所（Company Address）
        Route::get('/company-address', [AddressController::class, 'edit'])->name('company-address.edit');
        Route::put('/company-address', [AddressController::class, 'update'])->name('company-address.update');

        // ご自身の住所（Personal Address）
        Route::get('/address', [UserAddressController::class, 'edit'])->name('address.edit');
        Route::put('/address', [UserAddressController::class, 'update'])->name('address.update');

        // セキュリティ（二段階認証）
        Route::get('/security', [SecuritySettingsController::class, 'edit'])->name('security.edit');
        Route::put('/security', [SecuritySettingsController::class, 'update'])->name('security.update');
    });

    Route::get('/reservation-settings', function () {
        return Inertia::render('User/ReservationSettings');
    })->name('reservation.settings');
    Route::post('/reservation-settings', function () {
        return redirect()->back()->with('success', '予約設定を保存しました。');
    })->name('reservation.settings.store');

    // 予約（Adminとの面談予約）
    Route::prefix('appointments')->name('appointments.')->group(function () {
        Route::get('/', [UserAppointmentController::class, 'index'])->name('index');
        Route::get('/create', [UserAppointmentController::class, 'create'])->name('create');
        Route::post('/', [UserAppointmentController::class, 'store'])->name('store');
        Route::get('/{appointment}/edit', [UserAppointmentController::class, 'edit'])->name('edit');
        Route::put('/{appointment}', [UserAppointmentController::class, 'update'])->name('update');
        Route::post('/{appointment}/cancel', [UserAppointmentController::class, 'cancel'])->name('cancel');
    });
});

Route::post('/estimate-simulator/save', [EstimateSimulatorController::class, 'save'])->name('estimate.simulator.save');

// Public routes
// Route::group(['prefix' => '', 'name' => 'public.'], function () {
//     Route::get('/plans', fn() => inertiaPublic('Plans'))->name('plans');
//     Route::get('/careers', fn() => inertiaPublic('Careers'))->name('careers');

//     // Onboarding (public, no auth required)
//     Route::get('/onboarding/{token}', [OnboardingController::class, 'show'])->name('onboarding.show');
//     Route::post('/onboarding/{token}', [OnboardingController::class, 'store'])->name('onboarding.store');
// });

// // More public routes
// Route::name('public.')->prefix('/')->group(function () {
//     Route::get('/lp', fn() => inertiaPublic('LandingPage'))->name('landing.page');
//     Route::get('/lp-minimal', fn() => inertiaPublic('LandingPageMinimal'))->name('landing.minimal');
//     Route::get('/lp-creative', fn() => inertiaPublic('LandingPageCreative'))->name('landing.creative');
// });

// Auth routes
require __DIR__ . '/auth.php';

// 汎用固定ページ(Page + ブロックエディタ content)。他の具体的なルートに一致しない場合のフォールバック
// 必ず他の全ルート（特に auth.php の /login, /register 等）より後に定義すること
Route::get('/{slug}', [PublicPageController::class, 'show'])
    ->where('slug', '[a-z0-9\-]+')
    ->name('page.show');
