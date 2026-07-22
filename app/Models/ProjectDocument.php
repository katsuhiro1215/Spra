<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ProjectDocument extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id',
        'document_type',
        'title',
        'status',
        'is_client_deliverable',
        'created_by',
    ];

    protected $appends = ['display_title'];

    protected $casts = [
        'is_client_deliverable' => 'boolean',
    ];

    public const DOCUMENT_TYPES = [
        'overview'        => '概要',
        'requirements'    => '要件定義',
        'basic_design'    => '基本設計',
        'detail_design'   => '詳細設計',
        'database_design' => 'DB設計',
        'api_design'      => 'API設計',
        'screen_design'   => '画面設計',
        'test'            => 'テスト',
        'release'         => 'リリース',
        'documents'       => 'その他ドキュメント',
    ];

    public const STATUSES = [
        'draft'       => '下書き',
        'in_progress' => '作成中',
        'reviewing'   => 'レビュー中',
        'confirmed'   => '確定済み',
    ];

    /**
     * document_typeごとに許可するセクション種別
     */
    public const ALLOWED_SECTION_TYPES = [
        'overview'        => ['text'],
        'requirements'    => ['text', 'feature_list'],
        'basic_design'    => ['text', 'feature_list', 'screen_list', 'permission_list'],
        'detail_design'   => ['text'],
        'database_design' => ['text', 'db_table'],
        'api_design'      => ['text', 'api_group'],
        'screen_design'   => ['text', 'screen_list'],
        'test'            => ['text'],
        'release'         => ['text'],
        'documents'       => ['text'],
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function versions(): HasMany
    {
        return $this->hasMany(ProjectDocumentVersion::class)->orderBy('version');
    }

    public function currentVersion(): HasOne
    {
        return $this->hasOne(ProjectDocumentVersion::class)
            ->where('is_current', true)
            ->latestOfMany('version');
    }

    public function getDisplayTitleAttribute(): string
    {
        return $this->title ?: (self::DOCUMENT_TYPES[$this->document_type] ?? $this->document_type);
    }

    public function allowedSectionTypes(): array
    {
        return self::ALLOWED_SECTION_TYPES[$this->document_type] ?? ['text'];
    }
}
