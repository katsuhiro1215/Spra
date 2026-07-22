<?php

namespace Database\Seeders;

use App\Models\MembershipRank;
use Illuminate\Database\Seeder;

class MembershipRankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $membershipRanks = [
            [
                'key' => 'green',
                'name' => 'Green',
                'min_annual_amount' => 0,
                'description' => '通常サポート',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'key' => 'bronze',
                'name' => 'Bronze',
                'min_annual_amount' => 100000,
                'description' => 'オンライン相談 年1回無料',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'key' => 'silver',
                'name' => 'Silver',
                'min_annual_amount' => 300000,
                'description' => 'オンライン相談 年1回無料\n新サービス優先案内',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'key' => 'gold',
                'name' => 'Gold',
                'min_annual_amount' => 800000,
                'description' => '通常サポート\nオンライン相談 年3回無料\n新サービス優先案内',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'key' => 'diamonds',
                'name' => 'Diamonds',
                'min_annual_amount' => 3000000,
                'description' => '通常サポート\nオンライン相談 年5回無料\n新サービス優先案内\n専用担当者によるサポート',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'key' => 'platinum',
                'name' => 'Platinum',
                'min_annual_amount' => 3000000,
                'description' => '通常サポート\nオンライン相談 年10回無料\n新サービス優先案内\n専用担当者によるサポート',
                'sort_order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($membershipRanks as $membershipRank) {
            MembershipRank::create($membershipRank);
        }
    }
}
