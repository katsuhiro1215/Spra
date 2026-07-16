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
            ['event_date' => '2020-04-01', 'title' => '株式会社Smart Sprouts設立', 'sort_order' => 1],
            ['event_date' => '2021-04-01', 'title' => '従業員数10名突破、大阪支社設立', 'sort_order' => 2],
            ['event_date' => '2022-04-01', 'title' => '大手企業との協業プロジェクト開始', 'sort_order' => 3],
            ['event_date' => '2023-04-01', 'title' => 'AI技術導入サービス開始、従業員数20名突破', 'sort_order' => 4],
            ['event_date' => '2024-04-01', 'title' => '海外展開スタート、従業員数30名突破、資本金増資', 'sort_order' => 5],
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
