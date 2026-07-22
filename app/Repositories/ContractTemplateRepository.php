<?php

namespace App\Repositories;

use App\Models\ContractTemplate;
use App\Repositories\Contracts\ContractTemplateRepositoryInterface;

class ContractTemplateRepository extends SoftDeletableRepository implements ContractTemplateRepositoryInterface
{
    /**
     * モデルクラス名を返す
     */
    protected function getModelClass(): string
    {
        return ContractTemplate::class;
    }

    /**
     * 検索対象フィールドを返す
     */
    protected function getSearchableFields(): array
    {
        return [
            'name',
            'description',
        ];
    }

    /**
     * ソート可能フィールドを返す
     */
    protected function getSortableFields(): array
    {
        return [
            'created_at',
            'name',
            'sort_order',
            'template_type',
            'status',
        ];
    }

    /**
     * デフォルトのソートフィールドを返す
     */
    protected function getDefaultSortField(): string
    {
        return 'sort_order';
    }

    /**
     * 統計情報を取得（UI に合わせてキーを変換）
     */
    public function getStats(): array
    {
        $stats = parent::getStats();

        return [
            'all' => $stats['total'] ?? 0,
            'active' => $stats['active'] ?? 0,
            'trashed' => $stats['trashed'] ?? 0,
        ];
    }
}
