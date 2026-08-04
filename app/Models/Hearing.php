<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hearing extends Model
{
    use HasUlid, SoftDeletes;

    protected $fillable = [
        'contact_id',
        'quote_id',
        'title',
        'notes',
        'created_by',
    ];

    // -------------------------
    // リレーション
    // -------------------------

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(HearingAnswer::class);
    }
}
