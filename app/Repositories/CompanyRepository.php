<?php

namespace App\Repositories;

use App\Models\Company;
use App\Repositories\Contracts\CompanyRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class CompanyRepository extends SoftDeletableRepository implements CompanyRepositoryInterface
{
    /**
     * モデルクラス名を返す
     * 
     * @return string
     */
    protected function getModelClass(): string
    {
        return Company::class;
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
            'email',
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
            'status',
        ];
    }

    /**
     * メールアドレスで検索
     * 
     * @param string $email
     * @return Company|null
     */
    public function findByEmail(string $email): ?Company
    {
        return Company::where('email', $email)->first();
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

        if (!empty($filters['company_type'])) {
            $query->where('company_type', $filters['company_type']);
        }

        if (!empty($filters['industry'])) {
            $query->where('industry', $filters['industry']);
        }

        return $query;
    }

    public function bulkDelete(array $ids): int
    {
        return Company::whereIn('id', $ids)->delete();
    }

    public function attachUser(Company $company, string $userId, array $pivotData = []): void
    {
        // ULID PK のため attach() は使えない。DB::table を使う
        \Illuminate\Support\Facades\DB::table('company_user')->insert(array_merge([
            'id'         => (string) \Illuminate\Support\Str::ulid(),
            'company_id' => $company->id,
            'user_id'    => $userId,
            'created_at' => now(),
            'updated_at' => now(),
        ], $pivotData));
    }

    public function detachUser(Company $company, string $userId): void
    {
        \Illuminate\Support\Facades\DB::table('company_user')
            ->where('company_id', $company->id)
            ->where('user_id', $userId)
            ->delete();
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
            'active' => Company::where('status', 'active')->count(),
            'inactive' => Company::where('status', 'inactive')->count(),
            'suspended' => Company::where('status', 'suspended')->count(),
        ]);
    }
}
