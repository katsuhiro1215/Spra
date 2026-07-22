<?php

namespace App\Services;

use App\Models\Technology;
use App\Repositories\TechnologyRepository;

class TechnologyService extends BaseService
{
    public function __construct(TechnologyRepository $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'Technology';
    }

    /**
     * セレクト・チェックボックス用に有効な技術を取得
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveForSelect()
    {
        return Technology::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }
}
