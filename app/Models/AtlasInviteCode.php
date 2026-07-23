<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class AtlasInviteCode extends Model
{
    use HasUlid;

    protected $fillable = [
        'code',
        'brand',
        'status',
        'issued_by',
        'used_by',
        'used_at',
        'expires_at',
        'note',
    ];

    protected $casts = [
        'used_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function issuedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'issued_by');
    }

    public function usedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'used_by');
    }

    public function isRedeemable(): bool
    {
        if ($this->status !== 'unused') {
            return false;
        }

        return !$this->expires_at || $this->expires_at->isFuture();
    }

    /**
     * 重複しないランダムコードを生成する（紛らわしい文字は除外）
     */
    public static function generateCode(): string
    {
        $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

        do {
            $code = collect(range(1, 10))
                ->map(fn () => $alphabet[random_int(0, strlen($alphabet) - 1)])
                ->implode('');
        } while (static::where('code', $code)->exists());

        return $code;
    }
}
