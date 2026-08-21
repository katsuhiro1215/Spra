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
     * 【重要】このメソッド自身がDB::transaction()を開始するが、それは呼び出し元が
     * 既に外側のトランザクション内にいる場合に限り、そのトランザクションのコミットまで
     * lockForUpdate()のロックが保持される（内側の呼び出しはセーブポイントになるため）。
     * 呼び出し元が外側のトランザクションを持たない場合、このメソッドはリターンする前に
     * 自分のトランザクションをコミットしてしまい、ロックはすぐに解放される。
     * そのため、採番した番号を使ってレコードをINSERT/UPDATEするまでの間、
     * 呼び出し元は必ず自前で `DB::transaction(function () { ... })` によって
     * generate()呼び出しとレコード作成を同一トランザクションで包む必要がある。
     * このメソッド単体では重複防止を保証しない。
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
