<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Receipt;
use App\Services\ReceiptService;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ReceiptController extends Controller
{
    public function __construct(
        private ReceiptService $service
    ) {}

    /**
     * 自分の領収書一覧
     */
    public function index(Request $request): Response
    {
        $userId = auth('users')->id();

        $receipts = Receipt::forClient($userId)
            ->issued()
            ->with('invoice')
            ->orderBy('issued_at', 'desc')
            ->paginate(15);

        return Inertia::render('User/Receipts/Index', [
            'receipts' => $receipts,
        ]);
    }

    /**
     * 領収書詳細
     */
    public function show(Receipt $receipt): Response
    {
        $userId = auth('users')->id();
        abort_unless($receipt->user_id === $userId, 403);
        abort_unless(in_array($receipt->status, ['issued', 'sent']), 404);

        $receipt->load(['invoice', 'company']);

        return Inertia::render('User/Receipts/Show', [
            'receipt' => $receipt,
        ]);
    }

    /**
     * 領収書PDFをダウンロード
     */
    public function download(Receipt $receipt): HttpResponse
    {
        $userId = auth('users')->id();
        abort_unless($receipt->user_id === $userId, 403);
        abort_unless(in_array($receipt->status, ['issued', 'sent']), 404);

        if (!$receipt->pdf_path) {
            $this->service->generateAndSavePdf($receipt);
            $receipt->refresh();
        }

        $pdf = Storage::disk('private')->get($receipt->pdf_path);

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"{$receipt->receipt_number}.pdf\"",
        ]);
    }

    /**
     * 領収書PDFをプレビュー表示（ブラウザ内で確認してからダウンロードできる）
     */
    public function previewPdf(Receipt $receipt): HttpResponse
    {
        $userId = auth('users')->id();
        abort_unless($receipt->user_id === $userId, 403);
        abort_unless(in_array($receipt->status, ['issued', 'sent']), 404);

        if (!$receipt->pdf_path) {
            $this->service->generateAndSavePdf($receipt);
            $receipt->refresh();
        }

        $pdf = Storage::disk('private')->get($receipt->pdf_path);

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "inline; filename=\"{$receipt->receipt_number}.pdf\"",
        ]);
    }

    /**
     * 選択した複数の領収書をまとめた1つのPDFをプレビュー表示
     */
    public function bulkPreview(Request $request): HttpResponse
    {
        return $this->bulkPdfResponse($request, 'inline');
    }

    /**
     * 選択した複数の領収書をまとめた1つのPDFをダウンロード
     */
    public function bulkDownload(Request $request): HttpResponse
    {
        return $this->bulkPdfResponse($request, 'attachment');
    }

    private function bulkPdfResponse(Request $request, string $disposition): HttpResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'string',
        ]);

        $userId = auth('users')->id();

        $receipts = Receipt::forClient($userId)
            ->issued()
            ->whereIn('id', $validated['ids'])
            ->orderBy('issued_at')
            ->get();

        abort_if($receipts->isEmpty(), 404);

        $pdfContent = $this->service->generateBulkPdfContent($receipts);
        $filename = 'receipts_bulk_' . now()->format('YmdHis') . '.pdf';

        return response($pdfContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "{$disposition}; filename=\"{$filename}\"",
        ]);
    }
}
