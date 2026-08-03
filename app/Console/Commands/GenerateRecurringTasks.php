<?php

namespace App\Console\Commands;

use App\Services\TaskService;
use Illuminate\Console\Command;

class GenerateRecurringTasks extends Command
{
    protected $signature = 'tasks:generate-recurring';

    protected $description = '繰り返しタスク設定から、先行生成分の実体タスクを穴埋めします';

    public function handle(TaskService $service)
    {
        $this->info('繰り返しタスクを生成しています...');

        $count = $service->generateUpcomingOccurrences();

        $this->info("{$count}件のタスクを生成しました。");

        return Command::SUCCESS;
    }
}
