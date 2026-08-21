<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class ReferenceNumberService
{
    /**
     * {prefix}-{YYYYMM}-{4桁連番} 形式の番号を採番する。
     *
     * 同一プレフィックス・同一年月の範囲内で排他ロックしながら最大値を求め、
     * 論理削除済みの行も含めて重複を避ける（$modelClassはSoftDeletesを
     * 使っているモデルを想定し、withTrashed()を呼ぶ）。
     *
     * @param string $modelClass 対象Eloquentモデルのクラス名（例: Contract::class）
     * @param string $column 番号を保持するカラム名（例: 'contract_number'）
     * @param string $prefix 3文字のプレフィックス（例: 'CTR'）
     */
    public function generate(string $modelClass, string $column, string $prefix): string
    {
        $searchPrefix = $prefix . '-' . now()->format('Ym') . '-';

        return DB::transaction(function () use ($modelClass, $column, $searchPrefix) {
            $lastNumber = $modelClass::withTrashed()
                ->where($column, 'like', "{$searchPrefix}%")
                ->lockForUpdate()
                ->orderByDesc($column)
                ->value($column);

            $sequence = $lastNumber
                ? ((int) substr($lastNumber, strlen($searchPrefix))) + 1
                : 1;

            return sprintf('%s%04d', $searchPrefix, $sequence);
        });
    }
}
