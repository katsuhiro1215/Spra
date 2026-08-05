<?php

namespace Tests\Unit\Repositories;

use App\Models\Admin;
use App\Models\Quote;
use App\Models\QuoteVersion;
use App\Repositories\QuoteRepository;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class QuoteRepositoryStatsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_total_amount_counts_current_version_only_not_all_revisions(): void
    {
        $admin = Admin::factory()->create();

        $quote = Quote::create([
            'quote_number' => 'Q-STATS-' . Str::random(8),
            'title' => '改訂履歴のある見積もり',
            'status' => 'approved',
            'created_by' => $admin->id,
        ]);

        // 旧バージョン（改訂前、is_current=false）：二重集計されてはいけない
        $oldVersion = QuoteVersion::create([
            'quote_id' => $quote->id,
            'version' => 1,
            'title' => $quote->title,
            'base_amount' => 300000,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 30000,
            'total_amount' => 330000,
            'status' => 'approved',
            'is_current' => false,
            'created_by' => $admin->id,
        ]);

        // 現行バージョン
        $currentVersion = QuoteVersion::create([
            'quote_id' => $quote->id,
            'version' => 2,
            'title' => $quote->title,
            'base_amount' => 300000,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 30000,
            'total_amount' => 330000,
            'status' => 'approved',
            'is_current' => true,
            'created_by' => $admin->id,
        ]);

        $quote->update(['current_version_id' => $currentVersion->id]);

        $stats = app(QuoteRepository::class)->getStats();

        // 旧版(330000)+現行版(330000)=660000ではなく、現行版のみの330000であるべき
        $this->assertEquals(330000, (float) $stats['total_amount']);
        $this->assertEquals(330000, (float) $stats['average_amount']);
    }
}
