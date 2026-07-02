<?php

namespace App\Jobs;

use App\Models\Contract;
use App\Models\ContractHistory;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class NotifyUserToSignContractJob implements ShouldQueue
{
  use Queueable;

  public Contract $contract;

  /**
   * Create a new job instance.
   */
  public function __construct(Contract $contract)
  {
    $this->contract = $contract;
  }

  /**
   * Execute the job.
   */
  public function handle(): void
  {
    try {
      if (!$this->contract->user || !$this->contract->user->email) {
        return;
      }

      Mail::send('emails.sign-contract-reminder', [
        'contract' => $this->contract,
        'user' => $this->contract->user,
      ], function ($message) {
        $message->to($this->contract->user->email)
          ->subject("【署名のお願い】{$this->contract->title}の契約書署名が必要です");
      });

      // 履歴記録
      $this->contract->histories()->create([
        'action' => 'reminder_sent',
        'recipient_email' => $this->contract->user->email,
        'subject' => "署名リマインダー: {$this->contract->title}",
        'message' => 'リマインダーメール送信',
        'status' => 'sent',
        'sent_at' => now(),
        'created_by' => null,
      ]);
    } catch (\Exception $e) {
      $this->contract->histories()->create([
        'action' => 'reminder_failed',
        'recipient_email' => $this->contract->user?->email ?? 'unknown',
        'subject' => "署名リマインダー失敗: {$this->contract->title}",
        'message' => $e->getMessage(),
        'status' => 'failed',
        'created_by' => null,
      ]);

      throw $e;
    }
  }
}
