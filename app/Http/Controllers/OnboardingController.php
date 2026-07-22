<?php

namespace App\Http\Controllers;

use App\Models\QuoteResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingController extends Controller
{
  /**
   * Show the onboarding form
   */
  public function show(string $token)
  {
    $quoteResponse = QuoteResponse::with('quote.currentVersion')
      ->where('token', $token)
      ->where('responded_at', '!=', null)
      ->firstOrFail();

    // 既に User/Company が作成されていないかチェック
    if ($quoteResponse->user_id) {
      return redirect('/')->with('info', 'このトークンは既に使用されています。');
    }

    return Inertia::render('OnboardingForm', [
      'token' => $token,
      'quoteResponse' => [
        'email' => $quoteResponse->email,
        'quote' => [
          'title' => $quoteResponse->quote->title,
          'total_amount' => $quoteResponse->quote->currentVersion?->total_amount ?? 0,
        ],
      ],
    ]);
  }

  /**
   * Store the onboarding data
   */
  public function store(string $token, Request $request)
  {
    $quoteResponse = QuoteResponse::where('token', $token)
      ->where('responded_at', '!=', null)
      ->firstOrFail();

    // 既に User/Company が作成されていないかチェック
    if ($quoteResponse->user_id) {
      return redirect('/')->with('error', 'このトークンは既に使用されています。');
    }

    // バリデーション
    $validated = $request->validate([
      'first_name' => 'required|string|max:255',
      'last_name' => 'required|string|max:255',
      'email' => 'required|email|unique:users,email',
      'password' => 'required|string|min:8|confirmed',
      'company_name' => 'required|string|max:255',
      'company_type' => 'nullable|in:individual,corporate',
      'company_phone' => 'required|string|max:20',
      'legal_name' => 'nullable|string|max:255',
      'representative_name' => 'nullable|string|max:255',
      'representative_email' => 'nullable|email',
      'representative_phone' => 'nullable|string|max:20',
    ]);

    try {
      // User と Company を作成
      [$user, $company] = $quoteResponse->createUserAndCompany($validated);

      return Inertia::render('OnboardingSuccess', [
        'user' => [
          'email' => $user->email,
        ],
        'company' => [
          'name' => $company->name,
        ],
      ]);
    } catch (\Exception $e) {
      return back()->with('error', 'ユーザー登録中にエラーが発生しました。');
    }
  }
}
