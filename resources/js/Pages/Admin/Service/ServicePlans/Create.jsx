import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import ValidatedInput from "@/Components/Forms/ValidatedInput";
import {
    ArrowLeftIcon,
    PlusIcon,
    TrashIcon,
    SwatchIcon,
    CurrencyYenIcon,
} from "@heroicons/react/24/outline";

export default function Create({ serviceType, billingCycles }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        slug: "",
        description: "",
        detailed_description: "",
        base_price: "",
        price_unit: "",
        billing_cycle: "one_time",
        setup_fee: "",
        features: [""],
        included_items: [""],
        limitations: [""],
        max_revisions: "",
        estimated_delivery_days: "",
        is_popular: false,
        is_recommended: false,
        sort_order: "",
        color: "#3B82F6",
        badge_text: "",
        icon: "",
    });

    const headerActions = [
        {
            label: "戻る",
            href: route("admin.service.plans.index", serviceType.id),
            variant: "secondary",
            icon: ArrowLeftIcon,
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.service.plans.store", serviceType.id));
    };

    const addArrayItem = (field) => {
        setData(field, [...data[field], ""]);
    };

    const removeArrayItem = (field, index) => {
        setData(
            field,
            data[field].filter((_, i) => i !== index)
        );
    };

    const updateArrayItem = (field, index, value) => {
        const newArray = [...data[field]];
        newArray[index] = value;
        setData(field, newArray);
    };

    return (
        <AdminLayout>
            <Head title={`サービスプラン作成 - ${serviceType.name}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FlashMessage />

                    <PageHeader
                        title="サービスプラン作成"
                        description={`${serviceType.name}の新しいプランを作成します`}
                        actions={headerActions}
                    />

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        {/* 基本情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <SwatchIcon className="w-5 h-5 mr-2" />
                                    基本情報
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ValidatedInput
                                        label="プラン名"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        error={errors.name}
                                        required
                                        placeholder="例: ベーシック、スタンダード"
                                    />

                                    <ValidatedInput
                                        label="スラッグ"
                                        name="slug"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData("slug", e.target.value)
                                        }
                                        error={errors.slug}
                                        placeholder="例: basic, standard（自動生成）"
                                        helpText="未入力の場合、プラン名から自動生成されます"
                                    />
                                </div>

                                <div className="mt-4">
                                    <ValidatedInput
                                        label="プラン説明"
                                        name="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        error={errors.description}
                                        required
                                        placeholder="このプランの簡潔な説明"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        詳細説明
                                    </label>
                                    <textarea
                                        value={data.detailed_description}
                                        onChange={(e) =>
                                            setData(
                                                "detailed_description",
                                                e.target.value
                                            )
                                        }
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="プランの詳細な説明..."
                                    />
                                    {errors.detailed_description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.detailed_description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 価格設定 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <CurrencyYenIcon className="w-5 h-5 mr-2" />
                                    価格設定
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <ValidatedInput
                                        label="基本価格"
                                        name="base_price"
                                        type="number"
                                        value={data.base_price}
                                        onChange={(e) =>
                                            setData(
                                                "base_price",
                                                e.target.value
                                            )
                                        }
                                        error={errors.base_price}
                                        required
                                        min="0"
                                        step="1000"
                                        placeholder="300000"
                                    />

                                    <ValidatedInput
                                        label="価格単位"
                                        name="price_unit"
                                        value={data.price_unit}
                                        onChange={(e) =>
                                            setData(
                                                "price_unit",
                                                e.target.value
                                            )
                                        }
                                        error={errors.price_unit}
                                        placeholder="例: 式、月、時間"
                                    />

                                    <ValidatedInput
                                        label="初期費用"
                                        name="setup_fee"
                                        type="number"
                                        value={data.setup_fee}
                                        onChange={(e) =>
                                            setData("setup_fee", e.target.value)
                                        }
                                        error={errors.setup_fee}
                                        min="0"
                                        step="1000"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            請求サイクル{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            value={data.billing_cycle}
                                            onChange={(e) =>
                                                setData(
                                                    "billing_cycle",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {Object.entries(billingCycles).map(
                                                ([key, label]) => (
                                                    <option
                                                        key={key}
                                                        value={key}
                                                    >
                                                        {label}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                        {errors.billing_cycle && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.billing_cycle}
                                            </p>
                                        )}
                                    </div>

                                    <ValidatedInput
                                        label="最大修正回数"
                                        name="max_revisions"
                                        type="number"
                                        value={data.max_revisions}
                                        onChange={(e) =>
                                            setData(
                                                "max_revisions",
                                                e.target.value
                                            )
                                        }
                                        error={errors.max_revisions}
                                        min="0"
                                        placeholder="3"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* プラン詳細 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    プラン詳細
                                </h3>

                                {/* 機能・特徴 */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            機能・特徴
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                addArrayItem("features")
                                            }
                                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                                        >
                                            <PlusIcon className="h-3 w-3 mr-1" />
                                            追加
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {data.features.map((feature, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-2"
                                            >
                                                <input
                                                    type="text"
                                                    value={feature}
                                                    onChange={(e) =>
                                                        updateArrayItem(
                                                            "features",
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="例: レスポンシブデザイン"
                                                />
                                                {data.features.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeArrayItem(
                                                                "features",
                                                                index
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 含まれる項目 */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            含まれる項目
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                addArrayItem("included_items")
                                            }
                                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                                        >
                                            <PlusIcon className="h-3 w-3 mr-1" />
                                            追加
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {data.included_items.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <input
                                                        type="text"
                                                        value={item}
                                                        onChange={(e) =>
                                                            updateArrayItem(
                                                                "included_items",
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="例: デザイン設計"
                                                    />
                                                    {data.included_items
                                                        .length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeArrayItem(
                                                                    "included_items",
                                                                    index
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* 制限事項 */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            制限事項
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                addArrayItem("limitations")
                                            }
                                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                                        >
                                            <PlusIcon className="h-3 w-3 mr-1" />
                                            追加
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {data.limitations.map(
                                            (limitation, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <input
                                                        type="text"
                                                        value={limitation}
                                                        onChange={(e) =>
                                                            updateArrayItem(
                                                                "limitations",
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="例: ページ数上限: 5ページ"
                                                    />
                                                    {data.limitations.length >
                                                        1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeArrayItem(
                                                                    "limitations",
                                                                    index
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* その他設定 */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <ValidatedInput
                                        label="標準納期（日数）"
                                        name="estimated_delivery_days"
                                        type="number"
                                        value={data.estimated_delivery_days}
                                        onChange={(e) =>
                                            setData(
                                                "estimated_delivery_days",
                                                e.target.value
                                            )
                                        }
                                        error={errors.estimated_delivery_days}
                                        min="0"
                                        placeholder="14"
                                    />

                                    <ValidatedInput
                                        label="表示順序"
                                        name="sort_order"
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) =>
                                            setData(
                                                "sort_order",
                                                e.target.value
                                            )
                                        }
                                        error={errors.sort_order}
                                        min="0"
                                        placeholder="1"
                                    />

                                    <ValidatedInput
                                        label="バッジテキスト"
                                        name="badge_text"
                                        value={data.badge_text}
                                        onChange={(e) =>
                                            setData(
                                                "badge_text",
                                                e.target.value
                                            )
                                        }
                                        error={errors.badge_text}
                                        placeholder="例: 人気、推奨"
                                    />
                                </div>

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            プラン色
                                        </label>
                                        <input
                                            type="color"
                                            value={data.color}
                                            onChange={(e) =>
                                                setData("color", e.target.value)
                                            }
                                            className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.color && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.color}
                                            </p>
                                        )}
                                    </div>

                                    <ValidatedInput
                                        label="アイコン"
                                        name="icon"
                                        value={data.icon}
                                        onChange={(e) =>
                                            setData("icon", e.target.value)
                                        }
                                        error={errors.icon}
                                        placeholder="例: star, check-circle"
                                    />
                                </div>

                                {/* チェックボックス */}
                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_popular"
                                            checked={data.is_popular}
                                            onChange={(e) =>
                                                setData(
                                                    "is_popular",
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor="is_popular"
                                            className="ml-2 text-sm text-gray-700"
                                        >
                                            人気プランとして表示
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_recommended"
                                            checked={data.is_recommended}
                                            onChange={(e) =>
                                                setData(
                                                    "is_recommended",
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor="is_recommended"
                                            className="ml-2 text-sm text-gray-700"
                                        >
                                            推奨プランとして表示
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 送信ボタン */}
                        <div className="flex items-center justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? "作成中..." : "プラン作成"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
