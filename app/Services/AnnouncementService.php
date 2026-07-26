<?php

namespace App\Services;

use App\Models\Announcement;
use App\Models\User;
use App\Notifications\AnnouncementPublished;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Notification;

class AnnouncementService
{
    public function getPaginated(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = Announcement::query()->with('creator')->latest('created_at');

        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['status'])) {
            $query->where('is_published', $filters['status'] === 'sent');
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function createAnnouncement(array $data, string $adminId): Announcement
    {
        return Announcement::create([
            ...$data,
            'created_by' => $adminId,
            'updated_by' => $adminId,
        ]);
    }

    public function updateAnnouncement(Announcement $announcement, array $data, string $adminId): Announcement
    {
        $announcement->update([
            ...$data,
            'updated_by' => $adminId,
        ]);

        return $announcement;
    }

    public function deleteAnnouncement(Announcement $announcement): bool
    {
        return $announcement->delete();
    }

    /**
     * 配信対象を解決する（アカウント自体が有効なユーザーのみ。audienceが
     * active_contract の場合はさらに契約中のユーザーに絞る）
     */
    public function resolveTargetUsers(Announcement $announcement): Collection
    {
        $query = User::query()->active();

        if ($announcement->audience === Announcement::AUDIENCE_ACTIVE_CONTRACT) {
            $query->withActiveContract();
        }

        return $query->get();
    }

    /**
     * メール＋ダッシュボード通知で配信する。二重配信を防ぐため、
     * 既に配信済み（sent_at設定済み）の場合は例外を投げる。
     */
    public function publish(Announcement $announcement): int
    {
        if ($announcement->isSent()) {
            throw new \RuntimeException('このお知らせは既に配信済みです。');
        }

        $users = $this->resolveTargetUsers($announcement);

        if ($users->isNotEmpty()) {
            Notification::send($users, new AnnouncementPublished($announcement));
        }

        $announcement->update([
            'is_published' => true,
            'published_at' => now(),
            'sent_at' => now(),
            'recipient_count' => $users->count(),
        ]);

        return $users->count();
    }
}
