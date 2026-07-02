<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\QuoteResponseController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\EstimateSimulatorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\ProjectController as UserProjectController;
use App\Http\Controllers\User\ContractController;
use App\Http\Controllers\User\InvoiceController as UserInvoiceController;
use App\Http\Controllers\User\ProfileController as UserProfileController;
use App\Http\Controllers\User\CompanyController;
use App\Http\Controllers\User\AddressController;
use Inertia\Inertia;

// ヘルパー関数をルート定義の前に定義
if (!function_exists('inertiaPublic')) {
    function inertiaPublic($component, $data = [])
    {
        return Inertia::render("Public/{$component}", $data);
    }
}

// Public routes - define authenticated routes FIRST before public routes
Route::group(['middleware' => ['auth:users'], 'prefix' => ''], function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('user.dashboard');

    // Onboarding routes (登録情報の完成)
    Route::get('/onboarding/profile', [UserProfileController::class, 'create'])->name('user.onboarding.profile');
    Route::post('/onboarding/profile', [UserProfileController::class, 'store'])->name('user.onboarding.profile.store');
    Route::get('/onboarding/company', [CompanyController::class, 'create'])->name('user.onboarding.company');
    Route::post('/onboarding/company', [CompanyController::class, 'store'])->name('user.onboarding.company.store');
    Route::get('/onboarding/address', [AddressController::class, 'create'])->name('user.onboarding.address');
    Route::post('/onboarding/address', [AddressController::class, 'store'])->name('user.onboarding.address.store');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('user.profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('user.profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('user.profile.destroy');

    // プロジェクト（クライアント向け）
    Route::get('/my/projects', [UserProjectController::class, 'index'])->name('user.projects.index');
    Route::get('/my/projects/{id}', [UserProjectController::class, 'show'])->name('user.projects.show');

    // 契約（クライアント向け）
    Route::get('/contracts', [ContractController::class, 'index'])->name('user.contract.index');
    Route::get('/contracts/{id}', [ContractController::class, 'show'])->name('user.contract.show');

    // 請求書（クライアント向け）
    Route::get('/my/invoices', [UserInvoiceController::class, 'index'])->name('user.invoices.index');
    Route::get('/my/invoices/{id}', [UserInvoiceController::class, 'show'])->name('user.invoices.show');
    Route::get('/reservation-settings', function () {
        return Inertia::render('User/ReservationSettings');
    })->name('user.reservation.settings');
    Route::post('/reservation-settings', function () {
        return redirect()->back()->with('success', '予約設定を保存しました。');
    })->name('user.reservation.settings.store');
});

// Public routes
Route::group(['prefix' => '', 'name' => 'public.'], function () {
    Route::get('/', function () {
        return inertiaPublic('Home', [
            'canLogin' => Route::has('user.login'),
            'canRegister' => Route::has('user.register'),
        ]);
    })->name('home');
    Route::get('/about', fn() => inertiaPublic('About'))->name('about');
    Route::get('/service', fn() => inertiaPublic('Service'))->name('service');
    Route::get('/services/{slug}', fn($slug) => inertiaPublic('ServiceDetail', ['slug' => $slug]))->name('service.detail');
    Route::get('/blog', fn() => inertiaPublic('Blog'))->name('blog');
    Route::get('/blog/{slug}', fn($slug) => inertiaPublic('BlogDetail', ['slug' => $slug]))->name('blog.detail');
    Route::get('/faq', fn() => inertiaPublic('Faq'))->name('faq');
    Route::get('/flow', fn() => inertiaPublic('Flow'))->name('flow');
    Route::get('/company', fn() => inertiaPublic('Company'))->name('company');
    Route::get('/contact', fn() => inertiaPublic('Contact'))->name('contact');
    Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
    Route::get('/privacy-policy', fn() => inertiaPublic('PrivacyPolicy'))->name('privacy.policy');
    Route::get('/estimate-simulator', [EstimateSimulatorController::class, 'index'])->name('estimate.simulator');
    Route::post('/estimate-simulator/save', [EstimateSimulatorController::class, 'save'])->middleware('auth:users')->name('estimate.simulator.save');
    Route::get('/plans', fn() => inertiaPublic('Plans'))->name('plans');
    Route::get('/careers', fn() => inertiaPublic('Careers'))->name('careers');
    Route::get('/terms', fn() => inertiaPublic('Terms'))->name('terms');

    // Quote Response (public, no auth required) - Display & Submit
    Route::get('/quote-response/{token}', [QuoteResponseController::class, 'show'])->name('quote.response.show');
    Route::post('/quote-response/{token}', [QuoteResponseController::class, 'store'])->name('quote.response.store');

    // Onboarding (public, no auth required)
    Route::get('/onboarding/{token}', [OnboardingController::class, 'show'])->name('onboarding.show');
    Route::post('/onboarding/{token}', [OnboardingController::class, 'store'])->name('onboarding.store');
});

// More public routes
Route::name('public.')->prefix('/')->group(function () {
    Route::get('/lp', fn() => inertiaPublic('LandingPage'))->name('landing.page');
    Route::get('/lp-minimal', fn() => inertiaPublic('LandingPageMinimal'))->name('landing.minimal');
    Route::get('/lp-creative', fn() => inertiaPublic('LandingPageCreative'))->name('landing.creative');
    Route::get('/reservation', fn() => inertiaPublic('Reservation'))->name('reservation');
    Route::post('/reservation', fn() => redirect()->back()->with('success', '予約を受け付けました。確認メールをお送りしました。'))->name('reservation.store');
});

// User Registration via Invitation Token (no auth required, token-based access)
Route::group(['prefix' => '', 'name' => 'user.'], function () {
    Route::get('/quote-response/{token}/register', [QuoteResponseController::class, 'registerShow'])->name('quote.response.register');
    Route::post('/quote-response/{token}/register', [QuoteResponseController::class, 'registerStore'])->name('quote.response.register.store');
});

// Auth routes
require __DIR__ . '/auth.php';
