<?php

namespace Tests\Unit;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserPrimaryCompanyTest extends TestCase
{
    use RefreshDatabase;

    public function test_primary_company_returns_the_company_flagged_as_primary(): void
    {
        $user = User::factory()->create();
        $secondaryCompany = Company::factory()->create();
        $primaryCompany = Company::factory()->create();

        $user->companies()->attach($secondaryCompany->id, [
            'role' => 'member',
            'is_primary' => false,
            'joined_at' => now(),
        ]);
        $user->companies()->attach($primaryCompany->id, [
            'role' => 'owner',
            'is_primary' => true,
            'joined_at' => now(),
        ]);

        $this->assertSame($primaryCompany->id, $user->fresh()->primaryCompany?->id);
    }

    public function test_primary_company_is_null_when_user_belongs_to_no_company(): void
    {
        $user = User::factory()->create();

        $this->assertNull($user->primaryCompany);
    }
}
