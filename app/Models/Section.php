<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Section extends Model
{
    use HasUlid, SoftDeletes;

    protected $fillable = [
        'page_id',
        'name',
        'role',
        'sort_order',
        'content',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'content' => 'array', // JSON for block editor
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    /**
     * content.blocks の中から指定タイプの最初のブロックの data を取得
     * （公開サイト側でブロック内容を個別のpropsに変換する際に使用）
     */
    public function getBlockData(string $type): ?array
    {
        $blocks = $this->content['blocks'] ?? [];

        foreach ($blocks as $block) {
            if (($block['type'] ?? null) === $type) {
                return $block['data'] ?? [];
            }
        }

        return null;
    }
}
