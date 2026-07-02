<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContractHistory extends Model
{
    use HasUlid, SoftDeletes;

    protected $fillable = [
        'contract_id',
        'action',
        'recipient_email',
        'subject',
        'message',
        'sent_at',
        'status',
        'metadata',
        'created_by',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'metadata' => 'array',
    ];

    // -------------------------
    // Relationships
    // -------------------------

    /**
     * この履歴が属する契約
     */
    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    /**
     * この履歴を作成した Admin
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    // -------------------------
    // Scopes
    // -------------------------

    /**
     * 送信済みレコード
     */
    public function scopeSent($query)
    {
        return $query->where('status', 'sent')->whereNotNull('sent_at');
    }

    /**
     * 失敗したレコード
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    /**
     * ペンディングレコード
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    // -------------------------
    // Methods
    // -------------------------

    /**
     * 送信成功をマーク
     */
    public function markAsSent(): void
    {
        $this->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);
    }

    /**
     * 送信失敗をマーク
     */
    public function markAsFailed(?string $error = null): void
    {
        $this->update([
            'status' => 'failed',
            'metadata' => array_merge(
                $this->metadata ?? [],
                ['error' => $error, 'failed_at' => now()]
            ),
        ]);
    }

    /**
     * アクション名を日本語で取得
     */
    public function getActionLabel(): string
    {
        $labels = [
            'created' => '作成',
            'sent' => '送信',
            'signed' => '署名',
            'archived' => 'アーカイブ',
            'cancelled' => 'キャンセル',
            'note_added' => 'メモ追加',
        ];

        return $labels[$this->action] ?? $this->action;
    }

    /**
     * ステータス名を日本語で取得
     */
    public function getStatusLabel(): string
    {
        $labels = [
            'pending' => 'ペンディング',
            'sent' => '送信済み',
            'failed' => '失敗',
            'bounce' => 'バウンス',
        ];

        return $labels[$this->status] ?? $this->status;
    }
}
