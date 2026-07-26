<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnouncementRequest;
use App\Models\Announcement;
use App\Services\AnnouncementService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function __construct(private AnnouncementService $service) {}

    /**
     * お知らせ一覧
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
        ];

        $announcements = $this->service->getPaginated($filters);

        return Inertia::render('Admin/Announcements/Index', [
            'announcements' => $announcements,
            'filters' => $filters,
        ]);
    }

    /**
     * 新規作成フォーム
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Announcements/Create', [
            'audiences' => Announcement::AUDIENCES,
        ]);
    }

    /**
     * 保存（下書きとして保存。配信は別操作）
     */
    public function store(AnnouncementRequest $request): RedirectResponse
    {
        try {
            $this->service->createAnnouncement($request->validated(), Auth::guard('admins')->id());

            return redirect()->route('admin.announcement.index')
                ->with('success', __('messages.created', ['attribute' => 'お知らせ']));
        } catch (\Exception $e) {
            Log::error('Announcement store error: ' . $e->getMessage());

            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.create_failed', ['attribute' => 'お知らせ']));
        }
    }

    /**
     * 編集フォーム
     */
    public function edit(Announcement $announcement): Response
    {
        return Inertia::render('Admin/Announcements/Edit', [
            'announcement' => $announcement,
            'audiences' => Announcement::AUDIENCES,
        ]);
    }

    /**
     * 更新
     */
    public function update(AnnouncementRequest $request, Announcement $announcement): RedirectResponse
    {
        try {
            $this->service->updateAnnouncement($announcement, $request->validated(), Auth::guard('admins')->id());

            return redirect()->route('admin.announcement.index')
                ->with('success', __('messages.updated', ['attribute' => 'お知らせ']));
        } catch (\Exception $e) {
            Log::error('Announcement update error: ' . $e->getMessage());

            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.update_failed', ['attribute' => 'お知らせ']));
        }
    }

    /**
     * 削除
     */
    public function destroy(Announcement $announcement): RedirectResponse
    {
        try {
            $this->service->deleteAnnouncement($announcement);

            return redirect()->route('admin.announcement.index')
                ->with('success', __('messages.deleted', ['attribute' => 'お知らせ']));
        } catch (\Exception $e) {
            Log::error('Announcement destroy error: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', __('messages.delete_failed', ['attribute' => 'お知らせ']));
        }
    }

    /**
     * 配信（メール＋ダッシュボード通知）
     */
    public function publish(Announcement $announcement): RedirectResponse
    {
        try {
            $count = $this->service->publish($announcement);

            return redirect()->back()->with('success', "{$count}件のユーザーへお知らせを配信しました。");
        } catch (\RuntimeException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Announcement publish error: ' . $e->getMessage());

            return redirect()->back()->with('error', 'お知らせの配信に失敗しました。');
        }
    }
}
