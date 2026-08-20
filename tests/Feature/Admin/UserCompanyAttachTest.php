<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Company;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserCompanyAttachTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_can_attach_an_existing_company_to_a_manually_created_user(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $company = Company::create([
            'name' => 'テスト株式会社',
            'company_type' => 'corporate',
            'status' => 'active',
        ]);

        // Admin手動作成直後はcompany_userに何も紐付いていない状態を再現
        $this->assertSame(0, $user->companies()->count());

        $response = $this->actingAs($admin, 'admins')->post(
            route('admin.user.company.store', $user->id),
            [
                'company_id' => $company->id,
                'role' => 'owner',
            ],
        );

        $response->assertRedirect(route('admin.user.show', $user->id));
        $this->assertDatabaseHas('company_user', [
            'user_id' => $user->id,
            'company_id' => $company->id,
            'role' => 'owner',
            'is_primary' => true,
        ]);

        // 最初の紐付けが主所属になっているため、User::company()（is_primary絞り込み）でも取得できる
        $this->assertTrue($user->company()->exists());
    }

    public function test_owner_can_detach_a_company_from_a_user(): void
    {
        // destroy系操作は「admin」ロールには権限として付与されない設計
        // （config/admin_permissions.phpのadmin_role_excluded_actions）ため、
        // 削除操作はownerロールで検証する。
        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $user = User::factory()->create();
        $company = Company::create([
            'name' => 'テスト株式会社',
            'company_type' => 'corporate',
            'status' => 'active',
        ]);
        $user->companies()->attach($company->id, [
            'role' => 'owner',
            'is_primary' => true,
            'joined_at' => now(),
        ]);

        $response = $this->actingAs($admin, 'admins')->delete(
            route('admin.user.company.destroy', [$user->id, $company->id]),
        );

        $response->assertRedirect(route('admin.user.show', $user->id));
        $this->assertDatabaseMissing('company_user', [
            'user_id' => $user->id,
            'company_id' => $company->id,
        ]);
    }
}
