<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\AppointmentController;
use App\Services\ContactCategoryService;
use App\Http\Controllers\QuoteResponseController;
use App\Http\Controllers\InvoicePaymentController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\EstimateSimulatorController;
use App\Http\Controllers\User\AccountController as UserAccountController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\ServiceController;
use App\Http\Controllers\Public\FaqController;
use App\Http\Controllers\Public\PageController;
use App\Http\Controllers\Public\DocumentController;
use App\Http\Controllers\Public\PostController;
use App\Http\Controllers\Public\ContactController as PublicContactController;
// User用コントローラー
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
use App\Http\Controllers\User\CalendarController as UserCalendarController;
use App\Http\Controllers\User\ContactController as UserContactController;
use App\Http\Controllers\User\FaqController as UserFaqController;
use App\Http\Controllers\User\AnnouncementController as UserAnnouncementController;
use App\Http\Controllers\User\AtlasController as UserAtlasController;
use App\Http\Controllers\Atlas\Auth\AuthenticatedSessionController as AtlasAuthenticatedSessionController;
use App\Http\Controllers\Atlas\Auth\RegisteredUserController as AtlasRegisteredUserController;
use App\Http\Controllers\Atlas\RoomController as AtlasRoomController;
use App\Http\Controllers\Atlas\ApplicationController as AtlasApplicationController;
use Inertia\Inertia;

// Atlas（富裕層向けサービス）: Private Preview + Private Room
// メインサイトと切り離すため、サブドメイン（atlas.example.com）で配信する。
// ローカルでは http://atlas.localhost:8000 のようにポート付きでアクセスする。
// セッションもメインサイトとは共有しない（Atlas内で完結するログイン導線）。
Route::domain(config('app.atlas_domain'))->group(function () {
    Route::get('/', fn() => Inertia::render('Public/Atlas'))->name('atlas');
    Route::get('/apply', [AtlasApplicationController::class, 'create'])->name('atlas.apply');
    Route::post('/apply', [AtlasApplicationController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('atlas.apply.store');

    Route::middleware('guest:users')->group(function () {
        Route::controller(AtlasAuthenticatedSessionController::class)->group(function () {
            Route::get('/login', 'create')->name('atlas.login');
            Route::post('/login', 'store');
        });
        Route::controller(AtlasRegisteredUserController::class)->group(function () {
            Route::get('/register', 'create')->name('atlas.register');
            Route::post('/register', 'store');
        });
    });

    Route::post('/logout', [AtlasAuthenticatedSessionController::class, 'destroy'])
        ->middleware('auth:users')
        ->name('atlas.logout');

    Route::middleware('auth:users')->group(function () {
        Route::get('/membership-required', [AtlasRoomController::class, 'membershipRequired'])
            ->name('atlas.membership-required');

        Route::middleware('atlas.member')->group(function () {
            Route::get('/room', [AtlasRoomController::class, 'index'])->name('atlas.room');
        });
    });
});

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', fn() => Inertia::render('Public/About'))->name('about');
Route::get('/service', [ServiceController::class, 'index'])->name('service');
Route::get('/services/{slug}', [ServiceController::class, 'show'])->name('service.detail');
Route::get('/blog', [PostController::class, 'index'])->name('blog');
Route::get('/blog/{slug}', [PostController::class, 'show'])->name('blog.detail');
Route::get('/news', [PostController::class, 'newsIndex'])->name('news');
Route::get('/news/{slug}', [PostController::class, 'show'])->name('news.detail');
Route::get('/faq', [FaqController::class, 'show'])->name('faq');
Route::get('/company', function () {
    return Inertia::render('Public/Company', [
        'histories' => \App\Models\OrganizationHistory::published()->ordered()->get(),
    ]);
})->name('company');
Route::get('/contact', [PublicContactController::class, 'index'])->name('contact');
Route::get('/privacy-policy', [DocumentController::class, 'privacyPolicy'])->name('privacy.policy');
Route::get('/terms', [DocumentController::class, 'terms'])->name('terms');
Route::get('/documents/{slug}', [DocumentController::class, 'show'])->name('documents.show');

// // More public routes
Route::get('/lp', fn() => Inertia::render('Public/LandingPage'))->name('landing.page');
Route::get('/lp-minimal', fn() => Inertia::render('Public/LandingPageMinimal'))->name('landing.minimal');
Route::get('/lp-creative', fn() => Inertia::render('Public/LandingPageCreative'))->name('landing.creative');


// Contact 送信
Route::post('/contact', [PublicContactController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.store');

// 無料相談予約（Public - ログイン不要、一般クライアント向け）
Route::get('/consultation', [AppointmentController::class, 'create'])->name('consultation');
Route::post('/consultation', [AppointmentController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('consultation.store');
// 見積もりシミュレーター
Route::get('/estimate-simulator', [EstimateSimulatorController::class, 'index'])->name('estimate.simulator');

// Quote Response (public, no auth required) - Display & Submit
Route::get('/quote-response/{token}', [QuoteResponseController::class, 'show'])->name('quote.response.show');
Route::post('/quote-response/{token}', [QuoteResponseController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('quote.response.store');
Route::get('/quote-response/{token}/register', [QuoteResponseController::class, 'registerShow'])->name('quote.response.register');
Route::post('/quote-response/{token}/register', [QuoteResponseController::class, 'registerStore'])
    ->middleware('throttle:5,1')
    ->name('quote.response.register.store');

// 請求書メールからの入金報告（Public - ログイン不要）
Route::get('/invoice-payment/{token}', [InvoicePaymentController::class, 'show'])->name('invoice.payment.show');
Route::post('/invoice-payment/{token}', [InvoicePaymentController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('invoice.payment.store');


// Public routes - define authenticated routes FIRST before public routes
Route::middleware(['auth:users', 'verified'])->name('user.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Atlas会員資格の紹介カード用API（同一セッションでの利用が前提）
    Route::get('/api/atlas/me', [UserAtlasController::class, 'me'])->name('atlas.me');

    // Onboarding routes (登録情報の完成)
    Route::get('/onboarding/profile', [UserProfileController::class, 'create'])->name('onboarding.profile');
    Route::post('/onboarding/profile', [UserProfileController::class, 'store'])->name('onboarding.profile.store');
    Route::get('/onboarding/company', [CompanyController::class, 'create'])->name('onboarding.company');
    Route::post('/onboarding/company', [CompanyController::class, 'store'])->name('onboarding.company.store');
    Route::get('/onboarding/address', [AddressController::class, 'create'])->name('onboarding.address');
    Route::post('/onboarding/address', [AddressController::class, 'store'])->name('onboarding.address.store');

    Route::get('/profile', [UserAccountController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [UserAccountController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [UserAccountController::class, 'destroy'])->name('profile.destroy');

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
    Route::get('/receipt/{receipt}/pdf/preview', [ReceiptController::class, 'previewPdf'])->name('receipt.pdf.preview');
    // 複数の領収書をまとめて1つのPDFとして出力（/receipt/{receipt}系と衝突しないようパスを分ける）
    Route::get('/receipts/bulk/preview', [ReceiptController::class, 'bulkPreview'])->name('receipt.bulk.preview');
    Route::get('/receipts/bulk/download', [ReceiptController::class, 'bulkDownload'])->name('receipt.bulk.download');

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

    // カレンダー（自分の予定確認）
    Route::get('/calendar', [UserCalendarController::class, 'index'])->name('calendar.index');

    // 予約（Adminとの面談予約）
    Route::prefix('appointments')->name('appointments.')->group(function () {
        Route::get('/', [UserAppointmentController::class, 'index'])->name('index');
        Route::get('/create', [UserAppointmentController::class, 'create'])->name('create');
        Route::post('/', [UserAppointmentController::class, 'store'])->name('store');
        Route::get('/{appointment}/edit', [UserAppointmentController::class, 'edit'])->name('edit');
        Route::put('/{appointment}', [UserAppointmentController::class, 'update'])->name('update');
        Route::post('/{appointment}/cancel', [UserAppointmentController::class, 'cancel'])->name('cancel');
    });

    // お問い合わせ（公開用の /contact とURIが衝突しないよう /my プレフィックスを付与）
    Route::prefix('my/contact')->name('contact.')->group(function () {
        Route::get('/', [UserContactController::class, 'index'])->name('index');
        Route::post('/', [UserContactController::class, 'send'])->name('send');
    });

    // よくある質問（公開用の /faq とURIが衝突しないよう /my プレフィックスを付与）
    Route::get('/my/faq', [UserFaqController::class, 'index'])->name('faq.index');

    // お知らせ（Admin配信）
    Route::resource('/announcement', UserAnnouncementController::class)->only(['index', 'show']);
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

// Auth routes
require __DIR__ . '/auth.php';

// 汎用固定ページ(Page + ブロックエディタ content)。他の具体的なルートに一致しない場合のフォールバック
// 必ず他の全ルート（特に auth.php の /login, /register 等）より後に定義すること
Route::get('/{slug}', [PageController::class, 'show'])
    ->where('slug', '[a-z0-9\-]+')
    ->name('page.show');
