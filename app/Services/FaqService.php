<?php

namespace App\Services;

use App\Models\Faq;
use App\Repositories\FaqRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FaqService extends BaseService
{
    public function __construct(FaqRepository $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'Faq';
    }

    public function createFaq(array $data): Faq
    {
        return DB::transaction(function () use ($data) {
            $serviceIds = $data['service_ids'] ?? null;
            unset($data['service_ids']);

            $faq = $this->repository->create($data);

            if ($serviceIds !== null) {
                $faq->services()->sync($serviceIds);
            }

            return $faq;
        });
    }

    public function updateFaq(Faq $faq, array $data): Faq
    {
        return DB::transaction(function () use ($faq, $data) {
            $serviceIds = $data['service_ids'] ?? null;
            unset($data['service_ids']);

            $faq = $this->repository->update($faq, $data);

            if ($serviceIds !== null) {
                $faq->services()->sync($serviceIds);
            }

            return $faq;
        });
    }

    public function deleteFaq(Faq $faq): bool
    {
        return $this->repository->delete($faq);
    }

    public function restoreFaq(Faq $faq): bool
    {
        return $this->repository->restore($faq);
    }

    public function changeStatus(Faq $faq, bool $isPublished): Faq
    {
        return $this->repository->update($faq, ['is_published' => $isPublished]);
    }

    /**
     * 一括操作
     */
    public function bulkAction(array $ids, string $action): int
    {
        return DB::transaction(function () use ($ids, $action) {
            $query = Faq::whereIn('id', $ids);

            return match ($action) {
                'publish' => $query->update(['is_published' => true]),
                'unpublish' => $query->update(['is_published' => false]),
                'delete' => $query->get()->each->delete()->count(),
                default => 0,
            };
        });
    }
}
