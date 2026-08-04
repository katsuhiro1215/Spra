<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contact extends Model
{
    use HasUlid;
    protected $fillable = [
        'name',
        'email',
        'user_id',
        'phone',
        'company',
        'contact_category_id',
        'subject',
        'message',
        'attachments',
        'status',
        'admin_notes',
        'responded_at',
        'assigned_to',
        // 流入元トラッキング情報
        'source',
        'api_client_id',
        'ip',
        'user_agent',
        'referrer',
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function contactCategory(): BelongsTo
    {
        return $this->belongsTo(ContactCategory::class, 'contact_category_id');
    }

    public function apiClient(): BelongsTo
    {
        return $this->belongsTo(ContactApiClient::class, 'api_client_id');
    }

    public function responses(): HasMany
    {
        return $this->hasMany(Response::class)->orderBy('created_at', 'desc');
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(UserInvitation::class)->orderBy('created_at', 'desc');
    }

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class)->orderBy('created_at', 'desc');
    }

    public function hearings(): HasMany
    {
        return $this->hasMany(Hearing::class)->orderBy('created_at', 'desc');
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

    public function scopeReplied($query)
    {
        return $query->where('status', 'replied');
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

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('contact_category_id', $categoryId);
    }

    // アクセサ
    protected function isResolved(): Attribute
    {
        return Attribute::make(
            get: fn() => in_array($this->status, ['replied', 'resolved', 'closed'])
        );
    }

    protected function statusLabel(): Attribute
    {
        return Attribute::make(
            get: fn() => match ($this->status) {
                'new' => '新規',
                'in_progress' => '対応中',
                'replied' => '返信済み',
                'resolved' => '解決済み',
                'closed' => 'クローズ',
                default => $this->status
            }
        );
    }

    protected function categoryLabel(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->contactCategory?->name ?? '-'
        );
    }
}
