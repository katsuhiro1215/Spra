<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;

class HomepagePageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            [
                'title' => 'トップページ',
                'slug' => 'top',
                'template' => 'top',
                'content' => [
                    'hero_title' => 'スプラ学習塾へようこそ',
                    'hero_subtitle' => '一人ひとりに合わせた学習で、未来への扉を開きます',
                    'hero_image' => '/images/hero-bg.jpg',
                    'features' => [
                        [
                            'title' => '個別指導',
                            'description' => '一人ひとりの理解度に合わせた指導を行います',
                            'icon' => 'user'
                        ],
                        [
                            'title' => '充実したカリキュラム',
                            'description' => '最新の教育理論に基づいたカリキュラムを提供します',
                            'icon' => 'book'
                        ],
                        [
                            'title' => '経験豊富な講師',
                            'description' => '教育経験豊富な講師陣がサポートします',
                            'icon' => 'star'
                        ]
                    ]
                ],
                'meta' => [
                    'title' => 'スプラ学習塾 - 一人ひとりに合わせた学習指導',
                    'description' => 'スプラ学習塾では一人ひとりの理解度に合わせた個別指導を行い、お子様の可能性を最大限に引き出します。'
                ],
                'settings' => [
                    'is_featured' => true
                ],
                'is_published' => true,
                'sort_order' => 1
            ],
            [
                'title' => '塾について',
                'slug' => 'about',
                'template' => 'page',
                'content' => [
                    'sections' => [
                        [
                            'type' => 'text',
                            'content' => 'スプラ学習塾は、お子様一人ひとりの個性と能力を大切にし、それぞれに最適な学習環境を提供します。'
                        ],
                        [
                            'type' => 'image',
                            'src' => '/images/about-classroom.jpg',
                            'alt' => '教室の様子'
                        ]
                    ]
                ],
                'meta' => [
                    'title' => '塾について - スプラ学習塾',
                    'description' => 'スプラ学習塾の理念、特徴、教育方針について詳しくご紹介します。'
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
                        'message' => '必須'
                    ],
                    'contact_info' => [
                        'address' => '〒123-4567 東京都○○区○○1-2-3',
                        'phone' => '03-1234-5678',
                        'email' => 'info@spra-juku.com'
                    ]
                ],
                'meta' => [
                    'title' => 'お問い合わせ - スプラ学習塾',
                    'description' => 'スプラ学習塾へのお問い合わせはこちらから。無料体験授業のお申し込みも承っております。'
                ],
                'is_published' => true,
                'sort_order' => 3
            ],
            [
                'title' => '下書きページ',
                'slug' => 'draft-page',
                'template' => 'page',
                'content' => [
                    'sections' => [
                        [
                            'type' => 'text',
                            'content' => 'これは下書き状態のページです。'
                        ]
                    ]
                ],
                'meta' => [
                    'title' => '下書きページ',
                    'description' => '下書き状態のページです。'
                ],
                'is_published' => false,
                'sort_order' => 4
            ]
        ];

        foreach ($pages as $pageData) {
            Page::create($pageData);
        }
    }
}