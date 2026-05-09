<?php

namespace App\Repositories;

use App\Models\Media;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class MediaRepository
{
    /**
     * クエリを構築
     */
    public function query(): Builder
    {
        return Media::with('variants');
    }

    /**
     * 検索クエリを構築
     */
    public function buildSearchQuery(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhere('original_filename', 'like', "%{$search}%");
        });
    }

    /**
     * タイプフィルターを構築
     */
    public function buildTypeFilter(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    /**
     * フォーマットフィルターを構築
     */
    public function buildFormatFilter(Builder $query, string $format): Builder
    {
        return $query->where('format', $format);
    }

    /**
     * 使用タイプフィルターを構築
     */
    public function buildUsageTypeFilter(Builder $query, string $usageType): Builder
    {
        switch ($usageType) {
            case 'profile':
                // プロフィール画像として使用されているもの
                return $query->whereHas('profiles');
            case 'admin_profile':
                // Adminのプロフィール画像
                return $query->whereHas('profiles', function ($q) {
                    $q->where('profilable_type', 'App\\Models\\Admin');
                });
            case 'user_profile':
                // Userのプロフィール画像
                return $query->whereHas('profiles', function ($q) {
                    $q->where('profilable_type', 'App\\Models\\User');
                });
            case 'unused':
                // 未使用のメディア
                return $query->doesntHave('profiles');
            default:
                return $query;
        }
    }

    /**
     * ソートを適用
     */
    public function applySorting(Builder $query, string $field, string $direction): Builder
    {
        $allowedFields = ['created_at', 'updated_at', 'title', 'original_file_size', 'usage_count'];
        $field = in_array($field, $allowedFields) ? $field : 'created_at';
        $direction = in_array(strtolower($direction), ['asc', 'desc']) ? $direction : 'desc';

        return $query->orderBy($field, $direction);
    }



    /**
     * ハッシュで検索（重複チェック）
     */
    public function findByHash(string $hash): ?Media
    {
        return Media::where('original_hash', $hash)->first();
    }

    /**
     * ID で取得
     */
    public function findById(string $id): ?Media
    {
        return Media::where('id', $id)
            ->with('variants')
            ->first();
    }

    /**
     * 作成
     */
    public function create(array $data): Media
    {
        return Media::create($data);
    }

    /**
     * 更新
     */
    public function update(string $id, array $data): bool
    {
        $media = Media::findOrFail($id);
        return $media->update($data);
    }

    /**
     * 削除（ソフトデリート）
     */
    public function delete(Media $media): bool
    {
        return $media->delete();
    }

    /**
     * 総使用容量取得（バイト）
     */
    public function getTotalStorageUsed(): int
    {
        return Media::sum('original_file_size');
    }

    /**
     * 総メディア数を取得
     */
    public function getTotalCount(): int
    {
        return Media::count();
    }

    /**
     * タイプ別メディア数を取得
     */
    public function getCountByType(string $type): int
    {
        return Media::where('type', $type)->count();
    }

    /**
     * 合計ファイルサイズを取得
     */
    public function getTotalSize(): int
    {
        return Media::sum('original_file_size') ?? 0;
    }

    /**
     * プロフィール画像数を取得
     */
    public function getProfileImageCount(?string $profilableType = null): int
    {
        $query = Media::whereHas('profiles');

        if ($profilableType) {
            $query->whereHas('profiles', function ($q) use ($profilableType) {
                $q->where('profilable_type', "App\\Models\\{$profilableType}");
            });
        }

        return $query->count();
    }

    /**
     * 今月アップロードされたメディア数を取得
     */
    public function getThisMonthCount(): int
    {
        return Media::whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->count();
    }

    /**
     * 未使用メディアの取得
     */
    public function getUnusedMedia(int $daysUnused = 30): Collection
    {
        return Media::where('usage_count', 0)
            ->where('created_at', '<', now()->subDays($daysUnused))
            ->get();
    }
}
