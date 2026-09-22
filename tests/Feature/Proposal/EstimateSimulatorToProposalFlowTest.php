<?php

namespace Tests\Feature\Proposal;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Hearing;
use App\Models\Quote;
use App\Services\ProposalService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EstimateSimulatorToProposalFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    /**
     * EstimateSimulatorController::save()が実際に作るのと同じ形(Contact + Quote(draft) + QuoteVersion v1)を
     * ここでは直接組み立てる。EstimateSimulatorController自体のテストはスコープ外(既存実装で変更なし)。
     */
    private function createEstimateSimulatorQuote(Admin $admin): Quote
    {
        $category = ContactCategory::create([
            'name' => '見積もり依頼',
            'slug' => 'quote-request-' . uniqid(),
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $contact = Contact::create([
            'contact_category_id' => $category->id,
            'name' => '概算見積もりテスト太郎',
            'email' => 'estimate-flow-' . uniqid() . '@example.com',
            'message' => '見積もりシミュレーターから送信されました。',
            'status' => 'new',
            'source' => 'estimate_simulator',
        ]);

        $quote = Quote::create([
            'quote_number' => 'Q-ESTIMATE-' . uniqid(),
            'contact_id' => $contact->id,
            'title' => 'コーポレートサイト制作(概算)',
            'status' => 'draft',
            'created_by' => $admin->id,
        ]);

        $version = $quote->versions()->create([
            'version' => 1,
            'title' => $quote->title,
            'base_amount' => 500000,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 50000,
            'total_amount' => 550000,
            'status' => 'draft',
            'is_current' => true,
            'created_by' => $admin->id,
        ]);
        $quote->update(['current_version_id' => $version->id]);

        return $quote->fresh();
    }

    public function test_hearing_can_be_linked_back_to_the_estimate_simulator_quote(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $quote = $this->createEstimateSimulatorQuote($admin);

        $hearing = Hearing::create([
            'contact_id' => $quote->contact_id,
            'quote_id' => $quote->id,
            'title' => '概算見積もり後のヒアリング',
            'created_by' => $admin->id,
        ]);

        $this->assertTrue($hearing->quote->is($quote));
        $this->assertTrue($quote->fresh()->contact->hearings->contains($hearing));
    }

    public function test_formal_quote_version_is_created_on_the_same_quote_after_proposal(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $quote = $this->createEstimateSimulatorQuote($admin);

        $hearing = Hearing::create([
            'contact_id' => $quote->contact_id,
            'quote_id' => $quote->id,
            'title' => '概算見積もり後のヒアリング',
            'created_by' => $admin->id,
        ]);

        $proposal = app(ProposalService::class)->createProposal([
            'hearing_id' => $hearing->id,
            'contact_id' => $quote->contact_id,
            'title' => 'コーポレートサイト制作 提案書',
            'content' => '## 現状分析\n\n...',
        ], $admin->id);

        // 概算(v1)は据え置いたまま、Proposalの内容を反映した正式版(v2)を同じQuoteに追加する。
        // custom_specificationsはjsonキャストのため、Proposal本文をそのまま配列で包んで保存する
        // (転記時のデータ形状そのものは実装時に確定させる未決定事項)。
        $quote->update(['proposal_id' => $proposal->id]);
        $formalVersion = $quote->versions()->create([
            'version' => 2,
            'title' => $quote->title,
            'requirements' => 'ヒアリング・提案書の内容を反映した正式要件',
            'custom_specifications' => ['proposal_content' => $proposal->content],
            'base_amount' => 480000,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 48000,
            'total_amount' => 528000,
            'status' => 'draft',
            'is_current' => true,
            'revision_reason' => 'ヒアリング・提案書を踏まえた正式見積への改訂',
            'created_by' => $admin->id,
        ]);
        $quote->update(['current_version_id' => $formalVersion->id]);

        $this->assertCount(2, $quote->versions);
        $this->assertTrue($quote->fresh()->proposal->is($proposal));
        $this->assertSame(2, $quote->fresh()->currentVersion->version);
        $this->assertSame(
            $proposal->content,
            $quote->fresh()->currentVersion->custom_specifications['proposal_content']
        );
    }
}
