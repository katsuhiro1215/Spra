<?php

namespace App\Repositories;

use App\Models\Admin;
use App\Repositories\Contracts\AdminRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

/**
 * 管理者リポジトリ
 * 
 * SoftDeletableRepositoryを継承し、Admin固有の機能を追加
 */
class AdminRepository extends SoftDeletableRepository implements AdminRepositoryInterface
{
    /**
     * モデルクラス名を返す
     * 
     * @return string
     */
    protected function getModelClass(): string
    {
        return Admin::class;
    }

    /**
     * 検索対象フィールドを返す
     * 
     * @return array
     */
    protected function getSearchableFields(): array
    {
        return [
            'email',
            'profile.last_name',  // リレーション検索
            'profile.first_name', // リレーション検索
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
            'email',
            'role',
            'status',
            'last_login_at',
        ];
    }

    /**
     * デフォルトのリレーションを返す
     * 
     * @return array
     */
    protected function getDefaultRelations(): array
    {
        return ['profile'];
    }

    /**
     * メールアドレスで検索
     * 
     * @param string $email
     * @return Admin|null
     */
    public function findByEmail(string $email): ?Admin
    {
        return Admin::where('email', $email)->first();
    }

    /**
     * フィルタ条件でクエリビルダーを取得（オーバーライド）
     * 
     * @param array $filters
     * @return Builder
     */
    public function findWithFilters(array $filters): Builder
    {
        // 親クラスの基本フィルタを適用
        $query = parent::findWithFilters($filters);

        // 役割フィルタ（Admin固有）
        if (!empty($filters['role'])) {
            $query = $this->buildRoleFilter($query, $filters['role']);
        }

        return $query;
    }

    /**
     * 役割フィルタを適用
     * 
     * @param Builder $query
     * @param string $role
     * @return Builder
     */
    public function buildRoleFilter(Builder $query, string $role): Builder
    {
        return $query->where('role', $role);
    }

    /**
     * 統計情報を取得（オーバーライド）
     * 
     * @return array
     */
    public function getStats(): array
    {
        $baseStats = parent::getStats();

        return array_merge($baseStats, [
            'active' => Admin::where('status', 'active')->count(),
            'inactive' => Admin::where('status', 'inactive')->count(),
            'suspended' => Admin::where('status', 'suspended')->count(),
        ]);
    }
}
