<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Hearing;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProposalControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);

        // ai_staffロールは現状view専用(index/show)に権限制限されているため(config/admin_permissions.php)、
        // この専用ミドルウェアだけテストスコープでバイパスする。本番の権限設定・ロール定義は変更しない。
        // AI社員への書き込み権限付与自体は別途未決定事項(design memo §1.4参照)。
        $this->withoutMiddleware(\App\Http\Middleware\EnsureAdminPermission::class);
    }

    private function createHearing(Admin $admin): Hearing
    {
        return Hearing::create([
            'title' => 'テストヒアリング',
            'created_by' => $admin->id,
        ]);
    }

    public function test_admin_can_create_a_proposal_linked_to_a_hearing(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $hearing = $this->createHearing($admin);

        $response = $this->actingAs($admin, 'admins')->post(route('admin.proposal.store'), [
            'hearing_id' => $hearing->id,
            'title' => 'ECサイト構築提案',
            'content' => '## 分析結果\n\n...',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('proposals', [
            'hearing_id' => $hearing->id,
            'title' => 'ECサイト構築提案',
            'created_by' => $admin->id,
        ]);
    }

    public function test_creating_a_proposal_without_hearing_id_succeeds(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $response = $this->actingAs($admin, 'admins')->post(route('admin.proposal.store'), [
            'title' => 'ヒアリング無しの提案書',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('proposals', [
            'hearing_id' => null,
            'title' => 'ヒアリング無しの提案書',
        ]);
    }

    public function test_guest_cannot_create_a_proposal(): void
    {
        $response = $this->post(route('admin.proposal.store'), ['title' => 'テスト']);

        $response->assertRedirect(route('admin.login'));
    }

    public function test_admin_can_view_a_proposal(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $hearing = $this->createHearing($admin);

        $proposal = \App\Models\Proposal::create([
            'hearing_id' => $hearing->id,
            'title' => '閲覧テスト提案書',
            'content' => '## 提案内容',
            'created_by' => $admin->id,
        ]);

        $response = $this->actingAs($admin, 'admins')->get(route('admin.proposal.show', $proposal));

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Proposals/Show')
            ->has('proposal')
            ->where('proposal.id', $proposal->id)
        );
    }

    public function test_ai_staff_creating_a_proposal_logs_the_activity(): void
    {
        $aiStaff = Admin::factory()->aiStaff('sales')->create(['status' => 'active']);

        $this->actingAs($aiStaff, 'admins')->post(route('admin.proposal.store'), [
            'title' => 'AI社員作成の提案書',
        ]);

        $this->assertDatabaseHas('ai_staff_activity_logs', [
            'admin_id' => $aiStaff->id,
            'action' => \App\Models\AiStaffActivityLog::ACTION_PROPOSAL_CREATED,
        ]);
    }

    public function test_human_admin_creating_a_proposal_does_not_log_activity(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $this->actingAs($admin, 'admins')->post(route('admin.proposal.store'), [
            'title' => '人間作成の提案書',
        ]);

        $this->assertDatabaseCount('ai_staff_activity_logs', 0);
    }
}
