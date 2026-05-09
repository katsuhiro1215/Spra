<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use App\Models\Company;
use App\Services\ContractService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ContractController extends Controller
{
  public function __construct(
    private ContractService $service
  ) {}

  public function index(Request $request): Response
  {
    $filters = $request->only(['search', 'status', 'type', 'user_id', 'company_id']);

    $contracts = $this->service->getPaginated($filters, 20);

    return Inertia::render('Admin/Contract/Index', [
      'contracts' => $contracts,
      'filters'   => $filters,
      'statuses'  => \App\Models\Contract::STATUSES,
    ]);
  }

  public function show(string $id): Response
  {
    $contract = $this->service->findById($id);
    abort_unless($contract, 404);

    return Inertia::render('Admin/Contract/Show', [
      'contract' => $contract,
    ]);
  }

  public function create(): Response
  {
    return Inertia::render('Admin/Contract/Create', [
      'projects'  => Project::orderBy('title')->get(['id', 'title']),
      'users'     => User::with('profile')->orderBy('email')->get(['id', 'email']),
      'companies' => Company::orderBy('name')->get(['id', 'name']),
      'statuses'  => \App\Models\Contract::STATUSES,
    ]);
  }

  public function store(Request $request): RedirectResponse
  {
    $validated = $request->validate([
      'project_id'        => 'nullable|ulid|exists:projects,id',
      'user_id'           => 'nullable|uuid|exists:users,id',
      'company_id'        => 'nullable|ulid|exists:companies,id',
      'title'             => 'required|string|max:255',
      'type'              => 'required|string|in:one_time,monthly,annual',
      'status'            => 'required|string|in:draft,sent,active,suspended,completed,cancelled',
      'amount'            => 'required|integer|min:0',
      'tax_rate'          => 'required|numeric|min:0|max:100',
      'start_date'        => 'nullable|date',
      'end_date'          => 'nullable|date|after_or_equal:start_date',
      'auto_renewal'      => 'boolean',
      'payment_terms'     => 'nullable|string',
      'notes'             => 'nullable|string',
    ]);

    $contract = $this->service->create($validated);

    return redirect()->route('admin.contracts.show', $contract->id)
      ->with('success', '契約を作成しました。');
  }

  public function edit(string $id): Response
  {
    $contract = $this->service->findById($id);
    abort_unless($contract, 404);

    return Inertia::render('Admin/Contract/Edit', [
      'contract'  => $contract,
      'projects'  => Project::orderBy('title')->get(['id', 'title']),
      'users'     => User::with('profile')->orderBy('email')->get(['id', 'email']),
      'companies' => Company::orderBy('name')->get(['id', 'name']),
      'statuses'  => \App\Models\Contract::STATUSES,
    ]);
  }

  public function update(Request $request, string $id): RedirectResponse
  {
    $contract = $this->service->findById($id);
    abort_unless($contract, 404);

    $validated = $request->validate([
      'project_id'    => 'nullable|ulid|exists:projects,id',
      'user_id'       => 'nullable|uuid|exists:users,id',
      'company_id'    => 'nullable|ulid|exists:companies,id',
      'title'         => 'required|string|max:255',
      'type'          => 'required|string|in:one_time,monthly,annual',
      'status'        => 'required|string|in:draft,sent,active,suspended,completed,cancelled',
      'amount'        => 'required|integer|min:0',
      'tax_rate'      => 'required|numeric|min:0|max:100',
      'start_date'    => 'nullable|date',
      'end_date'      => 'nullable|date|after_or_equal:start_date',
      'auto_renewal'  => 'boolean',
      'payment_terms' => 'nullable|string',
      'notes'         => 'nullable|string',
    ]);

    $this->service->update($contract, $validated);

    return redirect()->route('admin.contracts.show', $contract->id)
      ->with('success', '契約を更新しました。');
  }

  public function activate(Request $request, string $id): RedirectResponse
  {
    $contract = $this->service->findById($id);
    abort_unless($contract, 404);

    $validated = $request->validate([
      'signed_at' => 'nullable|date',
    ]);

    $this->service->activate($contract, $validated);

    return back()->with('success', '契約を有効化しました。');
  }

  public function cancel(Request $request, string $id): RedirectResponse
  {
    $contract = $this->service->findById($id);
    abort_unless($contract, 404);

    $validated = $request->validate([
      'cancellation_reason' => 'nullable|string|max:1000',
    ]);

    $this->service->cancel($contract, $validated['cancellation_reason'] ?? '');

    return back()->with('success', '契約をキャンセルしました。');
  }

  public function uploadDocument(Request $request, string $id): RedirectResponse
  {
    $contract = $this->service->findById($id);
    abort_unless($contract, 404);

    $request->validate([
      'file'  => 'required|file|mimes:pdf,doc,docx|max:20480',
      'title' => 'required|string|max:255',
    ]);

    $path = $request->file('file')->store('contracts/documents', 'private');

    $contract->documents()->create([
      'title'     => $request->title,
      'file_path' => $path,
      'file_name' => $request->file('file')->getClientOriginalName(),
      'file_size' => $request->file('file')->getSize(),
      'mime_type' => $request->file('file')->getMimeType(),
    ]);

    return back()->with('success', '書類をアップロードしました。');
  }
}
