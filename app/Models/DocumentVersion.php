<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentVersion extends Model
{
    use HasUlid, SoftDeletes;

    protected $fillable = [
        'document_id',
        'version',
        'content',
        'status',
        'effective_date',
        'created_by',
    ];

    protected $casts = [
        'effective_date' => 'date',
    ];

    // -------------------------
    // Relationships
    // -------------------------

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function userAcceptances(): HasMany
    {
        return $this->hasMany(UserAcceptance::class);
    }

    // -------------------------
    // Scopes
    // -------------------------

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    // -------------------------
    // Methods
    // -------------------------

    /**
     * このバージョンを有効化（同じDocumentの他のバージョンは廃止）
     */
    public function activate(): void
    {
        static::where('document_id', $this->document_id)
            ->where('id', '!=', $this->id)
            ->where('status', 'active')
            ->update(['status' => 'archived']);

        $this->update([
            'status' => 'active',
            'effective_date' => now()->toDateString(),
        ]);
    }

    /**
     * ドラフト状態に戻す
     */
    public function revertToDraft(): void
    {
        $this->update(['status' => 'draft']);
    }

    /**
     * 新しいバージョンを作成
     */
    public static function createNewVersion(DocumentVersion $current, array $data): DocumentVersion
    {
        return static::create([
            ...$data,
            'document_id' => $current->document_id,
            'version' => $current->document->versions()->max('version') + 1,
            'status' => 'draft',
        ]);
    }
}
