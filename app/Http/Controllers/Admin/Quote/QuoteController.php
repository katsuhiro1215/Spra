<?php

namespace App\Http\Controllers\Admin\Quote;

use App\Http\Controllers\Controller;
use App\Http\Requests\QuoteRequest;
use App\Models\Quote;
use App\Models\User;
use App\Models\Contact;
use App\Models\Company;
use App\Models\Service;
use App\Models\ServicePlan;
use App\Services\QuoteService;
use App\Services\ServiceCategoryService;
use App\Services\ServiceItemService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class QuoteController extends Controller
{
    public function __construct(
        private QuoteService $quoteService,
        private ServiceCategoryService $serviceCategoryService,
        private ServiceItemService $serviceItemService
    ) {}

    /**
     * Display a listing of quotes.
     */
    public function index(Request $request): InertiaResponse
    {
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'user_id' => $request->input('user_id'),
            'company_id' => $request->input('company_id'),
            'trashed' => $request->input('trashed', 'without_trashed'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'created_at'),
            'direction' => $request->input('sort_direction', 'desc'),
        ];

        $quotes = $this->quoteService->getPaginated(
            $filters,
            $sort,
            $request->input('per_page', 20)
        );

        return Inertia::render('Admin/Quotes/Index', [
            'quotes' => $quotes,
            'filters' => $filters,
            'sort' => $sort,
            'stats' => $this->quoteService->getStats(),
            'statuses' => $this->quoteService->getStatuses(),
        ]);
    }

    /**
     * Show the form for creating a new quote.
     */
    public function create(Request $request): InertiaResponse
    {
        // ユーザー一覧を取得（検索用）
        $users = User::with('profile')
            ->select('id', 'email')
            ->where('status', 'active')
            ->orderBy('email')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->profile?->full_name ?? $user->email,
                ];
            });

        // Contactから見積もりを作成する場合
        $contact = null;
        if ($request->has('contact_id')) {
            $contact = Contact::with(['user.profile'])
                ->find($request->input('contact_id'));
        }

        // Userから見積もりを作成する場合
        $user = null;
        if ($request->has('user_id')) {
            $user = User::with(['profile', 'companies'])
                ->find($request->input('user_id'));
        }

        // Companyから見積もりを作成する場合
        $company = null;
        if ($request->has('company_id')) {
            $company = Company::with(['users.profile'])
                ->find($request->input('company_id'));
        }

        return Inertia::render('Admin/Quotes/Create', [
            'users' => $users,
            'contact' => $contact,
            'user' => $user,
            'company' => $company,
        ]);
    }

    /**
     * Store a newly created quote.
     */
    public function store(QuoteRequest $request)
    {
        $validated = $request->validated();

        // user_idとcontact_idのどちらか一方は必須
        if (empty($validated['user_id']) && empty($validated['contact_id'])) {
            return back()->withErrors([
                'user_id' => 'ユーザーまたはお問い合わせのいずれかを選択してください。',
                'contact_id' => 'ユーザーまたはお問い合わせのいずれかを選択してください。',
            ])->withInput();
        }

        try {
            // Quote + QuoteVersion v1 のみ作成（items は別途追加）
            $quoteData = [
                'user_id' => $validated['user_id'] ?? null,
                'contact_id' => $validated['contact_id'] ?? null,
                'company_id' => $validated['company_id'] ?? null,
                'title' => $validated['title'] ?? '無題の見積書',
                'requirements' => $validated['requirements'] ?? null,
                'status' => $validated['status'] ?? 'draft',
            ];

            // Quote作成（QuoteVersion v1 も自動作成される）
            $quote = $this->quoteService->createQuote($quoteData);


            return redirect()->route('admin.quote.show', $quote)
                ->with('success', '見積もりを作成しました。見積明細を追加してください。');
        } catch (\Exception $e) {
            return back()->with('error', '見積もりの作成に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified quote.
     */
    public function show(Quote $quote): InertiaResponse
    {
        $quote->load([
            'user.profile',
            'contact',
            'company',
            'currentVersion.items.serviceItem',
            'versions' => function ($query) {
                $query->orderBy('version', 'asc');
            },
            'creator.profile',
            'updater.profile',
        ]);

        return Inertia::render('Admin/Quotes/Show', [
            'quote' => $quote,
            'statuses' => $this->quoteService->getStatuses(),
        ]);
    }

    /**
     * Show the form for editing the specified quote.
     */
    public function edit(Quote $quote)
    {
        // 承認済みの見積もりは編集できない
        if ($quote->status === 'approved') {
            return redirect()->route('admin.quote.show', $quote)
                ->with('error', '承認済みの見積もりは編集できません。');
        }

        $quote->load(['currentVersion.items', 'user.profile', 'contact', 'company']);

        // サービスカテゴリ、Service、ServiceItemを取得
        $serviceCategories = $this->serviceCategoryService->getActiveForSelect();
        $services = \App\Models\Service::where('status', 'active')
            ->orderBy('name')
            ->select('id', 'name', 'service_category_id')
            ->get();
        $serviceItems = $this->serviceItemService->getActiveForQuote();

        // ServicePlansを取得（serviceItemsをeager loadする）
        $servicePlans = \App\Models\ServicePlan::where('status', 'active')
            ->with([
                'serviceItems' => function ($query) {
                    $query->select('service_items.id', 'service_items.name', 'service_items.standard_price', 'service_items.item_type')
                        ->orderBy('service_plan_items.sort_order');
                }
            ])
            ->select('id', 'name', 'service_id', 'description', 'base_price')
            ->orderBy('sort_order')
            ->get();

        // ユーザー一覧を取得
        $users = User::with('profile')
            ->select('id', 'email')
            ->where('status', 'active')
            ->orderBy('email')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->profile?->full_name ?? $user->email,
                ];
            });

        return Inertia::render('Admin/Quotes/Edit', [
            'quote' => $quote,
            'statuses' => $this->quoteService->getStatuses(),
            'serviceCategories' => $serviceCategories,
            'services' => $services,
            'serviceItems' => $serviceItems,
            'servicePlans' => $servicePlans,
            'users' => $users,
        ]);
    }

    /**
     * Update the specified quote.
     */
    public function update(Request $request, Quote $quote)
    {
        // 承認済みの見積もりは編集できない
        if ($quote->status === 'approved') {
            return back()->with('error', '承認済みの見積もりは編集できません。');
        }

        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'contact_id' => 'nullable|exists:contacts,id',
            'company_id' => 'nullable|exists:companies,id',
            'title' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'custom_specifications' => 'nullable|string',
            'discount_amount' => 'nullable|numeric|min:0',
            'campaign_id' => 'nullable|exists:campaigns,id',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'status' => 'required|in:draft,negotiating,approved,rejected,contracted,cancelled',
            'items' => 'array',
            'items.*.service_item_id' => 'nullable|exists:service_items,id',
            'items.*.name' => 'required|string|max:255',
            'items.*.description' => 'nullable|string',
            'items.*.item_type' => 'nullable|string',
            'items.*.billing_type' => 'required|in:one_time,monthly,quarterly,yearly',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.estimated_days' => 'nullable|integer|min:0',
            'items.*.sort_order' => 'nullable|integer',
        ]);

        // user_idとcontact_idのどちらか一方は必須
        if (empty($validated['user_id']) && empty($validated['contact_id'])) {
            return back()->withErrors([
                'user_id' => 'ユーザーまたはお問い合わせのいずれかを選択してください。',
                'contact_id' => 'ユーザーまたはお問い合わせのいずれかを選択してください。',
            ])->withInput();
        }

        try {
            $this->quoteService->updateQuote($quote, $validated);

            return redirect()->route('admin.quote.show', $quote)
                ->with('success', '見積もりを更新しました。');
        } catch (\Exception $e) {
            return back()->with('error', '見積もりの更新に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified quote.
     */
    public function destroy(Quote $quote)
    {
        try {
            $this->quoteService->deleteQuote($quote);

            return redirect()->route('admin.quote.index')
                ->with('success', '見積もりを削除しました。');
        } catch (\Exception $e) {
            return back()->with('error', '見積もりの削除に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Show quote preview before sending.
     */
    public function preview(Quote $quote): InertiaResponse
    {
        $quote->load([
            'user.profile',
            'contact',
            'company',
            'currentVersion.items.serviceItem',
        ]);

        return Inertia::render('Admin/Quotes/Preview', [
            'quote' => $quote,
            'statuses' => $this->quoteService->getStatuses(),
        ]);
    }

    /**
     * Send the quote to client.
     */
    public function send(Quote $quote)
    {
        try {
            // Generate token and response form URL in Controller (where route() is reliable)
            $token = Str::random(60);
            $responseFormUrl = route('quote.response.show', $token);

            $this->quoteService->sendQuote($quote, $token, $responseFormUrl);

            return redirect()->route('admin.quote.show', $quote)
                ->with('success', '見積もりを送信しました。');
        } catch (\Exception $e) {
            Log::error('Quote send error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', '見積もりの送信に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Approve the quote.
     */
    public function approve(Request $request, Quote $quote)
    {
        $validated = $request->validate([
            'client_feedback' => 'nullable|string',
        ]);

        try {
            $this->quoteService->approveQuote($quote, $validated['client_feedback'] ?? null);

            return redirect()->route('admin.quote.show', $quote)
                ->with('success', '見積もりを承認しました。');
        } catch (\Exception $e) {
            return back()->with('error', '見積もりの承認に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Reject the quote.
     */
    public function reject(Request $request, Quote $quote)
    {
        $validated = $request->validate([
            'client_feedback' => 'nullable|string',
        ]);

        try {
            $this->quoteService->rejectQuote($quote, $validated['client_feedback'] ?? null);

            return redirect()->route('admin.quote.show', $quote)
                ->with('success', '見積もりを却下しました。');
        } catch (\Exception $e) {
            return back()->with('error', '見積もりの却下に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Download quote as PDF.
     */
    public function downloadPdf(Quote $quote)
    {
        try {
            $quote->load([
                'user',
                'company',
                'items' => function ($query) {
                    $query->orderBy('sort_order');
                },
                'creator',
            ]);

            // PDFを生成
            $pdf = Pdf::loadView('pdfs.quote', [
                'quote' => $quote,
            ]);

            // A4サイズ、縦向き
            $pdf->setPaper('A4', 'portrait');
            \App\Support\PdfFontRegistrar::registerDomPdf($pdf);

            // ファイル名を生成
            $filename = sprintf('見積書_%s_%s.pdf', $quote->quote_number, date('Ymd'));

            // PDFをダウンロード
            return $pdf->download($filename);
        } catch (\Exception $e) {
            return back()->with('error', 'PDFの生成に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Preview quote as PDF in browser.
     */
    public function previewPdf(Quote $quote)
    {
        try {
            $quote->load([
                'user',
                'company',
                'items' => function ($query) {
                    $query->orderBy('sort_order');
                },
                'creator',
            ]);

            // PDFを生成
            $pdf = Pdf::loadView('pdfs.quote', [
                'quote' => $quote,
            ]);

            // A4サイズ、縦向き
            $pdf->setPaper('A4', 'portrait');
            \App\Support\PdfFontRegistrar::registerDomPdf($pdf);

            // ブラウザでプレビュー表示
            return $pdf->stream(sprintf('見積書_%s.pdf', $quote->quote_number));
        } catch (\Exception $e) {
            return back()->with('error', 'PDFの生成に失敗しました: ' . $e->getMessage());
        }
    }
}
