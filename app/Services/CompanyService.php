<?php

namespace App\Services;

use App\Models\Address;
use App\Models\Company;
use App\Repositories\Contracts\CompanyRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CompanyService
{
    public function __construct(
        private CompanyRepositoryInterface $repository
    ) {}

    // -------------------------
    // 一覧・取得
    // -------------------------

    public function getPaginated(
        array $filters = [],
        int $perPage = 15,
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

    // -------------------------
    // 作成・更新・削除
    // -------------------------

    public function create(array $data): Company
    {
        return DB::transaction(function () use ($data) {
            $addressesData = $data['addresses'] ?? [];
            unset($data['addresses']);

            $company = $this->repository->create($data);

            foreach ($addressesData as $addressData) {
                unset($addressData['id']);
                $company->addresses()->create($addressData);
            }

            return $company->load('addresses');
        });
    }

    public function update(Company $company, array $data): Company
    {
        return DB::transaction(function () use ($company, $data) {
            $addressesData = $data['addresses'] ?? null;
            unset($data['addresses']);

            $company = $this->repository->update($company, $data);

            if ($addressesData !== null) {
                $this->syncAddresses($company, $addressesData);
            }

            return $company->load('addresses');
        });
    }

    public function delete(Company $company): bool
    {
        return $this->repository->delete($company);
    }

    public function bulkDelete(array $ids): int
    {
        return $this->repository->bulkDelete($ids);
    }

    // -------------------------
    // 住所操作
    // -------------------------

    public function addAddress(Company $company, array $data): Address
    {
        if (!empty($data['is_default'])) {
            $company->addresses()->update(['is_default' => false]);
        }
        return $company->addresses()->create($data);
    }

    public function updateAddress(Company $company, Address $address, array $data): Address
    {
        $this->assertAddressBelongsTo($company, $address);

        if (!empty($data['is_default'])) {
            $company->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }
        $address->update($data);
        return $address->fresh();
    }

    public function deleteAddress(Company $company, Address $address): void
    {
        $this->assertAddressBelongsTo($company, $address);
        $address->delete();
    }

    // -------------------------
    // ユーザー関連付け
    // -------------------------

    public function attachUser(Company $company, string $userId, string $role = 'member'): void
    {
        $this->repository->attachUser($company, $userId, ['role' => $role]);
    }

    public function detachUser(Company $company, string $userId): void
    {
        $this->repository->detachUser($company, $userId);
    }

    // -------------------------
    // Private helpers
    // -------------------------

    private function syncAddresses(Company $company, array $addressesData): void
    {
        $incomingIds = collect($addressesData)->pluck('id')->filter()->toArray();

        // 送信されなかった住所を削除
        $company->addresses()->whereNotIn('id', $incomingIds)->delete();

        foreach ($addressesData as $addressData) {
            if (!empty($addressData['id'])) {
                $address = $company->addresses()->find($addressData['id']);
                $address?->update($addressData);
            } else {
                unset($addressData['id']);
                $company->addresses()->create($addressData);
            }
        }
    }

    private function assertAddressBelongsTo(Company $company, Address $address): void
    {
        if ($address->addressable_id !== $company->id || $address->addressable_type !== Company::class) {
            abort(404);
        }
    }
}
