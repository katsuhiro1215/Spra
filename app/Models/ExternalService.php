<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExternalService extends Model
{
    use HasUlid, SoftDeletes;

    protected $fillable = [
        'name',
        'category',
        'url',
        'description',
        'icon',
        'is_active',
        'api_base_url',
        'api_endpoint',
        'auth_type',
        'auth_header',
        'credential',
        'last_synced_at',
        'last_sync_status',
        'last_sync_error',
        'cached_data',
        'sort_order',
        'created_by',
    ];

    protected $hidden = [
        'credential',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'credential' => 'encrypted',
        'cached_data' => 'array',
        'last_synced_at' => 'datetime',
        'sort_order' => 'integer',
    ];

    // 認証方式の定数
    const AUTH_NONE = 'none';
    const AUTH_BEARER = 'bearer';
    const AUTH_API_KEY = 'api_key';
    const AUTH_BASIC = 'basic';

    public function createdByAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * API連携が設定されているか（base_urlがあれば同期対象とみなす）
     */
    public function hasApiIntegration(): bool
    {
        return ! empty($this->api_base_url);
    }
}
