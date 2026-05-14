<?php

namespace App\Repositories\Contracts;

use App\Models\Admin;
use Illuminate\Database\Eloquent\Builder;

/**
 * 管理者リポジトリインターフェース
 * 
 * SoftDeletableRepositoryInterfaceを継承し、Admin固有のメソッドを追加
 */
interface AdminRepositoryInterface extends SoftDeletableRepositoryInterface
{
    /**
     * メールアドレスで検索
     * 
     * @param string $email
     * @return Admin|null
     */
    public function findByEmail(string $email): ?Admin;

    /**
     * 役割フィルタを適用
     * 
     * @param Builder $query
     * @param string $role
     * @return Builder
     */
    public function buildRoleFilter(Builder $query, string $role): Builder;
}
