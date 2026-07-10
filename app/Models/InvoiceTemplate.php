<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceTemplate extends Model
{
    use HasUlid, HasFactory;

    protected $fillable = [
        'name',
        'notice_text',
        'terms',
        'additional_notes',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the invoices using this template.
     */
    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
