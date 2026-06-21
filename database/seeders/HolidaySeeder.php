<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Holiday;

class HolidaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 2022年の祝日を追加
        $this->command->info('Creating Japanese national holidays for 2022...');

        $holidays2022 = [
            ['date' => '2022-01-01', 'name' => '元旦'],
            ['date' => '2022-01-03', 'name' => '振替休日'],
            ['date' => '2022-02-11', 'name' => '建国記念の日'],
            ['date' => '2022-02-23', 'name' => '天皇誕生日'],
            ['date' => '2022-03-21', 'name' => '春分の日'],
            ['date' => '2022-04-05', 'name' => '昭和の日'],
            ['date' => '2022-04-06', 'name' => 'みどりの日'],
            ['date' => '2022-04-07', 'name' => '憲法記念日'],
            ['date' => '2022-04-08', 'name' => 'こどもの日'],
            ['date' => '2022-05-02', 'name' => 'ゴールデンウィークの休日'],
            ['date' => '2022-06-03', 'name' => '銀行休日'],
            ['date' => '2022-09-20', 'name' => '秋分の日'],
            ['date' => '2022-10-03', 'name' => 'スポーツの日'],
            ['date' => '2022-10-04', 'name' => '振替休日'],
            ['date' => '2022-11-03', 'name' => '文化の日'],
            ['date' => '2022-11-23', 'name' => '勤労感謝の日'],
        ];

        foreach ($holidays2022 as $holiday) {
            Holiday::create([
                'date' => $holiday['date'],
                'name' => $holiday['name'],
                'type' => 'national',
                'is_recurring' => false,
                'description' => $holiday['name'] . ' is a national holiday in Japan.',
            ]);
        }

        $this->command->info('Created ' . count($holidays2022) . ' Japanese national holidays for 2022.');

        // 2023年の祝日を追加
        $this->command->info('Creating Japanese national holidays for 2023...');

        $holidays2023 = [
            ['date' => '2023-01-01', 'name' => '元旦'],
            ['date' => '2023-01-02', 'name' => '振替休日'],
            ['date' => '2023-01-09', 'name' => '成人の日'],
            ['date' => '2023-02-11', 'name' => '建国記念の日'],
            ['date' => '2023-02-23', 'name' => '天皇誕生日'],
            ['date' => '2023-03-21', 'name' => '春分の日'],
            ['date' => '2023-04-29', 'name' => '昭和の日'],
            ['date' => '2023-05-03', 'name' => '憲法記念日'],
            ['date' => '2023-05-04', 'name' => 'みどりの日'],
            ['date' => '2023-05-05', 'name' => 'こどもの日'],
            ['date' => '2023-07-17', 'name' => '海の日'],
            ['date' => '2023-08-11', 'name' => '山の日'],
            ['date' => '2023-09-18', 'name' => '敬老の日'],
            ['date' => '2023-09-23', 'name' => '秋分の日'],
            ['date' => '2023-10-09', 'name' => 'スポーツの日'],
            ['date' => '2023-11-03', 'name' => '文化の日'],
            ['date' => '2023-11-23', 'name' => '勤労感謝の日'],
        ];

        foreach ($holidays2023 as $holiday) {
            Holiday::create([
                'date' => $holiday['date'],
                'name' => $holiday['name'],
                'type' => 'national',
                'is_recurring' => false,
                'description' => $holiday['name'] . ' is a national holiday in Japan.',
            ]);
        }

        $this->command->info('Created ' . count($holidays2023) . ' Japanese national holidays for 2023.');

        // 2024年の祝日を追加
        $this->command->info('Creating Japanese national holidays for 2024...');

        $holidays2024 = [
            ['date' => '2024-01-01', 'name' => '元旦'],
            ['date' => '2024-01-08', 'name' => '成人の日'],
            ['date' => '2024-02-11', 'name' => '建国記念の日'],
            ['date' => '2024-02-12', 'name' => '振替休日'],
            ['date' => '2024-02-23', 'name' => '天皇誕生日'],
            ['date' => '2024-03-20', 'name' => '春分の日'],
            ['date' => '2024-04-29', 'name' => '昭和の日'],
            ['date' => '2024-05-03', 'name' => '憲法記念日'],
            ['date' => '2024-05-04', 'name' => 'みどりの日'],
            ['date' => '2024-05-05', 'name' => 'こどもの日'],
            ['date' => '2024-05-06', 'name' => '振替休日'],
            ['date' => '2024-07-15', 'name' => '海の日'],
            ['date' => '2024-08-11', 'name' => '山の日'],
            ['date' => '2024-08-12', 'name' => '振替休日'],
            ['date' => '2024-09-16', 'name' => '敬老の日'],
            ['date' => '2024-09-22', 'name' => '秋分の日'],
            ['date' => '2024-09-23', 'name' => '振替休日'],
            ['date' => '2024-10-14', 'name' => 'スポーツの日'],
            ['date' => '2024-11-03', 'name' => '文化の日'],
            ['date' => '2024-11-04', 'name' => '振替休日'],
            ['date' => '2024-11-23', 'name' => '勤労感謝の日'],
        ];

        foreach ($holidays2024 as $holiday) {
            Holiday::create([
                'date' => $holiday['date'],
                'name' => $holiday['name'],
                'type' => 'national',
                'is_recurring' => false,
                'description' => $holiday['name'] . ' is a national holiday in Japan.',
            ]);
        }

        $this->command->info('Created ' . count($holidays2024) . ' Japanese national holidays for 2024.');

        // 2025年の祝日を追加
        $this->command->info('Creating Japanese national holidays for 2025...');

        $holidays2025 = [
            ['date' => '2025-01-01', 'name' => '元旦'],
            ['date' => '2025-01-13', 'name' => '成人の日'],
            ['date' => '2025-02-11', 'name' => '建国記念の日'],
            ['date' => '2025-02-23', 'name' => '天皇誕生日'],
            ['date' => '2025-02-24', 'name' => '振替休日'],
            ['date' => '2025-03-21', 'name' => '春分の日'],
            ['date' => '2025-04-29', 'name' => '昭和の日'],
            ['date' => '2025-05-03', 'name' => '憲法記念日'],
            ['date' => '2025-05-04', 'name' => 'みどりの日'],
            ['date' => '2025-05-05', 'name' => 'こどもの日'],
            ['date' => '2025-05-06', 'name' => '振替休日'],
            ['date' => '2025-07-21', 'name' => '海の日'],
            ['date' => '2025-08-11', 'name' => '山の日'],
            ['date' => '2025-09-15', 'name' => '敬老の日'],
            ['date' => '2025-09-23', 'name' => '秋分の日'],
            ['date' => '2025-10-13', 'name' => 'スポーツの日'],
            ['date' => '2025-11-03', 'name' => '文化の日'],
            ['date' => '2025-11-23', 'name' => '勤労感謝の日'],
            ['date' => '2025-11-24', 'name' => '振替休日'],
        ];

        foreach ($holidays2025 as $holiday) {
            Holiday::create([
                'date' => $holiday['date'],
                'name' => $holiday['name'],
                'type' => 'national',
                'is_recurring' => false,
                'description' => $holiday['name'] . ' is a national holiday in Japan.',
            ]);
        }

        $this->command->info('Created ' . count($holidays2025) . ' Japanese national holidays for 2025.');

        // 2026年の祝日を追加
        $this->command->info('Creating Japanese national holidays for 2026...');

        $holidays2026 = [
            ['date' => '2026-01-01', 'name' => '元旦'],
            ['date' => '2026-01-12', 'name' => '成人の日'],
            ['date' => '2026-02-11', 'name' => '建国記念の日'],
            ['date' => '2026-02-23', 'name' => '天皇誕生日'],
            ['date' => '2026-03-20', 'name' => '春分の日'],
            ['date' => '2026-04-29', 'name' => '昭和の日'],
            ['date' => '2026-05-03', 'name' => '憲法記念日'],
            ['date' => '2026-05-04', 'name' => 'みどりの日'],
            ['date' => '2026-05-05', 'name' => 'こどもの日'],
            ['date' => '2026-05-06', 'name' => '振替休日'],
            ['date' => '2026-07-20', 'name' => '海の日'],
            ['date' => '2026-08-11', 'name' => '山の日'],
            ['date' => '2026-09-21', 'name' => '敬老の日'],
            ['date' => '2026-09-22', 'name' => '振替休日'],
            ['date' => '2026-09-23', 'name' => '秋分の日'],
            ['date' => '2026-10-12', 'name' => 'スポーツの日'],
            ['date' => '2026-11-03', 'name' => '文化の日'],
            ['date' => '2026-11-23', 'name' => '勤労感謝の日'],
        ];

        foreach ($holidays2026 as $holiday) {
            Holiday::create([
                'date' => $holiday['date'],
                'name' => $holiday['name'],
                'type' => 'national',
                'is_recurring' => false,
                'description' => $holiday['name'] . ' is a national holiday in Japan.',
            ]);
        }

        $this->command->info('Created ' . count($holidays2026) . ' Japanese national holidays for 2026.');

        $this->command->info('Total holidays created: ' . (count($holidays2022) + count($holidays2023) + count($holidays2024) + count($holidays2025) + count($holidays2026)));
    }
}
