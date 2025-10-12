import React from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    DuplicateIcon,
    EyeIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
    CurrencyYenIcon,
    ClockIcon,
    ChartBarIcon,
    ColorSwatchIcon,
    Cog6ToothIcon,
    StarIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

const ServiceTypeShow = ({ serviceType }) => {
    const handleDelete = () => {
        if (
            confirm(
                `「${serviceType.name}」を削除しますか？この操作は取り消せません。`
            )
        ) {
            router.delete(
                route("admin.service.service-types.destroy", serviceType.id),
                {
                    onSuccess: () =>
                        router.get(route("admin.service.service-types.index")),
                }
            );
        }
    };

    const handleDuplicate = () => {
        router.post(
            route("admin.service.service-types.duplicate", serviceType.id)
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("ja-JP");
    };

    const formatPrice = (price, unit) => {
        if (!price) return "要相談";
        return `¥${Number(price).toLocaleString()}${unit ? `/${unit}` : ""}`;
    };

    const getPricingModelLabel = (model) => {
        const labels = {
            fixed: "固定価格",
            subscription: "サブスクリプション",
            custom: "カスタム価格",
            hybrid: "ハイブリッド",
        };
        return labels[model] || model;
    };

    const getPricingModelBadge = (model) => {
        const badges = {
            fixed: "bg-blue-100 text-blue-800",
            subscription: "bg-purple-100 text-purple-800",
            custom: "bg-orange-100 text-orange-800",
            hybrid: "bg-indigo-100 text-indigo-800",
        };

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    badges[model] || "bg-gray-100 text-gray-800"
                }`}
            >
                {getPricingModelLabel(model)}
            </span>
        );
    };

    const getStatusBadge = (isActive, isFeatured) => {
        if (!isActive) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <XCircleIcon className="w-4 h-4 mr-1" />
                    非アクティブ
                </span>
            );
        }
        if (isFeatured) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <StarIcon className="w-4 h-4 mr-1" />
                    おすすめ
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

    return (
        <AdminLayout>
            <Head title={`サービスタイプ詳細 - ${serviceType.name}`} />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() =>
                                router.get(
                                    route("admin.service.service-types.index")
                                )
                            }
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            一覧に戻る
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                {serviceType.color && (
                                    <div
                                        className="w-6 h-6 rounded-full mr-3"
                                        style={{
                                            backgroundColor: serviceType.color,
                                        }}
                                    ></div>
                                )}
                                {serviceType.name}
                            </h1>
                            <p className="text-gray-600">サービスタイプ詳細</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        {getStatusBadge(
                            serviceType.is_active,
                            serviceType.is_featured
                        )}
                        <button
                            onClick={() =>
                                router.get(
                                    route(
                                        "admin.service.service-types.edit",
                                        serviceType.id
                                    )
                                )
                            }
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            編集
                        </button>
                        <button
                            onClick={handleDuplicate}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <DuplicateIcon className="w-4 h-4 mr-2" />
                            複製
                        </button>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            削除
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* メインコンテンツ */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 基本情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    基本情報
                                </h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            サービスタイプ名
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {serviceType.name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            スラッグ
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            /{serviceType.slug}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            カテゴリ
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {serviceType.service_category?.name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            料金体系
                                        </dt>
                                        <dd className="mt-1">
                                            {getPricingModelBadge(
                                                serviceType.pricing_model
                                            )}
                                        </dd>
                                    </div>
                                </dl>

                                {serviceType.description && (
                                    <div className="mt-6">
                                        <dt className="text-sm font-medium text-gray-500 mb-2">
                                            概要説明
                                        </dt>
                                        <dd className="text-sm text-gray-900 whitespace-pre-wrap">
                                            {serviceType.description}
                                        </dd>
                                    </div>
                                )}

                                {serviceType.detailed_description && (
                                    <div className="mt-6">
                                        <dt className="text-sm font-medium text-gray-500 mb-2">
                                            詳細説明
                                        </dt>
                                        <dd className="text-sm text-gray-900 whitespace-pre-wrap">
                                            {serviceType.detailed_description}
                                        </dd>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 価格・納期情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <CurrencyYenIcon className="w-5 h-5 mr-2" />
                                    価格・納期情報
                                </h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            基本価格
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {formatPrice(
                                                serviceType.base_price,
                                                serviceType.price_unit
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            標準納期
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {serviceType.estimated_delivery_days
                                                ? `${serviceType.estimated_delivery_days}日`
                                                : "要相談"}
                                        </dd>
                                    </div>
                                </dl>

                                {serviceType.requires_consultation && (
                                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <Cog6ToothIcon className="h-5 w-5 text-yellow-400" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-yellow-800">
                                                    要相談サービス
                                                </h3>
                                                {serviceType.consultation_note && (
                                                    <p className="mt-2 text-sm text-yellow-700">
                                                        {
                                                            serviceType.consultation_note
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 特徴・機能 */}
                        {serviceType.features &&
                            serviceType.features.length > 0 && (
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            特徴・機能
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {serviceType.features.map(
                                                (feature, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                                    >
                                                        {feature}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                        {/* 対象顧客 */}
                        {serviceType.target_audience &&
                            serviceType.target_audience.length > 0 && (
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            対象顧客
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {serviceType.target_audience.map(
                                                (audience, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                                                    >
                                                        {audience}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                        {/* 成果物 */}
                        {serviceType.deliverables &&
                            serviceType.deliverables.length > 0 && (
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            成果物
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {serviceType.deliverables.map(
                                                (deliverable, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                                                    >
                                                        {deliverable}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                        {/* 使用技術 */}
                        {serviceType.technologies &&
                            serviceType.technologies.length > 0 && (
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            使用技術
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {serviceType.technologies.map(
                                                (technology, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                                                    >
                                                        {technology}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* サイドバー */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* クイックアクション */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    クイックアクション
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() =>
                                            router.get(
                                                route(
                                                    "admin.service.service-types.edit",
                                                    serviceType.id
                                                )
                                            )
                                        }
                                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        編集
                                    </button>

                                    <button
                                        onClick={handleDuplicate}
                                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <DuplicateIcon className="w-4 h-4 mr-2" />
                                        複製
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ビジュアル情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <ColorSwatchIcon className="w-5 h-5 mr-2" />
                                    ビジュアル情報
                                </h3>
                                <dl className="space-y-4">
                                    {serviceType.icon && (
                                        <div>
                                            <dt className="text-sm text-gray-500">
                                                アイコン
                                            </dt>
                                            <dd className="text-sm font-medium text-gray-900 flex items-center mt-1">
                                                <i
                                                    className={`${serviceType.icon} mr-2 text-lg`}
                                                ></i>
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                    {serviceType.icon}
                                                </code>
                                            </dd>
                                        </div>
                                    )}
                                    <div>
                                        <dt className="text-sm text-gray-500">
                                            テーマカラー
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900 flex items-center mt-1">
                                            <div
                                                className="w-4 h-4 rounded mr-2 border border-gray-300"
                                                style={{
                                                    backgroundColor:
                                                        serviceType.color,
                                                }}
                                            ></div>
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {serviceType.color}
                                            </code>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">
                                            表示順序
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900 mt-1">
                                            {serviceType.sort_order}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* 統計情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <ChartBarIcon className="w-5 h-5 mr-2" />
                                    統計情報
                                </h3>
                                <dl className="space-y-4">
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">
                                            特徴数
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {serviceType.features
                                                ? serviceType.features.length
                                                : 0}
                                            件
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">
                                            対象顧客数
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {serviceType.target_audience
                                                ? serviceType.target_audience
                                                      .length
                                                : 0}
                                            件
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">
                                            成果物数
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {serviceType.deliverables
                                                ? serviceType.deliverables
                                                      .length
                                                : 0}
                                            件
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">
                                            使用技術数
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {serviceType.technologies
                                                ? serviceType.technologies
                                                      .length
                                                : 0}
                                            件
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* 日付情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <CalendarIcon className="w-5 h-5 mr-2" />
                                    日付情報
                                </h3>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm text-gray-500">
                                            作成日
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {formatDate(serviceType.created_at)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">
                                            最終更新
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {formatDate(serviceType.updated_at)}
                                        </dd>
                                    </div>
                                    {serviceType.published_at && (
                                        <div>
                                            <dt className="text-sm text-gray-500">
                                                公開日
                                            </dt>
                                            <dd className="text-sm font-medium text-gray-900">
                                                {formatDate(
                                                    serviceType.published_at
                                                )}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>

                        {/* 作成者・更新者情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <UserIcon className="w-5 h-5 mr-2" />
                                    作成者・更新者
                                </h3>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm text-gray-500">
                                            作成者
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {serviceType.created_by
                                                ? serviceType.created_by.name
                                                : "不明"}
                                        </dd>
                                    </div>
                                    {serviceType.updated_by && (
                                        <div>
                                            <dt className="text-sm text-gray-500">
                                                最終更新者
                                            </dt>
                                            <dd className="text-sm font-medium text-gray-900">
                                                {serviceType.updated_by.name}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ServiceTypeShow;
