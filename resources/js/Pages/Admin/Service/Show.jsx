import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Dl, Dt, Dd } from "@/Components/Description";
import { EditButton, SecondaryButton } from "@/Components/Buttons";
// Icons
import {
    ArrowLeftIcon,
    PencilIcon,
    CheckCircleIcon,
    XCircleIcon,
    StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { PageConfig } from "@/Constants/PageConfig";

export default function Show({ service, servicePlansCount = 0 }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.services.actions.back,
            icon: ArrowLeftIcon,
            variant: "default",
            route: route("admin.service.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.services.pages.show.title}
                    description={PageConfig.services.pages.show.description}
                    actions={headerActions}
                    breadcrumbs={[
                        ...PageConfig.services.breadcrumbs,
                        PageConfig.services.pages.show.breadcrumb,
                    ]}
                />
            }
        >
            <Head title={`${PageConfig.services.pages.show.title} - ${service.name}`} />

            <FlashMessage />

            <div className="space-y-6">
                {/* 基本情報 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* サービス情報 */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <div className="mb-8">
                                <div className="flex items-center space-x-4 mb-4">
                                    {service.icon && (
                                        <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                            <i
                                                className={`heroicon-${service.icon} h-8 w-8`}
                                            ></i>
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                                {service.name}
                                            </h1>
                                            {service.is_featured && (
                                                <StarIconSolid className="h-8 w-8 text-yellow-400" />
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {service.slug}
                                            </span>
                                            <div className="flex items-center space-x-1">
                                                {service.status === "active" ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        稼働中
                                                    </span>
                                                ) : service.status ===
                                                  "inactive" ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                        停止中
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                        一時停止
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {service.description && (
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                        {service.description}
                                    </p>
                                )}

                                {service.details && (
                                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            詳細説明
                                        </h4>
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {service.details}
                                        </p>
                                    </div>
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
                                                サービス名
                                            </label>
                                            <p className="text-gray-900 dark:text-white">
                                                {service.name}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                スラッグ
                                            </label>
                                            <p className="text-gray-900 dark:text-white font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                {service.slug}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                サービスカテゴリ
                                            </label>
                                            {service.service_category ? (
                                                <Link
                                                    href={route(
                                                        "admin.service.category.show",
                                                        service.service_category
                                                            .id,
                                                    )}
                                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    {
                                                        service.service_category
                                                            .name
                                                    }
                                                </Link>
                                            ) : (
                                                <span className="text-gray-500">
                                                    未設定
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                表示順
                                            </label>
                                            <p className="text-gray-900">
                                                {service.sort_order}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                関連プラン数
                                            </label>
                                            <p className="text-gray-900">
                                                {servicePlansCount}件
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
                                                アイコン
                                            </label>
                                            <div className="flex items-center space-x-3">
                                                {service.icon ? (
                                                    <>
                                                        <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                                                            <i
                                                                className={`heroicon-${service.icon} h-4 w-4`}
                                                            ></i>
                                                        </div>
                                                        <span className="text-gray-900 font-mono text-sm">
                                                            {service.icon}
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
                                                {service.status === "active" ? (
                                                    <>
                                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                        <span className="text-green-600 font-medium">
                                                            稼働中
                                                        </span>
                                                    </>
                                                ) : service.status ===
                                                  "inactive" ? (
                                                    <>
                                                        <XCircleIcon className="h-5 w-5 text-gray-500" />
                                                        <span className="text-gray-600 font-medium">
                                                            停止中
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircleIcon className="h-5 w-5 text-red-500" />
                                                        <span className="text-red-600 font-medium">
                                                            一時停止
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                注目サービス
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                {service.is_featured ? (
                                                    <>
                                                        <StarIconSolid className="h-5 w-5 text-yellow-400" />
                                                        <span className="text-yellow-600 font-medium">
                                                            有効
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <StarIcon className="h-5 w-5 text-gray-400" />
                                                        <span className="text-gray-600">
                                                            無効
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
                                <SecondaryButton
                                    href={route("admin.service.index")}
                                >
                                    一覧に戻る
                                </SecondaryButton>
                                <EditButton
                                    href={route(
                                        "admin.service.edit",
                                        service.id,
                                    )}
                                >
                                    編集
                                </EditButton>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
