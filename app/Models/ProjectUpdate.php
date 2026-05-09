<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectUpdate extends Model
{
  use HasUlid, HasFactory;

  protected $fillable = [
    'project_id',
    'admin_id',
    'title',
    'content',
    'type',
    'is_client_visible',
    'notified_at',
  ];

  protected $casts = [
    'is_client_visible' => 'boolean',
    'notified_at'       => 'datetime',
  ];

  public const TYPES = [
    'progress'  => '進捗報告',
    'issue'     => '課題・障害',
    'milestone' => 'マイルストーン',
    'general'   => '一般報告',
  ];

  public function project(): BelongsTo
  {
    return $this->belongsTo(Project::class);
  }

  public function admin(): BelongsTo
  {
    return $this->belongsTo(Admin::class);
  }

  public function scopeClientVisible($query)
  {
    return $query->where('is_client_visible', true);
  }

  public function getTypeNameAttribute(): string
  {
    return self::TYPES[$this->type] ?? $this->type;
  }
}
