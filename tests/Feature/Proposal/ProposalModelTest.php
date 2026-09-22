<?php

namespace Tests\Feature\Proposal;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Hearing;
use App\Models\Proposal;
use App\Models\Quote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProposalModelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Admin保存時のbooted()フックがsyncRoles()を呼ぶため、Roleレコードを先に用意する。
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    /**
     * Quote/Contact/HearingにはHasFactoryが無いため、既存テスト
     * (tests/Feature/QuoteResponseRegistrationSyncTest.php等)と同じく
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
            'email' => 'proposal-test-' . uniqid() . '@example.com',
            'message' => 'テストメッセージ',
            'status' => 'new',
            'source' => 'web',
        ]);
    }

    private function createQuote(Admin $admin, array $overrides = []): Quote
    {
        return Quote::create(array_merge([
            'quote_number' => 'Q-TEST-' . uniqid(),
            'title' => 'テスト見積もり',
            'status' => 'draft',
            'created_by' => $admin->id,
        ], $overrides));
    }

    public function test_proposal_can_be_linked_to_hearing_and_contact(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $contact = $this->createContact();
        $hearing = Hearing::create([
            'contact_id' => $contact->id,
            'title' => '初回ヒアリング',
            'created_by' => $admin->id,
        ]);

        $proposal = Proposal::create([
            'hearing_id' => $hearing->id,
            'contact_id' => $contact->id,
            'title' => 'コーポレートサイトリニューアル提案',
            'content' => '## 現状分析\n\n...',
            'status' => 'draft',
            'created_by' => $admin->id,
        ]);

        $this->assertTrue($proposal->hearing->is($hearing));
        $this->assertTrue($proposal->contact->is($contact));
        $this->assertTrue($proposal->creator->is($admin));
    }

    public function test_quote_can_reference_a_proposal(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $proposal = Proposal::factory()->create(['created_by' => $admin->id]);

        $quote = $this->createQuote($admin, ['proposal_id' => $proposal->id]);

        $this->assertTrue($quote->proposal->is($proposal));
        $this->assertTrue($proposal->quotes->contains($quote));
    }

    public function test_quote_can_be_created_without_a_proposal(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);

        $quote = $this->createQuote($admin, ['proposal_id' => null]);

        $this->assertNull($quote->proposal);
    }
}
