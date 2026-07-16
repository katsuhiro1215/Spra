<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menu = Menu::where('slug', 'header')->first();

        if (! $menu) {
            return;
        }

        $topLevelItems = [
            [
                'label' => 'サービス',
                'url' => '/service',
                'description' => 'ビジネス成長を支援する包括的なソリューション',
                'sort_order' => 1,
                'children' => [
                    ['label' => 'Web制作', 'url' => '/service/web-development', 'description' => 'レスポンシブWebサイト・アプリ開発'],
                    ['label' => 'システム開発', 'url' => '/service/system-development', 'description' => '業務システム・API開発'],
                    ['label' => 'ECサイト構築', 'url' => '/service/ecommerce', 'description' => 'オンラインストア・決済システム'],
                    ['label' => 'AI・DX支援', 'url' => '/service/ai-dx', 'description' => 'AI導入・デジタル変革支援'],
                    ['label' => 'ITコンサルティング', 'url' => '/service/consulting', 'description' => 'IT戦略・技術アドバイス'],
                    ['label' => '保守・運用', 'url' => '/service/maintenance', 'description' => 'システム保守・運用サポート'],
                    ['label' => 'スタンダードLP', 'url' => '/lp', 'description' => 'バランスの取れたランディングページ'],
                    ['label' => 'ミニマルLP', 'url' => '/lp-minimal', 'description' => 'シンプルで洗練されたデザイン'],
                    ['label' => 'クリエイティブLP', 'url' => '/lp-creative', 'description' => 'インタラクティブで動的なデザイン'],
                ],
            ],
            [
                'label' => 'ソリューション',
                'url' => '/solution',
                'description' => '様々な業界に特化したソリューション',
                'sort_order' => 2,
                'children' => [
                    ['label' => '製造業向け', 'url' => '/solution/manufacturing', 'description' => '生産管理・品質管理システム'],
                    ['label' => '小売・EC', 'url' => '/solution/retail', 'description' => '在庫管理・販売管理システム'],
                    ['label' => '医療・介護', 'url' => '/solution/healthcare', 'description' => '患者管理・電子カルテシステム'],
                    ['label' => '教育機関', 'url' => '/solution/education', 'description' => '学習管理・出席管理システム'],
                    ['label' => '金融・保険', 'url' => '/solution/finance', 'description' => '顧客管理・リスク管理システム'],
                    ['label' => 'スタートアップ', 'url' => '/solution/startup', 'description' => 'MVP開発・事業成長支援'],
                ],
            ],
            [
                'label' => 'ブログ',
                'url' => '/blog',
                'sort_order' => 3,
                'children' => [],
            ],
            [
                'label' => '会社情報',
                'url' => '/company',
                'description' => '私たちの会社情報・サポート',
                'sort_order' => 4,
                'children' => [
                    ['label' => '会社概要', 'url' => '/company', 'description' => '企業情報・沿革・アクセス'],
                    ['label' => 'チーム紹介', 'url' => '/about', 'description' => 'メンバー・企業理念・文化'],
                    ['label' => 'お知らせ', 'url' => '/news', 'description' => '最新情報・プレスリリース'],
                    ['label' => 'お問い合わせ', 'url' => '/contact', 'description' => '相談・見積もり・サポート'],
                    ['label' => 'よくある質問', 'url' => '/faq', 'description' => 'FAQ・サポート情報'],
                    ['label' => 'プライバシーポリシー', 'url' => '/privacy-policy', 'description' => '個人情報保護方針'],
                ],
            ],
        ];

        foreach ($topLevelItems as $itemData) {
            $children = $itemData['children'];
            unset($itemData['children']);

            $parent = MenuItem::updateOrCreate(
                [
                    'menu_id' => $menu->id,
                    'parent_id' => null,
                    'label' => $itemData['label'],
                ],
                [
                    ...$itemData,
                    'is_active' => true,
                ],
            );

            foreach ($children as $childIndex => $childData) {
                MenuItem::updateOrCreate(
                    [
                        'menu_id' => $menu->id,
                        'parent_id' => $parent->id,
                        'label' => $childData['label'],
                    ],
                    [
                        ...$childData,
                        'sort_order' => $childIndex + 1,
                        'is_active' => true,
                    ],
                );
            }
        }
    }
}
