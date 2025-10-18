import { Link } from "@inertiajs/react";
import {
    EyeIcon,
    PencilIcon,
    CheckCircleIcon,
    XCircleIcon,
    StarIcon,
} from "@heroicons/react/24/outline";

export default function PricingTable({
    planPricings,
    servicePlan,
    selectedItems,
    handleSelectAll,
    handleSelectItem,
    getTypeBadge,
    getBillingTypeBadge,
    getStatusBadge,
    toggleActive,
    setDefault,
}) {
    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                    価格設定一覧 ({planPricings.total}件)
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={
                                        selectedItems.length ===
                                            planPricings.data.length &&
                                        planPricings.data.length > 0
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                価格設定名
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                タイプ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                価格
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                課金タイプ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ステータス
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                更新日
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                操作
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {planPricings.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    価格設定が見つかりません。上部の「価格設定を追加」ボタンから新しい価格設定を作成してください。
                                </td>
                            </tr>
                        ) : (
                            planPricings.data.map((pricing) => (
                                <tr
                                    key={pricing.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(
                                                pricing.id
                                            )}
                                            onChange={() =>
                                                handleSelectItem(pricing.id)
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {pricing.display_name ||
                                                        pricing.name}
                                                </div>
                                                {pricing.description && (
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                        {pricing.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getTypeBadge(pricing.type)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            ¥
                                            {Number(
                                                pricing.price
                                            ).toLocaleString()}
                                            {pricing.price_unit && (
                                                <span className="text-gray-500 ml-1">
                                                    / {pricing.price_unit}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getBillingTypeBadge(
                                            pricing.billing_type
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(pricing)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(
                                            pricing.updated_at
                                        ).toLocaleDateString("ja-JP")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link
                                                href={route(
                                                    "admin.service.plans.pricing.show",
                                                    [
                                                        servicePlan.service_type
                                                            .id,
                                                        servicePlan.id,
                                                        pricing.id,
                                                    ]
                                                )}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={route(
                                                    "admin.service.plans.pricing.edit",
                                                    [
                                                        servicePlan.service_type
                                                            .id,
                                                        servicePlan.id,
                                                        pricing.id,
                                                    ]
                                                )}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    toggleActive(pricing)
                                                }
                                                className={`${
                                                    pricing.is_active
                                                        ? "text-red-600 hover:text-red-900"
                                                        : "text-green-600 hover:text-green-900"
                                                }`}
                                            >
                                                {pricing.is_active ? (
                                                    <XCircleIcon className="w-4 h-4" />
                                                ) : (
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setDefault(pricing)
                                                }
                                                className="text-yellow-600 hover:text-yellow-900"
                                                disabled={pricing.is_default}
                                            >
                                                <StarIcon
                                                    className={`w-4 h-4 ${
                                                        pricing.is_default
                                                            ? "fill-current"
                                                            : ""
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ページネーション */}
            {planPricings.last_page > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            {planPricings.from} - {planPricings.to} 件目 (全{" "}
                            {planPricings.total} 件)
                        </div>
                        <div className="flex space-x-2">
                            {planPricings.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || "#"}
                                    className={`px-3 py-2 text-sm rounded-md ${
                                        link.active
                                            ? "bg-blue-600 text-white"
                                            : link.url
                                            ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
