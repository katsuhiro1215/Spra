<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\PageType;
use Illuminate\Database\Seeder;

class FaqPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pageType = PageType::where('key', 'static')->first();

        if (!$pageType) {
            return;
        }

        Page::updateOrCreate(
            ['slug' => 'faq'],
            [
                'page_type_id' => $pageType->id,
                'title' => 'よくある質問',
                'template' => 'faq',
                'meta_title' => 'よくある質問 | FAQ',
                'meta_description' => 'サービスに関するよくあるご質問をまとめました。',
                'is_published' => true,
                'published_at' => now(),
                'sort_order' => 0,
            ]
        );
    }
}
