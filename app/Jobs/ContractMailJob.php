<?php

namespace App\Jobs;

use App\Mail\ContractEmail;
use App\Models\Contract;
use App\Models\ContractHistory;
use App\Models\Term;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable as FoundationQueueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class ContractMailJob implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public Contract $contract;
    public string $recipientEmail;
    public ?string $createdById = null;

    /**
     * Create a new job instance.
     */
    public function __construct(
        Contract $contract,
        string $recipientEmail,
        ?string $createdById = null
    ) {
        $this->contract = $contract;
        $this->recipientEmail = $recipientEmail;
        $this->createdById = $createdById;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // 有効な規約を取得
            $terms = Term::where('status', 'active')
                ->latest('version')
                ->first();

            // メールを送信
            Mail::to($this->recipientEmail)->send(
                new ContractEmail($this->contract, $this->recipientEmail, $terms)
            );

            // 送信履歴を記録
            $this->recordHistory('sent', 'メールが正常に送信されました');
        } catch (\Exception $e) {
            // エラーを記録
            $this->recordHistory(
                'failed',
                $e->getMessage(),
                ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]
            );

            // ジョブを再試行
            $this->release(60); // 60秒後に再試行
        }
    }

    /**
     * ジョブが失敗した時の処理
     */
    public function failed(\Throwable $exception): void
    {
        $this->recordHistory(
            'failed',
            'ジョブが失敗しました: ' . $exception->getMessage(),
            ['exception' => $exception->getMessage()]
        );
    }

    /**
     * 送信履歴を記録
     */
    private function recordHistory(
        string $status,
        string $message,
        ?array $metadata = null
    ): void {
        ContractHistory::create([
            'contract_id' => $this->contract->id,
            'action' => 'sent',
            'recipient_email' => $this->recipientEmail,
            'subject' => "契約書をお送りします - {$this->contract->title}",
            'message' => $message,
            'status' => $status,
            'sent_at' => $status === 'sent' ? now() : null,
            'metadata' => $metadata,
            'created_by' => $this->createdById,
        ]);
    }
}
