<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\ContractService;
use App\Services\ContractPdfService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ContractController extends Controller
{
    public function __construct(
        private ContractService $service,
        private ContractPdfService $pdfService
    ) {}

    public function index(Request $request): Response
    {
        $userId = auth('users')->id();
        $filters = $request->only(['status']);

        $contracts = $this->service->getPaginatedForClient($userId, $filters, 15);

        return Inertia::render('User/Contracts/Index', [
            'contracts' => $contracts,
            'filters'   => $filters,
        ]);
    }

    public function show(string $id): Response
    {
        $userId = auth('users')->id();

        $contract = $this->service->findByIdForClient($id, $userId);
        abort_unless($contract, 404);

        // 関連データを取得
        $quote = null;
        if ($contract->quote_id) {
            $quote = \App\Models\Quote::find($contract->quote_id);
        }

        $invoices = $contract->invoices()->orderBy('issue_date', 'desc')->get();

        // TODO: Receipt機能の実装後に接続する（Invoice経由で発行される想定）
        $receipts = [];

        return Inertia::render('User/Contracts/Show', [
            'contract' => $contract,
            'quote' => $quote,
            'invoices' => $invoices,
            'receipts' => $receipts,
        ]);
    }

    /**
     * クライアント署名を処理
     */
    public function sign(Request $request, string $id): RedirectResponse
    {
        $userId = auth('users')->id();
        $contract = $this->service->findByIdForClient($id, $userId);
        abort_unless($contract, 404);

        // 署名画像を保存
        $request->validate([
            'signature' => 'required|string',
        ]);

        // 既に署名済み、または署名待ち状態でない場合は多重署名を防ぐ
        if (!$contract->isAwaitingUserSignature()) {
            return redirect()
                ->back()
                ->with('error', 'この契約書は現在署名できる状態ではありません。');
        }

        try {
            // Base64 署名画像を処理
            $signatureData = $request->input('signature');
            if (!preg_match('/^data:image\/(\w+);base64,/', $signatureData, $type)) {
                throw new \Exception('Invalid signature format');
            }

            $type = strtolower($type[1]);
            if (!in_array($type, ['jpeg', 'jpg', 'gif', 'png'])) {
                throw new \Exception('Invalid image type');
            }

            DB::transaction(function () use ($id, $userId, $signatureData, $request) {
                // contract_signatures テーブルに保存
                $signature = \App\Models\ContractSignature::create([
                    'contract_id' => $id,
                    'signed_by_user' => $userId,
                    'signature_image' => $signatureData, // Base64 データをそのまま保存
                    'signature_type' => 'user',
                    'method' => 'typed', // DigitalStamp コンポーネントで入力された方式
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'status' => 'pending',
                ]);

                // 署名を確定（管理者署名が不要な契約は内部で fully_signed になる）
                $signature->markAsSigned();
            });

            return redirect()
                ->route('user.contract.show', $id)
                ->with('success', '署名が完了しました。管理者が確認後、契約が有効化されます。');
        } catch (\Exception $e) {
            Log::error('契約書署名エラー', [
                'contract_id' => $id,
                'user_id' => $userId,
                'error' => $e->getMessage(),
            ]);

            return redirect()
                ->back()
                ->with('error', '署名の保存に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * 契約書をPDFで生成・ダウンロード
     */
    public function generatePdf(string $id): HttpResponse
    {
        $userId = auth('users')->id();
        $contract = $this->service->findByIdForClient($id, $userId);
        abort_unless($contract, 404);

        $pdf = $this->pdfService->generate($contract);
        $fileName = $this->pdfService->getFileName($contract);

        return response($pdf->Output($fileName, 'S'), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }

    /**
     * 契約書PDFをプレビュー用に取得
     */
    public function previewPdf(string $id): HttpResponse
    {
        $userId = auth('users')->id();
        $contract = $this->service->findByIdForClient($id, $userId);
        abort_unless($contract, 404);

        $pdf = $this->pdfService->generate($contract);

        return response($pdf->Output('', 'S'), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline',
        ]);
    }
}
