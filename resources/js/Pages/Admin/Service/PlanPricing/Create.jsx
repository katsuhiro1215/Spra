import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import {
    ArrowLeftIcon,
    PlusIcon,
    MinusIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function PlanPricingCreate({ servicePlan }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        type: "base",
        description: "",
        price: "",
        price_unit: "",
        billing_type: "fixed",
        min_quantity: "",
        max_quantity: "",
        tier_rules: [],
        tier_start_quantity: "",
        tier_end_quantity: "",
        discount_percentage: "",
        discount_amount: "",
        discount_start_date: "",
        discount_end_date: "",
        conditions: [],
        requires_approval: false,
        approval_notes: "",
        is_default: false,
        is_negotiable: false,
        is_recurring: false,
        recurring_months: "",
        is_visible: true,
        is_featured: false,
        sort_order: 0,
        display_name: "",
        is_active: true,
        effective_from: "",
        effective_until: "",
        notes: "",
    });

    const [conditionInput, setConditionInput] = useState("");
    const [tierRule, setTierRule] = useState({
        min_quantity: "",
        max_quantity: "",
        price: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(
            route("admin.service.plans.pricing.store", [
                servicePlan.service_type.id,
                servicePlan.id,
            ])
        );
    };

    // 条件追加
    const addCondition = () => {
        if (conditionInput.trim()) {
            setData("conditions", [...data.conditions, conditionInput.trim()]);
            setConditionInput("");
        }
    };

    // 条件削除
    const removeCondition = (index) => {
        setData(
            "conditions",
            data.conditions.filter((_, i) => i !== index)
        );
    };

    // 段階料金ルール追加
    const addTierRule = () => {
        if (tierRule.min_quantity && tierRule.price) {
            setData("tier_rules", [...data.tier_rules, { ...tierRule }]);
            setTierRule({ min_quantity: "", max_quantity: "", price: "" });
        }
    };

    // 段階料金ルール削除
    const removeTierRule = (index) => {
        setData(
            "tier_rules",
            data.tier_rules.filter((_, i) => i !== index)
        );
    };

    return (
        <AdminLayout>
            <Head title={`価格設定作成 - ${servicePlan.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FlashMessage />

                    <PageHeader
                        title="価格設定作成"
                        description={`プラン: ${servicePlan.name} (${servicePlan.service_type?.name})`}
                        actions={[
                            {
                                label: "価格設定一覧に戻る",
                                href: route(
                                    "admin.service.plans.pricing.index",
                                    [
                                        servicePlan.service_type.id,
                                        servicePlan.id,
                                    ]
                                ),
                                variant: "secondary",
                                icon: ArrowLeftIcon,
                            },
                        ]}
                    />

                    <form onSubmit={submit} className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* メインフォーム */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* 基本情報 */}
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            基本情報
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    価格設定名 *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="例: 基本料金"
                                                    required
                                                />
                                                {errors.name && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    表示名
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.display_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            "display_name",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="空の場合は価格設定名を使用"
                                                />
                                                {errors.display_name && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.display_name}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    価格タイプ *
                                                </label>
                                                <select
                                                    value={data.type}
                                                    onChange={(e) =>
                                                        setData(
                                                            "type",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="base">
                                                        基本価格
                                                    </option>
                                                    <option value="addon">
                                                        追加オプション
                                                    </option>
                                                    <option value="discount">
                                                        割引価格
                                                    </option>
                                                    <option value="tier">
                                                        段階料金
                                                    </option>
                                                </select>
                                                {errors.type && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.type}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    課金タイプ *
                                                </label>
                                                <select
                                                    value={data.billing_type}
                                                    onChange={(e) =>
                                                        setData(
                                                            "billing_type",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="fixed">
                                                        固定料金
                                                    </option>
                                                    <option value="per_unit">
                                                        単位料金
                                                    </option>
                                                    <option value="tiered">
                                                        段階料金
                                                    </option>
                                                    <option value="volume">
                                                        ボリューム料金
                                                    </option>
                                                </select>
                                                {errors.billing_type && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.billing_type}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                説明
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData(
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                rows={3}
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="価格設定の詳細説明"
                                            />
                                            {errors.description && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 価格設定 */}
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            価格設定
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    価格 *
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2 text-gray-500">
                                                        ¥
                                                    </span>
                                                    <input
                                                        type="number"
                                                        value={data.price}
                                                        onChange={(e) =>
                                                            setData(
                                                                "price",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="block w-full pl-8 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="0"
                                                        min="0"
                                                        step="0.01"
                                                        required
                                                    />
                                                </div>
                                                {errors.price && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.price}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    価格単位
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.price_unit}
                                                    onChange={(e) =>
                                                        setData(
                                                            "price_unit",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="例: 月、時間、件"
                                                />
                                                {errors.price_unit && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.price_unit}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    表示順序
                                                </label>
                                                <input
                                                    type="number"
                                                    value={data.sort_order}
                                                    onChange={(e) =>
                                                        setData(
                                                            "sort_order",
                                                            parseInt(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    min="0"
                                                />
                                                {errors.sort_order && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.sort_order}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* 数量制限 */}
                                        <div className="mt-4">
                                            <h4 className="text-md font-medium text-gray-900 mb-2">
                                                数量制限
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        最小数量
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={
                                                            data.min_quantity
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "min_quantity",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                    {errors.min_quantity && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {
                                                                errors.min_quantity
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        最大数量
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={
                                                            data.max_quantity
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "max_quantity",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                    {errors.max_quantity && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {
                                                                errors.max_quantity
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 段階料金ルール */}
                                {(data.billing_type === "tiered" ||
                                    data.billing_type === "volume") && (
                                    <div className="bg-white shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                段階料金ルール
                                            </h3>

                                            {/* 既存ルール */}
                                            {data.tier_rules.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                                                            設定済みルール
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {data.tier_rules.map(
                                                                (
                                                                    rule,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="flex items-center justify-between bg-white p-3 rounded border"
                                                                    >
                                                                        <span className="text-sm">
                                                                            {
                                                                                rule.min_quantity
                                                                            }
                                                                            〜
                                                                            {rule.max_quantity ||
                                                                                "∞"}
                                                                            : ¥
                                                                            {Number(
                                                                                rule.price
                                                                            ).toLocaleString()}
                                                                        </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                removeTierRule(
                                                                                    index
                                                                                )
                                                                            }
                                                                            className="text-red-600 hover:text-red-900"
                                                                        >
                                                                            <MinusIcon className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 新規ルール追加 */}
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                                    新しいルールを追加
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            最小数量 *
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={
                                                                tierRule.min_quantity
                                                            }
                                                            onChange={(e) =>
                                                                setTierRule({
                                                                    ...tierRule,
                                                                    min_quantity:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            最大数量
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={
                                                                tierRule.max_quantity
                                                            }
                                                            onChange={(e) =>
                                                                setTierRule({
                                                                    ...tierRule,
                                                                    max_quantity:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                            min="0"
                                                            step="0.01"
                                                            placeholder="空の場合は無制限"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            価格 *
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={
                                                                tierRule.price
                                                            }
                                                            onChange={(e) =>
                                                                setTierRule({
                                                                    ...tierRule,
                                                                    price: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </div>

                                                    <div className="flex items-end">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                addTierRule
                                                            }
                                                            className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            <PlusIcon className="w-4 h-4 mr-1" />
                                                            追加
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 割引設定 */}
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            割引設定
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    割引率 (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={
                                                        data.discount_percentage
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "discount_percentage",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                />
                                                {errors.discount_percentage && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors.discount_percentage
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    割引額 (¥)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={data.discount_amount}
                                                    onChange={(e) =>
                                                        setData(
                                                            "discount_amount",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    min="0"
                                                    step="0.01"
                                                />
                                                {errors.discount_amount && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.discount_amount}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    割引開始日
                                                </label>
                                                <input
                                                    type="date"
                                                    value={
                                                        data.discount_start_date
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "discount_start_date",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                {errors.discount_start_date && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors.discount_start_date
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    割引終了日
                                                </label>
                                                <input
                                                    type="date"
                                                    value={
                                                        data.discount_end_date
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "discount_end_date",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                {errors.discount_end_date && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors.discount_end_date
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                                            <div className="flex">
                                                <InformationCircleIcon className="h-5 w-5 text-yellow-400" />
                                                <div className="ml-3">
                                                    <p className="text-sm text-yellow-700">
                                                        割引率と割引額の両方が設定されている場合は、割引率が優先されます。
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 条件設定 */}
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            適用条件
                                        </h3>

                                        {/* 既存条件 */}
                                        {data.conditions.length > 0 && (
                                            <div className="mb-4">
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                                                        設定済み条件
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {data.conditions.map(
                                                            (
                                                                condition,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center justify-between bg-white p-3 rounded border"
                                                                >
                                                                    <span className="text-sm">
                                                                        {
                                                                            condition
                                                                        }
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeCondition(
                                                                                index
                                                                            )
                                                                        }
                                                                        className="text-red-600 hover:text-red-900"
                                                                    >
                                                                        <MinusIcon className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 新しい条件追加 */}
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                                                新しい条件を追加
                                            </h4>
                                            <div className="flex gap-4">
                                                <input
                                                    type="text"
                                                    value={conditionInput}
                                                    onChange={(e) =>
                                                        setConditionInput(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="例: 最小契約期間12ヶ月"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            addCondition();
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addCondition}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <PlusIcon className="w-4 h-4 mr-1" />
                                                    追加
                                                </button>
                                            </div>
                                        </div>

                                        {/* 承認設定 */}
                                        <div className="mt-6">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        data.requires_approval
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "requires_approval",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label className="ml-2 block text-sm text-gray-700">
                                                    この価格設定の適用には承認が必要
                                                </label>
                                            </div>

                                            {data.requires_approval && (
                                                <div className="mt-3">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        承認に関する備考
                                                    </label>
                                                    <textarea
                                                        value={
                                                            data.approval_notes
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "approval_notes",
                                                                e.target.value
                                                            )
                                                        }
                                                        rows={3}
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="承認プロセスや条件について"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 有効期間 */}
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            有効期間
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    有効開始日時
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    value={data.effective_from}
                                                    onChange={(e) =>
                                                        setData(
                                                            "effective_from",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                {errors.effective_from && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.effective_from}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    有効終了日時
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    value={data.effective_until}
                                                    onChange={(e) =>
                                                        setData(
                                                            "effective_until",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                {errors.effective_until && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.effective_until}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                            <div className="flex">
                                                <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                                                <div className="ml-3">
                                                    <p className="text-sm text-blue-700">
                                                        有効期間を設定しない場合は、常に有効な価格設定となります。
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 管理用メモ */}
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            管理用メモ
                                        </h3>

                                        <textarea
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData("notes", e.target.value)
                                            }
                                            rows={4}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="内部用のメモや備考"
                                        />
                                        {errors.notes && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* サイドバー - 設定 */}
                            <div className="space-y-6">
                                {/* ステータス設定 */}
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            ステータス設定
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.is_active}
                                                    onChange={(e) =>
                                                        setData(
                                                            "is_active",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label className="ml-2 block text-sm text-gray-700">
                                                    アクティブ
                                                </label>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.is_visible}
                                                    onChange={(e) =>
                                                        setData(
                                                            "is_visible",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label className="ml-2 block text-sm text-gray-700">
                                                    顧客に表示
                                                </label>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.is_default}
                                                    onChange={(e) =>
                                                        setData(
                                                            "is_default",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label className="ml-2 block text-sm text-gray-700">
                                                    デフォルト価格設定
                                                </label>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.is_featured}
                                                    onChange={(e) =>
                                                        setData(
                                                            "is_featured",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label className="ml-2 block text-sm text-gray-700">
                                                    注目設定
                                                </label>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.is_negotiable}
                                                    onChange={(e) =>
                                                        setData(
                                                            "is_negotiable",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label className="ml-2 block text-sm text-gray-700">
                                                    価格交渉可能
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 定期課金設定 */}
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            定期課金設定
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.is_recurring}
                                                    onChange={(e) =>
                                                        setData(
                                                            "is_recurring",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label className="ml-2 block text-sm text-gray-700">
                                                    定期課金
                                                </label>
                                            </div>

                                            {data.is_recurring && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        課金周期（月）
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={
                                                            data.recurring_months
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "recurring_months",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        min="1"
                                                    />
                                                    {errors.recurring_months && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {
                                                                errors.recurring_months
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 保存ボタン */}
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? (
                                                <>
                                                    <svg
                                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    作成中...
                                                </>
                                            ) : (
                                                "価格設定を作成"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
