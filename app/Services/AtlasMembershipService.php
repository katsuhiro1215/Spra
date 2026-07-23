<?php

namespace App\Services;

use App\Models\AtlasMembership;
use App\Repositories\AtlasMembershipRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AtlasMembershipService extends BaseService
{
    public function __construct(AtlasMembershipRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     */
    protected function getEntityName(): string
    {
        return 'AtlasMembership';
    }

    /**
     * Atlas会員を付与
     */
    public function createMembership(array $data): AtlasMembership
    {
        return DB::transaction(function () use ($data) {
            $data['granted_by'] = Auth::guard('admins')->id();
            if (($data['status'] ?? null) === 'active') {
                $data['activated_at'] = now();
            }

            return $this->repository->create($data);
        });
    }

    /**
     * Atlas会員を更新
     */
    public function updateMembership(AtlasMembership $membership, array $data): AtlasMembership
    {
        return DB::transaction(function () use ($membership, $data) {
            if (($data['status'] ?? null) === 'active' && $membership->status !== 'active') {
                $data['activated_at'] = now();
            }

            return $this->repository->update($membership, $data);
        });
    }
}
