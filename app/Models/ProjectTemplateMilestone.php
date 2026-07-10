<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectTemplateMilestone extends Model
{
  use HasUlid, HasFactory, SoftDeletes;

  protected $fillable = [
    'project_template_id',
    'milestone_name',
    'description',
    'order',
  ];

  public function template(): BelongsTo
  {
    return $this->belongsTo(ProjectTemplate::class, 'project_template_id');
  }
}
