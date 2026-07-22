<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Appointment;
use App\Models\AppointmentSlot;
use App\Models\Company;
use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    private const SLOT_TIMES = [['10:00', '11:00'], ['14:00', '15:00']];

    /**
     * 過去60日〜今後14日の平日に面談枠を作成し、一部に予約を入れる。
     * 「今週の予約」ダッシュボードキューを確認できるよう、直近の枠は必ず予約済みにする。
     */
    public function run(): void
    {
        $admin = Admin::first();
        $users = User::where('status', 'active')->with('companies')->inRandomOrder()->limit(15)->get();

        if (!$admin || $users->isEmpty()) {
            $this->command?->warn('AppointmentSeeder: 前提データ（Admin/User）が不足しているためスキップします。');
            return;
        }

        $today = Carbon::today();
        $start = $today->copy()->subDays(60);
        $end = $today->copy()->addDays(14);

        $slotCount = 0;
        $appointmentCount = 0;

        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            if ($date->isWeekend()) {
                continue;
            }

            foreach (self::SLOT_TIMES as [$startTime, $endTime]) {
                $slot = AppointmentSlot::create([
                    'date' => $date->toDateString(),
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'slot_type' => fake()->randomElement(['meeting', 'progress_review', 'consultation']),
                    'max_capacity' => 1,
                    'current_bookings' => 0,
                    'assigned_admin_id' => $admin->id,
                    'status' => 'available',
                    'created_by' => $admin->id,
                ]);
                $slot->forceFill(['created_at' => $date, 'updated_at' => $date])->save();
                $slotCount++;

                // 今週（今日〜今後7日）の枠は必ず予約を入れる。
                // それ以外は過去日は70%、将来日は30%の確率で予約を入れる。
                $isThisWeek = $date->between($today, $today->copy()->addDays(7));
                $isPast = $date->lt($today);
                $shouldBook = $isThisWeek || fake()->boolean($isPast ? 70 : 30);

                if (!$shouldBook) {
                    continue;
                }

                $user = $users->random();
                $company = $user->companies->first() ?? Company::inRandomOrder()->first();
                $project = Project::where('user_id', $user->id)->inRandomOrder()->first();

                $status = match (true) {
                    $isPast => fake()->randomElement(['completed', 'completed', 'completed', 'no_show', 'cancelled']),
                    $isThisWeek => fake()->randomElement(['pending', 'confirmed', 'confirmed']),
                    default => fake()->randomElement(['pending', 'confirmed']),
                };

                $appointment = Appointment::create([
                    'appointment_slot_id' => $slot->id,
                    'user_id' => $user->id,
                    'company_id' => $company?->id,
                    'project_id' => $project?->id,
                    'subject' => fake()->randomElement(['進捗確認ミーティング', '要件ヒアリング', '契約内容のご相談', '納品前レビュー']),
                    'description' => 'プロジェクトの進捗と今後の進め方について確認します。',
                    'location_type' => fake()->randomElement(['online', 'online', 'in_person']),
                    'meeting_tool' => fake()->randomElement(['zoom', 'google_meet', 'teams']),
                    'status' => $status,
                    'attended' => $status === 'completed',
                    'confirmed_at' => in_array($status, ['confirmed', 'completed'], true) ? $date->copy()->subDays(2) : null,
                    'cancelled_at' => $status === 'cancelled' ? $date->copy()->subDay() : null,
                    'cancellation_reason' => $status === 'cancelled' ? 'クライアントの都合により' : null,
                    'created_by' => $admin->id,
                ]);
                $appointment->forceFill(['created_at' => $date->copy()->subDays(3), 'updated_at' => $date])->save();

                $slot->update(['current_bookings' => 1, 'status' => 'full']);

                $appointmentCount++;
            }
        }

        $this->command?->info("AppointmentSeeder: 枠{$slotCount}件・予約{$appointmentCount}件を作成しました。");
    }
}
