<?php

namespace App\Repositories\Contracts;

use App\Models\Service;

/**
 * サービスリポジトリインターフェース
 * 
 * SoftDeletableRepositoryInterfaceを継承し、Service固有のメソッドを追加
 */
interface ServiceRepositoryInterface extends SoftDeletableRepositoryInterface
{
    /**
     * スラッグで検索
     * 
     * @param string $slug
     * @return Service|null
     */
    public function findBySlug(string $slug): ?Service;

    /**
     * スラッグが存在するか確認
     * 
     * @param string $slug
     * @param string|null $excludeId
     * @return bool
     */
    public function slugExists(string $slug, ?string $excludeId = null): bool;
}
