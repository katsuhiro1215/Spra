<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle($request = Illuminate\Http\Request::capture());

use App\Models\Contract;
use App\Models\Quote;
use App\Models\User;
use App\Models\Company;

// Get first user and company
$user = User::first();
$company = Company::first();

if (!$user || !$company) {
    echo "Missing user or company\n";
    exit(1);
}

// Create a quote
$quote = Quote::create([
    'title' => 'Test Quote',
    'quote_number' => 'QT-' . date('YmdHis'),
    'user_id' => $user->id,
    'company_id' => $company->id,
    'status' => 'approved',
    'valid_until' => now()->addDays(30)->toDateString(),
]);

// Create a contract
$contract = Contract::create([
    'title' => 'Test Contract for Email',
    'user_id' => $user->id,
    'company_id' => $company->id,
    'quote_id' => $quote->id,
    'status' => 'draft',
    'amount' => 100000,
    'start_date' => now()->toDateString(),
    'end_date' => now()->addMonth()->toDateString(),
]);

echo "Contract ID: " . $contract->id . "\n";
echo "User email: " . $contract->user?->email . "\n";
echo "Can Send: " . ($contract->canSend() ? 'Yes' : 'No') . "\n";
