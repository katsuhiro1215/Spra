<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Contract;
use App\Models\Project;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    private const MILESTONE_NAMES = ['企画', 'デザイン', '開発', 'テスト', '公開'];

    /**
     * 有効・完了済みの契約からプロジェクトを作成する。
     * マイルストーン・タスクも作成し、進捗状況・ガントチャートを確認できるようにする。
     */
    public function run(): void
    {
        $contracts = Contract::whereIn('status', ['active', 'completed'])
            ->with('currentVersion')
            ->orderBy('start_date')
            ->get();
        $admin = Admin::first();

        if ($contracts->isEmpty() || !$admin) {
            $this->command?->warn('ProjectSeeder: 前提データ（有効な契約/Admin）が不足しているためスキップします。');
            return;
        }

        $now = Carbon::now();
        $counter = 1;
        $created = 0;

        foreach ($contracts as $contract) {
            $startDate = Carbon::parse($contract->start_date);
            $estimatedEndDate = Carbon::parse($contract->end_date ?? $startDate->copy()->addMonths(3));
            $isCompleted = $contract->status === 'completed';

            // 進行度（0〜1）: 完了契約は1.0、有効契約は開始〜終了予定日に対する現在位置
            $totalDays = max(1, $startDate->diffInDays($estimatedEndDate));
            $elapsedDays = $startDate->diffInDays($now);
            $progressRatio = $isCompleted ? 1.0 : min(0.95, max(0.05, $elapsedDays / $totalDays));

            $projectStatus = match (true) {
                $isCompleted => 'completed',
                $progressRatio < 0.2 => 'planning',
                $progressRatio < 0.4 => 'design',
                $progressRatio < 0.7 => 'development',
                $progressRatio < 0.9 => 'testing',
                default => 'review',
            };

            $project = Project::create([
                'project_code' => 'PRJ-' . $startDate->format('Y') . '-' . str_pad($counter++, 4, '0', STR_PAD_LEFT),
                'contract_id' => $contract->id,
                'user_id' => $contract->user_id,
                'company_id' => $contract->company_id,
                'admin_id' => $admin->id,
                'title' => str_replace(' - 契約', '', $contract->title) . ' プロジェクト',
                'description' => $contract->currentVersion?->terms_and_conditions,
                'status' => $projectStatus,
                'priority' => fake()->randomElement(['low', 'medium', 'high']),
                'start_date' => $startDate->toDateString(),
                'estimated_end_date' => $estimatedEndDate->toDateString(),
                'actual_end_date' => $isCompleted ? $estimatedEndDate->toDateString() : null,
                'is_client_visible' => true,
                'created_by' => $admin->id,
            ]);
            $project->forceFill(['created_at' => $startDate, 'updated_at' => $now])->save();

            $version = $project->versions()->create([
                'version' => 1,
                'title' => "{$project->title} - Version 1",
                'description' => $project->description,
                'start_date' => $startDate->toDateString(),
                'estimated_end_date' => $estimatedEndDate->toDateString(),
                'total_estimated_hours' => 160,
                'status' => $isCompleted ? 'approved' : 'active',
                'is_current' => true,
                'created_by' => $admin->id,
            ]);
            $version->forceFill(['created_at' => $startDate, 'updated_at' => $now])->save();

            $milestoneCount = count(self::MILESTONE_NAMES);
            $daysPerMilestone = max(1, intdiv($totalDays, $milestoneCount));

            foreach (self::MILESTONE_NAMES as $mIndex => $name) {
                $milestoneStart = $startDate->copy()->addDays($daysPerMilestone * $mIndex);
                $milestoneDue = $startDate->copy()->addDays($daysPerMilestone * ($mIndex + 1));
                $milestoneRatio = ($mIndex + 1) / $milestoneCount;

                $milestoneStatus = match (true) {
                    $isCompleted => 'completed',
                    $milestoneRatio <= $progressRatio => 'completed',
                    $milestoneRatio - (1 / $milestoneCount) < $progressRatio => 'in_progress',
                    default => 'pending',
                };

                $milestone = $version->milestones()->create([
                    'title' => $name,
                    'description' => "{$name}フェーズの作業一式",
                    'status' => $milestoneStatus,
                    'due_date' => $milestoneDue->toDateString(),
                    'completed_at' => $milestoneStatus === 'completed' ? $milestoneDue->copy()->subDay() : null,
                    'sort_order' => $mIndex + 1,
                    'is_client_visible' => true,
                ]);

                $itemStatus = match ($milestoneStatus) {
                    'completed' => 'completed',
                    'in_progress' => 'in_progress',
                    default => 'not_started',
                };
                $itemProgress = match ($itemStatus) {
                    'completed' => 100,
                    'in_progress' => fake()->numberBetween(20, 80),
                    default => 0,
                };

                $version->items()->create([
                    'milestone_id' => $milestone->id,
                    'name' => "{$name}タスク",
                    'description' => "{$name}フェーズの実作業",
                    'type' => 'task',
                    'start_date' => $milestoneStart->toDateString(),
                    'end_date' => $milestoneDue->toDateString(),
                    'actual_start_date' => in_array($itemStatus, ['in_progress', 'completed'], true) ? $milestoneStart->toDateString() : null,
                    'actual_end_date' => $itemStatus === 'completed' ? $milestoneDue->toDateString() : null,
                    'estimated_hours' => 32,
                    'status' => $itemStatus,
                    'progress' => $itemProgress,
                    'priority' => 'medium',
                    'assigned_to' => $admin->id,
                    'sort_order' => $mIndex + 1,
                    'is_client_visible' => true,
                    'category' => $name,
                ]);
            }

            $created++;
        }

        $this->command?->info("ProjectSeeder: {$created}件のプロジェクトを作成しました。");
    }
}
