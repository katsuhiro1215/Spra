<?php

namespace App\Services;

use App\Models\Portfolio;
use App\Repositories\PortfolioRepository;
use Illuminate\Support\Facades\DB;

class PortfolioService extends BaseService
{
    public function __construct(PortfolioRepository $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'Portfolio';
    }

    /**
     * 実績を作成し、関連サービスを紐付ける
     *
     * @param array $data 'service_ids' があれば portfolio_service に同期する
     */
    public function createPortfolio(array $data): Portfolio
    {
        return DB::transaction(function () use ($data) {
            $serviceIds = $data['service_ids'] ?? [];
            unset($data['service_ids']);

            $portfolio = $this->repository->create($data);
            $portfolio->services()->sync($serviceIds);

            return $portfolio;
        });
    }

    /**
     * 実績を更新し、関連サービスを同期する
     */
    public function updatePortfolio(Portfolio $portfolio, array $data): Portfolio
    {
        return DB::transaction(function () use ($portfolio, $data) {
            $serviceIds = $data['service_ids'] ?? [];
            unset($data['service_ids']);

            $this->repository->update($portfolio, $data);
            $portfolio->services()->sync($serviceIds);

            return $portfolio->fresh();
        });
    }

    /**
     * Webサイトに表示中の実績を取得（サービス詳細ページ向け）
     */
    public function getDisplayedForService(string $serviceId)
    {
        return Portfolio::query()
            ->where('is_displayed', true)
            ->whereHas('services', function ($query) use ($serviceId) {
                $query->where('services.id', $serviceId);
            })
            ->orderBy('sort_order')
            ->orderBy('completed_at', 'desc')
            ->with('media')
            ->get();
    }
}
