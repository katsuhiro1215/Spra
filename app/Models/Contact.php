<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contact extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'category',
        'subject',
        'message',
        'attachments',
        'status',
        'admin_notes',
        'responded_at',
        'assigned_to'
    ];

    protected $casts = [
        'attachments' => 'array',
        'responded_at' => 'datetime'
    ];

    // リレーション
    public function assignedAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'assigned_to');
    }

    // スコープ
    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeResolved($query)
    {
        return $query->where('status', 'resolved');
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // アクセサ
    protected function isResolved(): Attribute
    {
        return Attribute::make(
            get: fn() => in_array($this->status, ['resolved', 'closed'])
        );
    }

    protected function statusLabel(): Attribute
    {
        return Attribute::make(
            get: fn() => match ($this->status) {
                'new' => '新規',
                'in_progress' => '対応中',
                'resolved' => '解決済み',
                'closed' => 'クローズ',
                default => $this->status
            }
        );
    }

    protected function categoryLabel(): Attribute
    {
        return Attribute::make(
            get: fn() => match ($this->category) {
                'estimate' => '見積もり',
                'partnership' => '業務提携',
                'support' => 'サポート',
                'other' => 'その他',
                default => $this->category
            }
        );
    }
}
