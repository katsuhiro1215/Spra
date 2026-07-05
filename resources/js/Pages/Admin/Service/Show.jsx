import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Dl, Dt, Dd } from "@/Components/Description";
import {
    EditButton,
    PrimaryButton,
    SecondaryButton,
} from "@/Components/Buttons";
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

export default function Show({
    service,
    servicePlans = [],
    serviceItems = [],
}) {
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
            <Head
                title={`${PageConfig.services.pages.show.title} - ${service.name}`}
            />

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
                                                {servicePlans.length}件
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
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    サービスプラン
                                </h2>
                                <PrimaryButton
                                    href={route("admin.service.plan.create", {
                                        service_id: service.id,
                                    })}
                                >
                                    プランを作成
                                </PrimaryButton>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {servicePlans.length > 0 ? (
                                <div className="space-y-4">
                                    {servicePlans.map((plan) => {
                                        const itemsTotal =
                                            plan.service_items?.reduce(
                                                (sum, item) =>
                                                    sum +
                                                    Number(item.price) *
                                                        (item.pivot?.quantity ||
                                                            1),
                                                0,
                                            ) || 0;
                                        const discountAmount =
                                            Number(plan.discount_amount) || 0;

                                        return (
                                            <Link
                                                key={plan.id}
                                                href={route(
                                                    "admin.service.plan.show",
                                                    plan.id,
                                                )}
                                                className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                            {plan.name}
                                                        </h3>
                                                        {plan.description && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                                {
                                                                    plan.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                                                            ¥
                                                            {Number(
                                                                plan.base_price,
                                                            ).toLocaleString()}
                                                        </p>
                                                        <span
                                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                plan.status ===
                                                                "active"
                                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                            }`}
                                                        >
                                                            {plan.status ===
                                                            "active"
                                                                ? "有効"
                                                                : "無効"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* 価格の内訳 */}
                                                {(itemsTotal > 0 ||
                                                    discountAmount > 0) && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                                        {itemsTotal > 0 && (
                                                            <div className="flex justify-between">
                                                                <span>
                                                                    項目合計:
                                                                </span>
                                                                <span>
                                                                    ¥
                                                                    {Number(
                                                                        itemsTotal,
                                                                    ).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {discountAmount > 0 && (
                                                            <div className="flex justify-between text-red-600 dark:text-red-400">
                                                                <span>
                                                                    割引:
                                                                </span>
                                                                <span>
                                                                    -¥
                                                                    {Number(
                                                                        discountAmount,
                                                                    ).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {plan.service_items &&
                                                            plan.service_items
                                                                .length > 0 && (
                                                                <div className="flex justify-between">
                                                                    <span>
                                                                        含まれる項目:
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            plan
                                                                                .service_items
                                                                                .length
                                                                        }
                                                                        件
                                                                    </span>
                                                                </div>
                                                            )}
                                                    </div>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                    このサービスに関連するプランはまだ登録されていません。
                                </p>
                            )}
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    サービス項目
                                </h2>
                                <PrimaryButton
                                    href={route("admin.service.item.create", {
                                        service_id: service.id,
                                    })}
                                >
                                    項目を作成
                                </PrimaryButton>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {serviceItems.length > 0 ? (
                                <div className="space-y-4">
                                    {serviceItems.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={route(
                                                "admin.service.item.show",
                                                item.id,
                                            )}
                                            className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                        {item.name}
                                                    </h3>
                                                    {item.description && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    {item.price && (
                                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                            ¥
                                                            {Number(
                                                                item.price,
                                                            ).toLocaleString()}
                                                        </p>
                                                    )}
                                                    <span
                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                            item.status ===
                                                            "active"
                                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                        }`}
                                                    >
                                                        {item.status ===
                                                        "active"
                                                            ? "有効"
                                                            : "無効"}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                    このサービスに関連する項目はまだ登録されていません。
                                </p>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
