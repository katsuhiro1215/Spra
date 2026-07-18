<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectDocumentSection extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'project_document_version_id',
        'section_type',
        'title',
        'body',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public const SECTION_TYPES = [
        'text'            => '本文',
        'db_table'        => 'DBテーブル定義',
        'api_group'       => 'APIエンドポイント一覧',
        'feature_list'    => '機能一覧',
        'screen_list'     => '画面一覧',
        'permission_list' => '権限一覧',
    ];

    /**
     * section_type別の明細行を持つリレーション名
     */
    public const DETAIL_RELATIONS = [
        'db_table'        => 'columns',
        'api_group'       => 'endpoints',
        'feature_list'    => 'features',
        'screen_list'     => 'screens',
        'permission_list' => 'permissions',
    ];

    public function version(): BelongsTo
    {
        return $this->belongsTo(ProjectDocumentVersion::class, 'project_document_version_id');
    }

    public function columns(): HasMany
    {
        return $this->hasMany(ProjectDocumentSectionColumn::class)->orderBy('sort_order');
    }

    public function endpoints(): HasMany
    {
        return $this->hasMany(ProjectDocumentSectionEndpoint::class)->orderBy('sort_order');
    }

    public function features(): HasMany
    {
        return $this->hasMany(ProjectDocumentSectionFeature::class)->orderBy('sort_order');
    }

    public function screens(): HasMany
    {
        return $this->hasMany(ProjectDocumentSectionScreen::class)->orderBy('sort_order');
    }

    public function permissions(): HasMany
    {
        return $this->hasMany(ProjectDocumentSectionPermission::class)->orderBy('sort_order');
    }

    /**
     * section_typeに応じた明細行のリレーションを取得する
     */
    public function detailRelationName(): ?string
    {
        return self::DETAIL_RELATIONS[$this->section_type] ?? null;
    }
}
