<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Organization extends Model
{
    /** @use HasFactory<\Database\Factories\OrganizationFactory> */
    use HasUlid, HasFactory;

    protected $fillable = [
        'name',
        'site_name',
        'name_en',
        'logo_path',
        'legal_name',
        'representative_name',
        'business_description',
        'employee_count',
        'capital',
        'established_date',
        'business_hours',
        'registration_number',
        'tax_number',
        'phone',
        'fax',
        'email',
        'website',
    ];

    protected $casts = [
        'established_date' => 'date:Y-m-d',
    ];

    public function addresses(): MorphMany
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    public function defaultAddress(): MorphMany
    {
        return $this->addresses()->where('is_default', true)->where('is_active', true);
    }
}
