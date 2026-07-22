<?php

namespace App\Http\Controllers\Admin\Contract;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\ContractGroup;
use App\Services\ContractGroupService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContractGroupController extends Controller
{
  protected ContractGroupService $service;

  public function __construct(ContractGroupService $service)
  {
    $this->service = $service;
  }

  /**
   * グループ一覧を表示
   */
  public function index(): Response
  {
    $groups = ContractGroup::with(['contracts', 'user', 'creator'])
      ->orderBy('created_at', 'desc')
      ->paginate(15);

    return Inertia::render('Admin/ContractGroups/Index', [
      'groups' => $groups,
    ]);
  }

  /**
   * グループ作成フォーム
   */
  public function create(): Response
  {
    // 既存の下書き契約書一覧を取得
    $draftContracts = Contract::where('status', 'draft')
      ->with(['user', 'currentVersion'])
      ->orderBy('created_at', 'desc')
      ->get();

    return Inertia::render('Admin/ContractGroups/Create', [
      'draftContracts' => $draftContracts,
    ]);
  }

  /**
   * グループを作成（複数契約書から）
   */
  public function store(Request $request): RedirectResponse
  {
    $validated = $request->validate([
      'contract_ids' => 'required|array|min:1',
      'contract_ids.*' => 'string|exists:contracts,id',
      'title' => 'required|string|max:255',
      'description' => 'nullable|string',
    ]);

    try {
      $group = $this->service->createGroupFromContracts(
        contractIds: $validated['contract_ids'],
        title: $validated['title'],
        description: $validated['description'],
        createdById: auth('admins')->id(),
      );

      return redirect()->route('admin.contract-group.show', $group->id)
        ->with('success', __('messages.contract_group.created'));
    } catch (\Exception $e) {
      return back()->with('error', __('messages.action_failed_detail', ['attribute' => 'グループ作成', 'message' => $e->getMessage()]));
    }
  }

  /**
   * グループ詳細を表示
   */
  public function show(string $id): Response
  {
    $group = ContractGroup::with([
      'contracts.currentVersion.items',
      'user.profile',
      'creator.profile',
    ])->findOrFail($id);

    $stats = $this->service->getGroupStats($group);

    // 同じユーザーの、まだどのグループにも属していない下書き契約（追加候補）
    $availableContracts = Contract::where('user_id', $group->user_id)
      ->where('status', 'draft')
      ->whereNull('contract_group_id')
      ->with('currentVersion')
      ->orderBy('created_at', 'desc')
      ->get();

    return Inertia::render('Admin/ContractGroups/Show', [
      'group' => $group,
      'stats' => $stats,
      'availableContracts' => $availableContracts,
    ]);
  }

  /**
   * グループを送信
   */
  public function send(Request $request, string $id): RedirectResponse
  {
    $group = ContractGroup::findOrFail($id);

    // 送信要件チェック
    if ($group->contracts->isEmpty()) {
      return back()->with('error', __('messages.contract_group.no_documents'));
    }

    $recipientEmail = $group->user?->email;
    if (!$recipientEmail) {
      return back()->with('error', __('messages.contract_group.user_email_missing'));
    }

    try {
      $this->service->sendGroup(
        group: $group,
        recipientEmail: $recipientEmail,
        createdById: auth('admins')->id(),
      );

      return redirect()->route('admin.contract-group.show', $group->id)
        ->with('success', __('messages.contract_group.all_sent'));
    } catch (\Exception $e) {
      return back()->with('error', __('messages.action_failed_detail', ['attribute' => 'グループ送信', 'message' => $e->getMessage()]));
    }
  }

  /**
   * グループから契約書を削除
   */
  public function removeContract(Request $request, string $groupId, string $contractId): RedirectResponse
  {
    $group = ContractGroup::findOrFail($groupId);
    $contract = Contract::findOrFail($contractId);

    if ($contract->contract_group_id !== $group->id) {
      return back()->with('error', __('messages.contract_group.not_in_group'));
    }

    try {
      $this->service->removeContractFromGroup($contract);

      return back()->with('success', __('messages.contract_group.removed_document'));
    } catch (\Exception $e) {
      return back()->with('error', __('messages.action_failed_detail', ['attribute' => '削除', 'message' => $e->getMessage()]));
    }
  }

  /**
   * グループに契約書を追加
   */
  public function addContract(Request $request, string $groupId): RedirectResponse
  {
    $group = ContractGroup::findOrFail($groupId);

    $validated = $request->validate([
      'contract_id' => 'required|string|exists:contracts,id',
    ]);

    $contract = Contract::findOrFail($validated['contract_id']);

    try {
      $this->service->addContractToGroup($group, $contract);

      return back()->with('success', __('messages.contract_group.added_document'));
    } catch (\Exception $e) {
      return back()->with('error', __('messages.action_failed_detail', ['attribute' => '追加', 'message' => $e->getMessage()]));
    }
  }

  /**
   * グループを削除
   */
  public function destroy(string $id): RedirectResponse
  {
    $group = ContractGroup::findOrFail($id);

    try {
      $this->service->removeGroupAssociation($group);

      return redirect()->route('admin.contract-group.index')
        ->with('success', __('messages.contract_group.deleted'));
    } catch (\Exception $e) {
      return back()->with('error', __('messages.action_failed_detail', ['attribute' => '削除', 'message' => $e->getMessage()]));
    }
  }
}
