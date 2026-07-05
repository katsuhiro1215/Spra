import React, { useState, useEffect } from "react";
import { Card, CardTitle, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    NumberInput,
    ColorInput,
    Checkbox,
} from "@/Components/Forms";
import { StoreButton, SecondaryButton } from "@/Components/Buttons";
import AlertMessage from "@/Components/AlertMessage";

const ServicePlanForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    statuses,
    billingCycles,
    services,
    available_items = [],
    mode = "create",
}) => {
    const [autoSlug, setAutoSlug] = useState(mode === "create");
    const [exceedsBasePriceAlert, setExceedsBasePriceAlert] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);

    // サービスが選択されたときにアイテムをフィルタリング
    useEffect(() => {
        if (data.service_id) {
            const filtered = available_items.filter(
                (item) => item.service_id === data.service_id,
            );
            setFilteredItems(filtered);
        } else {
            setFilteredItems([]);
        }
    }, [data.service_id, available_items]);

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim("-");
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setData("name", name);

        if (autoSlug) {
            setData("slug", generateSlug(name));
        }
    };

    const handleSlugChange = (e) => {
        setData("slug", e.target.value);
        setAutoSlug(false);
    };

    const handleAutoGenerateSlug = () => {
        setAutoSlug(true);
        setData("slug", generateSlug(data.name));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    // Service Items 管理用ヘルパー関数
    const addServiceItem = (item) => {
        console.log("Added item:", item); // デバッグ出力
        // 割引額チェック：割引額が基本料金を超える場合は追加不可
        const basePrice = parseFloat(data.base_price) || 0;
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
        const existingItem = data.service_items.find((si) => si.id === item.id);
        if (existingItem) {
            // included は複数追加不可
            if (item.item_type === "included") {
                alert("このアイテムは既に追加されており、複数選択できません。");
                return;
            }

            // 既に存在する場合は quantity を増加
            setData(
                "service_items",
                data.service_items.map((si) =>
                    si.id === item.id
                        ? { ...si, quantity: (si.quantity || 1) + 1 }
                        : si,
                ),
            );
        } else {
            // 新規追加の場合は quantity: 1 で追加
            const newItem = { ...item, quantity: 1 };
            console.log("New item to add:", newItem); // デバッグ出力
            setData("service_items", [...data.service_items, newItem]);
        }
    };

    const removeServiceItem = (itemId, index) => {
        setData(
            "service_items",
            data.service_items.filter((_, i) => i !== index),
        );
    };

    const updateServiceItemQuantity = (index, quantity) => {
        const item = data.service_items[index];
        // included は数量を 1 に固定
        const qty =
            item.item_type === "included"
                ? 1
                : Math.max(1, parseInt(quantity) || 1);
        setData(
            "service_items",
            data.service_items.map((item, i) =>
                i === index ? { ...item, quantity: qty } : item,
            ),
        );
    };

    // 選択されたサービスアイテムの合計金額
    const calculateTotalItemsPrice = () => {
        const total = data.service_items.reduce((sum, item) => {
            // included は価格を 0 にする
            if (item.item_type === "included") {
                console.log("Included item (0円):", item.name);
                return sum;
            }
            const price =
                (parseFloat(item.standard_price) || 0) * (item.quantity || 1);
            console.log(`Item "${item.name}" (${item.item_type}): ¥${price}`);
            return sum + price;
        }, 0);
        console.log("Total items price:", total); // デバッグ出力
        return total;
    };

    // 割引額の計算（アイテム合計 - 基本料金、ゼロ以上）
    const calculateDiscountAmount = () => {
        const basePrice = parseFloat(data.base_price) || 0;
        const itemsPrice = calculateTotalItemsPrice();
        return Math.max(0, itemsPrice - basePrice);
    };

    // 割引率の計算
    const calculateDiscountRate = () => {
        const basePrice = parseFloat(data.base_price) || 0;
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

    // service_items または base_price が変更されるたびに、割引額を自動計算して更新
    useEffect(() => {
        const discountAmount = calculateDiscountAmount();
        // 前回の割引額と異なる場合のみ更新（無限ループ防止）
        if (data.discount_amount !== discountAmount) {
            setData("discount_amount", discountAmount);
        }
    }, [data.service_items, data.base_price, data.discount_amount]);

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>基本情報</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* プラン名 */}
                                        <FormGroup
                                            label="プラン名"
                                            required
                                            error={errors.name}
                                        >
                                            <TextInput
                                                value={data.name}
                                                onChange={handleNameChange}
                                                placeholder="例: スタンダードプラン"
                                            />
                                        </FormGroup>

                                        {/* スラッグ */}
                                        <FormGroup
                                            label="スラッグ"
                                            error={errors.slug}
                                        >
                                            <div className="flex gap-2">
                                                <TextInput
                                                    value={data.slug}
                                                    onChange={handleSlugChange}
                                                    placeholder="例: standard-plan"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleAutoGenerateSlug
                                                    }
                                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 whitespace-nowrap"
                                                >
                                                    自動生成
                                                </button>
                                            </div>
                                        </FormGroup>

                                        {/* サービス選択 */}
                                        <FormGroup
                                            label="サービス"
                                            required
                                            error={errors.service_id}
                                        >
                                            <SelectInput
                                                value={data.service_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "service_id",
                                                        e.target.value,
                                                    )
                                                }
                                                options={services.map(
                                                    (service) => ({
                                                        value: service.id,
                                                        label: service.name,
                                                    }),
                                                )}
                                            >
                                                <option value="">
                                                    選択してください
                                                </option>
                                            </SelectInput>
                                        </FormGroup>

                                        {/* ステータス */}
                                        <FormGroup
                                            label="ステータス"
                                            required
                                            error={errors.status}
                                        >
                                            <SelectInput
                                                value={data.status}
                                                onChange={(e) =>
                                                    setData(
                                                        "status",
                                                        e.target.value,
                                                    )
                                                }
                                                options={statuses.map(
                                                    (status) => ({
                                                        value: status.value,
                                                        label: status.label,
                                                    }),
                                                )}
                                            />
                                        </FormGroup>
                                    </div>
                                    {/* 説明 */}
                                    <FormGroup
                                        label="説明"
                                        error={errors.description}
                                    >
                                        <TextArea
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                            placeholder="プランの簡潔な説明"
                                        />
                                    </FormGroup>
                                    {/* 詳細説明 */}
                                    <FormGroup
                                        label="詳細説明"
                                        error={errors.details}
                                    >
                                        <TextArea
                                            value={data.details}
                                            onChange={(e) =>
                                                setData(
                                                    "details",
                                                    e.target.value,
                                                )
                                            }
                                            rows={5}
                                            placeholder="プランの詳細な説明"
                                        />
                                    </FormGroup>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>料金設定</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* 基本料金 */}
                                    <FormGroup
                                        label="基本料金 (円)"
                                        required
                                        error={errors.base_price}
                                    >
                                        <NumberInput
                                            value={data.base_price}
                                            onChange={(value) =>
                                                setData("base_price", value)
                                            }
                                            min={0}
                                            step={1000}
                                            placeholder="100000"
                                        />
                                    </FormGroup>

                                    {/* 割引額 */}
                                    <FormGroup
                                        label="割引額 (円)"
                                        error={errors.discount_amount}
                                    >
                                        <NumberInput
                                            value={data.discount_amount}
                                            disabled
                                        />
                                    </FormGroup>

                                    {/* 請求サイクル */}
                                    <FormGroup
                                        label="請求サイクル"
                                        required
                                        error={errors.billing_cycle}
                                    >
                                        <SelectInput
                                            value={data.billing_cycle}
                                            onChange={(e) =>
                                                setData(
                                                    "billing_cycle",
                                                    e.target.value,
                                                )
                                            }
                                            options={billingCycles.map(
                                                (cycle) => ({
                                                    value: cycle.value,
                                                    label: cycle.label,
                                                }),
                                            )}
                                        />
                                    </FormGroup>

                                    {/* 初期費用 */}
                                    <FormGroup
                                        label="初期費用 (円)"
                                        error={errors.setup_fee}
                                    >
                                        <NumberInput
                                            value={data.setup_fee}
                                            onChange={(value) =>
                                                setData("setup_fee", value)
                                            }
                                            min={0}
                                            step={1000}
                                            placeholder="0"
                                        />
                                    </FormGroup>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>プラン詳細</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* 最大修正回数 */}
                                    <FormGroup
                                        label="最大修正回数"
                                        error={errors.max_revisions}
                                    >
                                        <NumberInput
                                            value={data.max_revisions}
                                            onChange={(value) =>
                                                setData("max_revisions", value)
                                            }
                                            min={0}
                                            step={1}
                                            placeholder="3"
                                        />
                                    </FormGroup>

                                    {/* 納期目安 */}
                                    <FormGroup
                                        label="納期目安 (日)"
                                        error={errors.estimated_delivery_days}
                                    >
                                        <NumberInput
                                            value={data.estimated_delivery_days}
                                            onChange={(value) =>
                                                setData(
                                                    "estimated_delivery_days",
                                                    value,
                                                )
                                            }
                                            min={0}
                                            step={1}
                                            placeholder="30"
                                        />
                                    </FormGroup>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>表示設定</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* 表示順 */}
                                    <FormGroup
                                        label="表示順"
                                        error={errors.sort_order}
                                    >
                                        <NumberInput
                                            value={data.sort_order}
                                            onChange={(value) =>
                                                setData("sort_order", value)
                                            }
                                            min={0}
                                            step={1}
                                            placeholder="0"
                                        />
                                    </FormGroup>

                                    {/* 注目プラン */}
                                    <div>
                                        <label className="flex items-center mt-6">
                                            <Checkbox
                                                checked={data.is_featured}
                                                onChange={(e) =>
                                                    setData(
                                                        "is_featured",
                                                        e.target.checked,
                                                    )
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                注目プラン
                                            </span>
                                        </label>
                                    </div>

                                    {/* カラー */}
                                    <FormGroup
                                        label="カラー"
                                        error={errors.color}
                                    >
                                        <ColorInput
                                            value={data.color}
                                            onChange={(color) =>
                                                setData("color", color)
                                            }
                                        />
                                    </FormGroup>

                                    {/* バッジテキスト */}
                                    <FormGroup
                                        label="バッジテキスト"
                                        error={errors.badge_text}
                                    >
                                        <TextInput
                                            value={data.badge_text}
                                            onChange={(e) =>
                                                setData(
                                                    "badge_text",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="おすすめ"
                                        />
                                    </FormGroup>

                                    {/* アイコン */}
                                    <FormGroup
                                        label="アイコン"
                                        error={errors.icon}
                                    >
                                        <TextInput
                                            value={data.icon}
                                            onChange={(e) =>
                                                setData("icon", e.target.value)
                                            }
                                            placeholder="例: RocketLaunchIcon"
                                        />
                                    </FormGroup>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    {/* ServiceItemを並べてリレーション */}
                    <Card>
                        <CardHeader>
                            <CardTitle>サービスアイテム</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                {/* サービスアイテム選択セレクト */}
                                <FormGroup label="アイテムを追加">
                                    <select
                                        disabled={!data.service_id}
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                const item = filteredItems.find(
                                                    (i) =>
                                                        i.id === e.target.value,
                                                );
                                                if (item) {
                                                    addServiceItem(item);
                                                    e.target.value = "";
                                                }
                                            }
                                        }}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                                    >
                                        <option value="">
                                            {data.service_id
                                                ? "+ アイテムを選択"
                                                : "サービスを先に選択してください"}
                                        </option>
                                        {filteredItems.map((item) => {
                                            let typeLabel = "";
                                            if (item.item_type === "included") {
                                                typeLabel = "[含]";
                                            } else if (
                                                item.item_type === "optional"
                                            ) {
                                                typeLabel = "[opt]";
                                            } else if (
                                                item.item_type === "addon"
                                            ) {
                                                typeLabel = "[add]";
                                            }
                                            return (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {typeLabel} {item.name} - ¥
                                                    {item.item_type ===
                                                    "included"
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
                                {data.service_items.length > 0 && (
                                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 dark:bg-gray-700 dark:text-white px-4 py-2 grid grid-cols-4 gap-4 text-sm font-semibold">
                                            <div>項目名</div>
                                            <div className="text-center">
                                                数量
                                            </div>
                                            <div className="text-right">
                                                金額
                                            </div>
                                            <div className="text-right">
                                                アクション
                                            </div>
                                        </div>
                                        {data.service_items.map(
                                            (item, index) => (
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
                                                                <span className="text-gray-500">
                                                                    {
                                                                        item.item_type
                                                                    }
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
                                                                    item.quantity ||
                                                                    1
                                                                }
                                                                onChange={(e) =>
                                                                    updateServiceItemQuantity(
                                                                        index,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-12 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center text-sm dark:bg-gray-700 dark:text-white"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="text-right text-sm">
                                                        ¥
                                                        {item.item_type ===
                                                        "included"
                                                            ? "0"
                                                            : (
                                                                  parseFloat(
                                                                      item.standard_price,
                                                                  ) *
                                                                  (item.quantity ||
                                                                      1)
                                                              ).toLocaleString()}
                                                    </div>
                                                    <div className="text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeServiceItem(
                                                                    item.id,
                                                                    index,
                                                                )
                                                            }
                                                            className="px-2 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
                                                        >
                                                            削除
                                                        </button>
                                                    </div>
                                                </div>
                                            ),
                                        )}
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
                                                data.base_price || 0,
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
                                            } ${
                                                getDiscountWarning().borderColor
                                            }`}
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
                                                    {
                                                        getDiscountWarning()
                                                            .message
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {data.service_items.length === 0 && (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <p>アイテムを選択してください</p>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
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
                            (exceedsBasePriceAlert &&
                                data.service_items.length > 0)
                        }
                    >
                        {mode === "edit" ? "更新" : "作成"}
                    </StoreButton>
                </div>
            </div>
        </form>
    );
};

export default ServicePlanForm;
