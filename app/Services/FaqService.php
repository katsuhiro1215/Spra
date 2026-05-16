<?php

namespace App\Services;

use App\Models\Faq;
use App\Repositories\Contracts\FaqRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class FaqService {
    public function __construct(
        private FaqRepositoryInterface $repository
    ) {}

    // -------------------------
    // 一覧・取得
    // -------------------------

    public function getPaginated(
        array $filters = [],
        int $perPage = 20,
        string $sortField = 'created_at',
        string $sortDirection = 'desc'
    ): LengthAwarePaginator {
        return $this->repository->paginate($perPage, $filters, $sortField, $sortDirection);
    }

    public function findById(string $id, array $with = []): ?Company
    {
        return $this->repository->findById($id, $with);
    }

    public function getStats(): array
    {
        return $this->repository->getStats();
    }
}
