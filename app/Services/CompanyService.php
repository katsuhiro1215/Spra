<?php

namespace App\Services;

use App\Models\Address;
use App\Models\Company;
use App\Repositories\CompanyRepository;
use Illuminate\Support\Facades\DB;

class CompanyService extends BaseService
{
    /**
     * コンストラクタ
     * 
     * @param CompanyRepository $repository
     */
    public function __construct(CompanyRepository $repository)
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
        return 'Company';
    }

    /**
     * 新しい会社を作成
     * 
     * @param array $data
     * @return Company
     * @throws \Exception
     */
    public function createCompany(array $data): Company
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

    /**
     * 会社情報を更新
     * 
     * @param Company $company
     * @param array $data
     * @return Company
     */
    public function updateCompany(Company $company, array $data): Company
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

    /**
     * 会社を削除
     * 
     * @param Company $company
     * @return void
     * @throws \Exception
     */
    public function deleteCompany(Company $company): void
    {
        DB::transaction(function () use ($company) {
            $this->repository->delete($company);
        });
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

    /**
     * アクティブな会社一覧を取得（選択肢用など）
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveCompanies()
    {
        return $this->repository->findWithFilters(['status' => 'active'])->get();
    }

    /**
     * ステータス定義を取得
     * 
     * @return array
     */
    public function getStatuses(): array
    {
        return [
            ['value' => 'active', 'label' => '有効'],
            ['value' => 'inactive', 'label' => '無効'],
            ['value' => 'suspended', 'label' => '停止中'],
        ];
    }
}
