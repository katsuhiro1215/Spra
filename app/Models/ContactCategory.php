<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ContactCategory extends Model
{
    use HasUlid;

    /**
     * 見積依頼用カテゴリのslug。EstimateSimulatorからの送信先として使用する。
     */
    const SLUG_QUOTE_REQUEST = 'quote-request';

    /**
     * Atlas利用申込み用カテゴリのslug。Atlas\ApplicationControllerからの送信先として使用する。
     */
    const SLUG_ATLAS_APPLY = 'atlas-apply';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // リレーション
    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class, 'contact_category_id');
    }

    // スコープ
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // 並び順スコープ
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (ContactCategory $model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });
    }
}
