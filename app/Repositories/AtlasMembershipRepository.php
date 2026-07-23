<?php

namespace App\Repositories;

use App\Models\AtlasMembership;

class AtlasMembershipRepository extends BaseRepository
{
    /**
     * モデルクラス名を返す
     */
    protected function getModelClass(): string
    {
        return AtlasMembership::class;
    }

    /**
     * 検索対象フィールドを返す
     */
    protected function getSearchableFields(): array
    {
        return [
            'user.email',
            'note',
        ];
    }

    /**
     * ソート可能フィールドを返す
     */
    protected function getSortableFields(): array
    {
        return [
            'brand',
            'status',
            'activated_at',
            'created_at',
        ];
    }

    /**
     * デフォルトのソートフィールドを返す
     */
    protected function getDefaultSortField(): string
    {
        return 'created_at';
    }

    /**
     * デフォルトのリレーションを返す
     */
    protected function getDefaultRelations(): array
    {
        return ['user', 'grantedBy'];
    }

    /**
     * 統計情報を取得
     */
    public function getStats(): array
    {
        return [
            'total' => AtlasMembership::count(),
            'active' => AtlasMembership::where('status', 'active')->count(),
            'pending' => AtlasMembership::where('status', 'pending')->count(),
        ];
    }
}
