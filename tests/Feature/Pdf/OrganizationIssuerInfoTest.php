<?php

namespace Tests\Feature\Pdf;

use App\Models\Admin;
use App\Models\Contract;
use App\Models\Invoice;
use App\Models\Organization;
use App\Models\Receipt;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class OrganizationIssuerInfoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeOrganization(): Organization
    {
        $organization = Organization::create([
            'name' => 'Smart Sprouts',
            'phone' => '090-9580-9257',
            'email' => 'info@smartsprouts.jp',
            'website' => 'https://smartsprouts.jp',
        ]);

        $organization->addresses()->create([
            'type' => 'office',
            'postal_code' => '6308303',
            'prefecture' => '奈良県',
            'city' => '奈良市',
            'district' => '南紀寺町',
            'address_other' => '2丁目274-3',
            'is_default' => true,
            'is_active' => true,
        ]);

        return $organization->fresh();
    }

    public function test_receipt_pdf_shows_real_organization_address_not_placeholder(): void
    {
        $this->makeOrganization();

        $admin = Admin::factory()->create();
        $user = User::factory()->create();

        $contract = Contract::create([
            'contract_number' => 'C-ISSUER-' . Str::random(6),
            'user_id' => $user->id,
            'title' => '発行者情報テスト契約',
            'start_date' => now()->toDateString(),
            'created_by' => $admin->id,
        ]);

        $invoice = Invoice::create([
            'invoice_number' => 'INV-ISSUER-' . Str::random(6),
            'issue_date' => now()->toDateString(),
            'contract_id' => $contract->id,
            'invoice_type' => 'full',
            'user_id' => $user->id,
            'subtotal' => 100000,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 10000,
            'total_amount' => 110000,
            'status' => 'paid',
            'due_date' => now()->addDays(30)->toDateString(),
            'created_by' => $admin->id,
        ]);

        $receipt = Receipt::create([
            'receipt_number' => 'REC-ISSUER-' . Str::random(6),
            'invoice_id' => $invoice->id,
            'user_id' => $user->id,
            'amount' => 100000,
            'tax_amount' => 10000,
            'total_amount' => 110000,
            'status' => 'issued',
            'issued_at' => now(),
            'created_by' => $admin->id,
        ]);

        $html = view('pdfs.receipt', [
            'receipt' => $receipt->load(['user.profile', 'company', 'invoice.contract']),
        ])->render();

        // 以前は所在地・連絡先が「〒000-0000 東京都○○区△△ 1-2-3」
        // 「Tel: 03-0000-0000 / Email: info@example.com」という架空のプレース
        // ホルダーのまま固定表示されていた(回帰テスト)。
        $this->assertStringNotContainsString('000-0000', $html);
        $this->assertStringNotContainsString('example.com', $html);
        $this->assertStringNotContainsString('○○区△△', $html);
        $this->assertStringContainsString('090-9580-9257', $html);
        $this->assertStringContainsString('info@smartsprouts.jp', $html);
        $this->assertStringContainsString('奈良市', $html);
    }

    // 見積書PDF(pdfs/quote.blade.php)の発行者情報プレースホルダーも同様に修正したが、
    // Quoteモデルにitemsリレーションも$quote->base_amount等の属性も存在せず
    // (QuoteVersionベースの設計への移行時に取り残された別の既存バグ)、
    // ビュー自体が現状クラッシュするためこのテストからは対象外とした。
}
