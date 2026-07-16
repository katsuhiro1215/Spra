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
                'name' => '株式会社Smart Sprouts',
                'site_name' => 'Smart Sprouts',
                'name_en' => 'Smart Sprouts Inc.',
                'logo_path' => '/upload/logo.svg',
                'representative_name' => '山田 太郎',
                'business_description' => "Webサイト・アプリケーション開発\nシステム開発・保守運用\nITコンサルティング\nAI技術導入支援",
                'employee_count' => 30,
                'capital' => '1,000万円',
                'established_date' => '2020-04-01',
                'business_hours' => '平日 9:00-18:00（土日祝休業）',
                'phone' => '03-1234-5678',
                'email' => 'info@smartsprouts.com',
            ],
        );

        $organization->addresses()->updateOrCreate(
            ['is_default' => true],
            [
                'type' => 'office',
                'postal_code' => '1000001',
                'prefecture' => '東京都',
                'city' => '千代田区',
                'district' => '千代田',
                'address_other' => '1-1-1',
                'is_default' => true,
                'is_active' => true,
            ],
        );
    }
}
