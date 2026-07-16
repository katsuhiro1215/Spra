import React from "react";
import { Link, router } from "@inertiajs/react";
import { Card } from "@/Components/Card";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

export default function ServicePlansTable({
    servicePlans,
    onDelete,
    isDeleting,
    billingCycles,
}) {
    if (!servicePlans || servicePlans.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                    サービスプランが見つかりませんでした。
                </p>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const badges = {
            active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            inactive:
                "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
            suspended:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        };
        const labels = {
            active: "稼働中",
            inactive: "停止中",
            suspended: "一時停止",
        };
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}
            >
                {labels[status]}
            </span>
        );
    };

    const getBillingCycleLabel = (cycle) => {
        const cycleObj = billingCycles.find((c) => c.value === cycle);
        return cycleObj ? cycleObj.label : cycle;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {servicePlans.map((plan) => (
                <Card key={plan.id}>
                    {/* ヘッダー部分 */}
                    <div
                        className="p-6 border-b border-gray-200 dark:border-gray-700"
                        style={
                            plan.color
                                ? {
                                      borderTopWidth: "4px",
                                      borderTopColor: plan.color,
                                  }
                                : {}
                        }
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                {plan.name}
                                {plan.is_featured && (
                                    <StarIconSolid className="ml-2 h-5 w-5 text-yellow-500" />
                                )}
                            </h3>
                            {plan.badge_text && (
                                <span
                                    className="px-2 py-1 text-xs font-medium rounded text-white"
                                    style={{
                                        backgroundColor:
                                            plan.color || "#3b82f6",
                                    }}
                                >
                                    {plan.badge_text}
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {plan.service?.name}
                        </p>

                        <div className="flex items-baseline mb-2">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                ¥{Number(plan.base_price).toLocaleString()}
                            </span>
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                / {getBillingCycleLabel(plan.billing_cycle)}
                            </span>
                        </div>

                        {plan.setup_fee > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                初期費用: ¥
                                {Number(plan.setup_fee).toLocaleString()}
                            </p>
                        )}
                    </div>

                    {/* コンテンツ部分 */}
                    <div className="p-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                            {plan.description || "説明なし"}
                        </p>

                        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 mb-4">
                            {plan.max_revisions && (
                                <div className="flex items-center">
                                    <span className="font-medium mr-2">
                                        修正回数:
                                    </span>
                                    <span>{plan.max_revisions}回</span>
                                </div>
                            )}
                            {plan.estimated_delivery_days && (
                                <div className="flex items-center">
                                    <span className="font-medium mr-2">
                                        納期目安:
                                    </span>
                                    <span>
                                        {plan.estimated_delivery_days}日
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center">
                                <span className="font-medium mr-2">
                                    ステータス:
                                </span>
                                {getStatusBadge(plan.status)}
                                {!plan.is_displayed && (
                                    <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                        非公開
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* アクションボタン */}
                        <div className="flex items-center gap-2">
                            <Link
                                href={route("admin.service.plan.show", plan.id)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                <EyeIcon className="h-4 w-4 mr-1" />
                                詳細
                            </Link>
                            <Link
                                href={route("admin.service.plan.edit", plan.id)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                <PencilIcon className="h-4 w-4 mr-1" />
                                編集
                            </Link>
                            <button
                                onClick={() => onDelete(plan)}
                                disabled={isDeleting === plan.id}
                                className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
