<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\AiStaffActivityLog;
use App\Models\Contact;
use App\Models\ContactCategory;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResponseControllerActivityLogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        // ai_staffロールは現状view専用(index/show)に権限制限されているため(config/admin_permissions.php)、
        // この専用ミドルウェアだけテストスコープでバイパスする。本番の権限設定・ロール定義は変更しない。
        // AI社員への書き込み権限付与自体は別途未決定事項(design memo §1.4参照)。
        $this->withoutMiddleware(\App\Http\Middleware\EnsureAdminPermission::class);
    }

    private function createContact(): Contact
    {
        $category = ContactCategory::create([
            'name' => '一般的な問い合わせ',
            'slug' => 'general-'.uniqid(),
            'sort_order' => 1,
            'is_active' => true,
        ]);

        return Contact::create([
            'contact_category_id' => $category->id,
            'name' => 'テスト太郎',
            'email' => 'response-log-test-'.uniqid().'@example.com',
            'message' => 'テストメッセージ',
            'status' => 'new',
            'source' => 'web',
        ]);
    }

    public function test_ai_staff_creating_a_response_logs_the_activity(): void
    {
        $aiStaff = Admin::factory()->aiStaff('support')->create(['status' => 'active']);
        $contact = $this->createContact();

        $this->actingAs($aiStaff, 'admins')
            ->post(route('admin.contact.response.store', $contact), [
                'subject' => 'ご返信',
                'body' => 'お問い合わせありがとうございます。',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('ai_staff_activity_logs', [
            'admin_id' => $aiStaff->id,
            'action' => AiStaffActivityLog::ACTION_RESPONSE_CREATED,
        ]);
    }

    public function test_human_admin_creating_a_response_does_not_log_activity(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $contact = $this->createContact();

        $this->actingAs($admin, 'admins')
            ->post(route('admin.contact.response.store', $contact), [
                'subject' => 'ご返信',
                'body' => 'お問い合わせありがとうございます。',
            ])
            ->assertRedirect();

        $this->assertDatabaseCount('ai_staff_activity_logs', 0);
    }
}
