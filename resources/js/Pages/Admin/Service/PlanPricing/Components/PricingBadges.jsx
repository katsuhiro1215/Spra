import {
    CheckCircleIcon,
    XCircleIcon,
    StarIcon,
} from "@heroicons/react/24/outline";

export function getTypeBadge(type) {
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
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                badges[type] || "bg-gray-100 text-gray-800"
            }`}
        >
            {labels[type] || type}
        </span>
    );
}

export function getBillingTypeBadge(billingType) {
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
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                badges[billingType] || "bg-gray-100 text-gray-800"
            }`}
        >
            {labels[billingType] || billingType}
        </span>
    );
}

export function getStatusBadge(pricing) {
    if (!pricing.is_active) {
        return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <XCircleIcon className="w-3 h-3 mr-1" />
                非アクティブ
            </span>
        );
    }

    if (!pricing.is_visible) {
        return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                非表示
            </span>
        );
    }

    return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            アクティブ
        </span>
    );
}
