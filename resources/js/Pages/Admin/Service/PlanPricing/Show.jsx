import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
    StarIcon,
    CurrencyYenIcon,
    ClockIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    EyeIcon,
    EyeSlashIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function PlanPricingShow({ servicePlan, planPricing }) {
    const handleDelete = () => {
        if (
            confirm(
                `「${planPricing.name}」を削除しますか？この操作は取り消せません。`
            )
        ) {
            router.delete(
                route("admin.service.plans.pricing.destroy", [
                    servicePlan.id,
                    planPricing.id,
                ]),
                {
                    onSuccess: () =>
                        router.get(
                            route("admin.service.plans.pricing.index", [
                                servicePlan.service_type.id,
                                servicePlan.id,
                            ])
                        ),
                }
            );
        }
    };

    const toggleActive = () => {
        router.patch(
            route("admin.service.plans.pricing.toggle-active", [
                servicePlan.id,
                planPricing.id,
            ]),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const setDefault = () => {
        router.patch(
            route("admin.service.plans.pricing.set-default", [
                servicePlan.id,
                planPricing.id,
            ]),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("ja-JP");
    };

    const formatPrice = (price, unit) => {
        if (!price) return "要相談";
        return `¥${Number(price).toLocaleString()}${unit ? ` / ${unit}` : ""}`;
    };

    // ステータスバッジ
    const getStatusBadge = () => {
        if (!planPricing.is_active) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <XCircleIcon className="w-4 h-4 mr-1" />
                    非アクティブ
                </span>
            );
        }
        if (planPricing.is_default) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <StarIcon className="w-4 h-4 mr-1" />
                    デフォルト
                </span>
            );
        }
        if (planPricing.is_featured) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <StarIcon className="w-4 h-4 mr-1" />
                    注目設定
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                アクティブ
            </span>
        );
    };

    // タイプバッジ
    const getTypeBadge = (type) => {
        const badges = {
            base: "bg-blue-100 text-blue-800",
            addon: "bg-purple-100 text-purple-800",
            discount: "bg-red-100 text-red-800",
            tier: "bg-indigo-100 text-indigo-800",
        };

        const labels = {
            base: "基本価格",
            addon: "追加オプション",
            discount: "割引価格",
            tier: "段階料金",
        };

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    badges[type] || "bg-gray-100 text-gray-800"
                }`}
            >
                {labels[type] || type}
            </span>
        );
    };

    // 課金タイプバッジ
    const getBillingTypeBadge = (billingType) => {
        const badges = {
            fixed: "bg-green-100 text-green-800",
            per_unit: "bg-orange-100 text-orange-800",
            tiered: "bg-purple-100 text-purple-800",
            volume: "bg-indigo-100 text-indigo-800",
        };

        const labels = {
            fixed: "固定料金",
            per_unit: "単位料金",
            tiered: "段階料金",
            volume: "ボリューム料金",
        };

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    badges[billingType] || "bg-gray-100 text-gray-800"
                }`}
            >
                {labels[billingType] || billingType}
            </span>
        );
    };

    // 割引情報の表示
    const hasDiscount =
        planPricing.discount_percentage > 0 || planPricing.discount_amount > 0;
    const discountText =
        planPricing.discount_percentage > 0
            ? `${planPricing.discount_percentage}% 割引`
            : planPricing.discount_amount > 0
            ? `¥${Number(planPricing.discount_amount).toLocaleString()} 割引`
            : "";

    // 有効期間の確認
    const now = new Date();
    const effectiveFrom = planPricing.effective_from
        ? new Date(planPricing.effective_from)
        : null;
    const effectiveUntil = planPricing.effective_until
        ? new Date(planPricing.effective_until)
        : null;

    const isCurrentlyEffective =
        (!effectiveFrom || effectiveFrom <= now) &&
        (!effectiveUntil || effectiveUntil >= now);

    return (
        <AdminLayout>
            <Head
                title={`価格設定詳細 - ${
                    planPricing.display_name || planPricing.name
                }`}
            />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FlashMessage />

                    <PageHeader
                        title={planPricing.display_name || planPricing.name}
                        description={`プラン: ${servicePlan.name} (${servicePlan.service_type?.name})`}
                        badge={getStatusBadge()}
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
                            {
                                label: "編集",
                                href: route(
                                    "admin.service.plans.pricing.edit",
                                    [
                                        servicePlan.service_type.id,
                                        servicePlan.id,
                                        planPricing.id,
                                    ]
                                ),
                                variant: "primary",
                                icon: PencilIcon,
                            },
                        ]}
                    />

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            onClick={toggleActive}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                                planPricing.is_active
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-green-600 hover:bg-green-700"
                            }`}
                        >
                            {planPricing.is_active ? (
                                <>
                                    <XCircleIcon className="w-4 h-4 mr-2" />
                                    非アクティブ化
                                </>
                            ) : (
                                <>
                                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                                    アクティブ化
                                </>
                            )}
                        </button>
                        {!planPricing.is_default && (
                            <button
                                onClick={setDefault}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                            >
                                <StarIcon className="w-4 h-4 mr-2" />
                                デフォルトに設定
                            </button>
                        )}
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            削除
                        </button>
                    </div>

                    <div className="mt-6 space-y-6"></div>

                    {/* 警告メッセージ */}
                    {!isCurrentlyEffective && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex">
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        有効期間外
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>
                                            この価格設定は現在有効期間外です。
                                        </p>
                                        {effectiveFrom &&
                                            effectiveFrom > now && (
                                                <p>
                                                    有効開始:{" "}
                                                    {formatDate(
                                                        planPricing.effective_from
                                                    )}
                                                </p>
                                            )}
                                        {effectiveUntil &&
                                            effectiveUntil < now && (
                                                <p>
                                                    有効終了:{" "}
                                                    {formatDate(
                                                        planPricing.effective_until
                                                    )}
                                                </p>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* メインコンテンツ */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* 基本情報 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <InformationCircleIcon className="w-5 h-5 mr-2 text-blue-500" />
                                        基本情報
                                    </h3>

                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                価格設定名
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {planPricing.name}
                                            </dd>
                                        </div>

                                        {planPricing.display_name && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    表示名
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {planPricing.display_name}
                                                </dd>
                                            </div>
                                        )}

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                価格タイプ
                                            </dt>
                                            <dd className="mt-1">
                                                {getTypeBadge(planPricing.type)}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                課金タイプ
                                            </dt>
                                            <dd className="mt-1">
                                                {getBillingTypeBadge(
                                                    planPricing.billing_type
                                                )}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                表示順序
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {planPricing.sort_order}
                                            </dd>
                                        </div>
                                    </dl>

                                    {planPricing.description && (
                                        <div className="mt-6">
                                            <dt className="text-sm font-medium text-gray-500 mb-2">
                                                説明
                                            </dt>
                                            <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                                                {planPricing.description}
                                            </dd>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 価格情報 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <CurrencyYenIcon className="w-5 h-5 mr-2 text-green-500" />
                                        価格情報
                                    </h3>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* 基本価格 */}
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h4 className="text-lg font-semibold text-blue-900 mb-2">
                                                基本価格
                                            </h4>
                                            <div className="text-3xl font-bold text-blue-900">
                                                {formatPrice(
                                                    planPricing.price,
                                                    planPricing.price_unit
                                                )}
                                            </div>
                                            {hasDiscount && (
                                                <div className="mt-2 text-sm text-blue-700">
                                                    割引前価格
                                                </div>
                                            )}
                                        </div>

                                        {/* 割引後価格 */}
                                        {hasDiscount && (
                                            <div className="bg-red-50 p-4 rounded-lg">
                                                <h4 className="text-lg font-semibold text-red-900 mb-2 flex items-center">
                                                    割引後価格
                                                    <span className="ml-2 text-xs bg-red-100 px-2 py-1 rounded">
                                                        {discountText}
                                                    </span>
                                                </h4>
                                                <div className="text-3xl font-bold text-red-900">
                                                    {formatPrice(
                                                        planPricing.price -
                                                            (planPricing.discount_amount ||
                                                                0) -
                                                            (planPricing.price *
                                                                (planPricing.discount_percentage ||
                                                                    0)) /
                                                                100,
                                                        planPricing.price_unit
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 数量制限 */}
                                    {(planPricing.min_quantity ||
                                        planPricing.max_quantity) && (
                                        <div className="mt-6">
                                            <h4 className="text-md font-medium text-gray-900 mb-3">
                                                数量制限
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {planPricing.min_quantity && (
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">
                                                            最小数量
                                                        </dt>
                                                        <dd className="mt-1 text-sm text-gray-900">
                                                            {
                                                                planPricing.min_quantity
                                                            }
                                                        </dd>
                                                    </div>
                                                )}
                                                {planPricing.max_quantity && (
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">
                                                            最大数量
                                                        </dt>
                                                        <dd className="mt-1 text-sm text-gray-900">
                                                            {
                                                                planPricing.max_quantity
                                                            }
                                                        </dd>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 段階料金ルール */}
                            {planPricing.tier_rules &&
                                planPricing.tier_rules.length > 0 && (
                                    <div className="bg-white shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                <ChartBarIcon className="w-5 h-5 mr-2 text-purple-500" />
                                                段階料金ルール
                                            </h3>

                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                数量範囲
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                単価
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {planPricing.tier_rules.map(
                                                            (rule, index) => (
                                                                <tr key={index}>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {
                                                                            rule.min_quantity
                                                                        }
                                                                        〜
                                                                        {rule.max_quantity ||
                                                                            "∞"}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        ¥
                                                                        {Number(
                                                                            rule.price
                                                                        ).toLocaleString()}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* 割引設定 */}
                            {hasDiscount && (
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <TagIcon className="w-5 h-5 mr-2 text-red-500" />
                                            割引設定
                                        </h3>

                                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {planPricing.discount_percentage >
                                                0 && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        割引率
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {
                                                            planPricing.discount_percentage
                                                        }
                                                        %
                                                    </dd>
                                                </div>
                                            )}

                                            {planPricing.discount_amount >
                                                0 && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        割引額
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        ¥
                                                        {Number(
                                                            planPricing.discount_amount
                                                        ).toLocaleString()}
                                                    </dd>
                                                </div>
                                            )}

                                            {planPricing.discount_start_date && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        割引開始日
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {new Date(
                                                            planPricing.discount_start_date
                                                        ).toLocaleDateString(
                                                            "ja-JP"
                                                        )}
                                                    </dd>
                                                </div>
                                            )}

                                            {planPricing.discount_end_date && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        割引終了日
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {new Date(
                                                            planPricing.discount_end_date
                                                        ).toLocaleDateString(
                                                            "ja-JP"
                                                        )}
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>
                                </div>
                            )}

                            {/* 適用条件 */}
                            {(planPricing.conditions &&
                                planPricing.conditions.length > 0) ||
                                (planPricing.requires_approval && (
                                    <div className="bg-white shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                <ShieldCheckIcon className="w-5 h-5 mr-2 text-indigo-500" />
                                                適用条件
                                            </h3>

                                            {planPricing.conditions &&
                                                planPricing.conditions.length >
                                                    0 && (
                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                                                            設定条件
                                                        </h4>
                                                        <ul className="bg-gray-50 rounded-lg p-4 space-y-2">
                                                            {planPricing.conditions.map(
                                                                (
                                                                    condition,
                                                                    index
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="text-sm text-gray-700 flex items-center"
                                                                    >
                                                                        <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                                                                        {
                                                                            condition
                                                                        }
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}

                                            {planPricing.requires_approval && (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                    <div className="flex">
                                                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                                                        <div className="ml-3">
                                                            <h4 className="text-sm font-medium text-yellow-800">
                                                                承認が必要
                                                            </h4>
                                                            {planPricing.approval_notes && (
                                                                <p className="mt-2 text-sm text-yellow-700">
                                                                    {
                                                                        planPricing.approval_notes
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                            {/* 有効期間 */}
                            {(planPricing.effective_from ||
                                planPricing.effective_until) && (
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <CalendarIcon className="w-5 h-5 mr-2 text-purple-500" />
                                            有効期間
                                        </h3>

                                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {planPricing.effective_from && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        有効開始日時
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {formatDate(
                                                            planPricing.effective_from
                                                        )}
                                                    </dd>
                                                </div>
                                            )}

                                            {planPricing.effective_until && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        有効終了日時
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {formatDate(
                                                            planPricing.effective_until
                                                        )}
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>

                                        <div className="mt-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                    isCurrentlyEffective
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {isCurrentlyEffective ? (
                                                    <>
                                                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                                                        現在有効
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircleIcon className="w-4 h-4 mr-1" />
                                                        有効期間外
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 管理用メモ */}
                            {planPricing.notes && (
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            管理用メモ
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                {planPricing.notes}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* サイドバー */}
                        <div className="space-y-6">
                            {/* ステータス */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        ステータス
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                アクティブ
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    planPricing.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {planPricing.is_active
                                                    ? "はい"
                                                    : "いいえ"}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                表示
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    planPricing.is_visible
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {planPricing.is_visible ? (
                                                    <>
                                                        <EyeIcon className="w-3 h-3 mr-1" />
                                                        表示中
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeSlashIcon className="w-3 h-3 mr-1" />
                                                        非表示
                                                    </>
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                デフォルト
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    planPricing.is_default
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {planPricing.is_default
                                                    ? "はい"
                                                    : "いいえ"}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                注目設定
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    planPricing.is_featured
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {planPricing.is_featured
                                                    ? "はい"
                                                    : "いいえ"}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                価格交渉可能
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    planPricing.is_negotiable
                                                        ? "bg-orange-100 text-orange-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {planPricing.is_negotiable
                                                    ? "はい"
                                                    : "いいえ"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 定期課金 */}
                            {planPricing.is_recurring && (
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <ClockIcon className="w-5 h-5 mr-2 text-green-500" />
                                            定期課金
                                        </h3>

                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {planPricing.recurring_months}
                                                ヶ月周期
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                定期課金が有効です
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 管理情報 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <UserIcon className="w-5 h-5 mr-2 text-gray-500" />
                                        管理情報
                                    </h3>

                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                作成者
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {planPricing.creator?.name ||
                                                    "-"}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                更新者
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {planPricing.updater?.name ||
                                                    "-"}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                作成日時
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {formatDate(
                                                    planPricing.created_at
                                                )}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                更新日時
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {formatDate(
                                                    planPricing.updated_at
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
