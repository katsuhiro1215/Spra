<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
  public function __construct(
    private InvoiceService $service
  ) {}

  public function index(Request $request): Response
  {
    $userId = auth('users')->id();
    $filters = $request->only(['status']);

    $invoices = $this->service->getPaginatedForClient($userId, $filters, 15);

    return Inertia::render('User/Invoice/Index', [
      'invoices' => $invoices,
      'filters'  => $filters,
    ]);
  }

  public function show(string $id): Response
  {
    $userId = auth('users')->id();

    $invoice = $this->service->findByIdForClient($id, $userId);
    abort_unless($invoice, 404);

    return Inertia::render('User/Invoice/Show', [
      'invoice' => $invoice,
    ]);
  }
}
