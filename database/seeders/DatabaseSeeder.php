<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // 管理者（認証確認用）
            AdminSeeder::class,

            // 会社（ユーザーより先に作成 → company_user で参照される）
            CompanySeeder::class,

            // ユーザー（会社への紐付け・住所含む）
            UserSeeder::class,

            // プロフィール（Admin, User統合）
            ProfileSeeder::class,

            // 住所（Admin, User, Company統合）
            AddressSeeder::class,

            // メディア
            MediaSeeder::class,

            // サービス関連
            ServiceCategorySeeder::class,
            ServiceSeeder::class,
            ServicePlanSeeder::class,
            ServiceItemSeeder::class,
        ]);
    }
}
