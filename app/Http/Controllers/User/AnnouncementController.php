<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\User;
use App\Notifications\AnnouncementPublished;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    /**
     * 自分に配信されたお知らせ一覧
     */
    public function index(): Response
    {
        $user = auth('users')->user();

        $announcements = $this->visibleAnnouncementsQuery($user)->paginate(15);

        return Inertia::render('User/Announcements/Index', [
            'announcements' => $announcements,
            'readAnnouncementIds' => Announcement::readIdsFor($user),
        ]);
    }

    /**
     * お知らせ詳細（既読化する）
     */
    public function show(Announcement $announcement): Response
    {
        $user = auth('users')->user();

        abort_unless(
            $this->visibleAnnouncementsQuery($user)->whereKey($announcement->id)->exists(),
            404
        );

        $user->notifications()
            ->where('type', AnnouncementPublished::class)
            ->whereNull('read_at')
            ->get()
            ->filter(fn ($notification) => ($notification->data['announcement_id'] ?? null) === $announcement->id)
            ->each->markAsRead();

        return Inertia::render('User/Announcements/Show', [
            'announcement' => $announcement,
        ]);
    }

    private function visibleAnnouncementsQuery(User $user)
    {
        return Announcement::published()->visibleTo($user)->orderByDesc('published_at');
    }
}
