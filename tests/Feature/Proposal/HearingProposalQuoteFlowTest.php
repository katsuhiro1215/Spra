<?php

namespace Tests\Feature\Proposal;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Hearing;
use App\Models\Quote;
use App\Services\ProposalService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HearingProposalQuoteFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    /**
     * Quote/Contact/HearingにはHasFactoryが無いため、既存テストと同じく
     * ::create()に必須項目を直接渡す方式に合わせる。
     */
    private function createContact(): Contact
    {
        $category = ContactCategory::create([
            'name' => '見積もり依頼',
            'slug' => 'quote-request-' . uniqid(),
            'sort_order' => 1,
            'is_active' => true,
        ]);

        return Contact::create([
            'contact_category_id' => $category->id,
            'name' => 'テスト太郎',
            'email' => 'flow-test-' . uniqid() . '@example.com',
            'message' => 'テストメッセージ',
            'status' => 'new',
            'source' => 'web',
        ]);
    }

    private function createHearing(Admin $admin, Contact $contact): Hearing
    {
        return Hearing::create([
            'contact_id' => $contact->id,
            'title' => 'テストヒアリング',
            'created_by' => $admin->id,
        ]);
    }

    private function createQuote(Admin $admin, array $overrides = []): Quote
    {
        return Quote::create(array_merge([
            'quote_number' => 'Q-FLOW-' . uniqid(),
            'title' => 'テスト見積もり',
            'status' => 'draft',
            'created_by' => $admin->id,
        ], $overrides));
    }

    public function test_simple_case_skips_proposal_from_hearing_to_quote(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $contact = $this->createContact();
        $hearing = $this->createHearing($admin, $contact);

        $quote = $this->createQuote($admin, ['contact_id' => $contact->id, 'proposal_id' => null]);
        $hearing->update(['quote_id' => $quote->id]);

        $this->assertTrue($hearing->fresh()->quote->is($quote));
        $this->assertNull($quote->fresh()->proposal);
    }

    public function test_complex_case_routes_through_a_proposal(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $contact = $this->createContact();
        $hearing = $this->createHearing($admin, $contact);

        $proposal = app(ProposalService::class)->createProposal([
            'hearing_id' => $hearing->id,
            'contact_id' => $contact->id,
            'title' => '複雑案件の提案書',
        ], $admin->id);

        $quote = $this->createQuote($admin, ['contact_id' => $contact->id, 'proposal_id' => $proposal->id]);

        $this->assertTrue($quote->proposal->is($proposal));
        $this->assertTrue($proposal->hearing->is($hearing));
    }

    public function test_quote_can_be_recreated_against_a_revised_proposal(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $contact = $this->createContact();
        $hearing = $this->createHearing($admin, $contact);
        $proposalService = app(ProposalService::class);

        $firstProposal = $proposalService->createProposal([
            'hearing_id' => $hearing->id,
            'title' => '初版提案書',
        ], $admin->id);
        $this->createQuote($admin, ['proposal_id' => $firstProposal->id]);

        // 提案書を作り直し、新しい見積を紐付け直すケース
        $revisedProposal = $proposalService->createProposal([
            'hearing_id' => $hearing->id,
            'title' => '改訂版提案書',
        ], $admin->id);
        $secondQuote = $this->createQuote($admin, ['proposal_id' => $revisedProposal->id]);

        $this->assertCount(2, $hearing->fresh()->proposals);
        $this->assertTrue($secondQuote->proposal->is($revisedProposal));
    }
}
