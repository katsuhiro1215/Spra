<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'profilable_type',
        'profilable_id',
        'media_id',
        'last_name',
        'first_name',
        'last_name_kana',
        'first_name_kana',
        'display_name',
        'birth_date',
        'gender',
        'phone',
        'mobile',
        'emergency_contact_name',
        'emergency_contact_phone',
        'bio',
    ];

    // protected $casts = [
    //     'birth_date' => 'date',
    // ];

    protected $appends = [
        'full_name',
        'full_name_kana',
    ];

    /**
     * ポリモーフィックリレーション（AdminまたはUser）
     */
    public function profilable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * メディアリレーション
     */
    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class);
    }

    /**
     * フルネームを取得
     */
    public function getFullNameAttribute(): string
    {
        if ($this->last_name && $this->first_name) {
            return "{$this->last_name} {$this->first_name}";
        }
        return $this->display_name ?? '';
    }

    /**
     * フルネーム（カナ）を取得
     */
    public function getFullNameKanaAttribute(): ?string
    {
        if ($this->last_name_kana && $this->first_name_kana) {
            return "{$this->last_name_kana} {$this->first_name_kana}";
        }
        return null;
    }

    /**
     * アバターURL取得
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if ($this->media) {
            return $this->media->url;
        }
        return null;
    }
}
