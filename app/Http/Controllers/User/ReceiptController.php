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
}
