<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\Service;
use App\Models\Technology;
use Illuminate\Database\Seeder;

class ServiceMediaSeeder extends Seeder
{
    /**
     * サービスにギャラリー画像・使用技術タグを紐付ける
     */
    public function run(): void
    {
        $mediaIds = Media::query()->images()->pluck('id')->all();

        if (empty($mediaIds)) {
            $this->command->warn('Media not found. Skipping service media/technology seeding.');
            return;
        }

        // slugキーワード => 使用技術名 のマッピング
        $technologyMap = [
            'website' => ['React', 'Next.js', 'WordPress', 'Tailwind CSS'],
            'landing-page' => ['React', 'Next.js', 'Tailwind CSS'],
            'ecommerce' => ['Laravel', 'Vue.js', 'MySQL', 'Tailwind CSS'],
            'web-system' => ['Laravel', 'PostgreSQL', 'AWS', 'Docker'],
            'api-development' => ['Laravel', 'PostgreSQL', 'Docker'],
            'saas' => ['Laravel', 'Vue.js', 'AWS', 'Docker'],
            'app' => ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
        ];

        Service::all()->each(function (Service $service, int $index) use ($mediaIds, $technologyMap) {
            // ギャラリー画像を2枚、ランダムに割り当て（先頭を代表画像に）
            $imageIds = collect($mediaIds)->shuffle()->take(2)->values();
            $pivotData = [];
            foreach ($imageIds as $position => $mediaId) {
                $pivotData[$mediaId] = ['sort_order' => $position, 'is_primary' => $position === 0];
            }
            $service->media()->sync($pivotData);

            // slugにマッチする技術タグを紐付け
            foreach ($technologyMap as $keyword => $technologyNames) {
                if (str_contains($service->slug, $keyword)) {
                    $technologyIds = Technology::whereIn('name', $technologyNames)->pluck('id');
                    $service->technologies()->sync($technologyIds);
                    break;
                }
            }
        });
    }
}
