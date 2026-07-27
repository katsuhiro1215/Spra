<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use App\Notifications\AnnouncementPublished;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    const AUDIENCE_ALL = 'all';
    const AUDIENCE_ACTIVE_CONTRACT = 'active_contract';

    const AUDIENCES = [
        self::AUDIENCE_ALL => '全ユーザー',
        self::AUDIENCE_ACTIVE_CONTRACT => '契約中のユーザー',
    ];

    protected $fillable = [
        'title',
        'body',
        'audience',
        'is_published',
        'published_at',
        'sent_at',
        'recipient_count',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderByDesc('published_at');
    }

    /**
     * 指定したUserに配信対象として表示してよいお知らせに絞り込む
     */
    public function scopeVisibleTo($query, User $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('audience', self::AUDIENCE_ALL);

            if ($user->hasActiveContract()) {
                $q->orWhere('audience', self::AUDIENCE_ACTIVE_CONTRACT);
            }
        });
    }

    public function isSent(): bool
    {
        return $this->sent_at !== null;
    }

    /**
     * 指定したUserが既読化したお知らせIDの一覧
     *
     * @return array<int, string>
     */
    public static function readIdsFor(User $user): array
    {
        return $user->notifications()
            ->where('type', AnnouncementPublished::class)
            ->whereNotNull('read_at')
            ->get()
            ->pluck('data.announcement_id')
            ->filter()
            ->values()
            ->all();
    }

    public function getAudienceLabelAttribute(): string
    {
        return self::AUDIENCES[$this->audience] ?? $this->audience;
    }
}
