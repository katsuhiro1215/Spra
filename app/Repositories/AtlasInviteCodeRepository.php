<?php

namespace App\Repositories;

use App\Models\AtlasInviteCode;

class AtlasInviteCodeRepository extends BaseRepository
{
    /**
     * モデルクラス名を返す
     */
    protected function getModelClass(): string
    {
        return AtlasInviteCode::class;
    }

    /**
     * 検索対象フィールドを返す
     */
    protected function getSearchableFields(): array
    {
        return [
            'code',
            'note',
        ];
    }

    /**
     * ソート可能フィールドを返す
     */
    protected function getSortableFields(): array
    {
        return [
            'code',
            'brand',
            'status',
            'expires_at',
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
        return ['issuedBy', 'usedBy'];
    }

    /**
     * 統計情報を取得
     */
    public function getStats(): array
    {
        return [
            'total' => AtlasInviteCode::count(),
            'unused' => AtlasInviteCode::where('status', 'unused')->count(),
            'used' => AtlasInviteCode::where('status', 'used')->count(),
        ];
    }
}
