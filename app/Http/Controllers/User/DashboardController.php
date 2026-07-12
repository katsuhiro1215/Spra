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

    // オンボーディング（プロフィール・会社情報・会社住所）が完了しているかどうかで表示を切り替える
    // 判定基準は resources/js/Pages/User/Onboarding/Progress.jsx の completedSteps と揃える
    $primaryCompany = $user->companies->first();
    $companyAddress = $primaryCompany?->addresses->firstWhere('type', 'office');

    $onboardingComplete = $user->profile !== null
      && $primaryCompany !== null && filled($primaryCompany->legal_name)
      && $companyAddress !== null && filled($companyAddress->postal_code);

    if (!$onboardingComplete) {
      return Inertia::render('User/Onboarding/Progress', [
        'user' => [
          'id' => $user->id,
          'email' => $user->email,
          'profile' => $user->profile,
          'companies' => $user->companies,
        ],
      ]);
    }

    // オンボーディング完了後はダッシュボードを表示
    $pendingContracts = $this->contractService->getByUserAndStatus($userId, 'pending_signature');
    $unpaidInvoices = $this->invoiceService->getUnpaidByUser($userId);

    return Inertia::render('User/Dashboard', [
      'pendingContracts' => $pendingContracts,
      'unpaidInvoices' => $unpaidInvoices,
    ]);
  }
}
