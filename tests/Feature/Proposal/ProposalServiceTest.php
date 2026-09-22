<?php

namespace Tests\Feature\Proposal;

use App\Models\Admin;
use App\Models\Hearing;
use App\Services\ProposalService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProposalServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    private function createHearing(Admin $admin, string $title = 'テストヒアリング'): Hearing
    {
        return Hearing::create([
            'title' => $title,
            'created_by' => $admin->id,
        ]);
    }

    public function test_create_proposal_sets_creator_and_persists_content(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $hearing = $this->createHearing($admin);

        $proposal = app(ProposalService::class)->createProposal([
            'hearing_id' => $hearing->id,
            'title' => '提案書タイトル',
            'content' => '本文',
        ], $admin->id);

        $this->assertSame($admin->id, $proposal->created_by);
        $this->assertSame('draft', $proposal->status);
        $this->assertDatabaseHas('proposals', [
            'id' => $proposal->id,
            'hearing_id' => $hearing->id,
            'title' => '提案書タイトル',
        ]);
    }

    public function test_find_by_hearing_returns_only_matching_proposals(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $hearingA = $this->createHearing($admin, 'ヒアリングA');
        $hearingB = $this->createHearing($admin, 'ヒアリングB');

        $service = app(ProposalService::class);
        $service->createProposal(['hearing_id' => $hearingA->id, 'title' => 'A案'], $admin->id);
        $service->createProposal(['hearing_id' => $hearingB->id, 'title' => 'B案'], $admin->id);

        $results = $service->findByHearing($hearingA->id);

        $this->assertCount(1, $results);
        $this->assertSame('A案', $results->first()->title);
    }
}
