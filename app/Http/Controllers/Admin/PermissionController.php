<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    public function __construct(
        private PermissionService $permissionService,
        Request $request
    ) {
        // 動的な権限判定に依存しない明示的なガード（owner/super_adminのみ）
        abort_unless($request->user('admins')?->isSuperAdmin(), 403, 'この画面にアクセスする権限がありません。');
    }

    /**
     * ロール別デフォルト権限マトリクス画面
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Permission/Index', $this->permissionService->getRoleMatrix());
    }

    /**
     * ロール別デフォルト権限マトリクス更新
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'admin' => ['array'],
            'admin.*' => ['integer', 'exists:permissions,id'],
            'editor' => ['array'],
            'editor.*' => ['integer', 'exists:permissions,id'],
        ]);

        $this->permissionService->updateRoleMatrix([
            'admin' => $validated['admin'] ?? [],
            'editor' => $validated['editor'] ?? [],
        ]);

        return back()->with('success', __('messages.updated', ['attribute' => '権限設定']));
    }
}
