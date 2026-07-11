<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class ContactApiClient extends Model
{
    use HasUlid, SoftDeletes;

    protected $fillable = [
        'name',
        'api_key_hash',
        'key_preview',
        'is_active',
        'created_by',
        'last_used_at',
    ];

    protected $hidden = [
        'api_key_hash',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_used_at' => 'datetime',
    ];

    public function createdByAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class, 'api_client_id');
    }

    /**
     * 新しいAPIキーを生成し、[平文キー, ハッシュ, プレビュー]を返す
     * 平文キーはこの生成時にしか取得できない
     *
     * @return array{plainKey: string, hash: string, preview: string}
     */
    public static function generateKey(): array
    {
        $plainKey = 'spra_' . Str::random(48);

        return [
            'plainKey' => $plainKey,
            'hash' => hash('sha256', $plainKey),
            'preview' => substr($plainKey, -8),
        ];
    }
}
