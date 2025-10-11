<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Page;
use App\Models\Service;
use App\Models\Faq;
use App\Models\SiteSetting;
use App\Models\Admin;
use App\Models\Blog;
use App\Models\BlogCategory;

class HomepageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // サイト設定を作成
        $this->createSiteSettings();

        // カテゴリを作成
        $this->createBlogCategories();

        // 固定ページを作成
        $this->createPages();

        // サービスを作成
        $this->createServices();

        // ブログ投稿を作成
        $this->createBlogs();

        // FAQを作成
        $this->createFaqs();
    }

    private function createSiteSettings()
    {
        $settings = [
            // 基本情報
            ['key' => 'site_name', 'value' => 'SPRA株式会社', 'type' => 'text', 'group' => 'basic', 'description' => 'サイト名'],
            ['key' => 'site_description', 'value' => 'システム開発・Web開発の専門企業', 'type' => 'text', 'group' => 'basic', 'description' => 'サイトの説明'],
            ['key' => 'site_keywords', 'value' => 'システム開発,Web開発,アプリ開発,Laravel,React', 'type' => 'text', 'group' => 'basic', 'description' => 'サイトキーワード'],

            // 連絡先情報
            ['key' => 'company_name', 'value' => 'SPRA株式会社', 'type' => 'text', 'group' => 'contact', 'description' => '会社名'],
            ['key' => 'phone', 'value' => '03-1234-5678', 'type' => 'text', 'group' => 'contact', 'description' => '電話番号'],
            ['key' => 'email', 'value' => 'contact@spra.co.jp', 'type' => 'email', 'group' => 'contact', 'description' => 'メールアドレス'],
            ['key' => 'address', 'value' => '東京都渋谷区渋谷1-1-1', 'type' => 'text', 'group' => 'contact', 'description' => '住所'],

            // SNS
            ['key' => 'twitter_url', 'value' => 'https://twitter.com/spra_corp', 'type' => 'url', 'group' => 'social', 'description' => 'Twitter URL'],
            ['key' => 'facebook_url', 'value' => 'https://facebook.com/spra.corp', 'type' => 'url', 'group' => 'social', 'description' => 'Facebook URL'],
            ['key' => 'linkedin_url', 'value' => 'https://linkedin.com/company/spra', 'type' => 'url', 'group' => 'social', 'description' => 'LinkedIn URL'],

            // SEO
            ['key' => 'google_analytics_id', 'value' => 'GA-XXXXXXXXX', 'type' => 'text', 'group' => 'seo', 'description' => 'Google Analytics ID'],
            ['key' => 'google_tag_manager_id', 'value' => 'GTM-XXXXXXX', 'type' => 'text', 'group' => 'seo', 'description' => 'Google Tag Manager ID'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }

    private function createBlogCategories()
    {
        $blogCategories = [
            ['name' => '技術', 'slug' => 'technology', 'description' => '技術に関する記事', 'color' => '#3B82F6', 'sort_order' => 1],
            ['name' => 'ビジネス', 'slug' => 'business', 'description' => 'ビジネスに関する記事', 'color' => '#10B981', 'sort_order' => 2],
            ['name' => '事例', 'slug' => 'case-study', 'description' => '導入事例', 'color' => '#F59E0B', 'sort_order' => 3],
            ['name' => 'お知らせ', 'slug' => 'news', 'description' => '会社のお知らせ', 'color' => '#EF4444', 'sort_order' => 4],
        ];

        foreach ($blogCategories as $blogCategory) {
            BlogCategory::updateOrCreate(
                ['slug' => $blogCategory['slug']],
                $blogCategory
            );
        }
    }

    private function createPages()
    {
        $pages = [
            [
                'title' => 'ホーム',
                'slug' => 'home',
                'template' => 'home',
                'content' => [
                    'hero' => [
                        'title' => 'あなたのビジネスを次のレベルへ',
                        'subtitle' => 'SPRA株式会社は、最新技術を活用したシステム開発・Web開発で、お客様のビジネス成長をサポートします。',
                        'cta_text' => 'お問い合わせ',
                        'cta_link' => '/contact',
                        'background_image' => '/images/hero-bg.jpg'
                    ],
                    'features' => [
                        [
                            'title' => '豊富な実績',
                            'description' => '多様な業界での開発実績があります',
                            'icon' => 'trophy'
                        ],
                        [
                            'title' => '最新技術',
                            'description' => '常に最新技術をキャッチアップしています',
                            'icon' => 'code'
                        ],
                        [
                            'title' => '充実サポート',
                            'description' => '開発後の運用サポートも万全です',
                            'icon' => 'support'
                        ]
                    ]
                ],
                'meta' => [
                    'title' => 'SPRA株式会社 - システム開発・Web開発',
                    'description' => 'SPRA株式会社は、システム開発・Web開発の専門企業です。お客様のビジネス成長をサポートします。'
                ],
                'is_published' => true,
                'sort_order' => 1
            ],
            [
                'title' => '会社概要',
                'slug' => 'about',
                'template' => 'about',
                'content' => [
                    'intro' => [
                        'title' => 'SPRA株式会社について',
                        'content' => '私たちは、お客様のビジネス課題を技術で解決する専門企業です。'
                    ],
                    'mission' => '技術の力でビジネスを成長させる',
                    'vision' => 'すべての企業がITの恩恵を受けられる世界の実現',
                    'values' => [
                        '品質第一',
                        '顧客満足',
                        '技術革新',
                        'チームワーク'
                    ]
                ],
                'meta' => [
                    'title' => '会社概要 - SPRA株式会社',
                    'description' => 'SPRA株式会社の企業情報、ミッション、ビジョンをご紹介します。'
                ],
                'is_published' => true,
                'sort_order' => 2
            ],
            [
                'title' => 'お問い合わせ',
                'slug' => 'contact',
                'template' => 'contact',
                'content' => [
                    'form_fields' => [
                        'name' => '必須',
                        'email' => '必須',
                        'phone' => '任意',
                        'company' => '任意',
                        'subject' => '必須',
                        'message' => '必須',
                        'service_interest' => '任意',
                        'budget_range' => '任意'
                    ],
                    'office_info' => [
                        'address' => '東京都渋谷区渋谷1-1-1',
                        'phone' => '03-1234-5678',
                        'email' => 'contact@spra.co.jp',
                        'hours' => '平日 9:00-18:00'
                    ]
                ],
                'meta' => [
                    'title' => 'お問い合わせ - SPRA株式会社',
                    'description' => 'SPRA株式会社へのお問い合わせはこちらから。お気軽にご相談ください。'
                ],
                'is_published' => true,
                'sort_order' => 4
            ]
        ];

        foreach ($pages as $page) {
            Page::updateOrCreate(
                ['slug' => $page['slug']],
                $page
            );
        }
    }

    private function createServices()
    {
        $services = [
            [
                'name' => 'Webサイト開発',
                'slug' => 'web-development',
                'category' => 'web',
                'description' => 'モダンなWebサイトを構築します',
                'details' => 'レスポンシブデザイン、SEO最適化、高速なWebサイトを開発いたします。',
                'icon' => 'globe',
                'features' => [
                    'レスポンシブデザイン',
                    'SEO最適化',
                    'CMS構築',
                    'パフォーマンス最適化',
                    'ユーザビリティ向上',
                    '検索順位向上',
                    '管理の効率化',
                    '表示速度向上'
                ],
                'pricing' => [
                    ['name' => 'ベーシック', 'price' => 500000, 'description' => '基本的なコーポレートサイト'],
                    ['name' => 'スタンダード', 'price' => 1000000, 'description' => 'CMS付きWebサイト'],
                    ['name' => 'プレミアム', 'price' => 2000000, 'description' => 'カスタム機能付きWebサイト']
                ],
                'technologies' => ['Laravel', 'React', 'MySQL', 'AWS'],
                'demo_links' => [
                    ['name' => 'コーポレートサイト例', 'url' => 'https://demo.spra.co.jp/corporate'],
                    ['name' => 'ECサイト例', 'url' => 'https://demo.spra.co.jp/ecommerce']
                ],
                'gallery' => [
                    '/images/services/web-dev-1.jpg',
                    '/images/services/web-dev-2.jpg'
                ],
                'status' => 'active',
                'is_featured' => true,
                'sort_order' => 1
            ],
            [
                'name' => 'システム開発',
                'slug' => 'system-development',
                'category' => 'system',
                'description' => '業務システムを構築します',
                'details' => '顧客管理、在庫管理、販売管理など、様々な業務システムを開発いたします。',
                'icon' => 'cog',
                'features' => [
                    'カスタム開発',
                    'データベース設計',
                    'API開発',
                    '既存システム連携',
                    '業務効率化',
                    'データ一元管理',
                    '自動化による工数削減',
                    'リアルタイム分析'
                ],
                'pricing' => [
                    ['name' => 'ライト', 'price' => 1000000, 'description' => '小規模業務システム'],
                    ['name' => 'スタンダード', 'price' => 3000000, 'description' => '中規模業務システム'],
                    ['name' => 'エンタープライズ', 'price' => 10000000, 'description' => '大規模業務システム']
                ],
                'technologies' => ['Laravel', 'PostgreSQL', 'Redis', 'Docker'],
                'gallery' => [
                    '/images/services/system-dev-1.jpg',
                    '/images/services/system-dev-2.jpg'
                ],
                'status' => 'active',
                'is_featured' => true,
                'sort_order' => 2
            ],
            [
                'name' => 'モバイルアプリ開発',
                'slug' => 'mobile-app-development',
                'category' => 'app',
                'description' => 'iOS・Androidアプリを開発します',
                'details' => 'ネイティブアプリからハイブリッドアプリまで、用途に応じて最適な技術で開発いたします。',
                'icon' => 'mobile',
                'features' => [
                    'iOS・Android対応',
                    'ネイティブ・ハイブリッド対応',
                    'プッシュ通知',
                    'オフライン対応',
                    'ユーザーエンゲージメント向上',
                    'ブランド認知度向上',
                    '顧客接点の拡大',
                    'データ収集・分析'
                ],
                'pricing' => [
                    ['name' => 'シンプル', 'price' => 1500000, 'description' => '基本的なアプリ'],
                    ['name' => 'スタンダード', 'price' => 3000000, 'description' => '機能豊富なアプリ'],
                    ['name' => 'プレミアム', 'price' => 5000000, 'description' => '高機能アプリ']
                ],
                'technologies' => ['React Native', 'Flutter', 'Firebase', 'AWS'],
                'gallery' => [
                    '/images/services/app-dev-1.jpg',
                    '/images/services/app-dev-2.jpg'
                ],
                'status' => 'active',
                'is_featured' => false,
                'sort_order' => 3
            ]
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['slug' => $service['slug']],
                $service
            );
        }
    }

    private function createBlogs()
    {
        $admin = Admin::first();
        if (!$admin) return;

        $posts = [
            [
                'title' => 'Laravel 11の新機能解説',
                'slug' => 'laravel-11-new-features',
                'excerpt' => 'Laravel 11で追加された新機能について詳しく解説します。',
                'content' => '<p>Laravel 11では多くの新機能が追加されました。この記事では主要な新機能について詳しく解説します。</p><h2>主要な新機能</h2><ul><li>新しいルーティング機能</li><li>改善されたバリデーション</li><li>パフォーマンスの向上</li></ul>',
                'featured_image' => '/images/blog/laravel-11.jpg',
                'status' => 'published',
                'post_type' => 'blog',
                'meta' => [
                    'title' => 'Laravel 11の新機能解説 - SPRA Tech Blog',
                    'description' => 'Laravel 11で追加された新機能について詳しく解説します。'
                ],
                'published_at' => now()->subDays(7),
                'author_id' => $admin->id
            ],
            [
                'title' => 'React開発のベストプラクティス',
                'slug' => 'react-best-practices',
                'excerpt' => 'Reactアプリケーション開発で押さえておきたいベストプラクティスをご紹介。',
                'content' => '<p>Reactアプリケーションを効率的に開発するためのベストプラクティスをまとめました。</p><h2>コンポーネント設計</h2><p>再利用可能なコンポーネントの設計方法について説明します。</p>',
                'featured_image' => '/images/blog/react-best-practices.jpg',
                'status' => 'published',
                'post_type' => 'blog',
                'meta' => [
                    'title' => 'React開発のベストプラクティス - SPRA Tech Blog',
                    'description' => 'Reactアプリケーション開発で押さえておきたいベストプラクティスをご紹介。'
                ],
                'published_at' => now()->subDays(14),
                'author_id' => $admin->id
            ],
            [
                'title' => '株式会社A様 業務システム導入事例',
                'slug' => 'case-study-company-a',
                'excerpt' => '在庫管理システムの導入により業務効率が50%向上した事例をご紹介。',
                'content' => '<p>株式会社A様では、従来の手作業による在庫管理に課題を抱えていました。</p><h2>課題</h2><ul><li>在庫の把握に時間がかかる</li><li>在庫切れの発生</li><li>過剰在庫の発生</li></ul><h2>解決策</h2><p>リアルタイム在庫管理システムを導入しました。</p>',
                'featured_image' => '/images/blog/case-study-a.jpg',
                'status' => 'published',
                'post_type' => 'case_study',
                'published_at' => now()->subDays(21),
                'author_id' => $admin->id
            ]
        ];

        foreach ($posts as $post) {
            $blog = Blog::updateOrCreate(
                ['slug' => $post['slug']],
                $post
            );

            // カテゴリを設定
            if ($post['post_type'] === 'case_study') {
                $blogCategory = BlogCategory::where('slug', 'case-study')->first();
            } else {
                $blogCategory = BlogCategory::where('slug', 'technology')->first();
            }

            if ($blogCategory) {
                $blog->categories()->syncWithoutDetaching([$blogCategory->id]);
            }
        }
    }

    private function createFaqs()
    {
        $faqs = [
            [
                'question' => '開発期間はどのくらいかかりますか？',
                'answer' => 'プロジェクトの規模により異なりますが、Webサイトの場合は1-3ヶ月、システム開発の場合は3-6ヶ月程度が目安となります。詳細はお打ち合わせの際にご相談させていただきます。',
                'category' => 'general',
                'is_featured' => true,
                'sort_order' => 1
            ],
            [
                'question' => '料金体系について教えてください',
                'answer' => '案件の規模や内容により異なります。基本的には要件定義後にお見積もりを提示いたします。また、月額での保守サポートも承っております。',
                'category' => 'pricing',
                'is_featured' => true,
                'sort_order' => 2
            ],
            [
                'question' => '保守・サポートはありますか？',
                'answer' => 'はい、開発完了後も継続的な保守・サポートを提供しています。不具合修正、機能追加、セキュリティアップデートなど、お客様のご要望に応じてサポートいたします。',
                'category' => 'support',
                'is_featured' => true,
                'sort_order' => 3
            ],
            [
                'question' => 'どのような技術を使用していますか？',
                'answer' => 'Laravel、React、Vue.js、Node.js、Python、AWSなど、現代的な技術スタックを使用しています。プロジェクトの要件に応じて最適な技術を選定いたします。',
                'category' => 'technical',
                'is_featured' => false,
                'sort_order' => 4
            ],
            [
                'question' => '小規模な案件でも対応可能ですか？',
                'answer' => 'はい、小規模な案件から大規模なシステム開発まで幅広く対応しています。お気軽にご相談ください。',
                'category' => 'general',
                'is_featured' => false,
                'sort_order' => 5
            ]
        ];

        foreach ($faqs as $faq) {
            Faq::updateOrCreate(
                ['question' => $faq['question']],
                $faq
            );
        }
    }
}
