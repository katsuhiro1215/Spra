<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Hearing;
use App\Models\HearingTemplateItem;
use Database\Seeders\HearingTemplateItemSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HearingControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->seed(HearingTemplateItemSeeder::class);
    }

    private function makeContact(): Contact
    {
        $category = ContactCategory::create([
            'name' => '一般的な問い合わせ',
            'slug' => 'general',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        return Contact::create([
            'contact_category_id' => $category->id,
            'name' => 'テスト太郎',
            'email' => 'hearing-test@example.com',
            'message' => 'ホームページ制作について相談したいです。',
            'status' => 'new',
        ]);
    }

    public function test_admin_can_create_hearing_with_answers(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $contact = $this->makeContact();

        $singleChoiceItem = HearingTemplateItem::where('type', 'single_choice')->firstOrFail();
        $multiChoiceItem = HearingTemplateItem::where('type', 'multi_choice')->firstOrFail();
        $textItem = HearingTemplateItem::where('type', 'text')->firstOrFail();

        $response = $this->actingAs($admin, 'admins')->post(
            route('admin.contact.hearing.store', $contact->id),
            [
                'title' => 'テスト太郎様 ヒアリング',
                'notes' => '電話にて実施',
                'answers' => [
                    [
                        'hearing_template_item_id' => $singleChoiceItem->id,
                        'answer_options' => [$singleChoiceItem->options[0]],
                    ],
                    [
                        'hearing_template_item_id' => $multiChoiceItem->id,
                        'answer_options' => [
                            $multiChoiceItem->options[0],
                            $multiChoiceItem->options[1],
                        ],
                    ],
                    [
                        'hearing_template_item_id' => $textItem->id,
                        'answer_text' => 'https://example.com/reference',
                    ],
                ],
            ],
        );

        $hearing = Hearing::where('contact_id', $contact->id)->firstOrFail();
        $response->assertRedirect(route('admin.contact.hearing.show', [
            'contact' => $contact->id,
            'hearing' => $hearing->id,
        ]));

        $this->assertDatabaseHas('hearings', [
            'contact_id' => $contact->id,
            'title' => 'テスト太郎様 ヒアリング',
            'created_by' => $admin->id,
        ]);
        $this->assertSame(3, $hearing->answers()->count());

        $textAnswer = $hearing->answers()->where('hearing_template_item_id', $textItem->id)->first();
        $this->assertSame('https://example.com/reference', $textAnswer->answer_text);

        $multiAnswer = $hearing->answers()->where('hearing_template_item_id', $multiChoiceItem->id)->first();
        $this->assertCount(2, $multiAnswer->answer_options);
    }

    public function test_unanswered_items_are_not_saved(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $contact = $this->makeContact();

        $textItem = HearingTemplateItem::where('type', 'text')->firstOrFail();

        $this->actingAs($admin, 'admins')->post(
            route('admin.contact.hearing.store', $contact->id),
            [
                'title' => '未回答テスト',
                'answers' => [
                    [
                        'hearing_template_item_id' => $textItem->id,
                        'answer_text' => '',
                    ],
                ],
            ],
        );

        $hearing = Hearing::where('title', '未回答テスト')->firstOrFail();

        // 空回答(未回答)の項目は保存しない
        $this->assertSame(0, $hearing->answers()->count());
    }

    public function test_admin_can_update_hearing_answers(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $contact = $this->makeContact();
        $textItem = HearingTemplateItem::where('type', 'text')->firstOrFail();

        $hearing = Hearing::create([
            'contact_id' => $contact->id,
            'title' => '更新前タイトル',
            'created_by' => $admin->id,
        ]);
        $hearing->answers()->create([
            'hearing_template_item_id' => $textItem->id,
            'answer_text' => '旧回答',
        ]);

        $this->actingAs($admin, 'admins')->put(
            route('admin.contact.hearing.update', [
                'contact' => $contact->id,
                'hearing' => $hearing->id,
            ]),
            [
                'title' => '更新後タイトル',
                'answers' => [
                    [
                        'hearing_template_item_id' => $textItem->id,
                        'answer_text' => '新回答',
                    ],
                ],
            ],
        )->assertRedirect(route('admin.contact.hearing.show', [
            'contact' => $contact->id,
            'hearing' => $hearing->id,
        ]));

        $hearing->refresh();
        $this->assertSame('更新後タイトル', $hearing->title);
        $this->assertSame(1, $hearing->answers()->count());
        $this->assertSame('新回答', $hearing->answers()->first()->answer_text);
    }

    public function test_admin_can_view_hearing(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $contact = $this->makeContact();

        $hearing = Hearing::create([
            'contact_id' => $contact->id,
            'title' => '閲覧テスト',
            'created_by' => $admin->id,
        ]);

        $this->actingAs($admin, 'admins')
            ->get(route('admin.contact.hearing.show', [
                'contact' => $contact->id,
                'hearing' => $hearing->id,
            ]))
            ->assertOk();
    }

    public function test_owner_can_delete_hearing(): void
    {
        // destroy系操作は「admin」ロールには権限として付与されない設計
        // （config/admin_permissions.phpのadmin_role_excluded_actions）ため、
        // 削除操作はownerロールで検証する。
        $owner = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $contact = $this->makeContact();

        $hearing = Hearing::create([
            'contact_id' => $contact->id,
            'title' => '削除テスト',
            'created_by' => $owner->id,
        ]);

        $this->actingAs($owner, 'admins')
            ->delete(route('admin.contact.hearing.destroy', [
                'contact' => $contact->id,
                'hearing' => $hearing->id,
            ]))
            ->assertRedirect(route('admin.contact.show', $contact));

        $this->assertSoftDeleted('hearings', ['id' => $hearing->id]);
    }
}
