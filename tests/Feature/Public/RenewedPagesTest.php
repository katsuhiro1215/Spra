<?php

namespace Tests\Feature\Public;

use App\Models\Faq;
use App\Models\FaqCategory;
use App\Models\Organization;
use App\Models\Page;
use App\Models\PageType;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * 公開サイトのリニューアル段階2（下層ページ）の挙動確認
 * 設計: docs/superpowers/specs/2026-10-30-public-site-renewal-design.md
 */
class RenewedPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_flow_page_is_accessible(): void
    {
        $this->get('/flow')->assertOk()->assertInertia(fn (Assert $page) => $page->component('Public/Flow'));
    }

    public function test_service_index_only_lists_displayed_services_with_displayed_categories(): void
    {
        $shown = ServiceCategory::create(['name' => '公開中カテゴリ', 'slug' => 'shown', 'status' => 'active', 'is_displayed' => true]);
        $hidden = ServiceCategory::create(['name' => '非公開カテゴリ', 'slug' => 'hidden', 'status' => 'active', 'is_displayed' => false]);
        Service::create(['name' => '公開サービス', 'slug' => 'visible-service', 'service_category_id' => $shown->id, 'status' => 'active', 'is_displayed' => true, 'description' => '説明']);
        Service::create(['name' => '非表示サービス', 'slug' => 'hidden-service', 'service_category_id' => $shown->id, 'status' => 'active', 'is_displayed' => false, 'description' => '説明']);
        Service::create(['name' => 'カテゴリ非公開サービス', 'slug' => 'in-hidden-category', 'service_category_id' => $hidden->id, 'status' => 'active', 'is_displayed' => true, 'description' => '説明']);

        $this->get('/service')->assertInertia(fn (Assert $page) => $page
            ->has('services', 1)
            ->where('services.0.name', '公開サービス'));
    }

    public function test_service_detail_404s_for_hidden_service(): void
    {
        $category = ServiceCategory::create(['name' => 'カテゴリ', 'slug' => 'cat', 'status' => 'active', 'is_displayed' => true]);
        Service::create(['name' => '非表示', 'slug' => 'not-shown', 'service_category_id' => $category->id, 'status' => 'active', 'is_displayed' => false, 'description' => '説明']);

        $this->get('/services/not-shown')->assertNotFound();
    }

    public function test_service_detail_shows_displayed_service(): void
    {
        $category = ServiceCategory::create(['name' => 'カテゴリ', 'slug' => 'cat', 'status' => 'active', 'is_displayed' => true]);
        Service::create(['name' => '公開サービス', 'slug' => 'open-service', 'service_category_id' => $category->id, 'status' => 'active', 'is_displayed' => true, 'description' => '説明文']);

        $this->get('/services/open-service')->assertInertia(fn (Assert $page) => $page
            ->component('Public/ServiceDetail')
            ->where('service.name', '公開サービス'));
    }

    public function test_faq_page_groups_by_category_and_hides_unpublished(): void
    {
        $category = FaqCategory::create(['name' => '料金', 'slug' => 'pricing', 'is_active' => true, 'sort_order' => 1]);
        Faq::create(['faq_category_id' => $category->id, 'question' => '公開中の質問', 'answer' => '回答', 'is_published' => true, 'sort_order' => 1]);
        Faq::create(['faq_category_id' => $category->id, 'question' => '非公開の質問', 'answer' => '回答', 'is_published' => false]);

        $pageType = PageType::create(['key' => 'static', 'name' => '固定ページ', 'slug' => 'static']);
        Page::create(['slug' => 'faq', 'title' => 'よくある質問', 'is_published' => true, 'page_type_id' => $pageType->id]);

        $this->get('/faq')->assertInertia(fn (Assert $page) => $page
            ->has('categories', 1)
            ->has('categories.0.published_faqs', 1)
            ->where('categories.0.published_faqs.0.question', '公開中の質問'));
    }

    public function test_company_page_shows_city_level_address_only(): void
    {
        $org = Organization::create(['name' => 'SmartSprouts', 'representative_name' => '栫 勝宏']);
        $org->addresses()->create([
            'type' => 'office',
            'postal_code' => '6300000',
            'prefecture' => '奈良県',
            'city' => '奈良市',
            'district' => '南紀寺町1-2-3',
            'is_default' => true,
            'is_active' => true,
        ]);

        $response = $this->get('/company');
        $response->assertOk();
        // 個人事業主の自宅兼事務所のため、番地（district）・郵便番号はサーバーから送らない（設計書の変更点）。
        // Inertiaの初回応答はSSRしないため、画面の文字列ではなく data-page のJSONを直接検証する
        $this->assertSame(
            ['prefecture' => '奈良県', 'city' => '奈良市'],
            $response->viewData('page')['props']['organization']['default_address'][0],
        );
        $response->assertDontSee('南紀寺町1-2-3');
        $response->assertDontSee('6300000');
    }
}
