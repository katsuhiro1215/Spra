<?php

namespace Database\Seeders;

use App\Models\ServicePlan;
use App\Models\ServiceType;
use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServicePlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get first service type and admin for relationships
        $serviceType = ServiceType::first();
        $admin = Admin::first();

        if (!$serviceType || !$admin) {
            $this->command->warn('ServiceType or Admin not found. Please seed those tables first.');
            return;
        }

        $plans = [
            [
                'service_type_id' => $serviceType->id,
                'name' => 'Basic Plan',
                'description' => 'Basic service plan for individuals',
                'detailed_description' => 'This is a comprehensive basic plan designed for individuals and small businesses who need essential features.',
                'base_price' => 999.00,
                'price_unit' => 'month',
                'billing_cycle' => 'monthly',
                'setup_fee' => 0.00,
                'features' => ['1 User', 'Basic Support', '1GB Storage'],
                'included_items' => ['Email Support', 'Basic Templates', 'Mobile App Access'],
                'limitations' => ['Limited API calls', 'No priority support'],
                'max_revisions' => 3,
                'estimated_delivery_days' => 7,
                'is_popular' => false,
                'is_recommended' => false,
                'sort_order' => 1,
                'is_active' => true,
                'color' => '#3B82F6',
                'badge_text' => null,
                'icon' => 'star',
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ],
            [
                'service_type_id' => $serviceType->id,
                'name' => 'Professional Plan',
                'description' => 'Professional service plan for small businesses',
                'detailed_description' => 'Perfect for growing businesses that need advanced features and priority support.',
                'base_price' => 2999.00,
                'price_unit' => 'month',
                'billing_cycle' => 'monthly',
                'setup_fee' => 500.00,
                'features' => ['5 Users', 'Priority Support', '10GB Storage', 'Advanced Analytics'],
                'included_items' => ['Priority Email Support', 'Premium Templates', 'API Access', 'Custom Reports'],
                'limitations' => ['Limited customization'],
                'max_revisions' => 10,
                'estimated_delivery_days' => 5,
                'is_popular' => true,
                'is_recommended' => true,
                'sort_order' => 2,
                'is_active' => true,
                'color' => '#10B981',
                'badge_text' => '最人気',
                'icon' => 'rocket',
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ],
            [
                'service_type_id' => $serviceType->id,
                'name' => 'Enterprise Plan',
                'description' => 'Enterprise service plan for large organizations',
                'detailed_description' => 'Comprehensive solution for large enterprises with unlimited features and dedicated support.',
                'base_price' => 9999.00,
                'price_unit' => 'month',
                'billing_cycle' => 'monthly',
                'setup_fee' => 2000.00,
                'features' => ['Unlimited Users', '24/7 Support', '100GB Storage', 'Custom Integration', 'Dedicated Manager'],
                'included_items' => ['24/7 Phone Support', 'Custom Development', 'Dedicated Account Manager', 'White-label Options'],
                'limitations' => [],
                'max_revisions' => null,
                'estimated_delivery_days' => 3,
                'is_popular' => false,
                'is_recommended' => true,
                'sort_order' => 3,
                'is_active' => true,
                'color' => '#8B5CF6',
                'badge_text' => '推奨',
                'icon' => 'crown',
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ],
            [
                'service_type_id' => $serviceType->id,
                'name' => 'Starter Plan',
                'description' => 'Free starter plan for testing',
                'detailed_description' => 'Perfect for testing our services before committing to a paid plan.',
                'base_price' => 0.00,
                'price_unit' => 'month',
                'billing_cycle' => 'monthly',
                'setup_fee' => 0.00,
                'features' => ['1 User', 'Community Support', '500MB Storage'],
                'included_items' => ['Basic Templates', 'Community Forum Access'],
                'limitations' => ['Limited features', 'Community support only', 'Basic functionality'],
                'max_revisions' => 1,
                'estimated_delivery_days' => 14,
                'is_popular' => false,
                'is_recommended' => false,
                'sort_order' => 0,
                'is_active' => true,
                'color' => '#6B7280',
                'badge_text' => '無料',
                'icon' => 'gift',
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ],
            [
                'service_type_id' => $serviceType->id,
                'name' => 'Legacy Plan',
                'description' => 'Old plan no longer offered',
                'detailed_description' => 'This plan is no longer available for new customers but is maintained for existing users.',
                'base_price' => 1999.00,
                'price_unit' => 'month',
                'billing_cycle' => 'monthly',
                'setup_fee' => 0.00,
                'features' => ['3 Users', 'Email Support', '5GB Storage'],
                'included_items' => ['Email Support', 'Standard Templates'],
                'limitations' => ['Deprecated features'],
                'max_revisions' => 5,
                'estimated_delivery_days' => 10,
                'is_popular' => false,
                'is_recommended' => false,
                'sort_order' => 4,
                'is_active' => false,
                'color' => '#EF4444',
                'badge_text' => '終了予定',
                'icon' => 'archive',
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ],
        ];

        foreach ($plans as $planData) {
            ServicePlan::create($planData);
        }

        $this->command->info('ServicePlan seeder completed successfully!');
    }
}
