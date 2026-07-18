<?php

namespace Database\Seeders;

use App\Models\PageType;
use Illuminate\Database\Seeder;

class PageTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * allowed_component_types: BlockUI registry(resources/js/Components/BlockUI/registry.js)の
     * ブロックタイプキーのみを指定する。空配列の場合は全ブロックが使用可能。
     *
     * default_layout.sections: ページ新規作成時に自動生成されるセクションの初期構成。
     * role は Section.role カラムに対応（hero / main / sidebar / footer）。
     *
     * id は Eloquent(HasUlid)側で自動生成させるため、ここでは指定しない。
     */
    public function run(): void
    {
        $pageTypes = [
            // 1. トップページ
            [
                'key' => 'front_page',
                'name' => 'トップページ',
                'slug' => 'front_page',
                'description' => 'サイトのトップページ（1サイトに1つ推奨）',
                'is_system' => true,
                'is_dynamic' => false,
                'has_detail' => false,
                'allowed_component_types' => [
                    'hero', 'heading', 'text', 'image', 'button', 'cta',
                    'stats', 'iconText', 'cardGroup', 'gallery',
                    'video', 'logoCloud', 'quote', 'divider', 'accordion',
                ],
                'default_layout' => [
                    'sections' => [
                        ['role' => 'hero', 'name' => 'ヒーローセクション'],
                        ['role' => 'main', 'name' => 'メインコンテンツ'],
                    ],
                ],
            ],

            // 2. 固定ページ
            [
                'key' => 'static',
                'name' => '固定ページ',
                'slug' => 'static',
                'description' => '会社概要、サービス紹介などの静的コンテンツページ',
                'is_system' => true,
                'is_dynamic' => false,
                'has_detail' => false,
                'allowed_component_types' => [
                    'heading', 'text', 'image', 'button', 'cta', 'quote',
                    'stats', 'iconText', 'card', 'cardGroup', 'gallery',
                    'video', 'accordion', 'tabs', 'divider', 'logoCloud',
                ],
                'default_layout' => [
                    'sections' => [
                        ['role' => 'hero', 'name' => 'ページヘッダー'],
                        ['role' => 'main', 'name' => 'メインコンテンツ'],
                    ],
                ],
            ],

            // 3. 投稿一覧（ブログ）
            [
                'key' => 'post_list',
                'name' => '投稿一覧',
                'slug' => 'post_list',
                'description' => 'ブログ記事やニュースなどの投稿一覧ページ（アーカイブ）',
                'is_system' => true,
                'is_dynamic' => true,
                'has_detail' => true,
                // 一覧本体（記事グリッド・ページネーション等）はブロックではなくアーカイブテンプレートが描画するため、
                // ブロックで編集できるのは一覧上部の導入文のみを想定
                'allowed_component_types' => ['heading', 'text', 'cta'],
                'default_layout' => [
                    'sections' => [
                        ['role' => 'hero', 'name' => 'アーカイブ見出し'],
                    ],
                ],
            ],

            // 4. ランディングページ
            [
                'key' => 'landing_page',
                'name' => 'ランディングページ',
                'slug' => 'landing_page',
                'description' => 'キャンペーンやプロモーション用のLP（コンバージョン重視）',
                'is_system' => true,
                'is_dynamic' => false,
                'has_detail' => false,
                'allowed_component_types' => [
                    'heading', 'text', 'image', 'button', 'cta',
                    'stats', 'iconText', 'card', 'cardGroup', 'quote',
                    'video', 'accordion', 'divider', 'logoCloud',
                ],
                'default_layout' => [
                    'sections' => [
                        ['role' => 'hero', 'name' => 'ヒーロー'],
                        ['role' => 'main', 'name' => '本文'],
                    ],
                ],
            ],

            // 5. お問い合わせ
            [
                'key' => 'contact',
                'name' => 'お問い合わせ',
                'slug' => 'contact',
                'description' => 'お問い合わせページ（フォーム機能付き）',
                'is_system' => true,
                'is_dynamic' => false,
                'has_detail' => false,
                // フォーム本体は専用コンポーネントで描画するため、ブロックは導入文・案内文のみを想定
                'allowed_component_types' => ['heading', 'text', 'iconText', 'divider'],
                'default_layout' => [
                    'sections' => [
                        ['role' => 'hero', 'name' => 'ページヘッダー'],
                        ['role' => 'main', 'name' => '案内文'],
                    ],
                ],
            ],

            // 6. プライバシーポリシー
            [
                'key' => 'privacy_policy',
                'name' => 'プライバシーポリシー',
                'slug' => 'privacy_policy',
                'description' => 'プライバシーポリシー・個人情報保護方針ページ',
                'is_system' => true,
                'is_dynamic' => false,
                'has_detail' => false,
                'allowed_component_types' => ['heading', 'text', 'accordion', 'divider'],
                'default_layout' => [
                    'sections' => [
                        ['role' => 'hero', 'name' => 'ページヘッダー'],
                        ['role' => 'main', 'name' => 'ポリシー本文'],
                    ],
                ],
            ],

            // 7. カスタム投稿一覧（Admin追加可能）
            [
                'key' => 'custom_post_list',
                'name' => 'カスタム投稿一覧',
                'slug' => 'custom_post_list',
                'description' => 'お客様の声、実績、ニュースなどの自由なカスタム投稿一覧（Adminが追加可能）',
                'is_system' => false,
                'is_dynamic' => true,
                'has_detail' => true,
                'allowed_component_types' => ['heading', 'text', 'cta'],
                'default_layout' => [
                    'sections' => [
                        ['role' => 'hero', 'name' => 'アーカイブ見出し'],
                    ],
                ],
            ],
        ];

        foreach ($pageTypes as $pageType) {
            PageType::updateOrCreate(
                ['key' => $pageType['key']],
                $pageType,
            );
        }
    }
}
