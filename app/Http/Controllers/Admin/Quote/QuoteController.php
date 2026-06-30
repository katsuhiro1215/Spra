<?php

namespace App\Http\Controllers\Admin\Quote;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\User;
use App\Models\Contact;
use App\Models\Company;
use App\Models\ProjectInquiry;
use App\Services\QuoteService;
use App\Services\ServiceCategoryService;
use App\Services\ServiceItemService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        // サービスカテゴリとServiceItemを取得
        $serviceCategories = $this->serviceCategoryService->getActiveForSelect();
        $serviceItems = $this->serviceItemService->getActiveForQuote();

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

        // ProjectInquiryから見積もりを作成する場合
        $projectInquiry = null;
        if ($request->has('from_inquiry_id')) {
            $projectInquiry = ProjectInquiry::with([
                'user.profile',
                'serviceCategory',
                'service',
                'servicePlan',
            ])->find($request->input('from_inquiry_id'));
        }

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
            'statuses' => $this->quoteService->getStatuses(),
            'serviceCategories' => $serviceCategories,
            'serviceItems' => $serviceItems,
            'users' => $users,
            'projectInquiry' => $projectInquiry,
            'contact' => $contact,
            'user' => $user,
            'company' => $company,
        ]);
    }

    /**
     * Store a newly created quote.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'contact_id' => 'nullable|exists:contacts,id',
            'company_id' => 'nullable|exists:companies,id',
            'title' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'custom_specifications' => 'nullable|string',
            'expires_at' => 'nullable|date',
            'discount_amount' => 'nullable|numeric|min:0',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'status' => 'required|in:draft,sent,reviewed,approved,rejected,expired',
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
            'from_inquiry_id' => 'nullable|exists:project_inquiries,id',
        ]);

        // user_idとcontact_idのどちらか一方は必須
        if (empty($validated['user_id']) && empty($validated['contact_id'])) {
            return back()->withErrors([
                'user_id' => 'ユーザーまたはお問い合わせのいずれかを選択してください。',
                'contact_id' => 'ユーザーまたはお問い合わせのいずれかを選択してください。',
            ])->withInput();
        }

        try {
            $quote = $this->quoteService->createQuote($validated);

            // ProjectInquiryから作成した場合、関連付けとステータス更新
            if (!empty($validated['from_inquiry_id'])) {
                $inquiry = ProjectInquiry::find($validated['from_inquiry_id']);
                if ($inquiry) {
                    $inquiry->update([
                        'quote_id' => $quote->id,
                        'status' => 'estimated',
                    ]);
                }
            }

            return redirect()->route('admin.quote.show', $quote)
                ->with('success', '見積もりを作成しました。');
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
            'items.serviceItem',
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

        $quote->load(['items', 'user.profile', 'contact', 'company']);

        // サービスカテゴリとServiceItemを取得
        $serviceCategories = $this->serviceCategoryService->getActiveForSelect();
        $serviceItems = $this->serviceItemService->getActiveForQuote();

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
            'serviceItems' => $serviceItems,
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
            'expires_at' => 'nullable|date',
            'discount_amount' => 'nullable|numeric|min:0',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'status' => 'required|in:draft,sent,reviewed,approved,rejected,expired',
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
            'items.serviceItem',
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
            $token = \Illuminate\Support\Str::random(60);
            $responseFormUrl = route('user.public.quote.response.show', $token);

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

            // ブラウザでプレビュー表示
            return $pdf->stream(sprintf('見積書_%s.pdf', $quote->quote_number));
        } catch (\Exception $e) {
            return back()->with('error', 'PDFの生成に失敗しました: ' . $e->getMessage());
        }
    }
}
