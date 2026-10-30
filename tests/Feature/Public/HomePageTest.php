<?php

namespace Tests\Feature\Public;

use App\Models\Faq;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Portfolio;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * 公開サイトのトップ（リニューアル段階1）が管理画面のデータを正しく渡しているか
 * 設計: docs/superpowers/specs/2026-10-30-public-site-renewal-design.md §6
 */
class HomePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_renders_without_cms_data(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Home')
                ->has('journal', 0)
                ->has('faqs', 0)
                ->has('works', 0));
    }

    public function test_featured_faqs_are_preferred_and_answers_are_plain_text(): void
    {
        Faq::create(['question' => '通常の質問', 'answer' => '通常', 'is_published' => true, 'sort_order' => 1]);
        Faq::create(['question' => '注目の質問', 'answer' => '<p>回答です</p>', 'is_published' => true, 'is_featured' => true, 'sort_order' => 2]);
        Faq::create(['question' => '非公開の質問', 'answer' => '非公開', 'is_published' => false, 'is_featured' => true]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->has('faqs', 1)
            ->where('faqs.0.question', '注目の質問')
            ->where('faqs.0.answer', '回答です'));
    }

    public function test_faqs_fall_back_to_the_first_published_ones_when_none_are_featured(): void
    {
        foreach (range(1, 5) as $i) {
            Faq::create(['question' => "質問{$i}", 'answer' => '回答', 'is_published' => true, 'sort_order' => $i]);
        }

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->has('faqs', 4)
            ->where('faqs.0.question', '質問1'));
    }

    public function test_journal_links_news_and_blog_posts_to_their_own_urls(): void
    {
        $news = PostCategory::create(['name' => 'お知らせ', 'slug' => 'news']);
        $blog = PostCategory::create(['name' => 'ブログ', 'slug' => 'blog']);
        Post::create(['post_category_id' => $news->id, 'title' => 'お知らせ記事', 'slug' => 'notice', 'is_published' => true, 'published_at' => now()->subDay()]);
        Post::create(['post_category_id' => $blog->id, 'title' => 'ブログ記事', 'slug' => 'article', 'is_published' => true, 'published_at' => now()]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->has('journal', 2)
            ->where('journal.0.href', '/blog/article')
            ->where('journal.1.href', '/news/notice'));
    }

    public function test_only_displayed_works_are_shown(): void
    {
        Portfolio::create(['title' => '公開の実績', 'is_displayed' => true, 'completed_at' => '2026-08-01']);
        Portfolio::create(['title' => '非公開の実績', 'is_displayed' => false]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->has('works', 1)
            ->where('works.0.title', '公開の実績')
            ->where('works.0.date', '2026.08'));
    }

    public function test_footer_menu_is_shared_with_only_active_items(): void
    {
        $footer = Menu::create(['name' => 'フッターメニュー', 'slug' => 'footer', 'location' => 'footer']);
        MenuItem::create(['menu_id' => $footer->id, 'label' => '会社情報', 'url' => '/company', 'is_active' => true, 'sort_order' => 1]);
        MenuItem::create(['menu_id' => $footer->id, 'label' => '非表示', 'url' => '/hidden', 'is_active' => false, 'sort_order' => 2]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->has('footerMenu.menu_items', 1)
            ->where('footerMenu.menu_items.0.label', '会社情報'));
    }
}
