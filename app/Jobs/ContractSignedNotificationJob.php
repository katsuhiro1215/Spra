<?php

namespace App\Jobs;

use App\Models\Contract;
use App\Models\ContractHistory;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class ContractSignedNotificationJob implements ShouldQueue
{
    use Queueable;

    public Contract $contract;
    public string $type; // 'user_signed', 'fully_signed', 'signature_rejected'
    public ?string $reason = null;

    /**
     * Create a new job instance.
     */
    public function __construct(Contract $contract, string $type, ?string $reason = null)
    {
        $this->contract = $contract;
        $this->type = $type;
        $this->reason = $reason;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            if ($this->type === 'user_signed') {
                // 管理者にユーザー署名通知
                $this->notifyAdminOfUserSignature();
            } elseif ($this->type === 'fully_signed') {
                // クライアントに完全署名完了通知
                $this->notifyClientOfFullySignedContract();
            } elseif ($this->type === 'signature_rejected') {
                // クライアントに却下通知
                $this->notifyClientOfRejectedSignature();
            }

            // 履歴記録
            $this->contract->histories()->create([
                'action' => 'signature_notification',
                'recipient_email' => $this->getRecipientEmail(),
                'subject' => $this->getEmailSubject(),
                'message' => $this->getEmailMessage(),
                'status' => 'sent',
                'sent_at' => now(),
                'created_by' => null,
            ]);
        } catch (\Exception $e) {
            $this->recordHistory('failed', $e->getMessage());
            throw $e;
        }
    }

    /**
     * 管理者にユーザー署名通知を送信
     */
    private function notifyAdminOfUserSignature(): void
    {
        $admins = \App\Models\Admin::whereIn('role', ['owner', 'super_admin', 'admin'])->get();

        foreach ($admins as $admin) {
            Mail::send('emails.admin-user-signed', [
                'contract' => $this->contract,
                'admin' => $admin,
                'userSignature' => $this->contract->signatures()->where('signature_type', 'user')->latest()->first(),
            ], function ($message) use ($admin) {
                $message->to($admin->email)
                    ->subject("【署名待ち】{$this->contract->title}がユーザーにより署名されました");
            });
        }
    }

    /**
     * クライアントに完全署名完了通知を送信
     */
    private function notifyClientOfFullySignedContract(): void
    {
        if (!$this->contract->user || !$this->contract->user->email) {
            return;
        }

        Mail::send('emails.contract-signed-complete', [
            'contract' => $this->contract,
            'user' => $this->contract->user,
        ], function ($message) {
            $message->to($this->contract->user->email)
                ->subject("【完了】{$this->contract->title}の契約書に署名されました");
        });
    }

    /**
     * クライアントに却下通知を送信
     */
    private function notifyClientOfRejectedSignature(): void
    {
        if (!$this->contract->user || !$this->contract->user->email) {
            return;
        }

        Mail::send('emails.contract-signature-rejected', [
            'contract' => $this->contract,
            'user' => $this->contract->user,
            'reason' => $this->reason,
        ], function ($message) {
            $message->to($this->contract->user->email)
                ->subject("【再署名必要】{$this->contract->title}の署名が却下されました");
        });
    }

    /**
     * 受信者メールアドレスを取得
     */
    private function getRecipientEmail(): string
    {
        if ($this->type === 'user_signed') {
            return 'admin@example.com'; // 管理者向け
        }
        return $this->contract->user?->email ?? 'unknown@example.com';
    }

    /**
     * メール件名を取得
     */
    private function getEmailSubject(): string
    {
        return match ($this->type) {
            'user_signed' => "【署名待ち】{$this->contract->title}がユーザーにより署名されました",
            'fully_signed' => "【完了】{$this->contract->title}の契約書に署名されました",
            'signature_rejected' => "【再署名必要】{$this->contract->title}の署名が却下されました",
            default => "契約書通知: {$this->contract->title}",
        };
    }

    /**
     * メール本文を取得
     */
    private function getEmailMessage(): string
    {
        return match ($this->type) {
            'user_signed' => "ユーザーが契約書に署名しました。管理者の確認をお待ちください。",
            'fully_signed' => "契約書が完全に署名されました。",
            'signature_rejected' => "お客様の署名が却下されました。理由: {$this->reason}",
            default => "契約書の通知です",
        };
    }

    /**
     * 失敗を記録
     */
    private function recordHistory(string $status, ?string $error = null): void
    {
        $this->contract->histories()->create([
            'action' => 'signature_notification',
            'recipient_email' => $this->getRecipientEmail(),
            'subject' => $this->getEmailSubject(),
            'message' => $this->getEmailMessage(),
            'status' => $status,
            'metadata' => $error ? ['error' => $error] : null,
            'created_by' => null,
        ]);
    }

    /**
     * ジョブ失敗時の処理
     */
    public function failed(\Throwable $exception): void
    {
        $this->recordHistory('failed', $exception->getMessage());
    }
}
