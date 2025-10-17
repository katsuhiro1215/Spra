<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ServicePlan;
use App\Models\ServiceType;
use App\Models\Admin;

class ServicePlanSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // 管理者を取得
        $admin = Admin::first();
        if (!$admin) {
            $this->command->error('Admin user not found. Please run AdminSeeder first.');
            return;
        }

        // 各サービスタイプに対してプランを作成
        $serviceTypes = ServiceType::take(3)->get();
        
        foreach ($serviceTypes as $serviceType) {
            $this->createPlansForServiceType($serviceType, $admin->id);
        }

        $this->command->info('ServicePlan seeder completed successfully.');
    }

    private function createPlansForServiceType(ServiceType $serviceType, int $adminId): void
    {
        $basePrice = $serviceType->base_price ?? 300000;
        
        $plans = [
            [
                'name' => 'ベーシック',
                'slug' => 'basic-' . $serviceType->id,
                'service_type_id' => $serviceType->id,
                'description' => '基本的な機能を含む入門プラン',
                'detailed_description' => $serviceType->name . 'の基本的な機能を提供するプランです。小規模なプロジェクトに最適です。',
                'base_price' => $basePrice * 0.7,
                'price_unit' => '式',
                'billing_cycle' => 'one_time',
                'setup_fee' => 0,
                'features' => ['基本機能', 'サポート対応', '基本カスタマイズ'],
                'included_items' => ['基本設計', '実装', 'テスト'],
                'limitations' => ['修正回数: 3回まで'],
                'max_revisions' => 3,
                'estimated_delivery_days' => 14,
                'is_popular' => false,
                'is_recommended' => false,
                'sort_order' => 1,
                'color' => '#10B981',
                'created_by' => $adminId,
            ],
            [
                'name' => 'スタンダード',
                'slug' => 'standard-' . $serviceType->id,
                'service_type_id' => $serviceType->id,
                'description' => '充実した機能の標準プラン',
                'detailed_description' => $serviceType->name . 'の標準的な機能を全て含むプランです。多くのお客様に選ばれています。',
                'base_price' => $basePrice,
                'price_unit' => '式',
                'billing_cycle' => 'one_time',
                'setup_fee' => 0,
                'features' => ['標準機能一式', '優先サポート', 'カスタマイズ対応', 'アフターサポート'],
                'included_items' => ['詳細設計', '実装', 'テスト・検証', 'マニュアル作成'],
                'limitations' => ['修正回数: 5回まで'],
                'max_revisions' => 5,
                'estimated_delivery_days' => 21,
                'is_popular' => true,
                'is_recommended' => true,
                'sort_order' => 2,
                'color' => '#3B82F6',
                'badge_text' => '人気',
                'created_by' => $adminId,
            ],
            [
                'name' => 'プレミアム',
                'slug' => 'premium-' . $serviceType->id,
                'service_type_id' => $serviceType->id,
                'description' => '最上位の高機能プラン',
                'detailed_description' => $serviceType->name . 'の全機能に加え、カスタム機能も含む最上位プランです。大規模なプロジェクトに対応。',
                'base_price' => $basePrice * 1.5,
                'price_unit' => '式',
                'billing_cycle' => 'one_time',
                'setup_fee' => 50000,
                'features' => ['全機能', 'カスタム機能開発', '専任サポート', '優先対応', '保守・運用サポート'],
                'included_items' => ['要件定義', '詳細設計', 'フルカスタム実装', 'テスト・検証', 'マニュアル・研修', '運用サポート（3ヶ月）'],
                'limitations' => ['修正回数: 10回まで'],
                'max_revisions' => 10,
                'estimated_delivery_days' => 35,
                'is_popular' => false,
                'is_recommended' => false,
                'sort_order' => 3,
                'color' => '#8B5CF6',
                'badge_text' => '高機能',
                'created_by' => $adminId,
            ],
        ];

        foreach ($plans as $planData) {
            ServicePlan::firstOrCreate(
                [
                    'service_type_id' => $serviceType->id,
                    'slug' => $planData['slug'],
                ],
                $planData
            );
        }
    }
}Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServicePlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
    }
}
