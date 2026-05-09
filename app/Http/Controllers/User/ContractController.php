<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\ContractService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContractController extends Controller
{
  public function __construct(
    private ContractService $service
  ) {}

  public function index(Request $request): Response
  {
    $userId = auth('users')->id();
    $filters = $request->only(['status']);

    $contracts = $this->service->getPaginatedForClient($userId, $filters, 15);

    return Inertia::render('User/Contract/Index', [
      'contracts' => $contracts,
      'filters'   => $filters,
    ]);
  }

  public function show(string $id): Response
  {
    $userId = auth('users')->id();

    $contract = $this->service->findByIdForClient($id, $userId);
    abort_unless($contract, 404);

    return Inertia::render('User/Contract/Show', [
      'contract' => $contract,
    ]);
  }
}
