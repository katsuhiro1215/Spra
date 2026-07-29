<?php

namespace App\Console\Commands;

use App\Services\AppointmentSlotRecurrenceService;
use Illuminate\Console\Command;

class GenerateRecurringAppointmentSlots extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'appointments:generate-recurring-slots';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '繰り返し予約枠設定から、先行生成分の予約枠を穴埋めします';

    /**
     * Execute the console command.
     */
    public function handle(AppointmentSlotRecurrenceService $service)
    {
        $this->info('繰り返し予約枠を生成しています...');

        $count = $service->generateForAllActive();

        $this->info("{$count}件の予約枠を生成しました。");

        return Command::SUCCESS;
    }
}
