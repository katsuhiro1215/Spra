<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContractDocument extends Model
{
  use HasUlid, HasFactory;

  protected $fillable = [
    'contract_id',
    'file_name',
    'file_path',
    'file_size',
    'mime_type',
    'uploaded_by',
  ];

  public function contract(): BelongsTo
  {
    return $this->belongsTo(Contract::class);
  }

  public function uploadedBy(): BelongsTo
  {
    return $this->belongsTo(Admin::class, 'uploaded_by');
  }

  public function getFileUrlAttribute(): string
  {
    return asset("storage/{$this->file_path}");
  }
}
