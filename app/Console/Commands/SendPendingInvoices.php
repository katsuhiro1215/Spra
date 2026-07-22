<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Services\InvoiceService;
use Illuminate\Console\Command;

class SendPendingInvoices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoices:send-pending
                            {--dry-run : ドライランモード（実際には送信しない）}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'ドラフト状態の請求書を送信する';

    /**
     * Execute the console command.
     */
    public function handle(InvoiceService $invoiceService)
    {
        $isDryRun = $this->option('dry-run');

        $this->info('未送信請求書の送信を開始します...');
        if ($isDryRun) {
            $this->warn('[ドライランモード] 実際には送信しません');
        }

        // ドラフト状態の請求書を取得
        $invoices = Invoice::where('status', 'draft')
            ->whereNotNull('pdf_path') // PDFが生成済みのもののみ
            ->with(['user.profile', 'company', 'contract'])
            ->get();

        if ($invoices->isEmpty()) {
            $this->info('送信対象の請求書がありません。');
            return Command::SUCCESS;
        }

        $this->info("送信対象: {$invoices->count()}件の請求書");
        $this->newLine();

        $progressBar = $this->output->createProgressBar($invoices->count());
        $progressBar->start();

        $successCount = 0;
        $errorCount = 0;
        $errors = [];

        foreach ($invoices as $invoice) {
            try {
                if (!$isDryRun) {
                    $invoiceService->sendInvoice($invoice);
                    $this->newLine();
                    $this->line("✓ [{$invoice->invoice_number}] " . $this->clientName($invoice) . " - 送信完了");
                } else {
                    $this->newLine();
                    $this->line("○ [{$invoice->invoice_number}] " . $this->clientName($invoice) . " - 送信対象 (ドライラン)");
                }
                $successCount++;
            } catch (\Exception $e) {
                $errorCount++;
                $errors[] = [
                    'invoice' => $invoice->invoice_number,
                    'user' => $this->clientName($invoice),
                    'error' => $e->getMessage(),
                ];
                $this->newLine();
                $this->error("✗ [{$invoice->invoice_number}] " . $this->clientName($invoice) . " - エラー: {$e->getMessage()}");
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
                ['処理対象', $invoices->count()],
                ['成功', $successCount],
                ['エラー', $errorCount],
            ]
        );

        if (!empty($errors)) {
            $this->newLine();
            $this->error('エラー詳細:');
            $this->table(
                ['請求書番号', 'クライアント', 'エラー内容'],
                array_map(fn($err) => [$err['invoice'], $err['user'], $err['error']], $errors)
            );
        }

        return $errorCount > 0 ? Command::FAILURE : Command::SUCCESS;
    }

    /**
     * クライアント表示名を取得(Userにnameカラムは無いためprofile経由で解決)
     */
    private function clientName(Invoice $invoice): string
    {
        return $invoice->user?->profile?->full_name ?? $invoice->user?->email ?? '(不明)';
    }
}
