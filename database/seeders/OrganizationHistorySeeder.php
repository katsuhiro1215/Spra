<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\OrganizationHistory;
use Illuminate\Database\Seeder;

class OrganizationHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organization = Organization::first();

        if (! $organization) {
            return;
        }

        $histories = [
            ['event_date' => '2022-05-13', 'title' => '個人事業主として「かつコード」を設立、資本金100万円', 'sort_order' => 1],
            ['event_date' => '2022-11-13', 'title' => 'Web制作案件10件突破', 'sort_order' => 2],
            ['event_date' => '2023-05-13', 'title' => '「かつコード」、資本金200万円', 'sort_order' => 3],
            ['event_date' => '2023-11-13', 'title' => 'Web制作案件30件突破', 'sort_order' => 4],
            ['event_date' => '2024-05-13', 'title' => 'ブランド名として「Smart Sprouts」を採用、資本金300万円', 'sort_order' => 5],
            ['event_date' => '2024-11-13', 'title' => 'Web制作案件50件突破', 'sort_order' => 6],
            ['event_date' => '2025-05-13', 'title' => '愛称「Spra」を採用、資本金400万円', 'sort_order' => 7],
            ['event_date' => '2025-11-13', 'title' => '自社システム「Spra」をリリース', 'sort_order' => 8],
            ['event_date' => '2026-05-13', 'title' => 'SaaSプロダクト「Spra」をリリース、資本金500万円', 'sort_order' => 9],
        ];

        foreach ($histories as $historyData) {
            OrganizationHistory::updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'title' => $historyData['title'],
                ],
                [
                    ...$historyData,
                    'is_published' => true,
                ],
            );
        }
    }
}
