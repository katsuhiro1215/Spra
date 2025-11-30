<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
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
    Route::get('/privacy-policy', fn() => inertiaPublic('PrivacyPolicy'))->name('privacy.policy');
    Route::get('/estimate-simulator', fn() => inertiaPublic('EstimateSimulator'))->name('estimate.simulator');
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
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/reservation-settings', function () {
        return Inertia::render('User/ReservationSettings');
    })->name('reservation.settings');
    Route::post('/reservation-settings', function () {
        return redirect()->back()->with('success', '予約設定を保存しました。');
    })->name('reservation.settings.store');
});

require __DIR__ . '/auth.php';
