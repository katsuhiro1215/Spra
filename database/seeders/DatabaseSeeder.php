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
        // User::factory(10)->create();

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
            FaqCategorySeeder::class,
        ]);
    }
}
