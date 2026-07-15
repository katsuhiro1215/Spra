<?php

namespace App\Services;

use App\Models\FaqCategory;
use App\Repositories\FaqCategoryRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FaqCategoryService extends BaseService
{
    public function __construct(FaqCategoryRepository $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'FaqCategory';
    }

    public function createFaqCategory(array $data): FaqCategory
    {
        return DB::transaction(function () use ($data) {
            $data['created_by'] = Auth::guard('admins')->id();
            return $this->repository->create($data);
        });
    }

    public function updateFaqCategory(FaqCategory $faqCategory, array $data): FaqCategory
    {
        return DB::transaction(function () use ($faqCategory, $data) {
            $data['updated_by'] = Auth::guard('admins')->id();
            return $this->repository->update($faqCategory, $data);
        });
    }

    public function deleteFaqCategory(FaqCategory $faqCategory): bool
    {
        return $this->repository->delete($faqCategory);
    }

    public function restoreFaqCategory(FaqCategory $faqCategory): bool
    {
        return $this->repository->restore($faqCategory);
    }

    /**
     * 一括操作
     */
    public function bulkAction(array $ids, string $action): int
    {
        return DB::transaction(function () use ($ids, $action) {
            $query = FaqCategory::whereIn('id', $ids);

            return match ($action) {
                'activate' => $query->update(['is_active' => true]),
                'deactivate' => $query->update(['is_active' => false]),
                'delete' => $query->get()->each->delete()->count(),
                default => 0,
            };
        });
    }

    /**
     * 表示順を一括更新
     *
     * @param array<int, array{id: string, sort_order: int}> $orders
     */
    public function updateOrder(array $orders): void
    {
        DB::transaction(function () use ($orders) {
            foreach ($orders as $order) {
                FaqCategory::where('id', $order['id'])->update(['sort_order' => $order['sort_order']]);
            }
        });
    }
}
