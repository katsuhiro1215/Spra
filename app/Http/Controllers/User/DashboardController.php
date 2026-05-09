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
    $userId = auth('users')->id();

    $activeProjects = $this->projectService->getActiveByUser($userId);
    $activeContracts = $this->contractService->getActiveByUser($userId);
    $unpaidInvoices = $this->invoiceService->getUnpaidByUser($userId);

    return Inertia::render('User/Dashboard', [
      'activeProjects'  => $activeProjects,
      'activeContracts' => $activeContracts,
      'unpaidInvoices'  => $unpaidInvoices,
      'stats' => [
        'projects'  => $activeProjects->count(),
        'contracts' => $activeContracts->count(),
        'unpaidInvoices' => $unpaidInvoices->count(),
        'unpaidAmount'   => $unpaidInvoices->sum('total_amount'),
      ],
    ]);
  }
}
