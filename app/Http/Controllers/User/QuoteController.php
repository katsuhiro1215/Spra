<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class QuoteController extends Controller
{
  /**
   * Display a listing of quotes for the authenticated user.
   */
  public function index(Request $request): InertiaResponse
  {
    $user = Auth::user();

    $quotes = Quote::where('user_id', $user->id)
      ->with(['items', 'contact'])
      ->orderBy('created_at', 'desc')
      ->paginate($request->input('per_page', 20));

    return Inertia::render('User/Quote/Index', [
      'quotes' => $quotes,
    ]);
  }

  /**
   * Display a specific quote for the authenticated user.
   */
  public function show(Quote $quote): InertiaResponse
  {
    // 自分の見積書のみアクセス許可
    if ($quote->user_id !== Auth::id()) {
      abort(403, 'アクセス権限がありません。');
    }

    $quote->load('items', 'contact');

    return Inertia::render('User/Quote/Show', [
      'quote' => $quote,
    ]);
  }

  /**
   * Generate and download PDF of a quote.
   */
  public function pdf(Quote $quote)
  {
    // 自分の見積書のみ生成許可
    if ($quote->user_id !== Auth::id()) {
      abort(403, 'アクセス権限がありません。');
    }

    $quote->load('items', 'contact');

    // PDFの生成（簡易版）
    $pdf = Pdf::loadView('user.quote.pdf', [
      'quote' => $quote,
    ])
      ->setPaper('a4')
      ->setOption('isPhpEnabled', true)
      ->setOption('isHtml5ParserEnabled', true);

    return $pdf->download("quote_{$quote->quote_number}.pdf");
  }

  /**
   * Accept a quote.
   */
  public function accept(Quote $quote)
  {
    // 自分の見積書のみ受け入れ許可
    if ($quote->user_id !== Auth::id()) {
      abort(403, 'アクセス権限がありません。');
    }

    // ステータスが "draft" または "negotiating" の場合のみ受け入れ可能
    if (!in_array($quote->status, ['draft', 'negotiating'])) {
      return redirect()->back()->with(
        'error',
        'このステータスの見積書は承認できません。'
      );
    }

    $quote->update([
      'status' => 'approved',
    ]);

    return redirect()->back()->with(
      'success',
      '見積書を承認しました。'
    );
  }

  /**
   * Reject a quote.
   */
  public function reject(Quote $quote)
  {
    // 自分の見積書のみ却下許可
    if ($quote->user_id !== Auth::id()) {
      abort(403, 'アクセス権限がありません。');
    }

    // ステータスが "draft" または "negotiating" の場合のみ却下可能
    if (!in_array($quote->status, ['draft', 'negotiating'])) {
      return redirect()->back()->with(
        'error',
        'このステータスの見積書は却下できません。'
      );
    }

    $quote->update([
      'status' => 'rejected',
    ]);

    return redirect()->back()->with(
      'success',
      '見積書を却下しました。'
    );
  }
}
