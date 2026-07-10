<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class UserRepository extends SoftDeletableRepository implements UserRepositoryInterface
{
    /**
     * モデルクラス名を返す
     * 
     * @return string
     */
    protected function getModelClass(): string
    {
        return User::class;
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
        return ['profile', 'company'];
    }

    /**
     * メールアドレスで検索
     * 
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
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

        return $query;
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
            'active' => User::where('status', 'active')->count(),
            'inactive' => User::where('status', 'inactive')->count(),
            'suspended' => User::where('status', 'suspended')->count(),
        ]);
    }
}
