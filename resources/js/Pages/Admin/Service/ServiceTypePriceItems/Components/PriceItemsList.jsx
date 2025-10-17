import { Link } from "@inertiajs/react";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import DangerButton from "@/Components/Buttons/DangerButton";

/**
 * 価格項目リスト表示コンポーネント
 */
const PriceItemsList = ({ priceItems, serviceType, onDelete }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(price);
    };

    const getCategoryIcon = (category) => {
        const icons = {
            design: "🎨",
            coding: "💻",
            infrastructure: "🏗️",
            content: "📝",
            testing: "🧪",
            management: "📋",
            maintenance: "🔧",
            optional: "⭐",
        };
        return icons[category] || "📦";
    };

    const getCategoryName = (category) => {
        const names = {
            design: "デザイン",
            coding: "コーディング",
            infrastructure: "インフラ",
            content: "コンテンツ",
            testing: "テスト",
            management: "管理",
            maintenance: "保守",
            optional: "オプション",
        };
        return names[category] || category;
    };

    if (Object.keys(priceItems).length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    価格項目がありません
                </h3>
                <p className="text-gray-600 mb-6">
                    このサービスタイプには価格項目が設定されていません。
                </p>
                <Link
                    href={route("admin.service.priceItem.create", {
                        serviceType: serviceType.id,
                    })}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                    最初の価格項目を追加
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {Object.entries(priceItems).map(([category, items]) => (
                <div
                    key={category}
                    className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6"
                >
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            <span className="mr-2 text-2xl">
                                {getCategoryIcon(category)}
                            </span>
                            {getCategoryName(category)}
                            <span className="ml-2 text-sm text-gray-500">
                                ({items.length}件)
                            </span>
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {item.name}
                                        </h4>
                                        {item.is_required && (
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                必須
                                            </span>
                                        )}
                                        {item.is_default_included && (
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                標準
                                            </span>
                                        )}
                                    </div>
                                    {item.description && (
                                        <p className="mt-1 text-sm text-gray-600">
                                            {item.description}
                                        </p>
                                    )}
                                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                        <span>
                                            価格: {formatPrice(item.price)}
                                        </span>
                                        {item.unit && (
                                            <span>単位: {item.unit}</span>
                                        )}
                                        {item.estimated_hours && (
                                            <span>
                                                予想時間: {item.estimated_hours}
                                                h
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex items-center space-x-2">
                                    <Link
                                        href={route(
                                            "admin.service.priceItem.show",
                                            {
                                                serviceType: serviceType.id,
                                                priceItem: item.id,
                                            }
                                        )}
                                    >
                                        <SecondaryButton>詳細</SecondaryButton>
                                    </Link>
                                    <Link
                                        href={route(
                                            "admin.service.priceItem.edit",
                                            {
                                                serviceType: serviceType.id,
                                                priceItem: item.id,
                                            }
                                        )}
                                    >
                                        <SecondaryButton>編集</SecondaryButton>
                                    </Link>
                                    <DangerButton
                                        onClick={() => onDelete(item)}
                                    >
                                        削除
                                    </DangerButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PriceItemsList;
