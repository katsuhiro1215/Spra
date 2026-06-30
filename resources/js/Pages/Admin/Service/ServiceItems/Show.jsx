import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
// Icons
import { PencilIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function Show({ serviceItem }) {
    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "サービス管理", href: null },
        {
            label: "サービス項目一覧",
            href: route("admin.service.item.index"),
        },
        { label: serviceItem.name, href: null },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            inactive:
                "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        };
        const labels = {
            active: "有効",
            inactive: "無効",
        };
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}
            >
                {labels[status]}
            </span>
        );
    };

    const getItemTypeBadge = (type) => {
        const badges = {
            plan_base:
                "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
            included:
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            optional:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            addon: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        };
        const labels = {
            plan_base: "プラン基本料金",
            included: "プラン含まれる項目",
            optional: "プラン固有オプション",
            addon: "全プラン共通オプション",
        };
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${badges[type]}`}
            >
                {labels[type]}
            </span>
        );
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={serviceItem.name}
                    description="サービス項目の詳細情報"
                    breadcrumbs={breadcrumbs}
                    action={
                        <Link
                            href={route(
                                "admin.service.item.edit",
                                serviceItem.id,
                            )}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                        >
                            <PencilIcon className="h-5 w-5 mr-2" />
                            編集
                        </Link>
                    }
                />
            }
        >
            <Head title={`サービス項目詳細 - ${serviceItem.name}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* メイン情報 */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>基本情報</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            項目名
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 flex items-center">
                                            {serviceItem.name}
                                            {serviceItem.is_required && (
                                                <CheckCircleIcon className="ml-2 h-5 w-5 text-green-500" />
                                            )}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            サービス
                                        </dt>
                                        <dd className="mt-1 text-sm">
                                            <Link
                                                href={route(
                                                    "admin.service.show",
                                                    serviceItem.service.id,
                                                )}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {serviceItem.service.name}
                                            </Link>
                                            {serviceItem.service
                                                .service_category && (
                                                <span className="ml-2 text-gray-500 dark:text-gray-400">
                                                    (
                                                    {
                                                        serviceItem.service
                                                            .service_category
                                                            .name
                                                    }
                                                    )
                                                </span>
                                            )}
                                        </dd>
                                    </div>

                                    {serviceItem.service_plan && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                サービスプラン
                                            </dt>
                                            <dd className="mt-1 text-sm">
                                                <Link
                                                    href={route(
                                                        "admin.service.plan.show",
                                                        serviceItem.service_plan
                                                            .id,
                                                    )}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    {
                                                        serviceItem.service_plan
                                                            .name
                                                    }
                                                </Link>
                                            </dd>
                                        </div>
                                    )}

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            項目タイプ
                                        </dt>
                                        <dd className="mt-1">
                                            {getItemTypeBadge(
                                                serviceItem.item_type,
                                            )}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            ステータス
                                        </dt>
                                        <dd className="mt-1">
                                            {getStatusBadge(serviceItem.status)}
                                        </dd>
                                    </div>

                                    {serviceItem.description && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                説明
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {serviceItem.description}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>料金・納期情報</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            価格
                                        </dt>
                                        <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            ¥
                                            {Number(
                                                serviceItem.price,
                                            ).toLocaleString()}
                                        </dd>
                                    </div>

                                    {serviceItem.estimated_days && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                作業日数目安
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {serviceItem.estimated_days}日
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </CardBody>
                        </Card>
                    </div>

                    {/* サイドバー */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>設定</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            必須項目
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {serviceItem.is_required
                                                ? "はい"
                                                : "いいえ"}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            表示順
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {serviceItem.sort_order}
                                        </dd>
                                    </div>
                                </dl>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>管理情報</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <dl className="space-y-4 text-sm">
                                    <div>
                                        <dt className="text-gray-500 dark:text-gray-400">
                                            作成者
                                        </dt>
                                        <dd className="mt-1 text-gray-900 dark:text-gray-100">
                                            {serviceItem.creator?.name || "---"}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500 dark:text-gray-400">
                                            作成日時
                                        </dt>
                                        <dd className="mt-1 text-gray-900 dark:text-gray-100">
                                            {new Date(
                                                serviceItem.created_at,
                                            ).toLocaleString("ja-JP")}
                                        </dd>
                                    </div>
                                    {serviceItem.updater && (
                                        <>
                                            <div>
                                                <dt className="text-gray-500 dark:text-gray-400">
                                                    更新者
                                                </dt>
                                                <dd className="mt-1 text-gray-900 dark:text-gray-100">
                                                    {serviceItem.updater.name}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-500 dark:text-gray-400">
                                                    更新日時
                                                </dt>
                                                <dd className="mt-1 text-gray-900 dark:text-gray-100">
                                                    {new Date(
                                                        serviceItem.updated_at,
                                                    ).toLocaleString("ja-JP")}
                                                </dd>
                                            </div>
                                        </>
                                    )}
                                </dl>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
