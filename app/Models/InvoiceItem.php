<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceItem extends Model
{
  use HasUlid, HasFactory;

  protected $fillable = [
    'invoice_id',
    'description',
    'quantity',
    'unit_price',
    'amount',
    'sort_order',
  ];

  protected $casts = [
    'quantity'   => 'decimal:2',
    'unit_price' => 'decimal:2',
    'amount'     => 'decimal:2',
  ];

  public function invoice(): BelongsTo
  {
    return $this->belongsTo(Invoice::class);
  }
}
