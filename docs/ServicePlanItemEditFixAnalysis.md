# ServicePlanItem Edit ページの表示問題 - 原因分析と解決方法

## 問題の症状

Edit ページで既存サービスアイテムを表示する際、以下の情報が表示されない問題が発生：

- 項目名（name）
- 金額（standard_price）
- 種類（item_type）

数量のみが表示されていた。

## 原因分析

### 根本原因：Inertia.js のシリアライズでリレーション情報が失われた

1. **初期状態の問題**

    ```php
    // これでは serviceItem リレーションが失われる
    $servicePlanItems = $servicePlan->servicePlanItems()
        ->with('serviceItem:id,name,item_type,standard_price,internal_cost,service_id')
        ->get()
        ->toArray();
    ```

    - Eloquent Collection に `.toArray()` を呼ぶと、eager-loaded リレーション情報が不完全にシリアライズされる
    - Inertia に返される時点で `serviceItem` フィールドが `null` または空になってしまう

2. **なぜリレーションが失われるのか**
    - Inertia.js は Laravel モデルをシリアライズする際、特定のパターンでのみリレーション情報を正しく処理する
    - Collection の `.toArray()` メソッドは eager-loaded データを完全に保持しない場合がある
    - PHP 側で明示的に構築した配列の方が、JavaScript 側で確実にデータが到達する

3. **JavaScript 側の影響**
    ```javascript
    // Edit.jsx で initialItems を作成する際
    const initialItems = servicePlanItems.map((item) => ({
        id: item.id,
        service_item_id: item.service_item_id,
        name: item.serviceItem?.name || "", // serviceItem が null → name が空文字列
        item_type: item.serviceItem?.item_type || "",
        standard_price: item.serviceItem?.standard_price || 0,
        // ...
    }));
    ```

## 解決方法

**PHP 側で明示的に配列を構築する**

```php
// servicePlanItemsをロードしてデータを構築
$servicePlanItemsRaw = $servicePlan->servicePlanItems()
    ->with('serviceItem:id,name,item_type,standard_price,internal_cost,service_id')
    ->get();

// 明示的に配列化してリレーション情報を含める
$servicePlanItems = $servicePlanItemsRaw->map(function ($item) {
    return [
        'id' => $item->id,
        'service_item_id' => $item->service_item_id,
        'quantity' => $item->quantity,
        'estimated_days' => $item->estimated_days,
        'sort_order' => $item->sort_order,
        'serviceItem' => $item->serviceItem ? [
            'id' => $item->serviceItem->id,
            'name' => $item->serviceItem->name,
            'item_type' => $item->serviceItem->item_type,
            'standard_price' => $item->serviceItem->standard_price,
            'internal_cost' => $item->serviceItem->internal_cost,
            'service_id' => $item->serviceItem->service_id,
        ] : null,
    ];
})->toArray();
```

### なぜこれが機能するのか

1. **リレーションの明示的なマッピング**
    - `->map()` でループしながら、関連モデルのフィールドを直接参照
    - 関連オブジェクトが null かどうかを事前チェック

2. **ネストされた配列構造**
    - `serviceItem` を独立した配列として明示的に構築
    - Inertia のシリアライズでも確実に保持される

3. **型の安全性**
    - すべてのフィールドが明示的に指定されているため、予期しないフィールドが含まれない
    - デバッグやメンテナンスが容易

## ベストプラクティス

### Inertia.js で eager-loaded リレーションを返す場合

❌ **避けるべきパターン**

```php
// リレーション情報が失われる可能性がある
return Inertia::render('Page', [
    'items' => $model->relation()->get(),  // Collection そのまま
    'items' => $model->relation()->get()->toArray(),  // toArray だけ
]);
```

✅ **推奨パターン**

```php
// 明示的に配列を構築する
$items = $model->relation()->get()->map(function ($item) {
    return [
        'id' => $item->id,
        'relatedData' => $item->relatedModel ? [
            // ネストされたデータを明示的に指定
        ] : null,
    ];
})->toArray();

return Inertia::render('Page', [
    'items' => $items,
]);
```

## 影響範囲

このパターンは以下の場面で注意が必要：

- Create/Edit フォームで eager-loaded リレーションを表示
- List ページでネストされたデータを表示
- モデルが複数レベルのリレーションを持つ場合

## 参考

- **Inertia.js 公式**: データのシリアライズについて明確な文書がないため、明示的な構築が最も安全
- **Laravel Collection**: `->toArray()` はシリアライズルールを完全に適用しない可能性がある
