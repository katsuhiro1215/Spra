<?php

namespace Database\Seeders;

use App\Models\ScheduleDefault;
use Illuminate\Database\Seeder;

class ScheduleDefaultSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaults = [
            // 日曜日 - 定休日
            [
                'day_of_week' => 0,
                'is_open' => false,
                'open_time' => null,
                'close_time' => null,
                'break_start' => null,
                'break_end' => null,
            ],
            // 月曜日 - 営業日
            [
                'day_of_week' => 1,
                'is_open' => true,
                'open_time' => '09:00',
                'close_time' => '18:00',
                'break_start' => '12:00',
                'break_end' => '13:00',
            ],
            // 火曜日 - 営業日
            [
                'day_of_week' => 2,
                'is_open' => true,
                'open_time' => '09:00',
                'close_time' => '18:00',
                'break_start' => '12:00',
                'break_end' => '13:00',
            ],
            // 水曜日 - 営業日
            [
                'day_of_week' => 3,
                'is_open' => true,
                'open_time' => '09:00',
                'close_time' => '18:00',
                'break_start' => '12:00',
                'break_end' => '13:00',
            ],
            // 木曜日 - 営業日
            [
                'day_of_week' => 4,
                'is_open' => true,
                'open_time' => '09:00',
                'close_time' => '18:00',
                'break_start' => '12:00',
                'break_end' => '13:00',
            ],
            // 金曜日 - 営業日
            [
                'day_of_week' => 5,
                'is_open' => true,
                'open_time' => '09:00',
                'close_time' => '18:00',
                'break_start' => '12:00',
                'break_end' => '13:00',
            ],
            // 土曜日 - 定休日
            [
                'day_of_week' => 6,
                'is_open' => false,
                'open_time' => null,
                'close_time' => null,
                'break_start' => null,
                'break_end' => null,
            ],
        ];

        foreach ($defaults as $default) {
            ScheduleDefault::updateOrCreate(
                ['day_of_week' => $default['day_of_week']],
                $default
            );
        }
    }
}
