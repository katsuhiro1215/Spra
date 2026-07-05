<?php

namespace App\Services;

use App\Repositories\ContactCategoryRepository;
use Illuminate\Support\Facades\DB;

class ContactCategoryService extends BaseService
{
    /**
     * @param ContactCategoryRepository $repository
     */
    public function __construct(ContactCategoryRepository $repository)
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
        return 'ContactCategory';
    }

    /**
     * アクティブなカテゴリを取得
     */
    public function getActive()
    {
        return $this->repository->getActive();
    }
}
