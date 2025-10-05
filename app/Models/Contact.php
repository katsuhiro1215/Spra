<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Contact extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'subject',
        'message',
        'service_interest',
        'budget_range',
        'timeline',
        'additional_info',
        'status',
        'admin_notes',
        'replied_at'
    ];

    protected $casts = [
        'additional_info' => 'array',
        'replied_at' => 'datetime'
    ];

    // スコープ
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeReplied($query)
    {
        return $query->where('status', 'replied');
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    // アクセサ
    protected function isReplied(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status === 'replied' && $this->replied_at !== null
        );
    }

    protected function statusLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => match($this->status) {
                'pending' => '未対応',
                'in_progress' => '対応中',
                'replied' => '返信済み',
                'closed' => 'クローズ',
                default => $this->status
            }
        );
    }

    protected function serviceInterestLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => match($this->service_interest) {
                'web' => 'Web開発',
                'system' => 'システム開発',
                'app' => 'アプリ開発',
                'consulting' => 'コンサルティング',
                'other' => 'その他',
                default => $this->service_interest
            }
        );
    }
}
