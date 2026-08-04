<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HearingAnswer extends Model
{
    use HasUlid;

    protected $fillable = [
        'hearing_id',
        'hearing_template_item_id',
        'answer_text',
        'answer_options',
    ];

    protected $casts = [
        'answer_options' => 'array',
    ];

    public function hearing(): BelongsTo
    {
        return $this->belongsTo(Hearing::class);
    }

    public function templateItem(): BelongsTo
    {
        return $this->belongsTo(HearingTemplateItem::class, 'hearing_template_item_id');
    }
}
