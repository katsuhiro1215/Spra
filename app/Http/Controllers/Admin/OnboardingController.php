<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Models\Quote;
use App\Models\Invoice;
use App\Mail\ContractApprovedMail;
use App\Mail\AccountApprovedMail;
use App\Mail\PaymentRequestMail;
use App\Services\ContractService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class OnboardingController extends Controller
{
    public function __construct(
        private ContractService $contractService,
    ) {}

    /**
     * Show list of pending onboarding registrations
     */
    public function index()
    {
        $pendingUsers = User::where('status', 'pending')
            ->with(['company' => function ($query) {
                $query->where('status', 'pending');
            }])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Onboarding/Index', [
            'pendingUsers' => $pendingUsers,
        ]);
    }

    /**
     * Show onboarding detail with approval interface
     */
    public function detail(string $userId)
    {
        $user = User::where('status', 'pending')
            ->with(['company' => function ($query) {
                $query->wherePivot('is_primary', true);
            }, 'quoteResponses' => function ($query) {
                $query->with('quote.currentVersion')->latest();
            }])
            ->findOrFail($userId);

        $company = $user->company()->first();

        // Get the related quote response
        $quoteResponse = $user->quoteResponses()->latest()->first();
        $quote = $quoteResponse ? $quoteResponse->quote : null;

        return Inertia::render('Admin/Onboarding/Detail', [
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'created_at' => $user->created_at->toDateTimeString(),
            ],
            'company' => [
                'id' => $company?->id,
                'name' => $company?->name,
                'type' => $company?->company_type,
                'phone' => $company?->phone,
                'legal_name' => $company?->legal_name,
                'representative_name' => $company?->representative_name,
                'representative_email' => $company?->representative_email,
                'representative_phone' => $company?->representative_phone,
            ],
            'quote' => $quote ? [
                'id' => $quote->id,
                'quote_number' => $quote->quote_number,
                'title' => $quote->title,
                'description' => $quote->description,
                'total_amount' => $quote->currentVersion?->total_amount,
                'payment_term_id' => $quote->payment_term_id,
                'valid_until' => $quote->valid_until?->toDateString(),
            ] : null,
        ]);
    }

    /**
     * Approve onboarding registration
     */
    public function approve(string $userId, Request $request)
    {
        DB::beginTransaction();

        try {
            $user = User::where('status', 'pending')
                ->with(['company' => function ($query) {
                    $query->wherePivot('is_primary', true);
                }, 'quoteResponses' => function ($query) {
                    $query->latest();
                }])
                ->findOrFail($userId);
            $company = $user->company()->first();

            if (!$company || $company->status !== 'pending') {
                return back()->with('error', __('messages.onboarding.already_processed'));
            }

            // Get the related quote
            $quoteResponse = $user->quoteResponses()->latest()->first();
            $quote = $quoteResponse?->quote;

            if (!$quote) {
                return back()->with('error', __('messages.not_found', ['attribute' => '関連する見積']));
            }

            // Update user and company status to 'active'
            $user->update(['status' => 'active']);
            $company->update(['status' => 'active']);

            // invoicesテーブルはcontract_id/user_idが必須のため、Invoiceを発行する前に
            // Quoteの内容を引き継いだContractを自動作成する(承認と同時に契約成立とみなす)。
            // 電子署名フローは別途Contract管理画面で行う想定のため、signature_statusは
            // デフォルト(pending)のままにする。
            $quoteVersion = $quote->currentVersion;

            $contract = $this->contractService->createContract([
                'quote_id' => $quote->id,
                'user_id' => $user->id,
                'company_id' => $company->id,
                'title' => $quote->title,
                'type' => 'one_time',
                'start_date' => now()->toDateString(),
                'status' => 'active',
                'discount_amount' => $quoteVersion?->discount_amount ?? 0,
                'tax_rate' => $quoteVersion?->tax_rate ?? 10,
            ]);

            // Quoteの明細をContractの明細としてそのまま引き継ぐ
            if ($quoteVersion) {
                foreach ($quoteVersion->items as $quoteItem) {
                    $contract->currentVersion->items()->create([
                        'service_id' => $quoteItem->service_id,
                        'service_item_id' => $quoteItem->service_item_id,
                        'name' => $quoteItem->name,
                        'description' => $quoteItem->description,
                        'item_type' => $quoteItem->item_type,
                        'billing_type' => $quoteItem->billing_type,
                        'quantity' => $quoteItem->quantity,
                        'unit_price' => $quoteItem->unit_price,
                        'amount' => $quoteItem->amount,
                        'estimated_days' => $quoteItem->estimated_days,
                        'sort_order' => $quoteItem->sort_order,
                    ]);
                }

                // 金額もQuoteVersionの内容にそのまま合わせる
                $contract->currentVersion->update([
                    'base_amount' => $quoteVersion->base_amount,
                    'tax_amount' => $quoteVersion->tax_amount,
                    'total_amount' => $quoteVersion->total_amount,
                ]);
            }

            // Create invoice with payment terms
            // Payment term calculation: 50% due on contract, 30% on delivery, 20% on completion
            // We'll create the first invoice for the 50% deposit
            // 金額は Quote 自体ではなく currentVersion 側にある
            $invoiceAmount = ($quoteVersion?->total_amount ?? 0) * 0.5;

            $invoice = Invoice::create([
                'contract_id' => $contract->id,
                'user_id' => $user->id,
                'company_id' => $company->id,
                'invoice_type' => 'deposit',
                'invoice_number' => $this->generateInvoiceNumber(),
                'subtotal' => $invoiceAmount,
                'total_amount' => $invoiceAmount,
                'tax_rate' => 0,
                'tax_amount' => 0,
                'status' => 'sent',
                'issue_date' => now(),
                'due_date' => now()->addDays(30), // 30 days to pay
                'notes' => "契約金（見積 #{$quote->quote_number} の50%）",
            ]);

            // Send notification emails
            // 1. Contract Approved Mail to representative
            if ($company->representative_email) {
                Mail::to($company->representative_email)
                    ->send(new ContractApprovedMail($user, $company, $quote, $invoice));
            }

            // 2. Account Approved Mail to user
            Mail::to($user->email)
                ->send(new AccountApprovedMail($user, $company, $quote));

            // 3. Payment Request Mail
            Mail::to($company->representative_email ?? $user->email)
                ->send(new PaymentRequestMail($user, $company, $invoice));

            DB::commit();

            return redirect()
                ->route('admin.onboarding.index')
                ->with('success', "ユーザー {$user->email} を承認しました。");
        } catch (\Exception $e) {
            DB::rollback();

            return back()->with('error', __('messages.unexpected_error_detail', ['message' => $e->getMessage()]));
        }
    }

    /**
     * Reject onboarding registration
     */
    public function reject(string $userId, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        DB::beginTransaction();

        try {
            $user = User::where('status', 'pending')
                ->with(['company' => function ($query) {
                    $query->wherePivot('is_primary', true);
                }])
                ->findOrFail($userId);
            $company = $user->company()->first();

            if (!$company || $company->status !== 'pending') {
                return back()->with('error', __('messages.onboarding.already_processed'));
            }

            // User/Companyを完全に削除する（論理削除ではなく物理削除）。
            // company_userピボットはON DELETE CASCADEのため物理削除で正しく片付く。
            // 通常のdelete()はSoftDeletesにより論理削除になり、emailのunique制約が
            // 残り続けて却下後に同じメールアドレスで再登録できなくなるため、
            // 意図通りの挙動にするにはforceDelete()が必要。
            $company->forceDelete();
            $user->forceDelete();

            DB::commit();

            return redirect()
                ->route('admin.onboarding.index')
                ->with('success', "登録を却下しました。");
        } catch (\Exception $e) {
            DB::rollback();

            return back()->with('error', __('messages.unexpected_error_detail', ['message' => $e->getMessage()]));
        }
    }

    /**
     * Generate unique invoice number
     */
    private function generateInvoiceNumber(): string
    {
        $lastInvoice = Invoice::where('invoice_number', 'like', 'INV-%')
            ->orderBy('invoice_number', 'desc')
            ->first();

        if (!$lastInvoice) {
            $number = 1;
        } else {
            $parts = explode('-', $lastInvoice->invoice_number);
            $number = intval(end($parts)) + 1;
        }

        return 'INV-' . str_pad($number, 8, '0', STR_PAD_LEFT);
    }
}
