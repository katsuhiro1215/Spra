<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\ContractMailJob;
use Illuminate\Support\Facades\Bus;
use App\Models\Project;
use App\Models\User;
use App\Models\Company;
use App\Services\ContractService;
use App\Services\ContractPdfService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Storage;
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
        $filters = $request->only(['search', 'status', 'type', 'user_id', 'company_id']);

        $contracts = $this->service->getPaginated($filters, 20);
        $stats = $this->service->getStats();

        return Inertia::render('Admin/Contracts/Index', [
            'contracts' => $contracts,
            'filters'   => $filters,
            'stats'     => $stats,
            'statuses'  => \App\Models\Contract::STATUSES,
        ]);
    }

    public function show(string $id): Response
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        return Inertia::render('Admin/Contracts/Show', [
            'contract' => $contract,
        ]);
    }

    public function create(Request $request): Response
    {
        $quote = null;
        $quoteResponse = null;
        $requirementStatus = null;
        $fromQuoteResponse = false;

        // QuoteResponse から遷移した場合（推奨ルート）
        if ($request->has('quote_response_id')) {
            $quoteResponse = \App\Models\QuoteResponse::with([
                'user.profile',
                'user.companies',
                'user.companies.addresses',
                'company.addresses',
                'quote',
            ])->find($request->input('quote_response_id'));

            if ($quoteResponse) {
                // Quote を明示的に読み込む（items を eager load）
                $quote = \App\Models\Quote::with([
                    'user.profile',
                    'company.addresses',
                    'items',
                ])->find($quoteResponse->quote_id);

                $fromQuoteResponse = true;

                // 一時的にドラフト Contract を作成して必要情報をチェック
                if ($quoteResponse->user_id && $quoteResponse->company_id) {
                    $tempContract = new \App\Models\Contract();
                    $tempContract->user_id = $quoteResponse->user_id;
                    $tempContract->company_id = $quoteResponse->company_id;
                    $tempContract->quote_id = $quote->id;

                    $requirementStatus = $tempContract->getRequirementStatus();
                }
            }
        }
        // Quote から遷移した場合（代替ルート）
        elseif ($request->has('quote_id')) {
            $quote = \App\Models\Quote::with([
                'user.profile',
                'user.companies',
                'contact',
                'company.addresses',
                'items',
            ])->find($request->input('quote_id'));

            // Quote から一時的にドラフト Contract を作成して必要情報をチェック
            if ($quote) {
                $tempContract = new \App\Models\Contract();
                $tempContract->user_id = $quote->user_id;
                $tempContract->company_id = $quote->company_id;
                $tempContract->quote_id = $quote->id;

                $requirementStatus = $tempContract->getRequirementStatus();
            }
        }

        return Inertia::render('Admin/Contracts/Create', [
            'projects'  => Project::orderBy('title')->get(['id', 'title', 'project_code']),
            'users'     => User::with('profile')->orderBy('email')->get(['id', 'email']),
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'services'  => \App\Models\Service::orderBy('name')->get(['id', 'name']),
            'quotes'    => \App\Models\Quote::whereIn('status', ['draft', 'sent', 'reviewed', 'approved'])->orderBy('created_at', 'desc')->with('items')->get(['id', 'quote_number', 'title', 'status']),
            'quote'     => $quote,
            'quoteResponse' => $quoteResponse,
            'fromQuoteResponse' => $fromQuoteResponse,
            'requirementStatus' => $requirementStatus,
            'statuses'  => \App\Models\Contract::STATUSES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'project_id'        => 'nullable|ulid|exists:projects,id',
            'user_id'           => 'required|uuid|exists:users,id',
            'company_id'        => 'nullable|ulid|exists:companies,id',
            'service_id'        => 'nullable|ulid|exists:services,id',
            'title'             => 'required|string|max:255',
            'type'              => 'required|string|in:one_time,monthly,annual',
            'status'            => 'required|string|in:draft,sent,pending_signature,active,suspended,completed,cancelled',
            'description'       => 'nullable|string',
            'amount'            => 'required|numeric|min:0',
            'tax_rate'          => 'required|numeric|min:0|max:100',
            'start_date'        => 'required|date',
            'end_date'          => 'nullable|date|after_or_equal:start_date',
            'auto_renewal'      => 'boolean',
            'renewal_notice_days' => 'nullable|integer|min:1',
            'payment_terms'     => 'nullable|string',
            'terms_and_conditions' => 'nullable|string',
            'notes'             => 'nullable|string',
            'quote_id'          => 'nullable|ulid|exists:quotes,id',
            'quote_response_id' => 'nullable|ulid|exists:quote_responses,id',
        ]);

        // ドラフト以外のステータスの場合、必要情報をチェック
        if ($validated['status'] !== 'draft') {
            $tempContract = new \App\Models\Contract();
            $tempContract->user_id = $validated['user_id'] ?? null;
            $tempContract->company_id = $validated['company_id'] ?? null;
            $tempContract->quote_id = $validated['quote_id'] ?? null;

            $missingRequirements = $tempContract->getMissingRequirements();

            if (!empty($missingRequirements)) {
                return redirect()->back()
                    ->withInput()
                    ->withErrors([
                        'requirements' => '契約書を送信するには以下の情報が必要です: ' . implode(', ', $missingRequirements),
                    ]);
            }
        }

        $contract = $this->service->create($validated);

        return redirect()->route('admin.contract.show', $contract->id)
            ->with('success', '契約を作成しました。');
    }

    public function edit(string $id): Response
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        // Contract に紐付いた Quote を取得
        $quote = null;
        if ($contract->quote_id) {
            $quote = \App\Models\Quote::with(['items'])->find($contract->quote_id);
        }

        return Inertia::render('Admin/Contracts/Edit', [
            'contract'  => $contract,
            'quote'     => $quote,
            'projects'  => Project::orderBy('title')->get(['id', 'title', 'project_code']),
            'users'     => User::with('profile')->orderBy('email')->get(['id', 'email']),
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'services'  => \App\Models\Service::orderBy('name')->get(['id', 'name']),
            'quotes'    => \App\Models\Quote::whereIn('status', ['draft', 'sent', 'reviewed', 'approved'])->orderBy('created_at', 'desc')->with('items')->get(['id', 'quote_number', 'title', 'status']),
            'statuses'  => \App\Models\Contract::STATUSES,
        ]);
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        $validated = $request->validate([
            'project_id'    => 'nullable|ulid|exists:projects,id',
            'user_id'       => 'nullable|uuid|exists:users,id',
            'company_id'    => 'nullable|ulid|exists:companies,id',
            'service_id'    => 'required|ulid|exists:services,id',
            'title'         => 'required|string|max:255',
            'type'          => 'required|string|in:one_time,monthly,annual',
            'status'        => 'required|string|in:draft,sent,active,suspended,completed,cancelled',
            'amount'        => 'required|numeric|min:0',
            'tax_rate'      => 'required|numeric|min:0|max:100',
            'deposit_rate'  => 'nullable|integer|min:0|max:100',
            'start_date'    => 'nullable|date',
            'end_date'      => 'nullable|date|after_or_equal:start_date',
            'auto_renewal'  => 'boolean',
            'payment_terms' => 'nullable|string',
            'notes'         => 'nullable|string',
        ]);

        $this->service->update($contract, $validated);

        return redirect()->route('admin.contract.show', $contract->id)
            ->with('success', '契約を更新しました。');
    }

    public function activate(Request $request, string $id): RedirectResponse
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        $validated = $request->validate([
            'signed_at' => 'nullable|date',
        ]);

        try {
            $this->service->activate($contract, $validated);
            return back()->with('success', '契約を有効化しました。');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function cancel(Request $request, string $id): RedirectResponse
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        $validated = $request->validate([
            'cancellation_reason' => 'nullable|string|max:1000',
        ]);

        $this->service->cancel($contract, $validated['cancellation_reason'] ?? '');

        return back()->with('success', '契約をキャンセルしました。');
    }

    /**
     * 契約を承認（署名完了状態から承認状態に遷移）
     */
    public function approve(string $id): RedirectResponse
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        // signature_status が fully_signed である必要がある
        if ($contract->signature_status !== 'fully_signed') {
            return back()->with('error', '署名が完了していない契約は承認できません。');
        }

        // status を active に更新
        $contract->update([
            'status' => 'active',
        ]);

        // Invoice自動生成をディスパッチ
        \App\Jobs\GenerateInvoiceJob::dispatch($contract);

        return back()->with('success', '契約を承認し、有効化しました。請求書を自動生成しています。');
    }

    /**
     * 署名リマインダーメール送信
     */
    public function sendReminder(string $id): RedirectResponse
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        // signature_status が pending である必要がある
        if ($contract->signature_status !== 'pending') {
            return back()->with('error', 'このステータスではリマインダーを送信できません。');
        }

        if (!$contract->user || !$contract->user->email) {
            return back()->with('error', 'ユーザーメールアドレスが登録されていません。');
        }

        // リマインダーメール送信ジョブをディスパッチ
        \App\Jobs\NotifyUserToSignContractJob::dispatch($contract);

        return back()->with('success', 'リマインダーメールを送信しました。');
    }

    public function uploadDocument(Request $request, string $id): RedirectResponse
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        $request->validate([
            'file'  => 'required|file|mimes:pdf,doc,docx|max:20480',
            'title' => 'required|string|max:255',
        ]);

        $path = $request->file('file')->store('contracts/documents', 'private');

        $contract->documents()->create([
            'title'     => $request->title,
            'file_path' => $path,
            'file_name' => $request->file('file')->getClientOriginalName(),
            'file_size' => $request->file('file')->getSize(),
            'mime_type' => $request->file('file')->getMimeType(),
        ]);

        return back()->with('success', '書類をアップロードしました。');
    }

    /**
     * 請求設定を更新
     */
    public function updateBillingSettings(Request $request, string $id): RedirectResponse
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        // 月額契約のみ請求設定を更新可能
        if ($contract->type !== 'monthly') {
            return back()->with('error', '月額契約のみ請求設定を更新できます。');
        }

        $validated = $request->validate([
            'billing_day' => 'required|integer|min:1|max:31',
            'payment_due_days' => 'required|integer|min:1|max:90',
            'auto_invoice_generation' => 'required|boolean',
        ]);

        // 次回請求日を計算
        if ($validated['auto_invoice_generation']) {
            $validated['next_billing_date'] = $contract->calculateNextBillingDate();
        } else {
            $validated['next_billing_date'] = null;
        }

        $contract->update($validated);

        return back()->with('success', '請求設定を更新しました。');
    }

    /**
     * 契約書をクライアントにメール送信
     */
    public function send(Request $request, string $id): RedirectResponse
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        // 送信要件チェック
        if (!$contract->canSend()) {
            $missing = $contract->getMissingRequirements();
            $missingLabels = array_map(fn($item) => $item['description'], $missing);

            return back()->with('error', '契約書を送信できません。以下が必要です: ' . implode(', ', $missingLabels));
        }

        // 送信メールアドレス
        $recipientEmail = $contract->user?->email;
        if (!$recipientEmail) {
            return back()->with('error', 'クライアントのメールアドレスが登録されていません。');
        }

        // キュージョブをディスパッチ
        Bus::dispatch(
            new ContractMailJob(
                $contract,
                $recipientEmail,
                auth('admins')->id()
            )
        );

        // ステータスを pending_signature に更新
        $contract->update(['status' => 'pending_signature']);

        // 初期履歴を記録（pending状態）
        $contract->histories()->create([
            'action' => 'sent',
            'recipient_email' => $recipientEmail,
            'subject' => "契約書をお送りします - {$contract->title}",
            'message' => 'メール送信がキューイングされました',
            'status' => 'pending',
            'created_by' => auth('admins')->id(),
        ]);

        return back()->with('success', 'クライアントにメールを送信しました。');
    }

    /**
     * 契約書をPDFで生成・ダウンロード
     */
    public function generatePdf(string $id): HttpResponse
    {
        $contract = $this->service->findById($id);
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
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        $pdf = $this->pdfService->generate($contract);

        return response($pdf->Output('', 'S'), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline',
        ]);
    }
}
