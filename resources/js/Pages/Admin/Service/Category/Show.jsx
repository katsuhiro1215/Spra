import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { TextButton } from "@/Components/Buttons";
// Icons
import {
    ArrowLeftIcon,
    PencilIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

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

    const headerActions = [
        {
            label: PageConfig.serviceCategories.actions.back,
            icon: ArrowLeftIcon,
            variant: "default",
            route: route("admin.service.category.index"),
        },
        {
            label: PageConfig.serviceCategories.actions.edit,
            icon: PencilIcon,
            variant: "warning",
            route: route("admin.service.category.edit", serviceCategory.id),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.serviceCategories.title}
                    description={PageConfig.serviceCategories.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.serviceCategories.breadcrumbs}
                />
            }
        >
            <Head title={`サービスカテゴリ詳細 - ${serviceCategory.name}`} />

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
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
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            {serviceCategory.name}
                                        </h1>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {serviceCategory.slug}
                                            </span>
                                            <div className="flex items-center space-x-1">
                                                {serviceCategory.status ===
                                                "active" ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        稼働中
                                                    </span>
                                                ) : serviceCategory.status ===
                                                    "inactive" ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        停止中
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        一時停止
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {serviceCategory.description && (
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {serviceCategory.description}
                                    </p>
                                )}
                            </div>
                        </CardHeader>
                        <CardBody>
                            {/* 詳細情報 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                        基本情報
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                カテゴリ名
                                            </label>
                                            <p className="text-gray-900 dark:text-white">
                                                {serviceCategory.name}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                スラッグ
                                            </label>
                                            <p className="text-gray-900 dark:text-white font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                {serviceCategory.slug}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                表示順
                                            </label>
                                            <p className="text-gray-900 dark:text-white">
                                                {serviceCategory.sort_order}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                関連サービス数
                                            </label>
                                            <p className="text-gray-900 dark:text-white">
                                                {servicesCount}件
                                                {servicesCount > 0 && (
                                                    <TextButton
                                                        href={route(
                                                            "admin.service.category.index",
                                                            {
                                                                category:
                                                                    serviceCategory.id,
                                                            },
                                                        )}
                                                    >
                                                        →サービス一覧を見る
                                                    </TextButton>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                        表示設定
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
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
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
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
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                ステータス
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                {serviceCategory.status ===
                                                "active" ? (
                                                    <>
                                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                        <span className="text-green-600 font-medium">
                                                            稼働中
                                                        </span>
                                                    </>
                                                ) : serviceCategory.status ===
                                                    "inactive" ? (
                                                    <>
                                                        <XCircleIcon className="h-5 w-5 text-gray-500" />
                                                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                                                            停止中
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircleIcon className="h-5 w-5 text-red-500" />
                                                        <span className="text-red-600 dark:text-red-400 font-medium">
                                                            一時停止
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* メタ情報 */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    システム情報
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div>
                                        <span className="font-medium">
                                            作成日時:
                                        </span>
                                        <span className="ml-2">
                                            {formatDate(
                                                serviceCategory.created_at,
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            更新日時:
                                        </span>
                                        <span className="ml-2">
                                            {formatDate(
                                                serviceCategory.updated_at,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
