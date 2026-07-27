<?php

namespace App\Services;

use App\Models\AtlasInviteCode;
use App\Repositories\AtlasInviteCodeRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AtlasInviteCodeService extends BaseService
{
    public function __construct(AtlasInviteCodeRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     */
    protected function getEntityName(): string
    {
        return 'AtlasInviteCode';
    }

    /**
     * 招待コードを発行
     */
    public function issue(array $data): AtlasInviteCode
    {
        return DB::transaction(function () use ($data) {
            $data['code'] = AtlasInviteCode::generateCode();
            $data['issued_by'] = Auth::guard('admins')->id();

            return $this->repository->create($data);
        });
    }

    /**
     * 招待コードを失効
     */
    public function revoke(AtlasInviteCode $inviteCode): AtlasInviteCode
    {
        return DB::transaction(function () use ($inviteCode) {
            return $this->repository->update($inviteCode, ['status' => 'revoked']);
        });
    }
}
