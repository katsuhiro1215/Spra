<?php

namespace Tests\Feature\Mail;

use App\Mail\ContractEmail;
use App\Mail\ContractGroupEmail;
use App\Mail\InvoiceMail;
use App\Mail\SendQuoteMail;
use App\Models\Admin;
use App\Models\Contract;
use App\Models\ContractGroup;
use App\Models\ContractVersion;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\QuoteVersion;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ContractEmailDesignTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeContract(Admin $admin, User $user): Contract
    {
        $contract = Contract::create([
            'contract_number' => 'C-MAIL-' . Str::random(6),
            'user_id' => $user->id,
            'title' => 'メールデザインテスト契約',
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

        return $contract->fresh();
    }

    public function test_contract_email_renders_as_styled_html_not_plain_text(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create();
        $contract = $this->makeContract($admin, $user);

        // 以前はtext: 'emails.contract-plain'（装飾の無いプレーンテキスト）を
        // 使っており、見積・領収書メールとデザインが揃っていなかった(回帰テスト)。
        $html = (new ContractEmail($contract, $user->email))->render();

        $this->assertStringContainsString('<!DOCTYPE html>', $html);
        $this->assertStringContainsString('契約書のご送付', $html);
        $this->assertStringContainsString($contract->title, $html);
        $this->assertStringContainsString(route('user.contract.show', $contract->id), $html);
    }

    public function test_contract_group_email_renders_as_styled_html_with_all_contracts_listed(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create();

        $group = ContractGroup::create([
            'group_number' => 'CG-MAIL-' . Str::random(6),
            'user_id' => $user->id,
            'title' => 'メールデザインテストグループ',
            'status' => 'active',
            'created_by' => $admin->id,
        ]);

        $contractA = $this->makeContract($admin, $user);
        $contractA->update(['contract_group_id' => $group->id]);
        $contractB = $this->makeContract($admin, $user);
        $contractB->update(['contract_group_id' => $group->id]);

        $html = (new ContractGroupEmail($group->fresh('contracts'), $user->email))->render();

        $this->assertStringContainsString('<!DOCTYPE html>', $html);
        $this->assertStringContainsString($contractA->contract_number, $html);
        $this->assertStringContainsString($contractB->contract_number, $html);
    }

    public function test_quote_send_email_uses_the_same_gradient_card_design(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create();

        $quote = Quote::create([
            'quote_number' => 'Q-MAIL-' . Str::random(6),
            'title' => 'メールデザインテスト見積もり',
            'user_id' => $user->id,
            'status' => 'draft',
            'created_by' => $admin->id,
        ]);

        $version = QuoteVersion::create([
            'quote_id' => $quote->id,
            'version' => 1,
            'title' => $quote->title,
            'base_amount' => 100000,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 10000,
            'total_amount' => 110000,
            'status' => 'draft',
            'is_current' => true,
            'created_by' => $admin->id,
        ]);
        $quote->update(['current_version_id' => $version->id]);

        QuoteItem::create([
            'quote_version_id' => $version->id,
            'name' => 'テスト項目',
            'quantity' => 1,
            'unit_price' => 100000,
            'amount' => 100000,
        ]);

        $html = (new SendQuoteMail($quote->fresh(), 'https://example.com/response'))->render();

        $this->assertStringContainsString('<!DOCTYPE html>', $html);
        $this->assertStringContainsString('お見積りのご送付', $html);
        $this->assertStringContainsString($quote->quote_number, $html);
        // 契約・領収書メールと同じグラデーションヘッダーの色を使っていることを確認
        $this->assertStringContainsString('#667eea', $html);
    }

    public function test_invoice_mail_uses_the_same_gradient_card_design(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create();
        $contract = $this->makeContract($admin, $user);

        $invoice = Invoice::create([
            'invoice_number' => 'INV-MAIL-' . Str::random(6),
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

        $html = (new InvoiceMail($invoice->fresh()))->render();

        $this->assertStringContainsString('<!DOCTYPE html>', $html);
        $this->assertStringContainsString('請求書のご送付', $html);
        $this->assertStringContainsString($invoice->invoice_number, $html);
        $this->assertStringContainsString($user->profile?->full_name ?? $user->email, $html);
        $this->assertStringContainsString('#667eea', $html);
    }
}
