# 書類番号（契約/見積/請求/領収）採番方式の統一 設計書

- 作成日: 2026-08-21
- 対象: `Contract.contract_number` / `Quote.quote_number` / `Invoice.invoice_number` / `Receipt.receipt_number` の採番ロジック
- 背景: ユーザーからの2点の指摘
  1. 4エンティティの採番フォーマットに統一感が無く、桁数からAdminの受注件数がクライアントに推測できてしまう
  2. 番号を後から手動修正する手段が無い

過去に`reference_numbers`という共通テーブル（`prefix`/`year_month`/`sequence`/`reference_number`/`entity_type`/`entity_id`を持つ多態的な採番テーブル）を検討したが削除された経緯がある。今回はテーブルは新設せず、既存の`contract_number`等の各カラムはそのまま使い、採番**ロジック**だけを共通化する方針とする（ユーザー承認済み）。

## 1. 現状（Before）

| エンティティ | 生成箇所 | フォーマット | 排他ロック | 論理削除考慮 |
|---|---|---|---|---|
| Contract | `ContractRepository::generateContractNumber()` | `C{YYYY}{MM}{4桁}` 例: C2026080002 | 無し | 無し |
| Quote | `QuoteRepository::generateQuoteNumber()` | `Q{YYYY}{MM}{4桁}` 例: Q2026080002 | `lockForUpdate()`あり | `withTrashed()`あり |
| Invoice | `InvoiceService::generateInvoiceNumber()` | `INV{YYYY}-{4桁}`（年単位、月なし） | 無し | `withTrashed()`あり |
| Receipt | `ReceiptService::generateReceiptNumber()` | `RCP{YYYY}-{4桁}`（年単位、月なし） | 無し | `withTrashed()`あり |

Quote以外は排他ロックが無く、Contractのみ論理削除も考慮していない（同時作成・削除後の番号重複リスクがある）。Invoice/Receiptは年単位でリセットされ、Contract/Quoteは年月単位でリセットされるという粒度の不一致もある。

いずれの番号も、発行後に画面から手動で編集する手段は存在しない（各FormRequestが`*_number`系フィールドを一切受け付けていない）。

## 2. 方針（After）

### 2.1 フォーマット統一

`{PREFIX}-{YYYYMM}-{4桁連番}`（ハイフン区切り、年月単位でリセット）に統一する。

| エンティティ | 新プレフィックス | 例 |
|---|---|---|
| Contract | `CTR` | `CTR-202608-0002` |
| Quote | `QTE` | `QTE-202608-0002` |
| Invoice | `INV` | `INV-202608-0002` |
| Receipt | `RCP` | `RCP-202608-0002` |

**過去に発行済みの番号（旧フォーマット）は遡って変換しない。** 新規発行分から新フォーマットを使う。旧フォーマットの番号が残っていても、採番ロジックは新フォーマットの番号のみを対象に連番を数える（`{PREFIX}-{YYYYMM}-` に前方一致するものだけを見る）ため、旧フォーマットの存在が新フォーマットの連番に影響しない。

### 2.2 共通採番サービス

`app/Services/ReferenceNumberService.php` を新設する。

```php
class ReferenceNumberService
{
    /**
     * {prefix}-{YYYYMM}-{4桁連番} 形式の番号を採番する。
     * $modelClass は対象Eloquentモデルのクラス名（例: Contract::class）、
     * $column は番号カラム名（例: 'contract_number'）。
     * 同一プレフィックス・年月内で排他ロックしながら最大値を求め、
     * 論理削除済みの行も含めて重複を避ける。
     */
    public function generate(string $modelClass, string $column, string $prefix): string
    {
        $yearMonth = now()->format('Ym');
        $searchPrefix = "{$prefix}-{$yearMonth}-";

        return DB::transaction(function () use ($modelClass, $column, $prefix, $yearMonth, $searchPrefix) {
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
```

既存4箇所の採番メソッドは、このサービスを呼び出す薄いラッパーに置き換える。呼び出し側のメソッドシグネチャ（`generateContractNumber()`等）は変更しない（呼び出し元への影響を避けるため）。

```php
// ContractRepository::generateContractNumber()
public function generateContractNumber(): string
{
    return app(ReferenceNumberService::class)->generate(Contract::class, 'contract_number', 'CTR');
}
```

Quoteが持っていた「見積シミュレーター経由の番号（`Q20260722-XFIJAX`のような旧フォーマット）を誤って拾わない」対策は、新フォーマットが常に`{PREFIX}-{YYYYMM}-{4桁}`という固定長で「-」区切りである以上、`like`条件の前方一致だけで十分にシミュレーター由来の番号（ハイフンの位置が異なる）を除外できる。

### 2.3 番号の手動編集

各エンティティの編集画面から、**特定のステータスの間だけ**番号を手動修正できるようにする。

| エンティティ | 編集可能な条件 |
|---|---|
| Contract | `status === 'draft'` |
| Quote | `status === 'draft'` |
| Invoice | `status === 'draft'` |
| Receipt | `status`が`sent`ではない、かつ`sent_at`が null（クライアントへのメール送付前） |

バリデーションルール（各FormRequestに追加）:
- 正規表現 `/^[A-Z]{3}-\d{6}-\d{4}$/` は**値が現在の保存値から変更された場合のみ**適用する（`Rule::when($this->input('contract_number') !== $this->route('contract')->contract_number, [...])`）。これにより、旧フォーマットの番号を持つ既存レコードを番号欄はそのままに他の項目だけ編集して保存しても、フォーマット不一致でエラーにならない
- ユニーク制約: 自分自身の行を`ignore()`した上で対象カラムに対して`unique`（これは値の変更有無に関わらず常に適用してよい。自分自身は`ignore()`されるため無害）
- 上記のステータス条件を満たさない場合、バックエンドは`*_number`フィールドの変更を無視する（送信された値を`$validated`から除外し、更新処理に渡さない）。クライアント側のUIも入力欄をdisabledにするが、直接POSTされた場合の防御をサーバー側でも行う

Receiptは現在専用の`ReceiptRequest`が無く`Request`を直接使っているため、この対応と合わせて`ReceiptRequest`（FormRequest）を新設する。

### 2.4 フロントエンド

`Admin/Contracts/Edit.jsx` / `Admin/Quotes/Edit.jsx` / `Admin/Invoices/Edit.jsx` / `Admin/Receipts/Edit.jsx` それぞれに、番号表示部分をテキスト入力に変更する。編集可能条件を満たさない場合は`disabled`表示＋「送付後は変更できません」等のヘルプテキストを出す。

## 3. スコープ外（今回やらないこと）

- `reference_numbers`という新規共通テーブルの作成（採番ロジックの共通化のみで対応する）
- 過去に発行済みの番号を新フォーマットへ一括変換するバッチ
- Quote以外のエンティティにおける、採番以外の既存不具合の修正（本設計のスコープは採番と番号編集のみ）

## 4. テスト方針

- `tests/Unit/Services/ReferenceNumberServiceTest.php`（新規）: フォーマット・年月リセット・同一トランザクション内の連番採番・論理削除済み番号を考慮した重複防止を検証
- 各エンティティの採番メソッドから`ReferenceNumberService`が正しく呼ばれることを検証する既存テストの更新（フォーマット変更に伴うアサーション修正）
- 番号編集のFeatureテスト（4エンティティ分）: 編集可能条件を満たす場合の成功、満たさない場合に無視されること、重複時のバリデーションエラー
