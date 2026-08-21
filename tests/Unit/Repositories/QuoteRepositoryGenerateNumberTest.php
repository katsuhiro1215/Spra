<?php

namespace Tests\Unit\Repositories;

use App\Repositories\QuoteRepository;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuoteRepositoryGenerateNumberTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_generates_a_number_in_the_new_qte_format(): void
    {
        $number = app(QuoteRepository::class)->generateQuoteNumber();

        $expected = 'QTE-' . now()->format('Ym') . '-0001';
        $this->assertSame($expected, $number);
    }
}
