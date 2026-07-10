<?php

namespace App\Jobs;

use App\Mail\ContractGroupEmail;
use App\Models\ContractGroup;
use App\Models\ContractHistory;
use App\Models\Term;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable as FoundationQueueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class ContractGroupMailJob implements ShouldQueue
{
  use InteractsWithQueue, Queueable, SerializesModels;

  public ContractGroup $contractGroup;
  public string $recipientEmail;
  public ?string $createdById = null;

  /**
   * Create a new job instance.
   */
  public function __construct(
    ContractGroup $contractGroup,
    string $recipientEmail,
    ?string $createdById = null
  ) {
    $this->contractGroup = $contractGroup;
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
        new ContractGroupEmail($this->contractGroup, $this->recipientEmail, $terms)
      );

      // 送信履歴を記録
      $this->recordHistory('sent', 'グループ内の全契約書が正常に送信されました');
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
    // グループ内の各契約書に対して履歴を記録
    foreach ($this->contractGroup->contracts as $contract) {
      ContractHistory::create([
        'contract_id' => $contract->id,
        'action' => 'group_sent',
        'recipient_email' => $this->recipientEmail,
        'subject' => "契約書グループをお送りします - {$this->contractGroup->title}",
        'message' => $message,
        'status' => $status,
        'sent_at' => $status === 'sent' ? now() : null,
        'metadata' => [
          ...$metadata ?? [],
          'group_id' => $this->contractGroup->id,
          'group_number' => $this->contractGroup->group_number,
        ],
        'created_by' => $this->createdById,
      ]);
    }
  }
}
