import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    ArrowLeftIcon,
    StarIcon,
    CurrencyYenIcon,
    ClockIcon,
    SwatchIcon,
} from "@heroicons/react/24/outline";

export default function Index({ serviceType, servicePlans }) {
    const [selectedPlans, setSelectedPlans] = useState([]);

    const headerActions = [
        {
            label: "戻る",
            href: route("admin.service.type.index"),
            variant: "secondary",
            icon: ArrowLeftIcon,
        },
        {
            label: "プラン作成",
            href: route("admin.service.plans.create", serviceType.id),
            variant: "primary",
            icon: PlusIcon,
        },
    ];

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedPlans(servicePlans.data.map((plan) => plan.id));
        } else {
            setSelectedPlans([]);
        }
    };

    const handleSelectPlan = (planId, checked) => {
        if (checked) {
            setSelectedPlans([...selectedPlans, planId]);
        } else {
            setSelectedPlans(selectedPlans.filter((id) => id !== planId));
        }
    };

    const handleBulkDelete = () => {
        if (selectedPlans.length === 0) return;

        if (
            confirm(
                `選択した${selectedPlans.length}件のプランを削除しますか？`
            )
        ) {
            router.post(
                route("admin.service.plans.bulk-destroy", serviceType.id),
                { ids: selectedPlans },
                {
                    onSuccess: () => setSelectedPlans([]),
                }
            );
        }
    };

    const handleDelete = (plan) => {
        if (confirm(`「${plan.name}」を削除しますか？`)) {
            router.delete(
                route("admin.service.plans.destroy", [
                    serviceType.id,
                    plan.id,
                ])
            );
        }
    };

    const formatPrice = (price, unit, setupFee) => {
        let priceText = price
            ? `¥${Number(price).toLocaleString()}`
            : "要相談";
        if (unit) priceText += `/${unit}`;
        if (setupFee > 0) {
            priceText += ` (初期費用: ¥${Number(setupFee).toLocaleString()})`;
        }
        return priceText;
    };

    const getBillingCycleBadge = (cycle) => {
        const configs = {
            one_time: { label: "一回払い", color: "bg-gray-100 text-gray-800" },
            monthly: { label: "月額", color: "bg-blue-100 text-blue-800" },
            quarterly: {
                label: "四半期",
                color: "bg-green-100 text-green-800",
            },
            yearly: { label: "年額", color: "bg-purple-100 text-purple-800" },
        };

        const config = configs[cycle] || configs.one_time;
        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
            >
                {config.label}
            </span>
        );
    };

    const getStatusBadge = (plan) => {
        const badges = [];

        if (plan.is_popular) {
            badges.push(
                <span
                    key="popular"
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                >
                    <StarIcon className="h-3 w-3 mr-1" />
                    人気
                </span>
            );
        }

        if (plan.is_recommended) {
            badges.push(
                <span
                    key="recommended"
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                    推奨
                </span>
            );
        }

        if (plan.badge_text) {
            badges.push(
                <span
                    key="custom"
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                    {plan.badge_text}
                </span>
            );
        }

        if (!plan.is_active) {
            badges.push(
                <span
                    key="inactive"
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                    非アクティブ
                </span>
            );
        }

        return <div className="flex flex-wrap gap-1">{badges}</div>;
    };

    return (
        <AdminLayout>
            <Head title={`${serviceType.name} - サービスプラン管理`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FlashMessage />

                    <PageHeader
                        title={`${serviceType.name} - サービスプラン`}
                        description={`${serviceType.name}のサービスプランを管理します`}
                        actions={headerActions}
                    />

                    {/* サマリーカード */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <SwatchIcon className="h-6 w-6 text-blue-500" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">
                                        総プラン数
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {servicePlans.total}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <StarIcon className="h-6 w-6 text-yellow-500" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">
                                        人気プラン
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {
                                            servicePlans.data.filter(
                                                (p) => p.is_popular
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <CurrencyYenIcon className="h-6 w-6 text-green-500" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">
                                        平均価格
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {servicePlans.data.length > 0
                                            ? `¥${Math.round(
                                                  servicePlans.data.reduce(
                                                      (sum, p) =>
                                                          sum + p.base_price,
                                                      0
                                                  ) / servicePlans.data.length
                                              ).toLocaleString()}`
                                            : "¥0"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <ClockIcon className="h-6 w-6 text-purple-500" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">
                                        平均納期
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {servicePlans.data.length > 0
                                            ? `${Math.round(
                                                  servicePlans.data.reduce(
                                                      (sum, p) =>
                                                          sum +
                                                          (p.estimated_delivery_days ||
                                                              0),
                                                      0
                                                  ) / servicePlans.data.length
                                              )}日`
                                            : "0日"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 一括操作 */}
                    {selectedPlans.length > 0 && (
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-800">
                                    {selectedPlans.length}件選択中
                                </span>
                                <button
                                    type="button"
                                    onClick={handleBulkDelete}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                                >
                                    <TrashIcon className="h-4 w-4 mr-1" />
                                    一括削除
                                </button>
                            </div>
                        </div>
                    )}

                    {/* プラン一覧 */}
                    <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            {servicePlans.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <SwatchIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        プランがありません
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        最初のサービスプランを作成してください。
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href={route(
                                                "admin.service.plans.create",
                                                serviceType.id
                                            )}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            プラン作成
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        checked={
                                                            selectedPlans.length ===
                                                                servicePlans.data
                                                                    .length &&
                                                            servicePlans.data
                                                                .length > 0
                                                        }
                                                        onChange={(e) =>
                                                            handleSelectAll(
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    プラン名
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    価格
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    請求サイクル
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ステータス
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    納期
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    順序
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    操作
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {servicePlans.data.map((plan) => (
                                                <tr
                                                    key={plan.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            checked={selectedPlans.includes(
                                                                plan.id
                                                            )}
                                                            onChange={(e) =>
                                                                handleSelectPlan(
                                                                    plan.id,
                                                                    e.target
                                                                        .checked
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            {plan.color && (
                                                                <div
                                                                    className="w-3 h-3 rounded-full mr-3"
                                                                    style={{
                                                                        backgroundColor:
                                                                            plan.color,
                                                                    }}
                                                                />
                                                            )}
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {plan.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {
                                                                        plan.description
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatPrice(
                                                            plan.base_price,
                                                            plan.price_unit,
                                                            plan.setup_fee
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getBillingCycleBadge(
                                                            plan.billing_cycle
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(plan)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {plan.estimated_delivery_days
                                                            ? `${plan.estimated_delivery_days}日`
                                                            : "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {plan.sort_order}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center space-x-2">
                                                            <Link
                                                                href={route(
                                                                    "admin.service.plans.show",
                                                                    [
                                                                        serviceType.id,
                                                                        plan.id,
                                                                    ]
                                                                )}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <EyeIcon className="h-4 w-4" />
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    "admin.service.plans.edit",
                                                                    [
                                                                        serviceType.id,
                                                                        plan.id,
                                                                    ]
                                                                )}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                <PencilIcon className="h-4 w-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        plan
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ページネーション */}
                    {servicePlans.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-700">
                                <span>
                                    {servicePlans.from}-{servicePlans.to} of{" "}
                                    {servicePlans.total} results
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                {servicePlans.prev_page_url && (
                                    <Link
                                        href={servicePlans.prev_page_url}
                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        前へ
                                    </Link>
                                )}
                                {servicePlans.next_page_url && (
                                    <Link
                                        href={servicePlans.next_page_url}
                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        次へ
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}