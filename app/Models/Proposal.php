<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Proposal extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    public const STATUSES = ['draft', 'reviewing', 'sent'];

    protected $fillable = [
        'hearing_id',
        'contact_id',
        'title',
        'content',
        'status',
        'created_by',
    ];

    public function hearing(): BelongsTo
    {
        return $this->belongsTo(Hearing::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
    }
}
