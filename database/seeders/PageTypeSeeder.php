<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PageTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pageTypes = [
            // 1. トップページ
            [
                'id' => '01FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z', // ULIDを指定（例: 01FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z）
                'key' => 'front_page',
                'name' => 'トップページ',
                'slug' => 'front_page',
                'description' => 'サイトのトップページ（1サイトに1つ推奨）',
                'is_system' => true,
                'is_dynamic' => false,
                'has_detail' => false,
                'allowed_component_types' => json_encode([
                    'hero',
                    'features',
                    'about',
                    'services',
                    'latest_posts',
                    'testimonials',
                    'cta',
                    'contact_form',
                    'map',
                    'faq',
                ]),
                'default_layout' => json_encode([
                    'sections' => [
                        ['component_type' => 'hero', 'name' => 'ヒーローセクション'],
                        ['component_type' => 'features', 'name' => '特徴'],
                        ['component_type' => 'latest_posts', 'name' => '最新記事', 'props' => ['count' => 3]],
                        ['component_type' => 'cta', 'name' => 'お問い合わせCTA'],
                    ],
                ]),
            ],

            // 2. 固定ページ
            [
                'id' => '02FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z', // ULIDを指定（例: 01FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z）
                'key' => 'static',
                'name' => '固定ページ',
                'slug' => 'static',
                'description' => '会社概要、サービス紹介などの静的コンテンツページ',
                'is_system' => true,
                'is_dynamic' => false,
                'has_detail' => false,
                'allowed_component_types' => json_encode([
                    'hero',
                    'content',
                    'heading',
                    'text',
                    'image',
                    'gallery',
                    'video',
                    'cta',
                    'accordion',
                    'tabs',
                    'timeline',
                ]),
                'default_layout' => json_encode([
                    'sections' => [
                        ['component_type' => 'hero', 'name' => 'ページヘッダー'],
                        ['component_type' => 'content', 'name' => 'メインコンテンツ'],
                    ],
                ]),
            ],

            // 3. 投稿一覧（ブログ）
            [
                'id' => '03FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z', // ULIDを指定（例: 01FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z）
                'key' => 'post_list',
                'name' => '投稿一覧',
                'slug' => 'post_list',
                'description' => 'ブログ記事やニュースなどの投稿一覧ページ（アーカイブ）',
                'is_system' => true,
                'is_dynamic' => true,
                'has_detail' => true,
                'allowed_component_types' => json_encode([
                    'hero',
                    'archive_header',
                    'post_list',
                    'post_grid',
                    'post_filter',
                    'category_filter',
                    'search_box',
                    'pagination',
                    'sidebar',
                ]),
                'default_layout' => json_encode([
                    'sections' => [
                        ['component_type' => 'archive_header', 'name' => 'アーカイブヘッダー'],
                        ['component_type' => 'post_grid', 'name' => '投稿グリッド', 'props' => ['per_page' => 12, 'layout' => 'grid']],
                        ['component_type' => 'pagination', 'name' => 'ページネーション'],
                    ],
                ]),
            ],

            // 4. ランディングページ
            [
                'id' => '04FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z', // ULIDを指定（例: 01FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z）
                'key' => 'landing_page',
                'name' => 'ランディングページ',
                'slug' => 'landing_page',
                'description' => 'キャンペーンやプロモーション用のLP（コンバージョン重視）',
                'is_system' => true,
                'is_dynamic' => false,
                'has_detail' => false,
                'allowed_component_types' => json_encode([
                    'hero',
                    'features',
                    'benefits',
                    'pricing',
                    'testimonials',
                    'faq',
                    'cta',
                    'countdown',
                    'contact_form',
                    'social_proof',
                ]),
                'default_layout' => json_encode([
                    'sections' => [
                        ['component_type' => 'hero', 'name' => 'ヒーロー', 'props' => ['show_cta' => true]],
                        ['component_type' => 'features', 'name' => '特徴・メリット'],
                        ['component_type' => 'testimonials', 'name' => 'お客様の声'],
                        ['component_type' => 'cta', 'name' => '申込フォームCTA'],
                    ],
                ]),
            ],

            // 5. 商品一覧（ECページ）
            [
                'id' => '05FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z', // ULIDを指定（例: 01FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z）
                'key' => 'product_list',
                'name' => '商品一覧',
                'slug' => 'product_list',
                'description' => 'EC用の商品一覧・カタログページ',
                'is_system' => true,
                'is_dynamic' => true,
                'has_detail' => true,
                'allowed_component_types' => json_encode([
                    'hero',
                    'catalog_header',
                    'product_grid',
                    'product_filter',
                    'category_filter',
                    'sort_options',
                    'search_box',
                    'pagination',
                    'sidebar',
                ]),
                'default_layout' => json_encode([
                    'sections' => [
                        ['component_type' => 'catalog_header', 'name' => 'カタログヘッダー'],
                        ['component_type' => 'product_filter', 'name' => '商品フィルター'],
                        ['component_type' => 'product_grid', 'name' => '商品グリッド', 'props' => ['per_page' => 24, 'layout' => 'grid']],
                        ['component_type' => 'pagination', 'name' => 'ページネーション'],
                    ],
                ]),
            ],

            // 6. お問い合わせ
            [
                'id' => '06FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z', // ULIDを指定（例: 01FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z）
                'key' => 'contact',
                'name' => 'お問い合わせ',
                'slug' => 'contact',
                'description' => 'お問い合わせページ（フォーム機能付き）',
                'is_system' => true,
                'is_dynamic' => false,
                'has_detail' => false,
                'allowed_component_types' => json_encode([
                    'hero',
                    'contact_form',
                    'contact_info',
                    'map',
                    'business_hours',
                    'access',
                    'faq',
                ]),
                'default_layout' => json_encode([
                    'sections' => [
                        ['component_type' => 'hero', 'name' => 'ページヘッダー'],
                        ['component_type' => 'contact_form', 'name' => 'お問い合わせフォーム'],
                        ['component_type' => 'contact_info', 'name' => '連絡先情報'],
                        ['component_type' => 'map', 'name' => 'アクセスマップ'],
                    ],
                ]),
            ],

            // 7. プライバシーポリシー
            [
                'id' => '07FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z', // ULIDを指定（例: 01FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z）
                'key' => 'privacy_policy',
                'name' => 'プライバシーポリシー',
                'slug' => 'privacy_policy',
                'description' => 'プライバシーポリシー・個人情報保護方針ページ',
                'is_system' => true,
                'is_dynamic' => false,
                'has_detail' => false,
                'allowed_component_types' => json_encode([
                    'hero',
                    'content',
                    'heading',
                    'text',
                    'accordion',
                    'toc',
                ]),
                'default_layout' => json_encode([
                    'sections' => [
                        ['component_type' => 'hero', 'name' => 'ページヘッダー'],
                        ['component_type' => 'toc', 'name' => '目次'],
                        ['component_type' => 'content', 'name' => 'プライバシーポリシー本文'],
                    ],
                ]),
            ],

            // 8. カスタム投稿一覧（Admin追加可能）
            [
                'id' => '08FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z', // ULIDを指定（例: 01FZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z）
                'key' => 'custom_post_list',
                'name' => 'カスタム投稿一覧',
                'slug' => 'custom_post_list',
                'description' => 'お客様の声、実績、ニュースなどの自由なカスタム投稿一覧（Adminが追加可能）',
                'is_system' => false,
                'is_dynamic' => true,
                'has_detail' => true,
                'allowed_component_types' => json_encode([
                    'hero',
                    'archive_header',
                    'post_list',
                    'post_grid',
                    'card_grid',
                    'post_filter',
                    'category_filter',
                    'search_box',
                    'pagination',
                    'sidebar',
                ]),
                'default_layout' => json_encode([
                    'sections' => [
                        ['component_type' => 'archive_header', 'name' => 'アーカイブヘッダー'],
                        ['component_type' => 'card_grid', 'name' => 'カードグリッド', 'props' => ['per_page' => 12, 'layout' => 'grid']],
                        ['component_type' => 'pagination', 'name' => 'ページネーション'],
                    ],
                ]),
            ],
        ];

        // Insert page types
        foreach ($pageTypes as $pageType) {
            $pageType['created_at'] = now();
            $pageType['updated_at'] = now();
            DB::table('page_types')->insert($pageType);
        }
    }
}
