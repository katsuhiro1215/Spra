<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'display_name',
        'first_name',
        'last_name',
        'first_name_kana',
        'last_name_kana',
        'birth_date',
        'gender',
        'phone_number',
        'mobile_number',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',
        'bio',
        'avatar',
        'website',
        'social_links',
        'occupation',
        'job_title',
        'education',
        'skills',
        'preferred_language',
        'timezone',
        'notification_preferences',
        'privacy_settings',
        'postal_code',
        'prefecture',
        'city',
        'district',
        'address_other',
        'is_public',
        'is_verified',
        'verified_at',
        'notes',
        'metadata',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'social_links' => 'array',
        'notification_preferences' => 'array',
        'privacy_settings' => 'array',
        'metadata' => 'array',
        'is_public' => 'boolean',
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
    ];

    // 定数定義
    const GENDERS = [
        'male' => '男性',
        'female' => '女性',
        'other' => 'その他',
        'prefer_not_to_say' => '回答しない',
    ];

    const LANGUAGES = [
        'ja' => '日本語',
        'en' => 'English',
        'ko' => '한국어',
        'zh' => '中文',
    ];

    const TIMEZONES = [
        'Asia/Tokyo' => '日本標準時 (JST)',
        'America/New_York' => '東部標準時 (EST)',
        'America/Los_Angeles' => '太平洋標準時 (PST)',
        'Europe/London' => 'グリニッジ標準時 (GMT)',
    ];

    /**
     * User との関連
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * フルネームを取得
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn() => trim(($this->last_name ?? '') . ' ' . ($this->first_name ?? ''))
        );
    }

    /**
     * フルネーム（カナ）を取得
     */
    protected function fullNameKana(): Attribute
    {
        return Attribute::make(
            get: fn() => trim(($this->last_name_kana ?? '') . ' ' . ($this->first_name_kana ?? ''))
        );
    }

    /**
     * 表示用の名前を取得（display_name > full_name > user.name の優先順位）
     */
    protected function displayNameOrFallback(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->display_name ?: $this->full_name ?: $this->user->name
        );
    }

    /**
     * 年齢を計算
     */
    protected function age(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->birth_date ? $this->birth_date->age : null
        );
    }

    /**
     * 住所を整形
     */
    protected function formattedAddress(): Attribute
    {
        return Attribute::make(
            get: function () {
                $parts = [];
                if ($this->postal_code) $parts[] = "〒{$this->postal_code}";
                if ($this->prefecture) $parts[] = $this->prefecture;
                if ($this->city) $parts[] = $this->city;
                if ($this->district) $parts[] = $this->district;
                if ($this->address_other) $parts[] = $this->address_other;
                return implode(' ', $parts);
            }
        );
    }

    /**
     * スキルを配列として取得
     */
    protected function skillsArray(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->skills ? explode(',', $this->skills) : []
        );
    }

    /**
     * プロフィール完成度を計算
     */
    public function getCompletionPercentage(): int
    {
        $fields = [
            'display_name',
            'first_name',
            'last_name',
            'birth_date',
            'phone_number',
            'bio',
            'occupation',
            'prefecture',
            'city'
        ];

        $completed = 0;
        foreach ($fields as $field) {
            if (!empty($this->$field)) {
                $completed++;
            }
        }

        return round(($completed / count($fields)) * 100);
    }

    /**
     * 公開可能なプロフィールかチェック
     */
    public function isPublicProfile(): bool
    {
        return $this->is_public && $this->is_verified;
    }

    /**
     * スコープ: 公開プロフィール
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * スコープ: 認証済み
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    /**
     * スコープ: 名前で検索
     */
    public function scopeSearchByName($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('display_name', 'like', "%{$search}%")
                ->orWhere('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('first_name_kana', 'like', "%{$search}%")
                ->orWhere('last_name_kana', 'like', "%{$search}%");
        });
    }
}
