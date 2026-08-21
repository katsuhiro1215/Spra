<?php

namespace Tests\Unit\Services;

use App\Services\InvoiceService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceServiceGenerateNumberTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_generates_a_number_in_the_new_inv_format_reset_per_month(): void
    {
        $number = app(InvoiceService::class)->generateInvoiceNumber();

        $expected = 'INV-' . now()->format('Ym') . '-0001';
        $this->assertSame($expected, $number);
    }
}
