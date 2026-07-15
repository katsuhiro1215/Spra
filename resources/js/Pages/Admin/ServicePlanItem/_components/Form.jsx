import React, { useMemo, useState } from "react";
import { Card, CardTitle, CardHeader, CardBody } from "@/Components/Card";
import { StoreButton, SecondaryButton } from "@/Components/Buttons";
import {
    Bars2Icon,
    PlusIcon,
    TrashIcon,
    ArrowLongRightIcon,
    ArrowLongLeftIcon,
} from "@heroicons/react/24/outline";
import AlertMessage from "@/Components/AlertMessage";

const ITEM_TYPE_LABELS = {
    plan_base: "基本料金",
    included: "含まれる",
    optional: "オプション",
    addon: "アドオン",
};

const ITEM_TYPE_BADGE_CLASSES = {
    plan_base:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    included:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    optional:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    addon: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

const formatYen = (amount) => `¥${(Number(amount) || 0).toLocaleString()}`;

function ItemTypeBadge({ type }) {
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                ITEM_TYPE_BADGE_CLASSES[type] || ITEM_TYPE_BADGE_CLASSES.addon
            }`}
        >
            {ITEM_TYPE_LABELS[type] || type}
        </span>
    );
}

// 右カラム：追加可能なアイテムのカード（ドラッグ元）
function AvailableItemCard({ item, isDragging, onDragStart, onDragEnd, onAdd }) {
    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", item.id);
                onDragStart({ from: "available", item });
            }}
            onDragEnd={onDragEnd}
            className={`flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-grab active:cursor-grabbing hover:border-blue-400 dark:hover:border-blue-500 transition-colors ${
                isDragging ? "opacity-40" : ""
            }`}
        >
            <Bars2Icon className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {item.name}
                    </span>
                    <ItemTypeBadge type={item.item_type} />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {item.item_type === "included"
                        ? "¥0（プランに含まれる）"
                        : formatYen(item.standard_price)}
                </div>
            </div>
            <button
                type="button"
                draggable={false}
                onClick={() => onAdd(item)}
                className="flex-shrink-0 p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                title="追加"
            >
                <PlusIcon className="h-4 w-4" />
            </button>
        </div>
    );
}

// 左カラム：設定済みアイテムのカード（ドラッグ元）
function AssignedItemCard({
    item,
    index,
    isDragging,
    onDragStart,
    onDragEnd,
    onRemove,
    onQuantityChange,
}) {
    const lineTotal =
        item.item_type === "included"
            ? 0
            : (parseFloat(item.standard_price) || 0) * (item.quantity || 1);

    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", item.service_item_id);
                onDragStart({ from: "assigned", item });
            }}
            onDragEnd={onDragEnd}
            className={`flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-grab active:cursor-grabbing hover:border-blue-400 dark:hover:border-blue-500 transition-colors ${
                isDragging ? "opacity-40" : ""
            }`}
        >
            <Bars2Icon className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {item.name}
                    </span>
                    <ItemTypeBadge type={item.item_type} />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatYen(item.standard_price)}
                    {item.item_type !== "included" && item.quantity > 1
                        ? ` × ${item.quantity} = ${formatYen(lineTotal)}`
                        : ""}
                </div>
            </div>
            {item.item_type === "included" ? (
                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    数量 1（固定）
                </span>
            ) : (
                <input
                    type="number"
                    min="1"
                    draggable={false}
                    value={item.quantity || 1}
                    onChange={(e) => onQuantityChange(index, e.target.value)}
                    className="w-14 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center text-sm dark:bg-gray-700 dark:text-white flex-shrink-0"
                />
            )}
            <button
                type="button"
                draggable={false}
                onClick={() => onRemove(index)}
                className="flex-shrink-0 p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                title="削除"
            >
                <TrashIcon className="h-4 w-4" />
            </button>
        </div>
    );
}

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
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverZone, setDragOverZone] = useState(null);

    // servicePlan.service_id に属するアイテムのみを対象にする
    const scopedAvailableItems = useMemo(() => {
        if (!servicePlan?.service_id) return available_items;
        return available_items.filter(
            (item) => item.service_id === servicePlan.service_id,
        );
    }, [available_items, servicePlan?.service_id]);

    const assignedIds = useMemo(
        () => new Set(data.items.map((i) => i.service_item_id)),
        [data.items],
    );

    const remainingAvailableItems = scopedAvailableItems.filter(
        (item) => !assignedIds.has(item.id),
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    // 選択されたサービスアイテムの合計金額
    const calculateTotalItemsPrice = () => {
        return data.items.reduce((sum, item) => {
            if (item.item_type === "included") return sum;
            const price =
                (parseFloat(item.standard_price) || 0) * (item.quantity || 1);
            return sum + price;
        }, 0);
    };

    const addServiceItem = (item) => {
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

        if (assignedIds.has(item.id)) return;

        const newItem = {
            service_item_id: item.id,
            name: item.name,
            item_type: item.item_type,
            standard_price: item.standard_price,
            quantity: 1,
            estimated_days: 0,
            sort_order: data.items.length,
        };
        setData("items", [...data.items, newItem]);
    };

    const removeServiceItem = (index) => {
        setData(
            "items",
            data.items.filter((_, i) => i !== index),
        );
    };

    const updateServiceItemQuantity = (index, quantity) => {
        const item = data.items[index];
        const qty =
            item.item_type === "included"
                ? 1
                : Math.max(1, parseInt(quantity) || 1);
        setData(
            "items",
            data.items.map((it, i) =>
                i === index ? { ...it, quantity: qty } : it,
            ),
        );
    };

    // 割引額の計算（アイテム合計 - 基本料金、ゼロ以上）
    const calculateDiscountAmount = () => {
        const basePrice = parseFloat(servicePlan.base_price) || 0;
        const itemsPrice = calculateTotalItemsPrice();
        return Math.max(0, itemsPrice - basePrice);
    };

    const calculateDiscountRate = () => {
        const basePrice = parseFloat(servicePlan.base_price) || 0;
        if (basePrice === 0) return 0;
        return (calculateDiscountAmount() / basePrice) * 100;
    };

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

    // ネイティブ HTML5 Drag and Drop
    const handleItemDragStart = (payload) => {
        setDraggedItem(payload);
    };

    const handleItemDragEnd = () => {
        setDraggedItem(null);
        setDragOverZone(null);
    };

    const handleZoneDragOver = (e) => {
        // これを呼ばないと onDrop が発火しない
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleZoneDragEnter = (zone) => (e) => {
        e.preventDefault();
        setDragOverZone(zone);
    };

    const handleZoneDragLeave = (zone) => (e) => {
        // 子要素間の移動では離脱と判定しない
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setDragOverZone((prev) => (prev === zone ? null : prev));
    };

    const handleZoneDrop = (zone) => (e) => {
        e.preventDefault();
        setDragOverZone(null);

        if (!draggedItem) return;

        if (draggedItem.from === "available" && zone === "assigned") {
            addServiceItem(draggedItem.item);
        } else if (draggedItem.from === "assigned" && zone === "available") {
            const index = data.items.findIndex(
                (i) => i.service_item_id === draggedItem.item.service_item_id,
            );
            if (index !== -1) removeServiceItem(index);
        }

        setDraggedItem(null);
    };

    const itemCount = data.items.length;
    const discountWarning = getDiscountWarning();

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
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    プラン名
                                </div>
                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {servicePlan?.name || "---"}
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                                <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">
                                    基本料金
                                </div>
                                <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                    {formatYen(servicePlan?.base_price)}
                                </div>
                            </div>

                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                                <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">
                                    設定済みアイテム数
                                </div>
                                <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
                                    {itemCount}件
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* ドラッグ&ドロップでアイテムを設定 */}
                <Card>
                    <CardHeader>
                        <CardTitle>サービスアイテムの設定</CardTitle>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            右側の一覧からアイテムを左側にドラッグして追加、左側から右側にドラッグして削除できます。
                            （＋／ゴミ箱ボタンでも操作できます）
                        </p>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* 左：設定済みアイテム */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        設定済みアイテム
                                    </h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {itemCount}件 ・{" "}
                                        {formatYen(calculateTotalItemsPrice())}
                                    </span>
                                </div>
                                <div
                                    onDragOver={handleZoneDragOver}
                                    onDragEnter={handleZoneDragEnter(
                                        "assigned",
                                    )}
                                    onDragLeave={handleZoneDragLeave(
                                        "assigned",
                                    )}
                                    onDrop={handleZoneDrop("assigned")}
                                    className={`min-h-[240px] max-h-[480px] overflow-y-auto space-y-2 p-3 rounded-lg border-2 border-dashed transition-colors ${
                                        dragOverZone === "assigned"
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                            : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
                                    }`}
                                >
                                    {data.items.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full py-10 text-gray-400 dark:text-gray-500 text-sm gap-2">
                                            <ArrowLongLeftIcon className="h-6 w-6" />
                                            <p>
                                                右側からアイテムをドラッグしてください
                                            </p>
                                        </div>
                                    ) : (
                                        data.items.map((item, index) => (
                                            <AssignedItemCard
                                                key={item.service_item_id}
                                                item={item}
                                                index={index}
                                                isDragging={
                                                    draggedItem?.from ===
                                                        "assigned" &&
                                                    draggedItem.item
                                                        .service_item_id ===
                                                        item.service_item_id
                                                }
                                                onDragStart={
                                                    handleItemDragStart
                                                }
                                                onDragEnd={handleItemDragEnd}
                                                onRemove={removeServiceItem}
                                                onQuantityChange={
                                                    updateServiceItemQuantity
                                                }
                                            />
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* 右：利用可能なアイテム */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        利用可能なアイテム
                                    </h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                        {remainingAvailableItems.length}件
                                        <ArrowLongRightIcon className="h-4 w-4" />
                                    </span>
                                </div>
                                <div
                                    onDragOver={handleZoneDragOver}
                                    onDragEnter={handleZoneDragEnter(
                                        "available",
                                    )}
                                    onDragLeave={handleZoneDragLeave(
                                        "available",
                                    )}
                                    onDrop={handleZoneDrop("available")}
                                    className={`min-h-[240px] max-h-[480px] overflow-y-auto space-y-2 p-3 rounded-lg border-2 border-dashed transition-colors ${
                                        dragOverZone === "available"
                                            ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                                            : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
                                    }`}
                                >
                                    {remainingAvailableItems.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full py-10 text-gray-400 dark:text-gray-500 text-sm">
                                            <p>
                                                追加できるアイテムはありません
                                            </p>
                                        </div>
                                    ) : (
                                        remainingAvailableItems.map(
                                            (item) => (
                                                <AvailableItemCard
                                                    key={item.id}
                                                    item={item}
                                                    isDragging={
                                                        draggedItem?.from ===
                                                            "available" &&
                                                        draggedItem.item
                                                            .id === item.id
                                                    }
                                                    onDragStart={
                                                        handleItemDragStart
                                                    }
                                                    onDragEnd={
                                                        handleItemDragEnd
                                                    }
                                                    onAdd={addServiceItem}
                                                />
                                            ),
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 金額サマリー */}
                        <div className="border-t border-gray-200 dark:border-gray-600 mt-6 pt-4 space-y-3">
                            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
                                <span className="font-semibold text-blue-900 dark:text-blue-100">
                                    基本料金:
                                </span>
                                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    {formatYen(servicePlan?.base_price)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-700">
                                <span className="font-semibold text-purple-900 dark:text-purple-100">
                                    アイテム合計:
                                </span>
                                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                    {formatYen(calculateTotalItemsPrice())}
                                </span>
                            </div>

                            {calculateDiscountAmount() > 0 && (
                                <div
                                    className={`p-3 rounded border ${discountWarning.bgColor} ${discountWarning.borderColor}`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span
                                            className={`font-semibold ${discountWarning.textColor}`}
                                        >
                                            割引額:
                                        </span>
                                        <span
                                            className={`text-lg font-bold ${discountWarning.textColor}`}
                                        >
                                            {formatYen(
                                                calculateDiscountAmount(),
                                            )}{" "}
                                            (
                                            {calculateDiscountRate().toFixed(
                                                1,
                                            )}
                                            %)
                                        </span>
                                    </div>
                                    {discountWarning.message && (
                                        <div
                                            className={`text-xs font-semibold ${discountWarning.textColor} pt-2 border-t ${discountWarning.borderColor}`}
                                        >
                                            {discountWarning.message}
                                        </div>
                                    )}
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
