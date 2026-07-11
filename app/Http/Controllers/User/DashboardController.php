<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\ProjectService;
use App\Services\ContractService;
use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
  public function __construct(
    private ProjectService  $projectService,
    private ContractService $contractService,
    private InvoiceService  $invoiceService,
  ) {}

  public function index(): Response
  {
    $user = auth('users')->user()->load(['profile', 'companies', 'companies.addresses']);
    $userId = $user->id;

    // アクティブな契約を取得
    $activeContracts = $this->contractService->getByUserAndStatus($userId, 'active');
    $hasActiveContract = count($activeContracts) > 0;

    // ユーザーがまだ pending または、active だが契約がない場合は OnboardingProgress を表示
    if ($user->status === 'pending' || !$hasActiveContract) {
      return Inertia::render('User/OnboardingProgress', [
        'user' => [
          'id' => $user->id,
          'email' => $user->email,
          'profile' => $user->profile,
          'companies' => $user->companies,
        ],
      ]);
    }

    // Active ユーザーでアクティブな契約がある場合はダッシュボードを表示
    $pendingContracts = $this->contractService->getByUserAndStatus($userId, 'pending_signature');
    $unpaidInvoices = $this->invoiceService->getUnpaidByUser($userId);

    return Inertia::render('User/Dashboard', [
      'pendingContracts' => $pendingContracts,
      'unpaidInvoices' => $unpaidInvoices,
    ]);
  }
}
