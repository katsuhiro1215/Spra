<?php

namespace App\Http\Controllers\Admin\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\StoreAdminRequest;
use App\Http\Requests\Auth\UpdateAdminRequest;
use App\Models\Admin;
use App\Models\Media;
use App\Services\AdminService;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function __construct(
        private AdminService $adminService,
        private PermissionService $permissionService
    ) {}

    /**
     * 管理者一覧画面
     */
    public function index(Request $request): Response
    {
        // フィルター
        $filters = [
            'search' => $request->input('search'),
            'role' => $request->input('role'),
            'status' => $request->input('status'),
            'trashed' => $request->input('trashed', 'without_trashed'), // デフォルトは削除されていないもの
        ];
        // ソート
        $sort = [
            'field' => $request->input('sort_field', 'created_at'),
            'direction' => $request->input('sort_direction', 'desc'),
        ];
        // 管理者のページネーション取得
        $admins = $this->adminService->getPaginated($filters, $sort, 20);
        // 統計情報の取得
        $stats = $this->adminService->getStats();

        return Inertia::render('Admin/Admin/Index', [
            'admins' => $admins,
            'filters' => $filters,
            'stats' => $stats,
            'roles' => $this->adminService->getRoles(),
            'statuses' => $this->adminService->getStatuses(),
        ]);
    }

    /**
     * 管理者登録画面
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Admin/Create', [
            'roles' => $this->adminService->getRoles(),
        ]);
    }

    /**
     * 管理者新規登録処理
     */
    public function store(StoreAdminRequest $request): RedirectResponse
    {
        $result = $this->adminService->createAdmin($request->validated());

        return redirect()
            ->route('admin.admin.show', $result['admin'])
            ->with('success', '管理者を作成しました。初期パスワード: ' . $result['password']);
    }

    /**
     * 管理者詳細画面
     */
    public function show(Request $request, Admin $admin): Response
    {
        $admin->load(['profile.media', 'addresses']);
        // プロフィール画像URLを明示的に追加
        if ($admin->profile && $admin->profile->media) {
            $admin->profile->media->makeVisible(['url', 'original_url']);
        }
        // テナントのメディア一覧を取得（画像選択用）
        $mediaList = Media::where('type', 'image')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($media) => [
                'id' => $media->id,
                'title' => $media->title,
                'file_name' => $media->original_filename,
                'alt_text' => $media->alt_text,
                'url' => $media->url,
                'file_size' => $media->original_file_size,
            ]);

        // 権限制限編集データ（owner/super_adminが対象admin/editorを閲覧している場合のみ）
        $permissionOverride = null;
        if ($request->user('admins')?->isSuperAdmin() && $admin->isRestrictable()) {
            $permissionOverride = $this->permissionService->getOverridesFor($admin);
        }

        return Inertia::render('Admin/Admin/Show', [
            'admin' => $admin,
            'mediaList' => $mediaList,
            'permissionOverride' => $permissionOverride,
        ]);
    }

    /**
     * 管理者編集画面
     */
    public function edit(Admin $admin): Response
    {
        $admin->load('profile');

        return Inertia::render('Admin/Admin/Edit', [
            'admin' => $admin,
            'roles' => $this->adminService->getRoles(),
            'statuses' => $this->adminService->getStatuses(),
        ]);
    }

    /**
     * 管理者更新処理
     */
    public function update(UpdateAdminRequest $request, Admin $admin): RedirectResponse
    {
        $this->adminService->updateAdmin($admin, $request->validated());

        return redirect()
            ->route('admin.admin.show', $admin)
            ->with('success', '管理者情報を更新しました。');
    }

    /**
     * 管理者削除処理
     */
    public function destroy(Admin $admin): RedirectResponse
    {
        try {
            $this->adminService->deleteAdmin($admin, auth('admin')->id());

            return redirect()
                ->route('admin.admin.index')
                ->with('success', '管理者を削除しました。');
        } catch (\Exception $e) {
            return redirect()
                ->route('admin.admin.index')
                ->with('error', $e->getMessage());
        }
    }
}
