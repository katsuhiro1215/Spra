<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Campaign;
use App\Models\Media;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class CampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $createdBy = Admin::first()?->id;
        $mediaIds = Media::where('type', 'image')->pluck('id')->all();

        $now = Carbon::now();

        $campaigns = [
            [
                'name' => '新春キャンペーン',
                'code' => 'NEWYEAR2026',
                'description' => '新年のWebサイト制作・リニューアルを応援する特別割引キャンペーンです。',
                'discount_type' => 'percentage',
                'discount_value' => 15,
                'starts_at' => $now->copy()->subMonths(2),
                'ends_at' => $now->copy()->subMonth(),
                'is_active' => true,
            ],
            [
                'name' => '春の制作応援キャンペーン',
                'code' => 'SPRING2026',
                'description' => '新年度に向けたWebサイト・LP制作を対象とした割引キャンペーンです。',
                'discount_type' => 'fixed',
                'discount_value' => 50000,
                'starts_at' => $now->copy()->subWeeks(2),
                'ends_at' => $now->copy()->addMonth(),
                'is_active' => true,
            ],
            [
                'name' => '新規お問い合わせ限定キャンペーン',
                'code' => 'FIRSTCONTACT',
                'description' => '初めてお問い合わせいただいたお客様限定の割引キャンペーンです。',
                'discount_type' => 'percentage',
                'discount_value' => 10,
                'starts_at' => $now->copy()->subDays(10),
                'ends_at' => $now->copy()->addMonths(3),
                'is_active' => true,
            ],
            [
                'name' => '夏の特別キャンペーン',
                'code' => 'SUMMER2026',
                'description' => '夏季限定、ECサイト構築・システム開発が対象の割引キャンペーンです。',
                'discount_type' => 'percentage',
                'discount_value' => 20,
                'starts_at' => $now->copy()->addMonth(),
                'ends_at' => $now->copy()->addMonths(2),
                'is_active' => true,
            ],
            [
                'name' => '紹介キャンペーン',
                'code' => 'REFERRAL2026',
                'description' => '既存クライアント様からのご紹介で成約された場合に適用される割引キャンペーンです。',
                'discount_type' => 'fixed',
                'discount_value' => 30000,
                'starts_at' => $now->copy()->addMonths(2),
                'ends_at' => $now->copy()->addMonths(5),
                'is_active' => true,
            ],
            [
                'name' => '年末大感謝祭',
                'code' => 'YEAREND2025',
                'description' => '年末に実施した大型割引キャンペーンです（終了済み）。',
                'discount_type' => 'percentage',
                'discount_value' => 25,
                'starts_at' => $now->copy()->subMonths(4),
                'ends_at' => $now->copy()->subMonths(3),
                'is_active' => true,
            ],
            [
                'name' => '休止中の試験キャンペーン',
                'code' => 'DRAFTPROMO',
                'description' => '社内検証用に用意した停止中のキャンペーンです。',
                'discount_type' => 'fixed',
                'discount_value' => 10000,
                'starts_at' => $now->copy()->subWeek(),
                'ends_at' => $now->copy()->addWeeks(2),
                'is_active' => false,
            ],
        ];

        foreach ($campaigns as $campaign) {
            Campaign::firstOrCreate(
                ['code' => $campaign['code']],
                array_merge($campaign, [
                    'media_id' => $mediaIds ? $mediaIds[array_rand($mediaIds)] : null,
                    'created_by' => $createdBy,
                ]),
            );
        }
    }
}
