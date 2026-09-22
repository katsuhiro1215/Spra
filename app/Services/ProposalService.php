<?php

namespace App\Services;

use App\Models\Proposal;
use App\Repositories\Contracts\ProposalRepositoryInterface;
use Illuminate\Support\Collection;

class ProposalService extends BaseService
{
    public function __construct(ProposalRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'Proposal';
    }

    public function createProposal(array $data, string $creatorId): Proposal
    {
        $data['created_by'] = $creatorId;
        $data['status'] ??= 'draft';

        return $this->create($data);
    }

    public function findByHearing(string $hearingId): Collection
    {
        return $this->repository->findByHearing($hearingId);
    }
}
