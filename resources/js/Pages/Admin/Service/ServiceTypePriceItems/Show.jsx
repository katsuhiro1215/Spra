import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import PageHeader from "@/Components/Layout/PageHeader";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import DangerButton from "@/Components/Buttons/DangerButton";
import DeleteAlert from "@/Components/Alerts/DeleteAlert";

export default function Show({ serviceType, priceItem, categories }) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const handleDelete = () => {
        setShowDeleteAlert(true);
    };

    const confirmDelete = () => {
        router.delete(
            route("admin.service.priceItem.destroy", {
                serviceType: serviceType.id,
                priceItem: priceItem.id,
            })
        );
    };

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

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const headerActions = [
        {
            label: "編集",
            variant: "primary",
            route: route("admin.service.priceItem.edit", {
                serviceType: serviceType.id,
                priceItem: priceItem.id,
            }),
        },
        {
            label: "削除",
            variant: "danger",
            onClick: handleDelete,
        },
        {
            label: "← 価格項目一覧に戻る",
            variant: "secondary",
            route: route("admin.service.priceItem.index", {
                serviceType: serviceType.id,
            }),
        },
    ];

    return (
        <AdminLayout>
            <Head title="価格項目詳細" />

            <FlashMessage />

            <div className="space-y-6">
                <PageHeader
                    title="価格項目詳細"
                    description={`${serviceType.name} - ${serviceType.service_category?.name}`}
                    actions={headerActions}
                />

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        {/* メイン情報 */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <span className="text-3xl mr-3">
                                    {getCategoryIcon(priceItem.category)}
                                </span>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {priceItem.name}
                                    </h1>
                                    <div className="flex items-center space-x-3 mt-2">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                            {categories[priceItem.category]}
                                        </span>
                                        {priceItem.is_optional && (
                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                オプション
                                            </span>
                                        )}
                                        {priceItem.is_variable && (
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                                可変価格
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {priceItem.description && (
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <h3 className="font-medium text-gray-900 mb-2">
                                        詳細説明
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {priceItem.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 価格情報 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-blue-900 mb-4">
                                    価格詳細
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">
                                            単価:
                                        </span>
                                        <span className="font-medium text-blue-900">
                                            {formatPrice(priceItem.price)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">
                                            数量:
                                        </span>
                                        <span className="font-medium text-blue-900">
                                            {priceItem.quantity}{" "}
                                            {priceItem.unit}
                                        </span>
                                    </div>
                                    <div className="border-t border-blue-200 pt-3">
                                        <div className="flex justify-between">
                                            <span className="text-blue-700 font-medium">
                                                小計:
                                            </span>
                                            <span className="text-xl font-bold text-blue-900">
                                                {formatPrice(
                                                    priceItem.total_price
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    設定情報
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            表示順序:
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            {priceItem.sort_order}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            オプション項目:
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            {priceItem.is_optional
                                                ? "はい"
                                                : "いいえ"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            可変価格:
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            {priceItem.is_variable
                                                ? "はい"
                                                : "いいえ"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* メタ情報 */}
                        <div className="bg-gray-50 p-6 rounded-lg mb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                作成・更新情報
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">
                                        作成日時:
                                    </span>
                                    <div className="font-medium text-gray-900">
                                        {formatDateTime(priceItem.created_at)}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-600">
                                        最終更新:
                                    </span>
                                    <div className="font-medium text-gray-900">
                                        {formatDateTime(priceItem.updated_at)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* アクションボタン */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                            <Link
                                href={route(
                                    "admin.service.priceItem.index",
                                    serviceType.id
                                )}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ← 価格項目一覧に戻る
                            </Link>

                            <div className="flex space-x-3">
                                <Link
                                    href={route(
                                        "admin.service.priceItem.edit",
                                        {
                                            serviceType: serviceType.id,
                                            priceItem: priceItem.id,
                                        }
                                    )}
                                >
                                    <PrimaryButton>
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        編集
                                    </PrimaryButton>
                                </Link>

                                <DangerButton onClick={handleDelete}>
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    削除
                                </DangerButton>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 関連情報 */}
                <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            所属サービスタイプ情報
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-600">
                                        サービス名:
                                    </span>
                                    <div className="font-medium text-gray-900">
                                        {serviceType.name}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-600">
                                        カテゴリ:
                                    </span>
                                    <div className="font-medium text-gray-900">
                                        {serviceType.service_category?.name}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-600">
                                        基本価格:
                                    </span>
                                    <div className="font-medium text-gray-900">
                                        {formatPrice(serviceType.base_price)}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-600">
                                        料金体系:
                                    </span>
                                    <div className="font-medium text-gray-900">
                                        {serviceType.pricing_model}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex space-x-3">
                                <Link
                                    href={route(
                                        "admin.service.type.show",
                                        serviceType.id
                                    )}
                                    className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                    サービスタイプ詳細を見る →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 削除確認モーダル */}
                <DeleteAlert
                    show={showDeleteAlert}
                    onClose={() => setShowDeleteAlert(false)}
                    onConfirm={confirmDelete}
                    title="価格項目の削除"
                    message={`「${priceItem.name}」を削除してもよろしいですか？この操作は取り消すことができません。`}
                />
            </div>
        </AdminLayout>
    );
}
