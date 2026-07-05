<?php

namespace App\Http\Controllers\Admin\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\StoreUserRequest;
use App\Http\Requests\Auth\UpdateUserRequest;
use App\Models\User;
use App\Models\Media;
use App\Models\ProjectInquiry;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    /**
     * 管理者一覧画面
     */
    public function index(Request $request): Response
    {
        // フィルター
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'trashed' => $request->input('trashed', 'without_trashed'), // デフォルトは削除されていないもの
        ];
        // ソート
        $sort = [
            'field' => $request->input('sort_field', 'created_at'),
            'direction' => $request->input('sort_direction', 'desc'),
        ];
        // ユーザーのページネーション取得
        $users = $this->userService->getPaginated($filters, $sort, 20);
        // 統計情報の取得
        $stats = $this->userService->getStats();

        return Inertia::render('Admin/User/Index', [
            'users' => $users,
            'filters' => $filters,
            'stats' => $stats,
            'statuses' => $this->userService->getStatuses(),
        ]);
    }

    /**
     * ユーザー登録画面
     */
    public function create(): Response
    {
        return Inertia::render('Admin/User/Create');
    }

    /**
     * ユーザー登録処理
     */
    public function store(StoreUserRequest $request)
    {
        $result = $this->userService->createUser($request->validated());

        return redirect()
            ->route('admin.user.show', $result['user'])
            ->with('success', 'ユーザーを作成しました。初期パスワード: ' . $result['password']);
    }

    /**
     * ユーザー詳細画面
     */
    public function show(User $user): Response
    {
        $user->load(['profile.media', 'addresses']);

        // プロフィール画像URLを明示的に追加
        if ($user->profile && $user->profile->media) {
            $user->profile->media->makeVisible(['url', 'original_url']);
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

        // ユーザーの見積もり依頼を取得
        $projectInquiries = ProjectInquiry::where('user_id', $user->id)
            ->with([
                'serviceCategory',
                'service',
                'servicePlan',
                'assignedAdmin.profile',
                'quote'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/User/Show', [
            'user' => $user,
            'mediaList' => $mediaList,
            'projectInquiries' => $projectInquiries,
        ]);
    }

    /**
     * ユーザー編集画面
     */
    public function edit(User $user): Response
    {
        $user->load('profile');

        return Inertia::render('Admin/User/Edit', [
            'user' => $user,
            'statuses' => $this->userService->getStatuses(),
        ]);
    }

    /**
     * ユーザー更新処理
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->userService->updateUser($user, $request->validated());

        return redirect()
            ->route('admin.user.show', $user)
            ->with('success', 'ユーザー情報を更新しました。');
    }

    /**
     * ユーザー削除処理
     */
    public function destroy(User $user): RedirectResponse
    {
        try {
            $this->userService->deleteUser($user, auth('admins')->id());

            return redirect()
                ->route('admin.user.index')
                ->with('success', 'ユーザーを削除しました。');
        } catch (\Exception $e) {
            Log::error('User delete error: ' . $e->getMessage());
            return redirect()
                ->route('admin.user.index')
                ->with('error', 'ユーザーの削除に失敗しました。');
        }
    }
}
