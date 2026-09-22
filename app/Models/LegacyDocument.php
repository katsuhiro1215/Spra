<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class LegacyDocument extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    public const DOCUMENT_TYPES = ['invoice', 'receipt'];

    protected $fillable = [
        'document_type',
        'client_name',
        'issued_at',
        'total_amount',
        'disk',
        'pdf_path',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'issued_at' => 'date:Y-m-d',
        'total_amount' => 'decimal:2',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }
}
