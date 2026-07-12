<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContractSignature extends Model
{
    use HasUlid, SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'contract_id',
        'signed_by_user',
        'signed_by_admin',
        'signature_image',
        'signature_type',
        'method',
        'ip_address',
        'user_agent',
        'signed_at',
        'status',
        'metadata',
    ];

    protected $casts = [
        'signed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
        'metadata' => 'array',
    ];

    // ============================================================
    // リレーション
    // ============================================================

    /**
     * 契約書
     */
    public function contract()
    {
        return $this->belongsTo(Contract::class, 'contract_id', 'id');
    }

    /**
     * 署名したユーザー
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'signed_by_user', 'id');
    }

    /**
     * 署名した管理者
     */
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'signed_by_admin', 'id');
    }

    // ============================================================
    // スコープ
    // ============================================================

    /**
     * ユーザー署名を取得
     */
    public function scopeUserSignatures($query)
    {
        return $query->where('signature_type', 'user')->whereNotNull('signed_by_user');
    }

    /**
     * 管理者署名を取得
     */
    public function scopeAdminSignatures($query)
    {
        return $query->where('signature_type', 'admin')->whereNotNull('signed_by_admin');
    }

    /**
     * 署名済みを取得
     */
    public function scopeSigned($query)
    {
        return $query->whereIn('status', ['signed', 'verified'])->whereNotNull('signed_at');
    }

    /**
     * 保留中を取得
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    // ============================================================
    // メソッド
    // ============================================================

    /**
     * 署名を確定
     */
    public function markAsSigned(?string $signedBy = null): void
    {
        $this->update([
            'status' => 'signed',
            'signed_at' => now(),
        ]);

        // 契約書ステータスを更新
        if ($this->signature_type === 'user') {
            // 管理者側の署名が不要な契約は、ユーザー署名のみで完全署名とする
            $newStatus = $this->contract->signature_required_from === 'user'
                ? 'fully_signed'
                : 'user_signed';

            $this->contract->update([
                'signature_status' => $newStatus,
                'user_signed_at' => now(),
            ]);
        } elseif ($this->signature_type === 'admin') {
            // admin/both いずれの場合も、管理者の署名が行われれば完全署名
            $this->contract->update([
                'signature_status' => 'fully_signed',
                'admin_signed_at' => now(),
            ]);
        }

        $this->contract->refresh();

        if ($this->contract->signature_status === 'fully_signed') {
            $this->activateContractAndNotifyUser();
        }
    }

    /**
     * 完全署名が完了した契約を有効化し、クライアントに通知する
     */
    private function activateContractAndNotifyUser(): void
    {
        $contract = $this->contract;

        if (in_array($contract->status, ['draft', 'pending_signature'], true)) {
            $contract->update(['status' => 'active']);
        }

        $contract->user?->notify(new \App\Notifications\ContractFullySigned($contract));
    }

    /**
     * 署名を却下
     */
    public function reject(?string $reason = null): void
    {
        $this->update([
            'status' => 'rejected',
            'metadata' => array_merge($this->metadata ?? [], [
                'rejected_reason' => $reason,
                'rejected_at' => now(),
            ]),
        ]);

        $this->contract->update([
            'signature_status' => 'rejected',
        ]);
    }

    /**
     * 署名を検証
     */
    public function verify(): void
    {
        $this->update([
            'status' => 'verified',
            'metadata' => array_merge($this->metadata ?? [], [
                'verified_at' => now(),
            ]),
        ]);
    }

    /**
     * 署名者名を取得
     */
    public function getSignerName(): string
    {
        if ($this->signature_type === 'user' && $this->user) {
            return $this->user->name ?? $this->user->email;
        }

        if ($this->signature_type === 'admin' && $this->admin) {
            return $this->admin->name ?? $this->admin->email;
        }

        return '不明';
    }

    /**
     * ステータスラベルを取得
     */
    public function getStatusLabel(): string
    {
        return match ($this->status) {
            'pending' => '保留中',
            'signed' => '署名済み',
            'verified' => '検証済み',
            'rejected' => '却下',
            default => $this->status,
        };
    }

    /**
     * 方法ラベルを取得
     */
    public function getMethodLabel(): string
    {
        return match ($this->method) {
            'canvas' => 'Canvas署名',
            'upload' => 'アップロード',
            'typed' => 'テキスト',
            default => $this->method,
        };
    }
}
