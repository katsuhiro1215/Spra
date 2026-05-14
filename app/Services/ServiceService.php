<?php

namespace App\Services;

use App\Models\Service;
use App\Repositories\ServiceRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ServiceService extends BaseService
{
    /**
     * コンストラクタ
     * 
     * @param ServiceRepository $repository
     */
    public function __construct(ServiceRepository $repository)
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
        return 'Service';
    }

    /**
     * スラッグでサービスを検索
     * 
     * @param string $slug
     * @return Service|null
     */
    public function findServiceBySlug(string $slug): ?Service
    {
        return $this->repository->findBySlug($slug);
    }

    /**
     * 新しいサービスを作成
     * 
     * @param array $data
     * @return Service
     * @throws \Exception
     */
    public function createService(array $data): Service
    {
        return DB::transaction(function () use ($data) {
            // スラッグ生成
            if (empty($data['slug'])) {
                $data['slug'] = $this->generateUniqueSlug($data['name']);
            }

            return $this->repository->create($data);
        });
    }

    /**
     * サービスを更新
     * 
     * @param Service $service
     * @param array $data
     * @return Service
     */
    public function updateService(Service $service, array $data): Service
    {
        return DB::transaction(function () use ($service, $data) {
            // 名前が変更されてslugが指定されていない場合は自動生成
            if (isset($data['name']) && $data['name'] !== $service->name && empty($data['slug'])) {
                $data['slug'] = $this->generateUniqueSlug($data['name'], $service->id);
            }

            $this->repository->update($service, $data);

            return $service->fresh();
        });
    }

    /**
     * サービスを削除
     * 
     * @param Service $service
     * @throws \Exception
     */
    public function deleteService(Service $service): void
    {
        // サービスプランが紐づいている場合は削除を防ぐ
        if ($service->servicePlans()->count() > 0) {
            throw new \Exception('このサービスには関連するプランが存在するため削除できません。');
        }

        DB::transaction(function () use ($service) {
            $this->repository->delete($service);
        });
    }

    /**
     * ステータス定義を取得
     * 
     * @return array
     */
    public function getStatuses(): array
    {
        return [
            'active' => '稼働中',
            'inactive' => '停止中',
            'suspended' => '一時停止',
        ];
    }

    /**
     * 一意のスラッグを生成
     * 
     * @param string $name
     * @param string|null $excludeId
     * @return string
     */
    private function generateUniqueSlug(string $name, ?string $excludeId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while ($this->repository->slugExists($slug, $excludeId)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
