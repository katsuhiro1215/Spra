<?php

namespace App\Console\Commands;

use App\Mail\ContractRenewalNoticeMail;
use App\Models\Admin;
use App\Models\Contract;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendContractRenewalNotices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'contracts:send-renewal-notices
                            {--dry-run : ドライランモード（実際には送信しない）}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '自動更新設定の契約について、契約終了日が近づいたら管理者に事前通知する';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $isDryRun = $this->option('dry-run');

        $this->info('契約更新の事前通知を開始します...');
        if ($isDryRun) {
            $this->warn('[ドライランモード] 実際には送信しません');
        }

        // 自動更新設定 かつ 有効 かつ 未通知 かつ 「終了日 <= 今日 + renewal_notice_days」の契約が対象
        // (renewal_notice_days は契約ごとに異なる列のため、DATE_ADDでの比較が必要)
        $contracts = Contract::where('auto_renewal', true)
            ->where('status', 'active')
            ->whereNotNull('end_date')
            ->whereNull('renewal_notice_sent_at')
            ->where('end_date', '>=', now()->toDateString())
            ->whereRaw('end_date <= DATE_ADD(?, INTERVAL renewal_notice_days DAY)', [now()->toDateString()])
            ->with(['user.profile', 'company'])
            ->get();

        if ($contracts->isEmpty()) {
            $this->info('通知対象の契約がありません。');
            return Command::SUCCESS;
        }

        $this->info("通知対象: {$contracts->count()}件の契約");
        $this->newLine();

        // 更新判断・対応ができる管理者に通知する
        $admins = Admin::whereIn('role', ['owner', 'super_admin', 'admin'])->get();
        $recipientEmails = $admins->isNotEmpty()
            ? $admins->pluck('email')->implode(', ')
            : '(該当する管理者なし)';

        $progressBar = $this->output->createProgressBar($contracts->count());
        $progressBar->start();

        $successCount = 0;
        $errorCount = 0;
        $errors = [];

        foreach ($contracts as $contract) {
            try {
                if (!$isDryRun) {
                    foreach ($admins as $admin) {
                        Mail::to($admin->email)->send(new ContractRenewalNoticeMail($contract));
                    }

                    $contract->update(['renewal_notice_sent_at' => now()]);

                    $contract->histories()->create([
                        'action' => 'renewal_notice_sent',
                        'recipient_email' => $recipientEmails,
                        'subject' => "更新案内: {$contract->title}",
                        'message' => "契約終了日({$contract->end_date->format('Y-m-d')})が近づいたため、管理者に更新案内を送付しました。",
                        'status' => 'sent',
                        'sent_at' => now(),
                        'created_by' => null,
                    ]);

                    $this->newLine();
                    $this->line("✓ [{$contract->contract_number}] {$contract->title} - 通知送信完了");
                } else {
                    $this->newLine();
                    $this->line("○ [{$contract->contract_number}] {$contract->title} - 通知対象 (ドライラン)");
                }
                $successCount++;
            } catch (\Exception $e) {
                $errorCount++;
                $errors[] = [
                    'contract' => $contract->contract_number,
                    'error' => $e->getMessage(),
                ];

                if (!$isDryRun) {
                    $contract->histories()->create([
                        'action' => 'renewal_notice_failed',
                        'recipient_email' => $recipientEmails,
                        'subject' => "更新案内送付失敗: {$contract->title}",
                        'message' => $e->getMessage(),
                        'status' => 'failed',
                        'created_by' => null,
                    ]);
                }

                $this->newLine();
                $this->error("✗ [{$contract->contract_number}] {$contract->title} - エラー: {$e->getMessage()}");
            }
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        $this->info('=== 実行結果 ===');
        $this->table(
            ['項目', '件数'],
            [
                ['処理対象', $contracts->count()],
                ['成功', $successCount],
                ['エラー', $errorCount],
            ]
        );

        if (!empty($errors)) {
            $this->newLine();
            $this->error('エラー詳細:');
            $this->table(
                ['契約番号', 'エラー内容'],
                array_map(fn($err) => [$err['contract'], $err['error']], $errors)
            );
        }

        return $errorCount > 0 ? Command::FAILURE : Command::SUCCESS;
    }
}
