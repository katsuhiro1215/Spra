<?php

namespace App\Http\Controllers\Admin\Contract;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContractRequest;
use App\Jobs\ContractMailJob;
use Illuminate\Support\Facades\Bus;
use App\Models\Project;
use App\Models\User;
use App\Models\Company;
use App\Models\Quote;
use App\Models\QuoteResponse;
use App\Models\Contract;
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

    public function show(Contract $contract): Response
    {
        $contract = $this->service->findById($contract->id);
        abort_unless($contract, 404);

        // quote・契約特典・署名を含めて読み込む(quoteの金額はcurrentVersionにあるため合わせて読み込む)
        // 請求書タブ・領収書タブで使うため、請求書に紐づく入金・領収書も合わせて読み込む
        // 契約履歴タブ用に、新しい順に並べ替えて操作者(Admin)情報も合わせて読み込む
        $contract->load([
            'quote.currentVersion',
            'benefits' => fn($q) => $q->orderBy('period_start'),
            'signatures' => fn($q) => $q->latest('signed_at'),
            'invoices' => fn($q) => $q->orderBy('issue_date', 'desc'),
            'invoices.payments' => fn($q) => $q->orderBy('payment_date', 'desc'),
            'invoices.receipt',
            'histories' => fn($q) => $q->orderBy('created_at', 'desc'),
            'histories.creator.profile',
        ]);

        return Inertia::render('Admin/Contracts/Show', [
            'contract' => $contract,
        ]);
    }

    public function create(Request $request): Response
    {
        $quote = null;
        $fromQuote = false;
        $fromQuoteResponse = false;
        $quoteResponse = null;

        // QuoteResponse から遷移した場合
        if ($request->has('quote_response_id')) {
            $quoteResponse = QuoteResponse::with([
                'quote.user.profile',
                'quote.user.companies.addresses',
                'quote.company.addresses',
                'quote.currentVersion.items.serviceItem',
                'user.profile',
                'user.companies.addresses',
            ])->find($request->input('quote_response_id'));

            if ($quoteResponse) {
                $quote = $quoteResponse->quote;
                $fromQuoteResponse = true;
            }
        }
        // Quote から直接遷移した場合
        elseif ($request->has('quote_id')) {
            $quote = Quote::with([
                'user.profile',
                'user.companies.addresses',
                'company.addresses',
                'currentVersion.items.serviceItem',
            ])->find($request->input('quote_id'));

            $fromQuote = true;
        }

        // 見積一覧を取得（承認済みのもの）
        $quotes = Quote::with(['user.profile', 'currentVersion'])
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($q) {
                return [
                    'id' => $q->id,
                    'quote_number' => $q->quote_number,
                    'title' => $q->title,
                    'status' => $q->status,
                    'user_name' => $q->user?->profile?->full_name ?? $q->user?->email ?? 'N/A',
                ];
            });

        // requirementStatus を計算
        $requirementStatus = null;
        if ($quote || $quoteResponse) {
            $errors = [];
            $can_send = true;

            // fromQuoteResponse の場合、quoteResponse->user を見る
            $user = $fromQuoteResponse ? $quoteResponse->user : $quote->user;

            // 1. ユーザー情報の確認
            if (!$user) {
                $errors[] = 'ユーザーが設定されていません';
                $can_send = false;
            }

            // 2. ユーザープロフィール情報の確認
            if (!$user?->profile || (!$user->profile?->phone && !$user->profile?->mobile)) {
                $errors[] = '連絡先情報が登録されていません';
                $can_send = false;
            }

            // 3. 会社情報の確認
            if ($fromQuoteResponse) {
                $company = $quoteResponse->company ?? $quoteResponse->user?->companies?->first();
            } else {
                $company = $quote->company ?? $quote->user?->companies?->first();
            }

            if (!$company) {
                $errors[] = '会社情報が設定されていません';
                $can_send = false;
            }

            // 4. 会社住所の確認
            if (!$company || !$company->addresses || count($company->addresses) === 0) {
                $errors[] = '会社の住所が登録されていません';
                $can_send = false;
            }

            $requirementStatus = [
                'can_send' => $can_send,
                'errors' => $errors,
            ];
        }

        return Inertia::render('Admin/Contracts/Create', [
            'users'     => User::with('profile')->where('status', 'active')->orderBy('email')->get(['id', 'email']),
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'quotes'    => $quotes,
            'quote'     => $quote,
            'fromQuote' => $fromQuote,
            'fromQuoteResponse' => $fromQuoteResponse,
            'quoteResponse' => $quoteResponse,
            'requirementStatus' => $requirementStatus,
            'statuses'  => Contract::STATUSES,
            'types'     => Contract::TYPES,
        ]);
    }

    public function store(ContractRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        try {
            // Contract + ContractVersion v1 のみ作成（items は別途追加）
            $contractData = [
                'quote_id' => $validated['quote_id'] ?? null,
                'user_id' => $validated['user_id'],
                'company_id' => $validated['company_id'] ?? null,
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'type' => $validated['type'] ?? 'one_time',
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'] ?? null,
                'billing_day' => $validated['billing_day'] ?? 10,
                'payment_due_days' => $validated['payment_due_days'] ?? 15,
                'auto_invoice_generation' => $validated['auto_invoice_generation'] ?? true,
                'auto_renewal' => $validated['auto_renewal'] ?? false,
                'renewal_notice_days' => $validated['renewal_notice_days'] ?? 30,
                'discount_amount' => $validated['discount_amount'] ?? 0,
                'tax_rate' => $validated['tax_rate'] ?? 10,
                'notes' => $validated['notes'] ?? null,
                'terms_and_conditions' => $validated['terms_and_conditions'] ?? null,
            ];

            // Contract作成（ContractVersion v1 も自動作成される）
            $contract = $this->service->createContract($contractData);

            return redirect()->route('admin.contract.show', $contract->id)
                ->with('success', '契約を作成しました。契約明細を追加してください。');
        } catch (\Exception $e) {
            return back()->with('error', '契約の作成に失敗しました: ' . $e->getMessage())->withInput();
        }
    }

    public function edit(string $id): Response
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        // Contract に紐付いた Quote を取得
        $quote = null;
        if ($contract->quote_id) {
            $quote = Quote::with(['currentVersion.items'])->find($contract->quote_id);
        }

        return Inertia::render('Admin/Contracts/Edit', [
            'contract'  => $contract,
            'quote'     => $quote,
            'users'     => User::with('profile')->where('status', 'active')->orderBy('email')->get(['id', 'email']),
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'statuses'  => Contract::STATUSES,
            'types'     => Contract::TYPES,
        ]);
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'start_date'    => 'nullable|date',
            'end_date'      => 'nullable|date|after_or_equal:start_date',
            'terms_and_conditions' => 'nullable|string',
            'special_provisions' => 'nullable|string',
            'notes'         => 'nullable|string',
            'discount_amount' => 'nullable|numeric|min:0',
            'tax_rate'      => 'nullable|numeric|min:0|max:100',
            'revision_reason' => 'nullable|string',
            'items'         => 'array',
            'items.*.service_id' => 'required|ulid|exists:services,id',
            'items.*.service_item_id' => 'required|ulid|exists:service_items,id',
            'items.*.name' => 'required|string|max:255',
            'items.*.description' => 'nullable|string',
            'items.*.item_type' => 'nullable|string',
            'items.*.billing_type' => 'required|in:one_time,monthly,quarterly,yearly',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.estimated_days' => 'nullable|integer|min:0',
            'items.*.sort_order' => 'nullable|integer',
        ]);

        try {
            $this->service->updateContract($contract, $validated);

            return redirect()->route('admin.contract.show', $contract->id)
                ->with('success', '契約を更新しました。新しいバージョンが作成されました。');
        } catch (\Exception $e) {
            return back()->with('error', '契約の更新に失敗しました: ' . $e->getMessage());
        }
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
            'billing_user_id' => 'nullable|uuid|exists:users,id',
        ]);

        // フォームで選択解除（契約者と同じに戻す）した場合もbilling_user_idをnullで確実に更新する
        $validated['billing_user_id'] = $validated['billing_user_id'] ?? null;

        // 送付先ユーザーを指定する場合、契約に紐づく会社に所属しているユーザーである必要がある
        if (!empty($validated['billing_user_id']) && $contract->company_id) {
            $belongsToCompany = \App\Models\CompanyUser::query()
                ->where('company_id', $contract->company_id)
                ->where('user_id', $validated['billing_user_id'])
                ->exists();

            if (!$belongsToCompany) {
                return back()
                    ->with('error', '送付先ユーザーはこの契約の会社に所属しているユーザーから選択してください。')
                    ->withInput();
            }
        }

        // 次回請求日を計算(calculateNextBillingDateはbilling_dayを参照するため、
        // 先にメモリ上の値を新しいbilling_dayへ更新してから計算する)
        $contract->billing_day = $validated['billing_day'];
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

        // 4ページの完全なPDFを生成
        $pdf = $this->pdfService->generateFullContract($contract);
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

        // 4ページの完全なPDFを生成
        $pdf = $this->pdfService->generateFullContract($contract);

        return response($pdf->Output('', 'S'), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline',
        ]);
    }

    /**
     * 契約条項編集ページ
     */
    public function editTerms(string $id): Response
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        $templates = \App\Models\ContractTemplate::active()->ordered()->get();

        return Inertia::render('Admin/Contracts/EditTerms', [
            'contract' => $contract,
            'templates' => $templates,
        ]);
    }

    /**
     * 契約条項を更新（Version1は何度でも保存可能、バージョン番号は増えない）
     */
    public function updateTerms(Request $request, string $id): RedirectResponse
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        $validated = $request->validate([
            'terms_and_conditions' => 'required|string',
            'special_provisions' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        try {
            $currentVersion = $contract->currentVersion;
            if (!$currentVersion) {
                return back()->with('error', '現在のバージョンが見つかりません。');
            }

            // ドラフト状態の場合のみ上書き保存可能
            if ($currentVersion->status !== 'draft') {
                return back()->with('error', 'ドラフト状態のバージョンのみ編集できます。');
            }

            $currentVersion->update([
                'terms_and_conditions' => $validated['terms_and_conditions'],
                'special_provisions' => $validated['special_provisions'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            return redirect()->route('admin.contract.show', $id)
                ->with('success', '契約条項を保存しました。');
        } catch (\Exception $e) {
            return back()->with('error', '契約条項の保存に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * 契約書プレビューページ
     */
    public function preview(string $id): Response
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        return Inertia::render('Admin/Contracts/Preview', [
            'contract' => $contract,
        ]);
    }

    /**
     * 契約削除
     */
    public function destroy(string $id): RedirectResponse
    {
        $contract = $this->service->findById($id);
        abort_unless($contract, 404);

        if ($contract->status !== 'draft') {
            return back()->with('error', '下書き状態の契約のみ削除できます。');
        }

        try {
            $contract->delete();
            return redirect()->route('admin.contract.index')
                ->with('success', '契約を削除しました。');
        } catch (\Exception $e) {
            return back()->with('error', '契約の削除に失敗しました: ' . $e->getMessage());
        }
    }
}
