<?php

namespace Database\Seeders;

use App\Models\Organization;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organization = Organization::updateOrCreate(
            [],
            [
                'name' => 'Smart Sprouts',
                'site_name' => 'Smart Sprouts',
                'name_en' => 'Smart Sprouts Inc.',
                'logo_path' => '/upload/logo.svg',
                'representative_name' => '栫 勝宏',
                'business_description' => "Webサイト・アプリケーション開発\nシステム開発・保守運用\nITコンサルティング\nAI技術導入支援",
                'employee_count' => 3,
                'capital' => '1,000万円',
                'established_date' => '2022-05-13',
                'business_hours' => '平日・土曜 8:00-20:00（日曜・祝日休業）',
                'phone' => '090-9580-9257',
                'email' => 'info@smartsprouts.jp',
            ],
        );

        $organization->addresses()->updateOrCreate(
            ['is_default' => true],
            [
                'type' => 'office',
                'postal_code' => '6308303',
                'prefecture' => '奈良県',
                'city' => '奈良市',
                'district' => '南紀寺町',
                'address_other' => null,
                'is_default' => true,
                'is_active' => true,
            ],
        );
    }
}
