<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class AdminPermissionOverrideController extends Controller
{
    public function __construct(
        private PermissionService $permissionService,
        Request $request
    ) {
        // 動的な権限判定に依存しない明示的なガード（owner/super_adminのみ）
        abort_unless($request->user('admins')?->isSuperAdmin(), 403, 'この操作を行う権限がありません。');
    }

    /**
     * 個別Adminへの権限制限を更新（対象はadmin/editorロールのみ）
     */
    public function update(Request $request, Admin $admin): RedirectResponse
    {
        abort_unless($admin->isRestrictable(), 422, 'このロールには個別制限をかけられません。');

        $validated = $request->validate([
            'restricted_permission_ids' => ['array'],
            'restricted_permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        $this->permissionService->updateOverridesFor($admin, $validated['restricted_permission_ids'] ?? []);

        return back()->with('success', __('messages.updated', ['attribute' => '権限制限']));
    }
}
