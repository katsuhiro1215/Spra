<?php

namespace Database\Seeders;

use App\Models\DocumentCategory;
use Illuminate\Database\Seeder;

class DocumentCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => '法務', 'slug' => 'legal', 'sort_order' => 1],
            ['name' => 'ヘルプ', 'slug' => 'help', 'sort_order' => 2],
            ['name' => 'API', 'slug' => 'api', 'sort_order' => 3],
            ['name' => '社内', 'slug' => 'internal', 'sort_order' => 4],
        ];

        foreach ($categories as $category) {
            DocumentCategory::create($category);
        }
    }
}
