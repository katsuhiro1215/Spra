<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\ContactApiClient;
use App\Models\ContactCategory;
use App\Models\Quote;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServiceItem;
use App\Models\ServicePlan;
use App\Models\ServicePlanItem;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Tests\TestCase;

class EstimateSimulatorApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        // /api/estimate-simulator/* は throttle:30,1 が付いており、同一プロセス内で
        // 複数テストを実行するとレート制限に引っかかるため無効化する
        $this->withoutMiddleware(ThrottleRequests::class);
    }

    private function createApiClient(): string
    {
        $generated = ContactApiClient::generateKey();

        ContactApiClient::create([
            'name' => 'かつコード連携テスト',
            'api_key_hash' => $generated['hash'],
            'key_preview' => $generated['preview'],
            'is_active' => true,
        ]);

        return $generated['plainKey'];
    }

    /**
     * @return array{service: Service, plan: ServicePlan, addon: ServiceItem}
     */
    private function createServiceCatalog(): array
    {
        $category = ServiceCategory::create([
            'name' => 'Web制作',
            'slug' => 'web-'.uniqid(),
            'status' => 'active',
        ]);
        $service = Service::create([
            'name' => 'コーポレートサイト制作',
            'slug' => 'corporate-'.uniqid(),
            'service_category_id' => $category->id,
            'description' => 'テスト',
            'status' => 'active',
            'is_displayed' => true,
        ]);
        $plan = ServicePlan::create([
            'name' => 'スタンダードプラン',
            'slug' => 'standard-'.uniqid(),
            'service_id' => $service->id,
            'base_price' => 300000,
            'billing_cycle' => 'one_time',
            'status' => 'active',
            'is_displayed' => true,
        ]);
        $planItem = ServiceItem::create([
            'service_id' => $service->id,
            'name' => 'トップページ制作',
            'slug' => 'top-page-'.uniqid(),
            'item_type' => 'included',
            'standard_price' => 300000,
            'status' => 'active',
        ]);
        ServicePlanItem::create([
            'service_plan_id' => $plan->id,
            'service_item_id' => $planItem->id,
            'quantity' => 1,
            'sort_order' => 0,
        ]);
        $addon = ServiceItem::create([
            'service_id' => $service->id,
            'name' => 'お問い合わせフォーム追加',
            'slug' => 'contact-form-'.uniqid(),
            'item_type' => 'addon',
            'standard_price' => 50000,
            'status' => 'active',
        ]);

        return ['service' => $service, 'plan' => $plan, 'addon' => $addon];
    }

    // ---------------------------------------------------------------
    // Web版(EstimateSimulatorController)の回帰確認
    // Service抽出後も既存の挙動が変わっていないことを確認する
    // ---------------------------------------------------------------

    public function test_web_save_creates_contact_and_draft_quote_as_a_guest(): void
    {
        Admin::factory()->create(['role' => 'admin']);
        ContactCategory::create([
            'name' => '見積もり依頼',
            'slug' => ContactCategory::SLUG_QUOTE_REQUEST,
            'sort_order' => 1,
            'is_active' => true,
        ]);
        $catalog = $this->createServiceCatalog();

        $response = $this->post(route('estimate.simulator.save'), [
            'service_id' => $catalog['service']->id,
            'service_plan_id' => $catalog['plan']->id,
            'selected_addon_ids' => [$catalog['addon']->id],
            'estimated_price' => 385000,
            'estimated_days' => 14,
            'title' => 'コーポレートサイト制作 - スタンダードプラン',
            'notes' => 'テスト備考',
            'name' => 'ゲスト太郎',
            'email' => 'web-simulator-guest@example.com',
            'phone' => '090-0000-0000',
            'company' => 'テスト株式会社',
        ]);

        $response->assertSessionDoesntHaveErrors();

        $contact = Contact::where('email', 'web-simulator-guest@example.com')->firstOrFail();
        $this->assertSame('estimate_simulator', $contact->source);

        $quote = Quote::where('contact_id', $contact->id)->firstOrFail();
        $this->assertSame('draft', $quote->status);
        $this->assertNotNull($quote->currentVersion);
        // base_price(300000) + addon(50000) = 350000、税10% = 385000
        $this->assertSame(385000.0, (float) $quote->currentVersion->total_amount);
    }

    public function test_web_save_rejects_an_undisplayed_service(): void
    {
        Admin::factory()->create(['role' => 'admin']);
        ContactCategory::create([
            'name' => '見積もり依頼',
            'slug' => ContactCategory::SLUG_QUOTE_REQUEST,
            'sort_order' => 1,
            'is_active' => true,
        ]);
        $catalog = $this->createServiceCatalog();
        $catalog['plan']->update(['is_displayed' => false]);

        $response = $this->post(route('estimate.simulator.save'), [
            'service_id' => $catalog['service']->id,
            'service_plan_id' => $catalog['plan']->id,
            'estimated_price' => 300000,
            'title' => 'テスト',
            'name' => 'ゲスト太郎',
            'email' => 'web-simulator-rejected@example.com',
        ]);

        $response->assertSessionHasErrors('error');
        $this->assertDatabaseMissing('contacts', ['email' => 'web-simulator-rejected@example.com']);
    }

    // ---------------------------------------------------------------
    // 外部API版(EstimateSimulatorApiController)
    // ---------------------------------------------------------------

    public function test_api_options_returns_the_catalog_with_a_valid_key(): void
    {
        $plainKey = $this->createApiClient();
        $catalog = $this->createServiceCatalog();

        $response = $this->withHeaders(['X-Api-Key' => $plainKey])
            ->getJson('/api/estimate-simulator/options');

        $response->assertOk();
        $response->assertJsonStructure([
            'serviceCategories', 'services', 'servicePlans', 'serviceItems', 'servicePlanItems',
        ]);
    }

    public function test_api_options_rejects_an_invalid_key(): void
    {
        $response = $this->withHeaders(['X-Api-Key' => 'invalid-key'])
            ->getJson('/api/estimate-simulator/options');

        $response->assertStatus(401);
    }

    public function test_api_store_creates_a_draft_quote_linked_to_the_api_client(): void
    {
        Admin::factory()->create(['role' => 'admin']);
        ContactCategory::create([
            'name' => '見積もり依頼',
            'slug' => ContactCategory::SLUG_QUOTE_REQUEST,
            'sort_order' => 1,
            'is_active' => true,
        ]);
        $plainKey = $this->createApiClient();
        $catalog = $this->createServiceCatalog();

        $response = $this->withHeaders(['X-Api-Key' => $plainKey])
            ->postJson('/api/estimate-simulator', [
                'service_id' => $catalog['service']->id,
                'service_plan_id' => $catalog['plan']->id,
                'selected_addon_ids' => [$catalog['addon']->id],
                'title' => 'コーポレートサイト制作 - スタンダードプラン',
                'notes' => 'かつコード経由のテスト',
                'name' => 'かつコード訪問者',
                'email' => 'api-simulator-guest@example.com',
                'phone' => '090-1111-2222',
                'page_url' => 'https://katsu-code.example.com/estimate',
                'visitor_ip' => '203.0.113.10',
                'visitor_user_agent' => 'TestAgent/1.0',
            ]);

        $response->assertOk()->assertJson(['success' => true]);
        $this->assertSame(385000.0, (float) $response->json('quote.total_amount'));

        $contact = Contact::where('email', 'api-simulator-guest@example.com')->firstOrFail();
        $this->assertSame('estimate_simulator_api', $contact->source);
        $this->assertSame('203.0.113.10', $contact->ip);
        $this->assertNotNull($contact->api_client_id);

        $quote = Quote::where('contact_id', $contact->id)->firstOrFail();
        $this->assertSame('draft', $quote->status);
        $this->assertNull($quote->user_id);
    }

    public function test_api_store_rejects_an_invalid_key(): void
    {
        $catalog = $this->createServiceCatalog();

        $response = $this->withHeaders(['X-Api-Key' => 'invalid-key'])
            ->postJson('/api/estimate-simulator', [
                'service_id' => $catalog['service']->id,
                'service_plan_id' => $catalog['plan']->id,
                'title' => 'テスト',
                'name' => 'テスト太郎',
                'email' => 'api-simulator-rejected@example.com',
            ]);

        $response->assertStatus(401);
        $this->assertDatabaseMissing('contacts', ['email' => 'api-simulator-rejected@example.com']);
    }

    public function test_api_store_rejects_an_undisplayed_plan(): void
    {
        Admin::factory()->create(['role' => 'admin']);
        ContactCategory::create([
            'name' => '見積もり依頼',
            'slug' => ContactCategory::SLUG_QUOTE_REQUEST,
            'sort_order' => 1,
            'is_active' => true,
        ]);
        $plainKey = $this->createApiClient();
        $catalog = $this->createServiceCatalog();
        $catalog['plan']->update(['is_displayed' => false]);

        $response = $this->withHeaders(['X-Api-Key' => $plainKey])
            ->postJson('/api/estimate-simulator', [
                'service_id' => $catalog['service']->id,
                'service_plan_id' => $catalog['plan']->id,
                'title' => 'テスト',
                'name' => 'テスト太郎',
                'email' => 'api-simulator-undisplayed@example.com',
            ]);

        $response->assertStatus(422)->assertJson(['success' => false]);
        $this->assertDatabaseMissing('contacts', ['email' => 'api-simulator-undisplayed@example.com']);
    }
}
