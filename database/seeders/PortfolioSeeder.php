<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Media;
use App\Models\Portfolio;
use App\Models\Service;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = Admin::where('email', 'katsuhiro.k1215@gmail.com')->first();
        $mediaIds = Media::query()->images()->pluck('id')->all();

        if (empty($mediaIds)) {
            $this->command->warn('Media not found. Skipping portfolio seeding.');
            return;
        }

        $portfolios = [
            [
                'title' => '株式会社ABC様 コーポレートサイト',
                'description' => '企業の魅力を伝えるレスポンシブ対応のコーポレートサイトを制作しました。CMS導入により、お客様自身での更新が可能です。',
                'url' => 'https://example.com/abc-corp',
                'completed_at' => '2024-06-15',
                'service_slugs' => ['website-production'],
            ],
            [
                'title' => 'XYZ株式会社様 リクルートサイト',
                'description' => '採用強化を目的としたリクルートサイトを制作。社員インタビューや福利厚生を訴求するコンテンツを充実させました。',
                'url' => 'https://example.com/xyz-recruit',
                'completed_at' => '2024-09-20',
                'service_slugs' => ['website-production', 'landing-page'],
            ],
            [
                'title' => 'セレクトショップ様 ECサイト',
                'description' => '在庫管理・決済機能を統合したECサイトを構築。スマートフォンでの購入体験を最適化しました。',
                'url' => 'https://example.com/select-shop',
                'completed_at' => '2024-03-10',
                'service_slugs' => ['ecommerce-development'],
            ],
            [
                'title' => '飲食チェーン様 予約管理システム',
                'description' => '複数店舗の予約状況を一元管理できるクラウド型システムを開発しました。',
                'url' => null,
                'completed_at' => '2024-11-05',
                'service_slugs' => ['web-system-development'],
            ],
            [
                'title' => '物流会社様 配送管理アプリ',
                'description' => 'ドライバー向けの配送管理モバイルアプリを開発。位置情報と連携したリアルタイムの配送状況管理を実現しました。',
                'url' => null,
                'completed_at' => '2025-01-22',
                'service_slugs' => ['app-development'],
            ],
            [
                'title' => '健康食品メーカー様 定期通販LP',
                'description' => 'コンバージョン率向上を目的としたランディングページを制作。A/Bテストを繰り返し、購入率を大幅に改善しました。',
                'url' => 'https://example.com/health-lp',
                'completed_at' => '2025-02-14',
                'service_slugs' => ['landing-page'],
            ],
        ];

        foreach ($portfolios as $index => $data) {
            $serviceSlugs = $data['service_slugs'];
            unset($data['service_slugs']);

            $portfolio = Portfolio::create([
                ...$data,
                'media_id' => $mediaIds[$index % count($mediaIds)],
                'is_displayed' => true,
                'sort_order' => $index,
                'created_by' => $admin?->id,
                'updated_by' => $admin?->id,
            ]);

            $serviceIds = Service::whereIn('slug', $serviceSlugs)->pluck('id');
            $portfolio->services()->sync($serviceIds);
        }
    }
}
