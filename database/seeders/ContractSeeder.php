<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Contract;
use App\Models\ContractSignature;
use App\Models\Quote;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ContractSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $quotes = Quote::where('status', 'approved')->limit(10)->get();
    $admin = Admin::first();
    $service = Service::first();

    if ($quotes->isEmpty() || !$admin || !$service) {
      echo "Prerequisites not found for contract seeding. Skipping contract seeding.\n";
      return;
    }

    $createdCount = 0;
    $contractStates = [
      // State 1: Just created, needs to be sent
      [
        'status' => 'draft',
        'signature_status' => 'pending',
        'signature_required_from' => 'user',
        'user_signed_at' => null,
        'admin_signed_at' => null,
      ],
      // State 2: Sent to user, awaiting signature
      [
        'status' => 'pending_signature',
        'signature_status' => 'pending',
        'signature_required_from' => 'user',
        'user_signed_at' => null,
        'admin_signed_at' => null,
      ],
      // State 3: User signed, awaiting admin approval
      [
        'status' => 'pending_signature',
        'signature_status' => 'user_signed',
        'signature_required_from' => 'admin',
        'user_signed_at' => now()->subDays(2),
        'admin_signed_at' => null,
      ],
      // State 4: Both signed, ready for admin approval
      [
        'status' => 'pending_signature',
        'signature_status' => 'fully_signed',
        'signature_required_from' => 'admin',
        'user_signed_at' => now()->subDays(3),
        'admin_signed_at' => now()->subDays(2),
      ],
      // State 5: Approved and active
      [
        'status' => 'active',
        'signature_status' => 'fully_signed',
        'signature_required_from' => 'admin',
        'user_signed_at' => now()->subDays(5),
        'admin_signed_at' => now()->subDays(4),
      ],
      // State 6: Cancelled
      [
        'status' => 'cancelled',
        'signature_status' => 'rejected',
        'signature_required_from' => 'user',
        'user_signed_at' => null,
        'admin_signed_at' => null,
      ],
      // State 7: Completed
      [
        'status' => 'completed',
        'signature_status' => 'fully_signed',
        'signature_required_from' => 'admin',
        'user_signed_at' => now()->subDays(30),
        'admin_signed_at' => now()->subDays(29),
      ],
    ];

    foreach ($quotes as $index => $quote) {
      $state = $contractStates[$index % count($contractStates)];

      try {
        $contract = Contract::create([
          'id' => \Illuminate\Support\Str::ulid(),
          'quote_id' => $quote->id,
          'user_id' => $quote->user_id,
          'company_id' => $quote->company_id,
          'service_id' => $service->id,
          'created_by' => $admin->id,
          'title' => $quote->title . ' - 契約書',
          'contract_number' => 'CTR-' . now()->format('Ym') . '-' . str_pad($index + 1, 5, '0', STR_PAD_LEFT),
          'description' => $quote->title . 'の詳細な契約内容を記載します。',
          'amount' => $quote->base_amount,
          'tax_rate' => $quote->tax_rate,
          'start_date' => now(),
          'end_date' => now()->addMonths(12),
          'status' => $state['status'],
          'signature_status' => $state['signature_status'],
          'signature_required_from' => $state['signature_required_from'],
          'user_signed_at' => $state['user_signed_at'],
          'admin_signed_at' => $state['admin_signed_at'],
        ]);

        // Create signatures if they exist
        if ($state['user_signed_at']) {
          ContractSignature::create([
            'id' => \Illuminate\Support\Str::ulid(),
            'contract_id' => $contract->id,
            'signed_by_user' => $contract->user_id,
            'signature_type' => 'user',
            'signature_image' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            'method' => 'canvas',
            'signed_at' => $state['user_signed_at'],
            'status' => 'signed',
          ]);
        }

        if ($state['admin_signed_at']) {
          ContractSignature::create([
            'id' => \Illuminate\Support\Str::ulid(),
            'contract_id' => $contract->id,
            'signed_by_admin' => $admin->id,
            'signature_type' => 'admin',
            'signature_image' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            'method' => 'canvas',
            'signed_at' => $state['admin_signed_at'],
            'status' => 'signed',
          ]);
        }

        $createdCount++;
      } catch (\Exception $e) {
        echo "Error creating contract for quote {$quote->id}: " . $e->getMessage() . "\n";
      }
    }

    echo "=== ContractSeeder Summary ===\n";
    echo "Total contracts created: {$createdCount}\n";
    echo "\nContract States:\n";
    echo "- Draft (needs to be sent): 1\n";
    echo "- Pending signature (awaiting user): 1\n";
    echo "- User signed (awaiting admin): 1\n";
    echo "- Fully signed (ready for approval): 1\n";
    echo "- Active (approved): 1\n";
    echo "- Cancelled: 1\n";
    echo "- Completed: 1+\n";
  }
}
