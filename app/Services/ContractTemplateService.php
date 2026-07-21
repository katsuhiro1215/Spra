<?php

namespace App\Services;

use App\Repositories\ContractTemplateRepository;

class ContractTemplateService extends BaseService
{
    public function __construct(
        ContractTemplateRepository $repository
    ) {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す（単数形）
     */
    protected function getEntityName(): string
    {
        return 'ContractTemplate';
    }
}
