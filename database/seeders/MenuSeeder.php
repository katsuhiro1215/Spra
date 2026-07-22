<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Menu::updateOrCreate(
            ['slug' => 'header'],
            [
                'name' => 'ヘッダーメニュー',
                'description' => 'サイト共通ヘッダーに表示するメインナビゲーション',
                'location' => 'header',
            ],
        );
    }
}
