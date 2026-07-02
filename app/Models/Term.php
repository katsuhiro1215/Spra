<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Term extends Model
{
    use HasUlid, SoftDeletes;

    protected $fillable = [
        'title',
        'content',
        'version',
        'effective_date',
        'status',
        'created_by',
    ];

    protected $casts = [
        'effective_date' => 'date',
    ];

    // -------------------------
    // Relationships
    // -------------------------

    /**
     * この規約を作成した Admin
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    // -------------------------
    // Scopes
    // -------------------------

    /**
     * 現在有効な規約を取得（最新版）
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->latest('version')
            ->first();
    }

    /**
     * タイトル別に有効な規約を取得
     */
    public function scopeActiveByTitle($query, string $title)
    {
        return $query->where('title', $title)
            ->where('status', 'active')
            ->latest('version')
            ->first();
    }

    /**
     * ドラフト規約を取得
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * アーカイブ済みを除外
     */
    public function scopeNotArchived($query)
    {
        return $query->where('status', '!=', 'archived');
    }

    // -------------------------
    // Methods
    // -------------------------

    /**
     * この規約を有効化
     */
    public function activate(): void
    {
        // 同じタイトルの古いバージョンを廃止
        static::where('title', $this->title)
            ->where('id', '!=', $this->id)
            ->update(['status' => 'archived']);

        // 自分を有効化
        $this->update([
            'status' => 'active',
            'effective_date' => now()->toDateString(),
        ]);
    }

    /**
     * この規約をドラフト状態に戻す
     */
    public function revertToDraft(): void
    {
        $this->update(['status' => 'draft']);
    }

    /**
     * 新しいバージョンを作成
     */
    public static function createNewVersion(Term $currentTerm, array $data): Term
    {
        $newVersion = $currentTerm->version + 1;

        return static::create([
            ...$data,
            'title' => $currentTerm->title,
            'version' => $newVersion,
            'status' => 'draft',
        ]);
    }
}
