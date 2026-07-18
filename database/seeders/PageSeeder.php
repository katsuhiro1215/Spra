<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\PageType;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * id は Eloquent(HasUlid)側で自動生成させるため、ここでは指定しない。
     * page_type_id は PageTypeSeeder 実行後に確定した実際の id を都度引いて設定する。
     *
     * 注意: 公開サイトのトップページ("/") は resources/js/Pages/Public/Home.jsx を
     * 直接描画しており、ここで作成する Page レコード(front_page)はまだ連動していない。
     * 管理画面でPageType→Page→Sectionの流れを確認するためのサンプルデータという位置づけ。
     */
    public function run(): void
    {
        $frontPageType = PageType::where('key', 'front_page')->first();
        $staticPageType = PageType::where('key', 'static')->first();
        $postListPageType = PageType::where('key', 'post_list')->first();
        $landingPageType = PageType::where('key', 'landing_page')->first();
        $contactPageType = PageType::where('key', 'contact')->first();
        $privacyPolicyPageType = PageType::where('key', 'privacy_policy')->first();
        $customPostListPageType = PageType::where('key', 'custom_post_list')->first();

        $pages = [
            [
                [
                    'slug' => 'home',
                    'page_type_id' => $frontPageType->id,
                    'title' => 'トップページ',
                    'template' => 'default',
                    'meta_title' => 'Smart Sprouts | スプラ公式サイト',
                    'meta_description' => 'Smart Sproutsは、あなたのビジネスを次の成長ステージへ導くデジタルパートナーです。',
                    'is_published' => true,
                    'published_at' => now(),
                    'sort_order' => 1,
                ],
                // about
                [
                    'slug' => 'about',
                    'page_type_id' => $staticPageType->id,
                    'title' => '私たちについて',
                    'template' => 'default',
                    'meta_title' => '私たちについて | Smart Sprouts',
                    'meta_description' => 'Smart Sproutsの私たちについてページです。',
                    'is_published' => true,
                    'published_at' => now(),
                    'sort_order' => 2,
                ],
                // service
                [
                    'slug' => 'service',
                    'page_type_id' => $staticPageType->id,
                    'title' => 'サービス紹介',
                    'template' => 'default',
                    'meta_title' => 'サービス紹介 | Smart Sprouts',
                    'meta_description' => 'Smart Sproutsのサービス紹介ページです。',
                    'is_published' => true,
                    'published_at' => now(),
                    'sort_order' => 3,
                ],
                // blog
                [
                    'slug' => 'blog',
                    'page_type_id' => $staticPageType->id,
                    'title' => 'ブログ',
                    'template' => 'default',
                    'meta_title' => 'ブログ | Smart Sprouts',
                    'meta_description' => 'Smart Sproutsのブログページです。',
                    'is_published' => true,
                    'published_at' => now(),
                    'sort_order' => 4,
                ],
                // company
                [
                    'slug' => 'company',
                    'page_type_id' => $staticPageType->id,
                    'title' => '会社概要',
                    'template' => 'default',
                    'meta_title' => '会社概要 | Smart Sprouts',
                    'meta_description' => 'Smart Sproutsの会社概要ページです。',
                    'is_published' => true,
                    'published_at' => now(),
                    'sort_order' => 5,
                ],
                // faq
                [
                    'slug' => 'faq',
                    'page_type_id' => $staticPageType->id,
                    'title' => 'よくある質問',
                    'template' => 'default',
                    'meta_title' => 'よくある質問 | Smart Sprouts',
                    'meta_description' => 'Smart Sproutsのよくある質問ページです。',
                    'is_published' => true,
                    'published_at' => now(),
                    'sort_order' => 6,
                ],
                // contact
                [
                    'slug' => 'contact',
                    'page_type_id' => $contactPageType->id,
                    'title' => 'お問い合わせ',
                    'template' => 'default',
                    'meta_title' => 'お問い合わせ | Smart Sprouts',
                    'meta_description' => 'Smart Sproutsのお問い合わせページです。',
                    'is_published' => true,
                    'published_at' => now(),
                    'sort_order' => 7,
                ],
                // privacy-policy
                [
                    'slug' => 'privacy-policy',
                    'page_type_id' => $privacyPolicyPageType->id,
                    'title' => 'プライバシーポリシー',
                    'template' => 'default',
                    'meta_title' => 'プライバシーポリシー | Smart Sprouts',
                    'meta_description' => 'Smart Sproutsのプライバシーポリシーページです。',
                    'is_published' => true,
                    'published_at' => now(),
                    'sort_order' => 8,
                ],
            ],
        ];

        foreach ($pages as $pageGroup) {
            foreach ($pageGroup as $page) {
                Page::updateOrCreate(
                    ['slug' => $page['slug']],
                    $page,
                );
            }
        }
    }
}
