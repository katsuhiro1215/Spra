<?php

namespace App\Console\Commands;

use App\Models\Company;
use App\Services\MembershipRankService;
use Illuminate\Console\Command;

class CalculateMembershipRanks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'membership:calculate-ranks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '入金履歴のある会社の年間利用額を再集計し、会員ランクを更新する';

    /**
     * Execute the console command.
     */
    public function handle(MembershipRankService $membershipRankService)
    {
        $this->info('会員ランクの再計算を開始します...');

        $companies = Company::whereHas('receipts')->get();

        if ($companies->isEmpty()) {
            $this->info('対象の会社がありません。');
            return Command::SUCCESS;
        }

        $this->info("対象: {$companies->count()}件の会社");
        $this->newLine();

        $progressBar = $this->output->createProgressBar($companies->count());
        $progressBar->start();

        $successCount = 0;
        $errorCount = 0;
        $errors = [];

        foreach ($companies as $company) {
            try {
                $membershipRankService->recalculateForCompany($company);
                $successCount++;
            } catch (\Exception $e) {
                $errorCount++;
                $errors[] = [
                    'company' => $company->name,
                    'error' => $e->getMessage(),
                ];
            }
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        $this->info('=== 実行結果 ===');
        $this->table(
            ['項目', '件数'],
            [
                ['処理対象', $companies->count()],
                ['成功', $successCount],
                ['エラー', $errorCount],
            ]
        );

        if (!empty($errors)) {
            $this->newLine();
            $this->error('エラー詳細:');
            $this->table(
                ['会社', 'エラー内容'],
                array_map(fn($err) => [$err['company'], $err['error']], $errors)
            );
        }

        return $errorCount > 0 ? Command::FAILURE : Command::SUCCESS;
    }
}
