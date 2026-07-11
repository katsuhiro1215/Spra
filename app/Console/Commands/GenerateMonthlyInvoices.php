<?php

namespace App\Console\Commands;

use App\Models\Contract;
use App\Services\InvoiceService;
use Illuminate\Console\Command;

class GenerateMonthlyInvoices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoices:generate-monthly
                            {--dry-run : ドライランモード（実際には生成しない）}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '月額契約から請求書を自動生成する';

    /**
     * Execute the console command.
     */
    public function handle(InvoiceService $invoiceService)
    {
        $isDryRun = $this->option('dry-run');

        $this->info('月額請求書の自動生成を開始します...');
        if ($isDryRun) {
            $this->warn('[ドライランモード] 実際には生成しません');
        }

        // 請求対象の契約を取得
        $contracts = Contract::where('type', 'monthly')
            ->where('status', 'active')
            ->where('auto_invoice_generation', true)
            ->where(function ($query) {
                $query->whereNull('next_billing_date')
                    ->orWhere('next_billing_date', '<=', now());
            })
            ->with(['user.profile', 'company'])
            ->get();

        if ($contracts->isEmpty()) {
            $this->info('請求対象の契約がありません。');
            return Command::SUCCESS;
        }

        $this->info("請求対象: {$contracts->count()}件の契約");
        $this->newLine();

        $progressBar = $this->output->createProgressBar($contracts->count());
        $progressBar->start();

        $successCount = 0;
        $errorCount = 0;
        $errors = [];

        foreach ($contracts as $contract) {
            try {
                if (!$isDryRun) {
                    $invoice = $invoiceService->generateMonthlyInvoice($contract);
                    $this->newLine();
                    $this->line("✓ [{$contract->contract_number}] " . $this->clientName($contract) . " - 請求書生成: {$invoice->invoice_number}");
                } else {
                    $this->newLine();
                    $this->line("○ [{$contract->contract_number}] " . $this->clientName($contract) . " - 生成対象 (ドライラン)");
                }
                $successCount++;
            } catch (\Exception $e) {
                $errorCount++;
                $errors[] = [
                    'contract' => $contract->contract_number,
                    'user' => $this->clientName($contract),
                    'error' => $e->getMessage(),
                ];
                $this->newLine();
                $this->error("✗ [{$contract->contract_number}] " . $this->clientName($contract) . " - エラー: {$e->getMessage()}");
            }
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        // 結果サマリー
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
                ['契約番号', 'クライアント', 'エラー内容'],
                array_map(fn($err) => [$err['contract'], $err['user'], $err['error']], $errors)
            );
        }

        return $errorCount > 0 ? Command::FAILURE : Command::SUCCESS;
    }

    /**
     * クライアント表示名を取得(Userにnameカラムは無いためprofile経由で解決)
     */
    private function clientName(Contract $contract): string
    {
        return $contract->user?->profile?->full_name ?? $contract->user?->email ?? '(不明)';
    }
}
