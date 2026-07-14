import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Dl, Dt, Dd } from "@/Components/Description";
import {
    EditButton,
    DeleteButton,
} from "@/Components/Buttons";
// Icons
import {
    ArrowLeftIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Show({ serviceItem }) {
    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.serviceItems.actions.back,
            icon: ArrowLeftIcon,
            variant: "default",
            route: route("admin.service.item.index"),
        },
    ];
    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.serviceItems.breadcrumbs,
        PageConfig.serviceItems.pages.show.breadcrumb,
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
                    title={PageConfig.serviceItems.pages.show.title}
                    description={PageConfig.serviceItems.pages.show.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head
                title={`${PageConfig.serviceItems.pages.show.title} - ${serviceItem.name}`}
            />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="space-y-6">
                {/* 編集ボタンと削除ボタン */}
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={route(
                            "admin.service.item.edit",
                            serviceItem.id,
                        )}
                    >
                        <EditButton>編集</EditButton>
                    </Link>
                    <Link
                        href={route(
                            "admin.service.item.destroy",
                            serviceItem.id,
                        )}
                    >
                        <DeleteButton>削除</DeleteButton>
                    </Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* メイン情報 */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>基本情報</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Dl>
                                    <div>
                                        <Dt>項目名</Dt>
                                        <Dd>
                                            {serviceItem.name}
                                            {serviceItem.is_required && (
                                                <CheckCircleIcon className="ml-2 h-5 w-5 text-green-500" />
                                            )}
                                        </Dd>
                                    </div>

                                    <div>
                                        <Dt>サービス</Dt>
                                        <Dd>
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
                                        </Dd>
                                    </div>

                                    {serviceItem.service_plan && (
                                        <div>
                                            <Dt>サービスプラン</Dt>
                                            <Dd>
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
                                            </Dd>
                                        </div>
                                    )}

                                    <div>
                                        <Dt>項目タイプ</Dt>
                                        <Dd>
                                            {getItemTypeBadge(
                                                serviceItem.item_type,
                                            )}
                                        </Dd>
                                    </div>

                                    <div>
                                        <Dt>ステータス</Dt>
                                        <Dd>
                                            {getStatusBadge(serviceItem.status)}
                                        </Dd>
                                    </div>

                                    {serviceItem.description && (
                                        <div>
                                            <Dt>説明</Dt>
                                            <Dd>{serviceItem.description}</Dd>
                                        </div>
                                    )}
                                </Dl>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>料金・納期情報</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Dl>
                                    <div>
                                        <Dt>標準価格</Dt>
                                        <Dd>
                                            ¥
                                            {Number(
                                                serviceItem.standard_price,
                                            ).toLocaleString()}
                                        </Dd>
                                    </div>
                                    <div>
                                        <Dt>原価</Dt>
                                        <Dd>
                                            ¥
                                            {Number(
                                                serviceItem.internal_cost,
                                            ).toLocaleString()}
                                        </Dd>
                                    </div>

                                    {serviceItem.estimated_days && (
                                        <div>
                                            <Dt>作業日数目安</Dt>
                                            <Dd>
                                                {serviceItem.estimated_days}日
                                            </Dd>
                                        </div>
                                    )}
                                </Dl>
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
                                        <Dt>必須項目</Dt>
                                        <Dd>
                                            {serviceItem.is_required
                                                ? "はい"
                                                : "いいえ"}
                                        </Dd>
                                    </div>

                                    <div>
                                        <Dt>表示順</Dt>
                                        <Dd>{serviceItem.sort_order}</Dd>
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
                                        <Dt>作成者</Dt>
                                        <Dd>
                                            {serviceItem.creator?.name || "---"}
                                        </Dd>
                                    </div>
                                    <div>
                                        <Dt>作成日時</Dt>
                                        <Dd>
                                            {new Date(
                                                serviceItem.created_at,
                                            ).toLocaleString("ja-JP")}
                                        </Dd>
                                    </div>
                                    {serviceItem.updater && (
                                        <>
                                            <div>
                                                <Dt>更新者</Dt>
                                                <Dd>
                                                    {serviceItem.updater.name}
                                                </Dd>
                                            </div>
                                            <div>
                                                <Dt>更新日時</Dt>
                                                <Dd>
                                                    {new Date(
                                                        serviceItem.updated_at,
                                                    ).toLocaleString("ja-JP")}
                                                </Dd>
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
