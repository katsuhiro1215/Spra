<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface ProposalRepositoryInterface extends BaseRepositoryInterface
{
    public function findByHearing(string $hearingId): Collection;
}
