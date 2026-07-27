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
   * 自分自身が紐づく見積、または自分が所属する会社に紐づく見積であればアクセス許可。
   * （見積作成時に管理者が会社のみを選択し、user_idが別の会社担当者になっているケースがあるため）
   */
  private function canAccess(Quote $quote): bool
  {
    $user = Auth::user();

    if ($quote->user_id === $user->id) {
      return true;
    }

    if ($quote->company_id && $user->companies()->where('companies.id', $quote->company_id)->exists()) {
      return true;
    }

    return false;
  }

  /**
   * Display a listing of quotes for the authenticated user.
   */
  public function index(Request $request): InertiaResponse
  {
    $user = Auth::user();
    $companyIds = $user->companies()->pluck('companies.id');

    $quotes = Quote::where(function ($query) use ($user, $companyIds) {
        $query->where('user_id', $user->id)
          ->orWhereIn('company_id', $companyIds);
      })
      ->with(['currentVersion.items', 'contact'])
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
    if (!$this->canAccess($quote)) {
      abort(403, 'アクセス権限がありません。');
    }

    $quote->load('currentVersion.items', 'contact');

    return Inertia::render('User/Quote/Show', [
      'quote' => $quote,
    ]);
  }

  /**
   * 見積PDFを生成
   */
  private function buildPdf(Quote $quote)
  {
    $quote->load('currentVersion.items', 'contact');

    $pdf = Pdf::loadView('user.quote.pdf', [
      'quote' => $quote,
    ])
      ->setPaper('a4')
      ->setOption('isPhpEnabled', true)
      ->setOption('isHtml5ParserEnabled', true);
    \App\Support\PdfFontRegistrar::registerDomPdf($pdf);

    return $pdf;
  }

  /**
   * Generate and download PDF of a quote.
   */
  public function pdf(Quote $quote)
  {
    if (!$this->canAccess($quote)) {
      abort(403, 'アクセス権限がありません。');
    }

    return $this->buildPdf($quote)->download("quote_{$quote->quote_number}.pdf");
  }

  /**
   * 見積PDFをプレビュー表示（ブラウザ内で確認してからダウンロードできる）
   */
  public function pdfPreview(Quote $quote)
  {
    if (!$this->canAccess($quote)) {
      abort(403, 'アクセス権限がありません。');
    }

    return $this->buildPdf($quote)->stream("quote_{$quote->quote_number}.pdf");
  }

  /**
   * Accept a quote.
   */
  public function accept(Quote $quote)
  {
    if (!$this->canAccess($quote)) {
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
    if (!$this->canAccess($quote)) {
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
