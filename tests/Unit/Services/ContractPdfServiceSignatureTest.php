<?php

namespace Tests\Unit\Services;

use App\Models\Admin;
use App\Models\Contract;
use App\Models\ContractVersion;
use App\Models\User;
use App\Services\ContractPdfService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ContractPdfServiceSignatureTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeContractWithCreator(Admin $admin): Contract
    {
        $user = User::factory()->create();

        $contract = Contract::create([
            'contract_number' => 'C-SIG-' . Str::random(8),
            'user_id' => $user->id,
            'title' => '署名欄テスト契約',
            'start_date' => now()->toDateString(),
            'created_by' => $admin->id,
        ]);

        ContractVersion::create([
            'contract_id' => $contract->id,
            'version' => 1,
            'base_amount' => 0,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 0,
            'total_amount' => 0,
            'status' => 'draft',
            'is_current' => true,
            'created_by' => $admin->id,
        ]);

        return $contract->fresh();
    }

    public function test_notes_page_template_prints_the_contract_creator_admin_name(): void
    {
        $admin = Admin::factory()->create();
        $admin->profile()->create([
            'full_name' => '栫 勝宏',
            'last_name' => '栫',
            'first_name' => '勝宏',
        ]);

        $contract = $this->makeContractWithCreator($admin);

        // ContractPdfService::generateNotesPage()が実際に解決するadminNameと
        // 同じロジックで、テンプレート側の表示を直接検証する(PDFはmPDFで圧縮
        // されるためテキスト抽出できず、Blade側の描画を直接確認する)。
        $adminName = $contract->creator?->loadMissing('profile')?->profile?->full_name;
        $this->assertSame('栫 勝宏', $adminName);

        $html = view('contracts.pdf-template-notes', [
            'contract' => $contract,
            'notes' => '',
            'signatureBase64' => null,
            'adminName' => $adminName,
        ])->render();

        // 以前は甲（SmartSprouts）側の署名欄が常に空欄で、クライアントに一方的に
        // 署名を求めるだけの見た目になっていた(回帰テスト)。
        $this->assertStringContainsString('栫 勝宏', $html);
        $this->assertStringContainsString('甲', $html);
    }

    public function test_generate_notes_page_returns_a_valid_pdf(): void
    {
        $admin = Admin::factory()->create();
        $admin->profile()->create([
            'full_name' => '栫 勝宏',
            'last_name' => '栫',
            'first_name' => '勝宏',
        ]);

        $contract = $this->makeContractWithCreator($admin);

        $pdfContent = (new ContractPdfService())->generateNotesPage($contract)->Output('', 'S');

        $this->assertStringStartsWith('%PDF-', $pdfContent);
    }
}
