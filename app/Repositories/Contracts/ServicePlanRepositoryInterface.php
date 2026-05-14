<?php

namespace App\Repositories\Contracts;

use App\Models\ServicePlan;

/**
 * サービスプランリポジトリインターフェース
 * 
 * SoftDeletableRepositoryInterfaceを継承し、ServicePlan固有のメソッドを追加
 */
interface ServicePlanRepositoryInterface extends SoftDeletableRepositoryInterface
{
    /**
     * スラッグで検索
     * 
     * @param string $slug
     * @return ServicePlan|null
     */
    public function findBySlug(string $slug): ?ServicePlan;

    /**
     * スラッグが存在するか確認
     * 
     * @param string $slug
     * @param string|null $excludeId
     * @return bool
     */
    public function slugExists(string $slug, ?string $excludeId = null): bool;
}
