import React, { useState, useEffect } from "react";
import { Card, CardTitle, CardHeader, CardBody } from "@/Components/Card";
import { FormGroup, NumberInput } from "@/Components/Forms";
import { StoreButton, SecondaryButton } from "@/Components/Buttons";
import AlertMessage from "@/Components/AlertMessage";

const ServicePlanItemForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    servicePlan,
    available_items = [],
    mode = "create",
}) => {
    const [exceedsBasePriceAlert, setExceedsBasePriceAlert] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);

    // デバッグ: servicePlan の構造を確認
    useEffect(() => {
        console.log("servicePlan:", servicePlan);
        console.log("servicePlan.service_id:", servicePlan?.service_id);
        console.log("servicePlan.service:", servicePlan?.service);
    }, [servicePlan]);

    // servicePlan.service_id でアイテムをフィルタリング
    useEffect(() => {
        console.log("available_items:", available_items);
        console.log("available_items[0]:", available_items[0]);
        
        if (servicePlan?.service_id) {
            const filtered = available_items.filter(
                (item) => item.service_id === servicePlan.service_id,
            );
            console.log("filteredItems:", filtered);
            setFilteredItems(filtered);
        } else {
            console.log("servicePlan.service_id is not set, using all items");
            setFilteredItems(available_items);
        }
    }, [servicePlan?.service_id, available_items]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    // Service Items 管理用ヘルパー関数
    const addServiceItem = (item) => {
        console.log("Adding item:", item); // デバッグ用

        // 割引額チェック：割引額が基本料金を超える場合は追加不可
        const basePrice = parseFloat(servicePlan.base_price) || 0;
        const currentTotal = calculateTotalItemsPrice();
        const itemPrice = parseFloat(item.standard_price) || 0;
        const newTotal = currentTotal + itemPrice;
        const discountAmount = Math.max(0, newTotal - basePrice);

        if (discountAmount > basePrice) {
            setExceedsBasePriceAlert(true);
            return;
        }

        setExceedsBasePriceAlert(false);

        // 既に存在するかチェック
        const existingItem = data.items.find(
            (si) => si.service_item_id === item.id,
        );
        if (existingItem) {
            // included は複数追加不可
            if (item.item_type === "included") {
                alert("このアイテムは既に追加されており、複数選択できません。");
                return;
            }

            // 既に存在する場合は quantity を増加
            setData(
                "items",
                data.items.map((si) =>
                    si.service_item_id === item.id
                        ? { ...si, quantity: (si.quantity || 1) + 1 }
                        : si,
                ),
            );
        } else {
            // 新規追加の場合は quantity: 1 で追加
            // 必要なフィールドのみを明示的に指定（item.idを含めない）
            const newItem = {
                service_item_id: item.id,
                name: item.name,
                item_type: item.item_type,
                standard_price: item.standard_price,
                quantity: 1,
                estimated_days: 0,
                sort_order: data.items.length,
            };
            console.log("New item to add:", newItem); // デバッグ用
            setData("items", [...data.items, newItem]);
        }
    };

    const removeServiceItem = (itemId, index) => {
        setData(
            "items",
            data.items.filter((_, i) => i !== index),
        );
    };

    const updateServiceItemQuantity = (index, quantity) => {
        const item = data.items[index];
        // included は数量を 1 に固定
        const qty =
            item.item_type === "included"
                ? 1
                : Math.max(1, parseInt(quantity) || 1);
        setData(
            "items",
            data.items.map((item, i) =>
                i === index ? { ...item, quantity: qty } : item,
            ),
        );
    };

    // 選択されたサービスアイテムの合計金額
    const calculateTotalItemsPrice = () => {
        const total = data.items.reduce((sum, item) => {
            // included は価格を 0 にする
            if (item.item_type === "included") {
                return sum;
            }
            const price =
                (parseFloat(item.standard_price) || 0) * (item.quantity || 1);
            return sum + price;
        }, 0);
        return total;
    };

    // 割引額の計算（アイテム合計 - 基本料金、ゼロ以上）
    const calculateDiscountAmount = () => {
        const basePrice = parseFloat(servicePlan.base_price) || 0;
        const itemsPrice = calculateTotalItemsPrice();
        return Math.max(0, itemsPrice - basePrice);
    };

    // 割引率の計算
    const calculateDiscountRate = () => {
        const basePrice = parseFloat(servicePlan.base_price) || 0;
        if (basePrice === 0) return 0;
        return (calculateDiscountAmount() / basePrice) * 100;
    };

    // 割引額の色と警告メッセージを決定
    const getDiscountWarning = () => {
        const rate = calculateDiscountRate();
        if (rate >= 50) {
            return {
                textColor: "text-red-600 dark:text-red-400",
                bgColor: "bg-red-50 dark:bg-red-900/20",
                borderColor: "border-red-200 dark:border-red-700",
                message: "⚠️ 警告：割引額が基本料金の50%を超えています",
            };
        } else if (rate > 30) {
            return {
                textColor: "text-yellow-600 dark:text-yellow-400",
                bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
                borderColor: "border-yellow-200 dark:border-yellow-700",
                message: "⚠️ 注意：割引額が基本料金の30%を超えています",
            };
        }
        return {
            textColor: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-50 dark:bg-green-900/20",
            borderColor: "border-green-200 dark:border-green-700",
            message: null,
        };
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                {exceedsBasePriceAlert && (
                    <AlertMessage
                        type="warning"
                        title="⚠️ 注意"
                        message="※割引額が基本料金を超えているので追加できません。"
                        onClose={() => setExceedsBasePriceAlert(false)}
                    />
                )}

                {/* サービスプラン情報 */}
                <Card>
                    <CardHeader>
                        <CardTitle>サービスプラン情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* プラン名 */}
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    プラン名
                                </div>
                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {servicePlan?.name || "---"}
                                </div>
                            </div>

                            {/* 基本料金 */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                                <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">
                                    基本料金
                                </div>
                                <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                    ¥
                                    {parseFloat(
                                        servicePlan?.base_price || 0,
                                    ).toLocaleString()}
                                </div>
                            </div>

                            {/* 現在の割引額 */}
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                                <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">
                                    現在の割引額
                                </div>
                                <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
                                    ¥
                                    {parseFloat(
                                        servicePlan?.discount_amount || 0,
                                    ).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* サービスアイテム */}
                <Card>
                    <CardHeader>
                        <CardTitle>サービスアイテム</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            {/* サービスアイテム選択セレクト */}
                            <FormGroup label="アイテムを追加">
                                <select
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            const item = filteredItems.find(
                                                (i) => i.id === e.target.value,
                                            );
                                            if (item) {
                                                addServiceItem(item);
                                                e.target.value = "";
                                            }
                                        }
                                    }}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">+ アイテムを選択</option>
                                    {filteredItems.map((item) => {
                                        let typeLabel = "";
                                        if (item.item_type === "included") {
                                            typeLabel = "[含]";
                                        } else if (
                                            item.item_type === "optional"
                                        ) {
                                            typeLabel = "[opt]";
                                        } else if (item.item_type === "addon") {
                                            typeLabel = "[add]";
                                        }
                                        return (
                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {typeLabel} {item.name} - ¥
                                                {item.item_type === "included"
                                                    ? "0"
                                                    : parseFloat(
                                                          item.standard_price,
                                                      ).toLocaleString()}
                                            </option>
                                        );
                                    })}
                                </select>
                            </FormGroup>

                            {/* 選択されたアイテムリスト */}
                            {data.items.length > 0 && (
                                <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 dark:bg-gray-700 dark:text-white px-4 py-2 grid grid-cols-4 gap-4 text-sm font-semibold">
                                        <div>項目名</div>
                                        <div className="text-center">数量</div>
                                        <div className="text-right">金額</div>
                                        <div className="text-right">
                                            アクション
                                        </div>
                                    </div>
                                    {data.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-3 border-t border-gray-200 dark:border-gray-600 dark:text-gray-100 grid grid-cols-4 gap-4 items-center"
                                        >
                                            <div className="text-sm">
                                                <div className="font-medium">
                                                    {item.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {item.item_type ===
                                                    "included" ? (
                                                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                                            プランに含まれている
                                                        </span>
                                                    ) : item.item_type ===
                                                      "optional" ? (
                                                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                                            オプション
                                                        </span>
                                                    ) : item.item_type ===
                                                      "addon" ? (
                                                        <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                                                            アドオン
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500 dark:text-gray-400">
                                                            {item.item_type}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                {item.item_type ===
                                                "included" ? (
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                        1 (固定)
                                                    </span>
                                                ) : (
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={
                                                            item.quantity || 1
                                                        }
                                                        onChange={(e) =>
                                                            updateServiceItemQuantity(
                                                                index,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-12 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center text-sm dark:bg-gray-700 dark:text-white"
                                                    />
                                                )}
                                            </div>
                                            <div className="text-right text-sm">
                                                ¥
                                                {item.item_type === "included"
                                                    ? "0"
                                                    : (
                                                          parseFloat(
                                                              item.standard_price,
                                                          ) *
                                                          (item.quantity || 1)
                                                      ).toLocaleString()}
                                            </div>
                                            <div className="text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeServiceItem(
                                                            item.service_item_id,
                                                            index,
                                                        )
                                                    }
                                                    className="px-2 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 金額サマリー */}
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-3">
                                {/* 基本料金 */}
                                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
                                    <span className="font-semibold text-blue-900 dark:text-blue-100">
                                        基本料金:
                                    </span>
                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                        ¥
                                        {parseFloat(
                                            servicePlan.base_price || 0,
                                        ).toLocaleString()}
                                    </span>
                                </div>

                                {/* アイテム合計 */}
                                <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-700">
                                    <span className="font-semibold text-purple-900 dark:text-purple-100">
                                        アイテム合計:
                                    </span>
                                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                        ¥
                                        {calculateTotalItemsPrice().toLocaleString()}
                                    </span>
                                </div>

                                {/* 割引額（条件付き色分け） */}
                                {calculateDiscountAmount() > 0 && (
                                    <div
                                        className={`p-3 rounded border ${
                                            getDiscountWarning().bgColor
                                        } ${getDiscountWarning().borderColor}`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span
                                                className={`font-semibold ${
                                                    getDiscountWarning()
                                                        .textColor
                                                }`}
                                            >
                                                割引額:
                                            </span>
                                            <span
                                                className={`text-lg font-bold ${
                                                    getDiscountWarning()
                                                        .textColor
                                                }`}
                                            >
                                                ¥
                                                {calculateDiscountAmount().toLocaleString()}{" "}
                                                (
                                                {calculateDiscountRate().toFixed(
                                                    1,
                                                )}
                                                %)
                                            </span>
                                        </div>

                                        {/* 警告メッセージ */}
                                        {getDiscountWarning().message && (
                                            <div
                                                className={`text-xs font-semibold ${
                                                    getDiscountWarning()
                                                        .textColor
                                                } pt-2 border-t ${
                                                    getDiscountWarning()
                                                        .borderColor
                                                }`}
                                            >
                                                {getDiscountWarning().message}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {data.items.length === 0 && (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <p>アイテムを選択してください</p>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>

                {/* アクション */}
                <div className="flex items-center justify-end gap-4">
                    <SecondaryButton href={cancelRoute} disabled={processing}>
                        キャンセル
                    </SecondaryButton>
                    <StoreButton
                        type="submit"
                        processing={processing}
                        disabled={
                            processing ||
                            (exceedsBasePriceAlert && data.items.length > 0)
                        }
                    >
                        {mode === "edit" ? "更新" : "追加"}
                    </StoreButton>
                </div>
            </div>
        </form>
    );
};

export default ServicePlanItemForm;
