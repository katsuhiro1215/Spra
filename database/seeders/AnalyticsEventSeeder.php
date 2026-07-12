<?php

namespace Database\Seeders;

use App\Models\AnalyticsEvent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AnalyticsEventSeeder extends Seeder
{
    private const PAGES = ['/', '/service', '/about', '/company', '/blog', '/faq', '/flow', '/contact'];

    private const REFERRERS = [
        null, // 直接流入
        null,
        'https://www.google.com/search?q=%E3%83%9B%E3%83%BC%E3%83%A0%E3%83%9A%E3%83%BC%E3%82%B8%E5%88%B6%E4%BD%9C',
        'https://www.bing.com/search?q=web%E5%88%B6%E4%BD%9C',
        'https://www.facebook.com/',
        'https://twitter.com/',
        'https://www.instagram.com/',
    ];

    private const DEVICES = ['desktop', 'mobile', 'tablet'];
    private const BROWSERS = ['Chrome', 'Safari', 'Firefox', 'Edge'];
    private const PLATFORMS = ['Windows', 'OS X', 'iOS', 'Android'];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating analytics events (demo pageviews)...');

        $days = 30;
        $totalEvents = 0;

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->startOfDay();
            // 平日はやや多め、週末はやや少なめの訪問数にする
            $isWeekend = $date->isWeekend();
            $eventsToday = random_int($isWeekend ? 15 : 30, $isWeekend ? 40 : 90);

            for ($j = 0; $j < $eventsToday; $j++) {
                $visitorSeed = Str::random(12);
                $occurredAt = $date->copy()->addSeconds(random_int(0, 86399));

                AnalyticsEvent::create([
                    'session_id' => Str::uuid()->toString(),
                    'visitor_hash' => hash('sha256', $visitorSeed . $date->toDateString()),
                    'event_type' => AnalyticsEvent::TYPE_PAGEVIEW,
                    'url' => self::PAGES[array_rand(self::PAGES)],
                    'referrer_url' => self::REFERRERS[array_rand(self::REFERRERS)],
                    'device_type' => self::DEVICES[array_rand(self::DEVICES)],
                    'browser' => self::BROWSERS[array_rand(self::BROWSERS)],
                    'platform' => self::PLATFORMS[array_rand(self::PLATFORMS)],
                    'occurred_at' => $occurredAt,
                    'created_at' => $occurredAt,
                    'updated_at' => $occurredAt,
                ]);
                $totalEvents++;
            }
        }

        $this->command->info("Analytics events created: {$totalEvents}");
    }
}
