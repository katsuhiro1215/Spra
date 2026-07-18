<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * id は Eloquent(HasUlid)側で自動生成させるため、ここでは指定しない。
     *
     * トップページ("home"スラッグ)に、実際の
     * resources/js/Pages/Public/Section/HeroSection.jsx / AboutSection.jsx の内容を
     * ブロックデータとして反映したサンプルセクションを作成する。
     */
    public function run(): void
    {
        $page = Page::where('slug', 'home')->first();

        if (! $page) {
            return;
        }

        // hero: HeroSection.jsx のデフォルトスライド画像をそのまま反映
        $page->sections()->updateOrCreate(
            ['page_id' => $page->id, 'role' => 'hero'],
            [
                'name' => 'ヒーローセクション',
                'sort_order' => 0,
                'content' => [
                    'blocks' => [
                        [
                            'id' => (string) Str::ulid(),
                            'type' => 'hero',
                            'data' => [
                                'images' => [
                                    '/upload/test1.jpg',
                                    '/upload/test2.jpg',
                                    '/upload/test3.jpg',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        );

        // main: AboutSection.jsx の見出し・本文・ボタン・3カードを反映
        $page->sections()->updateOrCreate(
            ['page_id' => $page->id, 'role' => 'main'],
            [
                'name' => 'メインコンテンツ',
                'sort_order' => 1,
                'content' => [
                    'blocks' => [
                        [
                            'id' => (string) Str::ulid(),
                            'type' => 'heading',
                            'data' => [
                                'text' => '私たちについて — ビジネスの実践の成長と管理をサポートします。',
                                'level' => 'h2',
                                'align' => 'left',
                            ],
                        ],
                        [
                            'id' => (string) Str::ulid(),
                            'type' => 'text',
                            'data' => [
                                'html' => '<p>私たちは企業の実務運用や成長プロセスを支援し、デジタル化・業務最適化・Web戦略などを包括的にサポートします。</p>',
                            ],
                        ],
                        [
                            'id' => (string) Str::ulid(),
                            'type' => 'button',
                            'data' => [
                                'label' => '私たちについて',
                                'url' => '/about',
                                'style' => 'primary',
                                'align' => 'left',
                                'openInNewTab' => false,
                            ],
                        ],
                        [
                            'id' => (string) Str::ulid(),
                            'type' => 'cardGroup',
                            'data' => [
                                'columns' => 3,
                                'items' => [
                                    [
                                        'icon' => '',
                                        'title' => 'デジタル変革',
                                        'text' => '最新のテクノロジーを活用し、ビジネスプロセスを効率化。DX推進で競争力を高めます。',
                                        'linkLabel' => '',
                                        'url' => '',
                                    ],
                                    [
                                        'icon' => '',
                                        'title' => '経営サポート',
                                        'text' => 'ビジネス全体の戦略設計から日々の業務改善まで、実践的なサポートを提供します。',
                                        'linkLabel' => '',
                                        'url' => '',
                                    ],
                                    [
                                        'icon' => '',
                                        'title' => 'Web・システム構築',
                                        'text' => 'ホームページ制作からシステム開発まで、効果のあるWeb活用を支援します。',
                                        'linkLabel' => '',
                                        'url' => '',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        );

        // cta: ContactSection.jsx の見出し・説明文・ボタンを反映
        $page->sections()->updateOrCreate(
            ['page_id' => $page->id, 'role' => 'cta'],
            [
                'name' => 'お問い合わせCTA',
                'sort_order' => 3,
                'content' => [
                    'blocks' => [
                        [
                            'id' => (string) Str::ulid(),
                            'type' => 'cta',
                            'data' => [
                                'heading' => 'まずはお気軽にご相談ください',
                                'text' => 'プロジェクトのご相談から、技術的なご質問まで専門スタッフが丁寧にお答えいたします',
                                'buttonLabel' => 'お問い合わせフォームへ',
                                'buttonUrl' => '/contact',
                                'openInNewTab' => false,
                                'background' => 'gradient',
                            ],
                        ],
                    ],
                ],
            ],
        );
    }
}
