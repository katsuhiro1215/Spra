<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\EstimateSimulatorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\ProjectController as UserProjectController;
use App\Http\Controllers\User\ContractController as UserContractController;
use App\Http\Controllers\User\InvoiceController as UserInvoiceController;
use Inertia\Inertia;

// Public routes
Route::name('public.')->prefix('/')->group(function () {
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
    Route::get('/lp', fn() => inertiaPublic('LandingPage'))->name('landing.page');
    Route::get('/lp-minimal', fn() => inertiaPublic('LandingPageMinimal'))->name('landing.minimal');
    Route::get('/lp-creative', fn() => inertiaPublic('LandingPageCreative'))->name('landing.creative');
    Route::get('/reservation', fn() => inertiaPublic('Reservation'))->name('reservation');
    Route::post('/reservation', fn() => redirect()->back()->with('success', '予約を受け付けました。確認メールをお送りしました。'))->name('reservation.store');
});

if (!function_exists('inertiaPublic')) {
    function inertiaPublic($component, $data = [])
    {
        return Inertia::render("Public/{$component}", $data);
    }
}

// User routes
Route::middleware(['auth:users', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // プロジェクト（クライアント向け）
    Route::get('/my/projects', [UserProjectController::class, 'index'])->name('projects.index');
    Route::get('/my/projects/{id}', [UserProjectController::class, 'show'])->name('projects.show');

    // 契約（クライアント向け）
    Route::get('/my/contracts', [UserContractController::class, 'index'])->name('contracts.index');
    Route::get('/my/contracts/{id}', [UserContractController::class, 'show'])->name('contracts.show');

    // 請求書（クライアント向け）
    Route::get('/my/invoices', [UserInvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/my/invoices/{id}', [UserInvoiceController::class, 'show'])->name('invoices.show');
    Route::get('/reservation-settings', function () {
        return Inertia::render('User/ReservationSettings');
    })->name('reservation.settings');
    Route::post('/reservation-settings', function () {
        return redirect()->back()->with('success', '予約設定を保存しました。');
    })->name('reservation.settings.store');
});

require __DIR__ . '/auth.php';
