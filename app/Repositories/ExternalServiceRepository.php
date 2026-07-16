<?php

namespace App\Repositories;

use App\Models\ExternalService;

class ExternalServiceRepository extends BaseRepository
{
    protected function getModelClass(): string
    {
        return ExternalService::class;
    }

    protected function getSearchableFields(): array
    {
        return ['name', 'category'];
    }

    protected function getSortableFields(): array
    {
        return ['name', 'category', 'sort_order', 'created_at', 'last_synced_at'];
    }

    protected function getDefaultSortField(): string
    {
        return 'sort_order';
    }

    /**
     * 統計情報を取得
     */
    public function getStats(): array
    {
        return [
            'total' => ExternalService::count(),
            'active' => ExternalService::where('is_active', true)->count(),
            'inactive' => ExternalService::where('is_active', false)->count(),
            'apiLinked' => ExternalService::whereNotNull('api_base_url')->count(),
        ];
    }
}
