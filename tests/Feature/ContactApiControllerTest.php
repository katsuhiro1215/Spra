<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\ContactApiClient;
use App\Models\ContactCategory;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactApiControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function createApiClient(): string
    {
        $generated = ContactApiClient::generateKey();

        ContactApiClient::create([
            'name' => 'WordPress連携テスト',
            'api_key_hash' => $generated['hash'],
            'key_preview' => $generated['preview'],
            'is_active' => true,
        ]);

        return $generated['plainKey'];
    }

    public function test_store_creates_contact_and_notifies_admins(): void
    {
        Mail::fake();

        $plainKey = $this->createApiClient();
        $category = ContactCategory::create([
            'name' => '一般的な問い合わせ',
            'slug' => 'general',
            'sort_order' => 1,
            'is_active' => true,
        ]);
        $admin = Admin::factory()->create();

        $response = $this->withHeaders(['X-Api-Key' => $plainKey])
            ->postJson('/api/contacts', [
                'name' => 'テスト太郎',
                'email' => 'wp-contact-test@example.com',
                'phone' => '090-1234-5678',
                'contact_category_id' => $category->id,
                'subject' => 'テスト件名',
                'message' => 'テストメッセージ',
            ]);

        $response->assertOk()->assertJson(['success' => true]);

        $contact = Contact::where('email', 'wp-contact-test@example.com')->firstOrFail();
        $this->assertSame('wordpress', $contact->source);

        // 以前はAPI経由の場合ベル通知(adminNotifications)が抜けていた(回帰テスト)。
        $this->assertSame(1, $admin->fresh()->unreadNotifications()->count());
    }

    public function test_store_rejects_invalid_api_key(): void
    {
        $category = ContactCategory::create([
            'name' => '一般的な問い合わせ',
            'slug' => 'general',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $response = $this->withHeaders(['X-Api-Key' => 'invalid-key'])
            ->postJson('/api/contacts', [
                'name' => 'テスト太郎',
                'email' => 'wp-contact-test@example.com',
                'contact_category_id' => $category->id,
                'subject' => 'テスト件名',
                'message' => 'テストメッセージ',
            ]);

        $response->assertStatus(401);
    }
}
