import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Dl, Dt, Dd } from "@/Components/Description";
import { FlashMessage } from "@/Components/Notifications";
import { EditButton, DeleteButton } from "@/Components/Buttons";
// Icons
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    CheckIcon,
    XMarkIcon,
    PlusIcon,
    CurrencyYenIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Show({ servicePlan }) {
    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.servicePlans.actions.back,
            icon: ArrowLeftIcon,
            variant: "default",
            href: route("admin.service.plan.index"),
        },
    ];
    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.servicePlans.breadcrumbs,
        PageConfig.servicePlans.pages.show.breadcrumb,
    ];

    const handleDelete = () => {
        if (confirm(`「${servicePlan.name}」を削除しますか？`)) {
            router.delete(route("admin.service.plan.destroy", servicePlan.id));
        }
    };

    const formatPrice = (price, unit, setupFee) => {
        let priceText = price ? `¥${Number(price).toLocaleString()}` : "要相談";
        if (unit) priceText += `/${unit}`;
        if (setupFee > 0) {
            priceText += ` (初期費用: ¥${Number(setupFee).toLocaleString()})`;
        }
        return priceText;
    };

    const getBillingCycleLabel = (cycle) => {
        const labels = {
            one_time: "一回払い",
            monthly: "月額",
            quarterly: "四半期",
            yearly: "年額",
        };
        return labels[cycle] || cycle;
    };

    const StatusBadge = ({ isActive }) => (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
        >
            {isActive ? (
                <>
                    <CheckIcon className="h-3 w-3 mr-1" />
                    アクティブ
                </>
            ) : (
                <>
                    <XMarkIcon className="h-3 w-3 mr-1" />
                    非アクティブ
                </>
            )}
        </span>
    );

    const hasItems =
        servicePlan.service_plan_items &&
        servicePlan.service_plan_items.length > 0;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.servicePlans.pages.show.title}
                    description={PageConfig.servicePlans.pages.show.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head
                title={`${PageConfig.servicePlans.pages.show.title} - ${servicePlan.name}`}
            />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="space-y-6">
                {/* 操作ボタン */}
                <div className="flex items-center justify-end space-x-3">
                    <Link
                        href={route("admin.service.plan.edit", servicePlan.id)}
                    >
                        <EditButton>プラン情報を編集</EditButton>
                    </Link>
                    <DeleteButton onClick={handleDelete}>削除</DeleteButton>
                </div>

                {/* 基本情報カード */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>基本情報</span>
                            <StatusBadge
                                isActive={servicePlan.status === "active"}
                            />
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <Dt>プラン名</Dt>
                                <Dd className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {servicePlan.name}
                                </Dd>
                            </div>

                            <div>
                                <Dt>サービス</Dt>
                                <Dd>{servicePlan.service?.name || "未設定"}</Dd>
                            </div>

                            <div>
                                <Dt>基本料金</Dt>
                                <Dd className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                    ¥
                                    {Number(
                                        servicePlan.base_price || 0,
                                    ).toLocaleString()}
                                </Dd>
                            </div>

                            {servicePlan.discount_amount > 0 && (
                                <div>
                                    <Dt>割引額</Dt>
                                    <Dd className="text-xl font-bold text-red-600 dark:text-red-400">
                                        ¥
                                        {Number(
                                            servicePlan.discount_amount,
                                        ).toLocaleString()}
                                    </Dd>
                                </div>
                            )}

                            <div>
                                <Dt>請求サイクル</Dt>
                                <Dd>
                                    {getBillingCycleLabel(
                                        servicePlan.billing_cycle,
                                    )}
                                </Dd>
                            </div>

                            {servicePlan.setup_fee > 0 && (
                                <div>
                                    <Dt>初期費用</Dt>
                                    <Dd>
                                        ¥
                                        {Number(
                                            servicePlan.setup_fee,
                                        ).toLocaleString()}
                                    </Dd>
                                </div>
                            )}

                            <div>
                                <Dt>標準納期</Dt>
                                <Dd>
                                    {servicePlan.estimated_delivery_days
                                        ? `${servicePlan.estimated_delivery_days}日`
                                        : "要相談"}
                                </Dd>
                            </div>
                        </Dl>

                        {servicePlan.description && (
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Dt>説明</Dt>
                                <Dd className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {servicePlan.description}
                                </Dd>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* サービスアイテム */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>含まれるサービスアイテム</CardTitle>
                            <div className="flex items-center space-x-2">
                                {hasItems && (
                                    <Link
                                        href={route(
                                            "admin.service.plan.items.edit",
                                            servicePlan.id,
                                        )}
                                    >
                                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <PencilIcon className="h-4 w-4 mr-2" />
                                            編集
                                        </button>
                                    </Link>
                                )}
                                <Link
                                    href={route(
                                        "admin.service.plan.items.create",
                                        servicePlan.id,
                                    )}
                                >
                                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        {hasItems ? "追加" : "アイテムを追加"}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {hasItems ? (
                            <div className="space-y-3">
                                {servicePlan.service_plan_items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {item.service_item?.name ||
                                                        "アイテム名不明"}
                                                </h4>
                                                {item.service_item
                                                    ?.item_type ===
                                                "included" ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        プランに含まれる
                                                    </span>
                                                ) : item.service_item
                                                      ?.item_type ===
                                                  "optional" ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        オプション
                                                    </span>
                                                ) : item.service_item
                                                      ?.item_type ===
                                                  "addon" ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                        アドオン
                                                    </span>
                                                ) : null}
                                            </div>
                                            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                                <span>
                                                    数量: {item.quantity || 1}
                                                </span>
                                                {item.estimated_days > 0 && (
                                                    <span>
                                                        納期:{" "}
                                                        {item.estimated_days}日
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {item.service_item?.item_type ===
                                            "included" ? (
                                                <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                    ¥0
                                                </span>
                                            ) : (
                                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    ¥
                                                    {(
                                                        Number(
                                                            item.service_item
                                                                ?.standard_price ||
                                                                0,
                                                        ) * (item.quantity || 1)
                                                    ).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* 価格サマリー */}
                                <div className="mt-6 pt-4 border-t-2 border-gray-300 dark:border-gray-600">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                                            <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">
                                                基本料金
                                            </div>
                                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                                ¥
                                                {Number(
                                                    servicePlan.base_price || 0,
                                                ).toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                                            <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">
                                                アイテム合計
                                            </div>
                                            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                                ¥
                                                {servicePlan.service_plan_items
                                                    .reduce((sum, item) => {
                                                        if (
                                                            item.service_item
                                                                ?.item_type ===
                                                            "included"
                                                        )
                                                            return sum;
                                                        return (
                                                            sum +
                                                            Number(
                                                                item
                                                                    .service_item
                                                                    ?.standard_price ||
                                                                    0,
                                                            ) *
                                                                (item.quantity ||
                                                                    1)
                                                        );
                                                    }, 0)
                                                    .toLocaleString()}
                                            </div>
                                        </div>

                                        {servicePlan.discount_amount > 0 && (
                                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                                                <div className="text-sm text-red-700 dark:text-red-300 mb-1">
                                                    割引額
                                                </div>
                                                <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                                                    ¥
                                                    {Number(
                                                        servicePlan.discount_amount,
                                                    ).toLocaleString()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <CurrencyYenIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                    アイテムが登録されていません
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    このプランにサービスアイテムを追加してください。
                                </p>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
