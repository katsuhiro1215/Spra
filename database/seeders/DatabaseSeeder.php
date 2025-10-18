<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 基本のテストユーザー
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // ホームページ管理用の初期データを作成
        $this->call([
            AdminSeeder::class,
            HomepagePageSeeder::class,
            ServiceCategorySeeder::class,
            ServiceTypeSeeder::class,
            ServiceSeeder::class,
            ServicePlanSeeder::class,
            PlanPricingSeeder::class,
            FaqCategorySeeder::class,

            // 新しいSeeder群（順序重要：CompanySeeder → UserSeeder）
            CompanySeeder::class,    // 会社データを先に作成
            UserSeeder::class,       // ユーザーデータ（会社との関連含む）
        ]);
    }
}
