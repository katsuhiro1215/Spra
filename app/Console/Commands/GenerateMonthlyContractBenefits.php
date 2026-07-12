<?php

namespace App\Console\Commands;

use App\Models\Contract;
use App\Services\ContractBenefitService;
use Illuminate\Console\Command;

class GenerateMonthlyContractBenefits extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'benefits:generate-monthly
                            {--dry-run : ドライランモード（実際には生成しない）}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '継続契約（保守契約等）の契約特典（チケット）を毎月自動生成する';

    /**
     * Execute the console command.
     */
    public function handle(ContractBenefitService $benefitService)
    {
        $isDryRun = $this->option('dry-run');

        $this->info('契約特典の月次自動生成を開始します...');
        if ($isDryRun) {
            $this->warn('[ドライランモード] 実際には生成しません');
        }

        // end_date が未設定（継続契約）かつ有効な契約が対象
        $contracts = Contract::whereNull('end_date')
            ->where('status', 'active')
            ->with(['user.profile', 'servicePlan'])
            ->get();

        if ($contracts->isEmpty()) {
            $this->info('対象の契約がありません。');
            return Command::SUCCESS;
        }

        $this->info("対象: {$contracts->count()}件の契約");

        $successCount = 0;
        $errorCount = 0;

        foreach ($contracts as $contract) {
            try {
                if (!$isDryRun) {
                    $benefitService->generateNextPeriodBenefits($contract);
                }
                $this->line("✓ [{$contract->contract_number}] " . $this->clientName($contract));
                $successCount++;
            } catch (\Exception $e) {
                $errorCount++;
                $this->error("✗ [{$contract->contract_number}] " . $this->clientName($contract) . " - エラー: {$e->getMessage()}");
            }
        }

        $this->newLine();
        $this->table(
            ['項目', '件数'],
            [
                ['処理対象', $contracts->count()],
                ['成功', $successCount],
                ['エラー', $errorCount],
            ]
        );

        return $errorCount > 0 ? Command::FAILURE : Command::SUCCESS;
    }

    private function clientName(Contract $contract): string
    {
        return $contract->user?->profile?->full_name ?? $contract->user?->email ?? '(不明)';
    }
}
