<?php

namespace Tests\Feature\Invoice;

use App\Jobs\SendInvoiceJob;
use App\Mail\InvoiceMail;
use App\Models\Admin;
use App\Models\Contract;
use App\Models\ContractVersion;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\User;
use App\Services\InvoiceService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class SendInvoiceJobTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_handle_sends_the_styled_invoice_mail_not_the_old_plain_template(): void
    {
        Mail::fake();
        Storage::fake('private');

        $admin = Admin::factory()->create();
        $user = User::factory()->create();

        $contract = Contract::create([
            'contract_number' => 'C-JOB-' . Str::random(6),
            'user_id' => $user->id,
            'title' => 'ジョブテスト契約',
            'start_date' => now()->toDateString(),
            'created_by' => $admin->id,
        ]);

        $version = ContractVersion::create([
            'contract_id' => $contract->id,
            'version' => 1,
            'base_amount' => 100000,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 10000,
            'total_amount' => 110000,
            'status' => 'active',
            'is_current' => true,
            'created_by' => $admin->id,
        ]);
        $contract->update(['current_version_id' => $version->id]);

        $invoice = Invoice::create([
            'invoice_number' => 'INV-JOB-' . Str::random(6),
            'issue_date' => now()->toDateString(),
            'contract_id' => $contract->id,
            'invoice_type' => 'full',
            'user_id' => $user->id,
            'billing_period_start' => now()->startOfMonth()->toDateString(),
            'billing_period_end' => now()->endOfMonth()->toDateString(),
            'subtotal' => 100000,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 10000,
            'total_amount' => 110000,
            'status' => 'draft',
            'due_date' => now()->addDays(30)->toDateString(),
            'created_by' => $admin->id,
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice->id,
            'description' => 'テスト項目',
            'quantity' => 1,
            'unit_price' => 100000,
            'amount' => 100000,
        ]);

        (new SendInvoiceJob($invoice))->handle(app(InvoiceService::class));

        // 以前はMail::send('emails.invoice-notification', ...)を直接呼んでおり、
        // 装飾の無いプレーンテキストメール(かつ存在しない$user->nameを参照して
        // 宛名が空になる)が送信される不具合があった(回帰テスト)。
        // InvoiceMailはShouldQueueを実装しているためsend()もキューイングされる。
        Mail::assertQueued(InvoiceMail::class, fn ($mail) => $mail->invoice->id === $invoice->id);

        $this->assertSame('sent', $invoice->fresh()->status);
        $this->assertNotNull($invoice->fresh()->pdf_path);
        Storage::disk('private')->assertExists($invoice->fresh()->pdf_path);
    }
}
