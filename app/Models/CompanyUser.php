<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Relations\Pivot;

class CompanyUser extends Pivot
{
  use HasUlid;

  protected $table = 'company_user';
  public $incrementing = false;
  protected $keyType = 'string';
  public $timestamps = true;

  protected $fillable = [
    'role',
    'is_primary',
    'joined_at',
    'left_at',
  ];

  protected $casts = [
    'is_primary' => 'boolean',
    'joined_at' => 'datetime',
    'left_at' => 'datetime',
  ];
}
