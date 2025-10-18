<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PlanPricing;
use App\Models\ServicePlan;
use App\Models\Admin;

class PlanPricingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $servicePlans = ServicePlan::all();
        $admin = Admin::first();

        if (!$admin) {
            $this->command->error('Admin user not found. Please run AdminSeeder first.');
            return;
        }

        foreach ($servicePlans as $servicePlan) {
            // 基本価格設定
            PlanPricing::create([
                'service_plan_id' => $servicePlan->id,
                'name' => '基本料金',
                'display_name' => $servicePlan->name . ' - 基本料金',
                'description' => '標準的な基本料金プランです。',
                'type' => 'base',
                'billing_type' => 'fixed',
                'price' => $servicePlan->base_price ?: 50000,
                'price_unit' => 'プロジェクト',
                'is_default' => true,
                'is_active' => true,
                'is_visible' => true,
                'sort_order' => 1,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ]);

            // 段階料金設定
            PlanPricing::create([
                'service_plan_id' => $servicePlan->id,
                'name' => 'ボリューム割引',
                'display_name' => $servicePlan->name . ' - ボリューム割引',
                'description' => '大量注文時の割引料金です。',
                'type' => 'tier',
                'billing_type' => 'tiered',
                'price' => $servicePlan->base_price ?: 50000,
                'price_unit' => '個',
                'tier_rules' => [
                    ['min_quantity' => 1, 'max_quantity' => 5, 'price' => ($servicePlan->base_price ?: 50000)],
                    ['min_quantity' => 6, 'max_quantity' => 10, 'price' => ($servicePlan->base_price ?: 50000) * 0.9],
                    ['min_quantity' => 11, 'max_quantity' => null, 'price' => ($servicePlan->base_price ?: 50000) * 0.8],
                ],
                'min_quantity' => 1,
                'is_active' => true,
                'is_visible' => true,
                'sort_order' => 2,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ]);

            // 早期割引設定
            PlanPricing::create([
                'service_plan_id' => $servicePlan->id,
                'name' => '早期割引プラン',
                'display_name' => $servicePlan->name . ' - 早期割引',
                'description' => '事前申込による早期割引プランです。',
                'type' => 'discount',
                'billing_type' => 'fixed',
                'price' => $servicePlan->base_price ?: 50000,
                'price_unit' => 'プロジェクト',
                'discount_percentage' => 15,
                'discount_start_date' => now(),
                'discount_end_date' => now()->addMonths(3),
                'conditions' => [
                    '30日前までの事前申込が必要',
                    '変更・キャンセルは14日前まで',
                    '一括払いのみ対応'
                ],
                'is_active' => true,
                'is_visible' => true,
                'is_featured' => true,
                'sort_order' => 3,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ]);

            // 追加オプション
            PlanPricing::create([
                'service_plan_id' => $servicePlan->id,
                'name' => '急ぎ対応オプション',
                'display_name' => $servicePlan->name . ' - 急ぎ対応',
                'description' => '通常より短納期での対応オプションです。',
                'type' => 'addon',
                'billing_type' => 'fixed',
                'price' => ($servicePlan->base_price ?: 50000) * 0.5,
                'price_unit' => 'オプション',
                'conditions' => [
                    '通常納期の50%短縮',
                    '追加料金が発生します',
                    '対応可能な場合のみ提供'
                ],
                'requires_approval' => true,
                'approval_notes' => 'スケジュール調整が必要なため、事前承認が必要です。',
                'is_active' => true,
                'is_visible' => true,
                'sort_order' => 4,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ]);

            // 月額プラン（対象のプランのみ）
            if (in_array($servicePlan->billing_cycle, ['monthly', 'yearly'])) {
                PlanPricing::create([
                    'service_plan_id' => $servicePlan->id,
                    'name' => 'サブスクリプションプラン',
                    'display_name' => $servicePlan->name . ' - 月額プラン',
                    'description' => '継続利用者向けの月額プランです。',
                    'type' => 'base',
                    'billing_type' => 'fixed',
                    'price' => ($servicePlan->base_price ?: 50000) * 0.7,
                    'price_unit' => '月',
                    'is_recurring' => true,
                    'recurring_months' => 1,
                    'discount_percentage' => 30,
                    'conditions' => [
                        '最低3ヶ月の継続利用',
                        '月末締め翌月払い',
                        '解約は1ヶ月前告知'
                    ],
                    'effective_from' => now(),
                    'effective_until' => now()->addYear(),
                    'is_active' => true,
                    'is_visible' => true,
                    'sort_order' => 5,
                    'created_by' => $admin->id,
                    'updated_by' => $admin->id,
                ]);
            }

            // 企業向け特別プラン
            PlanPricing::create([
                'service_plan_id' => $servicePlan->id,
                'name' => '企業向けプラン',
                'display_name' => $servicePlan->name . ' - 企業向け',
                'description' => '企業向けのカスタマイズプランです。',
                'type' => 'base',
                'billing_type' => 'volume',
                'price' => 0, // 要相談
                'price_unit' => '要相談',
                'conditions' => [
                    '年間契約必須',
                    '専任担当者配置',
                    'カスタマイズ対応可能',
                    '優先サポート'
                ],
                'requires_approval' => true,
                'approval_notes' => '企業規模とニーズに応じてカスタマイズします。',
                'is_negotiable' => true,
                'is_active' => true,
                'is_visible' => false, // 一般には非表示
                'sort_order' => 6,
                'notes' => '企業規模とプロジェクト規模に応じて個別見積もりを行います。',
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ]);
        }

        $this->command->info('Plan Pricing seeder completed successfully!');
        $this->command->info('Created pricing plans for ' . $servicePlans->count() . ' service plans.');
    }
}
