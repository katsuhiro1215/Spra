import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import {
    ArrowLeftIcon,
    PencilIcon,
    CheckCircleIcon,
    XCircleIcon,
    StarIcon,
    CurrencyYenIcon,
    TagIcon,
    LinkIcon,
    CodeBracketIcon,
    GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

export default function Show({ service }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatPrice = (price) => {
        if (price === 0) return "お問い合わせ";
        return `¥${price.toLocaleString()}`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800";
            case "inactive":
                return "bg-red-100 text-red-800";
            case "draft":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "active":
                return "アクティブ";
            case "inactive":
                return "非アクティブ";
            case "draft":
                return "下書き";
            default:
                return status;
        }
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route("admin.homepage.services.index")}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-1" />
                            戻る
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            サービス詳細
                        </h2>
                    </div>
                    <Link
                        href={route("admin.homepage.services.edit", service)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                    >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        編集
                    </Link>
                </div>
            }
        >
            <Head title={`サービス詳細 - ${service.name}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* ヘッダー部分 */}
                            <div className="mb-8">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h1 className="text-3xl font-bold text-gray-900">
                                                {service.name}
                                            </h1>
                                            {service.is_featured && (
                                                <StarIconSolid className="h-8 w-8 text-yellow-400" />
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-4 mb-4">
                                            <span className="text-sm text-gray-500 font-mono">
                                                {service.slug}
                                            </span>
                                            <span
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                                                style={{
                                                    backgroundColor:
                                                        service.service_category
                                                            ?.color ||
                                                        "#6B7280",
                                                }}
                                            >
                                                <TagIcon className="h-4 w-4 mr-1" />
                                                {service.service_category
                                                    ?.name || "未分類"}
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                    service.status
                                                )}`}
                                            >
                                                {getStatusText(service.status)}
                                            </span>
                                        </div>

                                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                                            {service.description}
                                        </p>

                                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                                            <div className="flex items-center space-x-1">
                                                {service.is_active ? (
                                                    <>
                                                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                                        <span className="text-green-600">
                                                            アクティブ
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircleIcon className="h-4 w-4 text-red-500" />
                                                        <span className="text-red-600">
                                                            非アクティブ
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <div>
                                                <span className="font-medium">
                                                    表示順:
                                                </span>
                                                <span className="ml-1">
                                                    {service.sort_order}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 詳細説明 */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                                    詳細説明
                                </h3>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {service.details}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* 特徴・機能 */}
                                {service.features &&
                                    service.features.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                                                特徴・機能
                                            </h3>
                                            <ul className="space-y-2">
                                                {service.features.map(
                                                    (feature, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-center space-x-3"
                                                        >
                                                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                            <span className="text-gray-700">
                                                                {feature}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                {/* 使用技術 */}
                                {service.technologies &&
                                    service.technologies.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                                                使用技術
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {service.technologies.map(
                                                    (tech, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-700"
                                                        >
                                                            <CodeBracketIcon className="h-4 w-4 mr-1" />
                                                            {tech}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>

                            {/* 価格設定 */}
                            {service.pricing && service.pricing.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                                        価格設定
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {service.pricing.map((plan, index) => (
                                            <div
                                                key={index}
                                                className="border border-gray-200 rounded-lg p-4"
                                            >
                                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {plan.name}
                                                </h4>
                                                <div className="flex items-center mb-3">
                                                    <CurrencyYenIcon className="h-5 w-5 text-gray-400 mr-1" />
                                                    <span className="text-2xl font-bold text-gray-900">
                                                        {formatPrice(
                                                            plan.price
                                                        )}
                                                    </span>
                                                </div>
                                                {plan.description && (
                                                    <p className="text-sm text-gray-600">
                                                        {plan.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* デモリンク */}
                            {service.demo_links &&
                                service.demo_links.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                                            デモリンク
                                        </h3>
                                        <div className="space-y-3">
                                            {service.demo_links.map(
                                                (link, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                                    >
                                                        <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900">
                                                                {link.name}
                                                            </div>
                                                            <a
                                                                href={link.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                                            >
                                                                {link.url}
                                                            </a>
                                                        </div>
                                                        <LinkIcon className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* ギャラリー */}
                            {service.gallery && service.gallery.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                                        ギャラリー
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {service.gallery.map((image, index) => (
                                            <div
                                                key={index}
                                                className="aspect-w-1 aspect-h-1"
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${service.name} - ${
                                                        index + 1
                                                    }`}
                                                    className="object-cover rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* メタ情報 */}
                            <div className="border-t border-gray-200 pt-6 mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    システム情報
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <span className="font-medium">
                                            サービスID:
                                        </span>
                                        <span className="ml-2">
                                            {service.id}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            ステータス:
                                        </span>
                                        <span className="ml-2">
                                            {getStatusText(service.status)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            作成日時:
                                        </span>
                                        <span className="ml-2">
                                            {formatDate(service.created_at)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            更新日時:
                                        </span>
                                        <span className="ml-2">
                                            {formatDate(service.updated_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* アクションボタン */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                                <Link
                                    href={route(
                                        "admin.homepage.services.index"
                                    )}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    一覧に戻る
                                </Link>
                                <Link
                                    href={route(
                                        "admin.homepage.services.edit",
                                        service
                                    )}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    編集
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
