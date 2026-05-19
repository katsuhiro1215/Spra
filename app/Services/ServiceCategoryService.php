<?php

namespace App\Services;

use App\Models\ServiceCategory;
use App\Repositories\ServiceCategoryRepository;
use Illuminate\Support\Facades\DB;

class ServiceCategoryService extends BaseService
{
    /**
     * コンストラクタ
     * 
     * @param ServiceCategoryRepository $repository
     */
    public function __construct(ServiceCategoryRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     * 
     * @return string
     */
    protected function getEntityName(): string
    {
        return 'ServiceCategory';
    }



    /**
     * サービスカテゴリの統計情報を取得
     */
    public function getServiceCategoryStats(): array
    {
        return [
            'all' => ServiceCategory::withTrashed()->count(),
            'active' => ServiceCategory::count(),
            'trashed' => ServiceCategory::onlyTrashed()->count(),
        ];
    }

    /**
     * 新しいサービスカテゴリを作成
     * 
     * @param array $data
     * @return ServiceCategory
     * @throws \Exception
     */
    public function createServiceCategory(array $data): ServiceCategory
    {
        return DB::transaction(function () use ($data) {
            return $this->repository->create($data);
        });
    }

    /**
     * サービスカテゴリ情報を更新
     * 
     * @param ServiceCategory $serviceCategory
     * @param array $data
     * @return ServiceCategory
     */
    public function updateServiceCategory(ServiceCategory $serviceCategory, array $data): ServiceCategory
    {
        return DB::transaction(function () use ($serviceCategory, $data) {
            return $this->repository->update($serviceCategory, $data);
        });
    }

    /**
     * サービスカテゴリを削除
     * 
     * @param ServiceCategory $serviceCategory
     * @throws \Exception
     */
    public function deleteServiceCategory(ServiceCategory $serviceCategory): void
    {
        // サービスが紐づいている場合は削除を防ぐ
        if ($serviceCategory->services()->count() > 0) {
            throw new \Exception('このカテゴリにはサービスが紐づいているため削除できません。');
        }

        DB::transaction(function () use ($serviceCategory) {
            $this->repository->delete($serviceCategory);
        });
    }

    /**
     * ステータス定義を取得
     * 
     * @return array
     */
    public function getStatuses(): array
    {
        return [
            'active' => '稼働中',
            'inactive' => '停止中',
            'suspended' => '一時停止',
        ];
    }

    /**
     * セレクトボックス用にカテゴリを取得（全ステータス、id/nameのみ）
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getForSelect()
    {
        return $this->repository->query()
            ->select('id', 'name', 'slug')
            ->orderBy('sort_order', 'asc')
            ->get();
    }

    /**
     * セレクトボックス用にアクティブなカテゴリのみを取得（id/nameのみ）
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveForSelect()
    {
        return $this->repository->query()
            ->select('id', 'name', 'slug')
            ->where('status', 'active')
            ->orderBy('sort_order', 'asc')
            ->get();
    }
}
