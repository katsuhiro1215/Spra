<?php

namespace App\Repositories;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * 基底リポジトリ抽象クラス
 * 
 * 共通のCRUD操作とクエリ機能を実装
 * 各具体的なリポジトリはこのクラスを継承して使用する
 */
abstract class BaseRepository implements BaseRepositoryInterface
{
    /**
     * モデルクラス名を返す
     * 各リポジトリで実装必須
     * 
     * @return string
     */
    abstract protected function getModelClass(): string;

    /**
     * 検索対象フィールドを返す
     * 
     * @return array
     */
    abstract protected function getSearchableFields(): array;

    /**
     * ソート可能フィールドを返す
     * 
     * @return array
     */
    abstract protected function getSortableFields(): array;

    /**
     * デフォルトのソートフィールドを返す
     * 
     * @return string
     */
    protected function getDefaultSortField(): string
    {
        return 'created_at';
    }

    /**
     * デフォルトのリレーションを返す
     * 
     * @return array
     */
    protected function getDefaultRelations(): array
    {
        return [];
    }

    /**
     * ベースクエリビルダーを取得
     * 
     * @return Builder
     */
    public function query(): Builder
    {
        $modelClass = $this->getModelClass();
        $query = $modelClass::query();

        $relations = $this->getDefaultRelations();
        if (!empty($relations)) {
            $query->with($relations);
        }

        return $query;
    }

    /**
     * IDで単一レコードを検索
     * 
     * @param string $id
     * @return Model|null
     */
    public function findById(string $id): mixed
    {
        return $this->query()->find($id);
    }

    /**
     * フィルタ条件でクエリビルダーを取得
     * 
     * @param array $filters
     * @return Builder
     */
    public function findWithFilters(array $filters): Builder
    {
        $query = $this->query();

        // 検索
        if (!empty($filters['search'])) {
            $query = $this->buildSearchQuery($query, $filters['search']);
        }

        // ステータスフィルタ
        if (!empty($filters['status'])) {
            $query = $this->buildStatusFilter($query, $filters['status']);
        }

        return $query;
    }

    /**
     * ページネーション付きでレコードを取得
     * 
     * @param int $perPage
     * @param array $filters
     * @param array $sort
     * @return LengthAwarePaginator
     */
    public function paginate(
        int $perPage = 20,
        array $filters = [],
        array $sort = []
    ): LengthAwarePaginator {
        $query = $this->findWithFilters($filters);

        $sortField = $sort['field'] ?? $this->getDefaultSortField();
        $sortDirection = $sort['direction'] ?? 'desc';

        $query = $this->applySorting($query, $sortField, $sortDirection);

        // ページネーションオブジェクトを取得（page パラメータは自動的に含まれる）
        $paginator = $query->paginate($perPage)->withQueryString();

        // フィルターとソートパラメータをクエリストリングに追加
        $appendParams = [];

        // フィルターパラメータを追加（すべてのパラメータを含める）
        foreach ($filters as $key => $value) {
            $appendParams[$key] = $value;
        }

        // ソートパラメータを追加
        if (!empty($sort['field'])) {
            $appendParams['sort_field'] = $sortField;
            $appendParams['sort_direction'] = $sortDirection;
        }

        return $paginator->appends($appendParams);
    }

    /**
     * 検索クエリを適用
     * 
     * @param Builder $query
     * @param string $search
     * @return Builder
     */
    public function buildSearchQuery(Builder $query, string $search): Builder
    {
        $searchableFields = $this->getSearchableFields();

        return $query->where(function ($q) use ($search, $searchableFields) {
            foreach ($searchableFields as $field) {
                if (str_contains($field, '.')) {
                    // リレーション検索
                    [$relation, $relationField] = explode('.', $field);
                    $q->orWhereHas($relation, function ($relQuery) use ($relationField, $search) {
                        $relQuery->where($relationField, 'LIKE', "%{$search}%");
                    });
                } else {
                    // 通常のフィールド検索
                    $q->orWhere($field, 'LIKE', "%{$search}%");
                }
            }
        });
    }

    /**
     * ステータスフィルタを適用
     * 
     * @param Builder $query
     * @param string $status
     * @return Builder
     */
    public function buildStatusFilter(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * ソートを適用
     * 
     * @param Builder $query
     * @param string $field
     * @param string $direction
     * @return Builder
     */
    public function applySorting(
        Builder $query,
        string $field,
        string $direction = 'desc'
    ): Builder {
        $allowedFields = $this->getSortableFields();
        $field = in_array($field, $allowedFields) ? $field : $this->getDefaultSortField();
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        return $query->orderBy($field, $direction);
    }

    /**
     * 新規レコードを作成
     * 
     * @param array $data
     * @return Model
     */
    public function create(array $data): mixed
    {
        $modelClass = $this->getModelClass();
        return $modelClass::create($data);
    }

    /**
     * レコードを更新
     * 
     * @param mixed $model
     * @param array $data
     * @return mixed
     */
    public function update(mixed $model, array $data): mixed
    {
        $model->update($data);
        return $model->fresh();
    }

    /**
     * レコードを削除
     * 
     * @param mixed $model
     * @return bool
     */
    public function delete(mixed $model): bool
    {
        return $model->delete();
    }

    /**
     * 統計情報を取得
     * 
     * @return array
     */
    public function getStats(): array
    {
        $modelClass = $this->getModelClass();

        return [
            'total' => $modelClass::count(),
        ];
    }
}
