<?php

namespace App\Contracts;

use Carbon\CarbonInterface;

interface SearchConsoleServiceInterface
{
    /**
     * 指定日のSearch Analyticsデータを取得する
     *
     * @return array<int, array{query: string, page: string, clicks: int, impressions: int, ctr: float, position: float}>
     */
    public function fetchSearchAnalytics(CarbonInterface $date): array;

    /**
     * 実データ(Google API)を返す実装かどうか
     */
    public function isLive(): bool;
}
