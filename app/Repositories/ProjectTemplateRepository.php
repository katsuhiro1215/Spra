<?php

namespace App\Repositories;

use App\Models\ProjectTemplate;
use App\Repositories\Contracts\ProjectTemplateRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class ProjectTemplateRepository extends SoftDeletableRepository implements ProjectTemplateRepositoryInterface
{
    /**
     * モデルクラス名を返す
     * 
     * @return string
     */
    protected function getModelClass(): string
    {
        return ProjectTemplate::class;
    }

    /**
     * 検索対象フィールドを返す
     * 
     * @return array
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
     * 
     * @return array
     */
    protected function getSortableFields(): array
    {
        return [
            'created_at',
            'updated_at',
            'name',
            'sort_order',
            'is_active',
        ];
    }

    /**
     * デフォルトのリレーションを返す
     * 
     * @return array
     */
    protected function getDefaultRelations(): array
    {
        return ['milestones'];
    }

    /**
     * Get all active templates
     */
    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        return ProjectTemplate::where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * Find template with milestones
     */
    public function findWithMilestones(string $id): ?ProjectTemplate
    {
        return ProjectTemplate::with('milestones')
            ->find($id);
    }

    /**
     * Find template by slug
     */
    public function findBySlug(string $slug): ?ProjectTemplate
    {
        return ProjectTemplate::where('slug', $slug)->first();
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
