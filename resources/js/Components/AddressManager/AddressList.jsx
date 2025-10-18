import React from "react";
import {
    PencilIcon,
    TrashIcon,
    PhoneIcon,
    UserIcon,
    StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

const AddressList = ({
    addresses = [],
    onEdit,
    onDelete,
    showActions = true,
}) => {
    const typeLabels = {
        home: "自宅",
        office: "オフィス",
        billing: "請求先",
        shipping: "配送先",
        branch: "支店",
        other: "その他",
    };

    const getTypeColor = (type) => {
        const colors = {
            home: "bg-green-100 text-green-800",
            office: "bg-blue-100 text-blue-800",
            billing: "bg-yellow-100 text-yellow-800",
            shipping: "bg-purple-100 text-purple-800",
            branch: "bg-indigo-100 text-indigo-800",
            other: "bg-gray-100 text-gray-800",
        };
        return colors[type] || colors.other;
    };

    const formatAddress = (address) => {
        const parts = [];
        if (address.postal_code) parts.push(`〒${address.postal_code}`);
        if (address.prefecture) parts.push(address.prefecture);
        if (address.city) parts.push(address.city);
        if (address.district) parts.push(address.district);
        if (address.address_other) parts.push(address.address_other);
        return parts.join(" ");
    };

    if (!addresses.length) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>住所が登録されていません</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {addresses.map((address, index) => (
                <div
                    key={address.id || index}
                    className={`bg-white rounded-lg border p-4 ${
                        address.is_default
                            ? "border-blue-300 ring-1 ring-blue-300"
                            : "border-gray-200"
                    }`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {/* ヘッダー部分 */}
                            <div className="flex items-center gap-3 mb-2">
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                                        address.type
                                    )}`}
                                >
                                    {typeLabels[address.type] || address.type}
                                </span>

                                {address.label && (
                                    <span className="text-sm font-medium text-gray-900">
                                        {address.label}
                                    </span>
                                )}

                                {address.is_default && (
                                    <div className="flex items-center gap-1 text-blue-600">
                                        <StarSolidIcon className="h-4 w-4" />
                                        <span className="text-xs font-medium">
                                            デフォルト
                                        </span>
                                    </div>
                                )}

                                {!address.is_active && (
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                        無効
                                    </span>
                                )}
                            </div>

                            {/* 住所情報 */}
                            <div className="text-sm text-gray-900 mb-2">
                                {formatAddress(address)}
                            </div>

                            {/* 連絡先情報 */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                {address.phone && (
                                    <div className="flex items-center gap-1">
                                        <PhoneIcon className="h-4 w-4" />
                                        <span>{address.phone}</span>
                                    </div>
                                )}

                                {address.contact_person && (
                                    <div className="flex items-center gap-1">
                                        <UserIcon className="h-4 w-4" />
                                        <span>{address.contact_person}</span>
                                    </div>
                                )}
                            </div>

                            {/* メモ */}
                            {address.notes && (
                                <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded p-2">
                                    {address.notes}
                                </div>
                            )}

                            {/* 検証ステータス */}
                            {address.verified_at && (
                                <div className="mt-2 text-xs text-green-600">
                                    住所確認済み (
                                    {new Date(
                                        address.verified_at
                                    ).toLocaleDateString("ja-JP")}
                                    )
                                </div>
                            )}
                        </div>

                        {/* アクションボタン */}
                        {showActions && (
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => onEdit(address)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="編集"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                </button>

                                <button
                                    onClick={() => onDelete(address)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    title="削除"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AddressList;
