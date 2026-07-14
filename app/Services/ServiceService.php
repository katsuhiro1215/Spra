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
            $mediaIds = $data['media_ids'] ?? null;
            $technologyIds = $data['technology_ids'] ?? null;
            unset($data['media_ids'], $data['technology_ids']);

            // スラッグ生成
            if (empty($data['slug'])) {
                $data['slug'] = $this->generateUniqueSlug($data['name']);
            }

            $service = $this->repository->create($data);

            $this->syncMedia($service, $mediaIds);
            $this->syncTechnologies($service, $technologyIds);

            return $service;
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
            $mediaIds = $data['media_ids'] ?? null;
            $technologyIds = $data['technology_ids'] ?? null;
            unset($data['media_ids'], $data['technology_ids']);

            // 名前が変更されてslugが指定されていない場合は自動生成
            if (isset($data['name']) && $data['name'] !== $service->name && empty($data['slug'])) {
                $data['slug'] = $this->generateUniqueSlug($data['name'], $service->id);
            }

            $this->repository->update($service, $data);

            $this->syncMedia($service, $mediaIds);
            $this->syncTechnologies($service, $technologyIds);

            return $service->fresh();
        });
    }

    /**
     * ギャラリー画像を同期（先頭を代表画像とする）
     */
    private function syncMedia(Service $service, ?array $mediaIds): void
    {
        if ($mediaIds === null) {
            return;
        }

        $pivotData = [];
        foreach (array_values($mediaIds) as $index => $mediaId) {
            $pivotData[$mediaId] = ['sort_order' => $index, 'is_primary' => $index === 0];
        }

        $service->media()->sync($pivotData);
    }

    /**
     * 使用技術タグを同期
     */
    private function syncTechnologies(Service $service, ?array $technologyIds): void
    {
        if ($technologyIds === null) {
            return;
        }

        $pivotData = [];
        foreach (array_values($technologyIds) as $index => $technologyId) {
            $pivotData[$technologyId] = ['sort_order' => $index];
        }

        $service->technologies()->sync($pivotData);
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
     * セレクトボックス用にアクティブなサービスのみを取得（id/nameのみ）
     *
     * @param bool $onlyDisplayed Web公開（is_displayed）されているものだけに絞り込む
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveForSelect(bool $onlyDisplayed = false)
    {
        return $this->repository->query()
            ->select('id', 'name', 'slug')
            ->where('status', 'active')
            ->when($onlyDisplayed, fn ($query) => $query->where('is_displayed', true))
            ->orderBy('sort_order', 'asc')
            ->get();
    }

    /**
     * 公開サイト・見積もりシミュレーター向けに、Web公開中のサービスを
     * カテゴリ・プラン（いずれもWeb公開中のもののみ）と一緒に取得
     *
     * @return \Illuminate\Support\Collection<int, Service>
     */
    public function getPublicList()
    {
        return Service::query()
            ->where('status', 'active')
            ->where('is_displayed', true)
            ->whereHas('serviceCategory', function ($query) {
                $query->where('status', 'active')->where('is_displayed', true);
            })
            ->with([
                'serviceCategory',
                'servicePlans' => function ($query) {
                    $query->where('status', 'active')
                        ->where('is_displayed', true)
                        ->orderBy('sort_order');
                },
                'media',
                'technologies',
            ])
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * 公開サイト向けに、slugを指定してWeb公開中のサービスを1件取得
     * （プランに含まれる項目もあわせて取得）
     *
     * @param string $slug
     * @return Service|null
     */
    public function getPublicBySlug(string $slug): ?Service
    {
        return Service::query()
            ->where('slug', $slug)
            ->where('status', 'active')
            ->where('is_displayed', true)
            ->whereHas('serviceCategory', function ($query) {
                $query->where('status', 'active')->where('is_displayed', true);
            })
            ->with([
                'serviceCategory',
                'servicePlans' => function ($query) {
                    $query->where('status', 'active')
                        ->where('is_displayed', true)
                        ->with('serviceItems')
                        ->orderBy('sort_order');
                },
                'media',
                'technologies',
                'portfolios' => function ($query) {
                    $query->where('is_displayed', true)->with('media');
                },
            ])
            ->first();
    }

    /**
     * 公開サイト向けに、同カテゴリ内の他のWeb公開中サービスを取得（関連サービス表示用）
     *
     * @param Service $service
     * @param int $limit
     * @return \Illuminate\Support\Collection<int, Service>
     */
    public function getPublicRelated(Service $service, int $limit = 3)
    {
        return Service::query()
            ->where('service_category_id', $service->service_category_id)
            ->where('id', '!=', $service->id)
            ->where('status', 'active')
            ->where('is_displayed', true)
            ->with('media')
            ->orderBy('sort_order')
            ->limit($limit)
            ->get();
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
