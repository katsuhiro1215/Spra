import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import {
    ArrowLeftIcon,
    PencilIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

export default function Show({ serviceCategory, servicesCount }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route(
                                "admin.homepage.serviceCategories.index"
                            )}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-1" />
                            戻る
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            サービスカテゴリ詳細
                        </h2>
                    </div>
                    <Link
                        href={route(
                            "admin.homepage.serviceCategories.edit",
                            serviceCategory
                        )}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                    >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        編集
                    </Link>
                </div>
            }
        >
            <Head title={`サービスカテゴリ詳細 - ${serviceCategory.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* ヘッダー部分 */}
                            <div className="mb-8">
                                <div className="flex items-center space-x-4 mb-4">
                                    {serviceCategory.icon && (
                                        <div
                                            className="w-16 h-16 rounded-xl flex items-center justify-center text-white"
                                            style={{
                                                backgroundColor:
                                                    serviceCategory.color,
                                            }}
                                        >
                                            <i
                                                className={`heroicon-${serviceCategory.icon} h-8 w-8`}
                                            ></i>
                                        </div>
                                    )}
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                            {serviceCategory.name}
                                        </h1>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm text-gray-500">
                                                {serviceCategory.slug}
                                            </span>
                                            <div className="flex items-center space-x-1">
                                                {serviceCategory.is_active ? (
                                                    <>
                                                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                                        <span className="text-sm text-green-600">
                                                            アクティブ
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircleIcon className="h-4 w-4 text-red-500" />
                                                        <span className="text-sm text-red-600">
                                                            非アクティブ
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {serviceCategory.description && (
                                    <p className="text-gray-700 leading-relaxed">
                                        {serviceCategory.description}
                                    </p>
                                )}
                            </div>

                            {/* 詳細情報 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                        基本情報
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                カテゴリ名
                                            </label>
                                            <p className="text-gray-900">
                                                {serviceCategory.name}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                スラッグ
                                            </label>
                                            <p className="text-gray-900 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                                {serviceCategory.slug}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                表示順
                                            </label>
                                            <p className="text-gray-900">
                                                {serviceCategory.sort_order}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                関連サービス数
                                            </label>
                                            <p className="text-gray-900">
                                                {servicesCount}件
                                                {servicesCount > 0 && (
                                                    <Link
                                                        href={route(
                                                            "admin.homepage.services.index",
                                                            {
                                                                category:
                                                                    serviceCategory.id,
                                                            }
                                                        )}
                                                        className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                                                    >
                                                        →サービス一覧を見る
                                                    </Link>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                        表示設定
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                カラー
                                            </label>
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-8 h-8 rounded-md border border-gray-300"
                                                    style={{
                                                        backgroundColor:
                                                            serviceCategory.color,
                                                    }}
                                                ></div>
                                                <span className="text-gray-900 font-mono text-sm">
                                                    {serviceCategory.color}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                アイコン
                                            </label>
                                            <div className="flex items-center space-x-3">
                                                {serviceCategory.icon ? (
                                                    <>
                                                        <div
                                                            className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                                                            style={{
                                                                backgroundColor:
                                                                    serviceCategory.color,
                                                            }}
                                                        >
                                                            <i
                                                                className={`heroicon-${serviceCategory.icon} h-4 w-4`}
                                                            ></i>
                                                        </div>
                                                        <span className="text-gray-900 font-mono text-sm">
                                                            {
                                                                serviceCategory.icon
                                                            }
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-500">
                                                        設定なし
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                ステータス
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                {serviceCategory.is_active ? (
                                                    <>
                                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                        <span className="text-green-600 font-medium">
                                                            アクティブ
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircleIcon className="h-5 w-5 text-red-500" />
                                                        <span className="text-red-600 font-medium">
                                                            非アクティブ
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* メタ情報 */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    システム情報
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <span className="font-medium">
                                            作成日時:
                                        </span>
                                        <span className="ml-2">
                                            {formatDate(
                                                serviceCategory.created_at
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            更新日時:
                                        </span>
                                        <span className="ml-2">
                                            {formatDate(
                                                serviceCategory.updated_at
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* アクションボタン */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                                <Link
                                    href={route(
                                        "admin.homepage.serviceCategories.index"
                                    )}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    一覧に戻る
                                </Link>
                                <Link
                                    href={route(
                                        "admin.homepage.serviceCategories.edit",
                                        serviceCategory
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
