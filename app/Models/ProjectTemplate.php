<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectTemplate extends Model
{
  use HasUlid, HasFactory, SoftDeletes;

  protected $fillable = [
    'name',
    'description',
    'icon',
    'sort_order',
    'is_active',
  ];

  protected $casts = [
    'is_active' => 'boolean',
  ];

  public function milestones(): HasMany
  {
    return $this->hasMany(ProjectTemplateMilestone::class, 'project_template_id')->orderBy('order');
  }

  public function scopeActive($query)
  {
    return $query->where('is_active', true);
  }
}
