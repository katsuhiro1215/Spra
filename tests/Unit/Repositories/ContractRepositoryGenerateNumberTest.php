<?php

namespace Tests\Unit\Repositories;

use App\Repositories\ContractRepository;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContractRepositoryGenerateNumberTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_generates_a_number_in_the_new_ctr_format(): void
    {
        $number = app(ContractRepository::class)->generateContractNumber();

        $expected = 'CTR-' . now()->format('Ym') . '-0001';
        $this->assertSame($expected, $number);
    }
}
