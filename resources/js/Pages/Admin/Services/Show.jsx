import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import TabNavigation from "@/Components/TabNavigation";
import MediaSelectModal from "@/Components/Media/MediaSelectModal";
import {
    ArrowLeftIcon,
    PencilIcon,
    CameraIcon,
    Squares2X2Icon,
    StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { PageConfig } from "@/Constants/PageConfig";
import { getStatusBadge } from "@/Constants/Badges";

export default function Show({
    service,
    servicePlans = [],
    serviceItems = [],
    mediaList = [],
}) {
    const [activeTab, setActiveTab] = useState("basic");
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaListState, setMediaListState] = useState(mediaList);

    const handleMediaSelect = (mediaId) => {
        router.post(
            route("admin.service.attach-media", service.id),
            { media_id: mediaId },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setShowMediaModal(false),
            },
        );
    };

    const handleMediaUploaded = (newMedia) => {
        setMediaListState((prev) => [newMedia, ...prev]);
    };

    const handleDetachMedia = () => {
        if (confirm("サムネイル画像を削除しますか？")) {
            router.delete(route("admin.service.detach-media", service.id), {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const tabs = [
        {
            key: "basic",
            label: "基本情報",
        },
        {
            key: "plans",
            label: "サービスプラン",
            count: servicePlans.length,
        },
        {
            key: "items",
            label: "サービス項目",
            count: serviceItems.length,
        },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "basic":
                return (
                    <div className="space-y-8">
                        {service.description && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                    概要
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        )}

                        {service.details && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                    詳細説明
                                </h3>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {service.details}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                    基本情報
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        スラッグ
                                    </label>
                                    <p className="text-gray-900 dark:text-white font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded inline-block">
                                        {service.slug}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        サービスカテゴリ
                                    </label>
                                    {service.service_category ? (
                                        <Link
                                            href={route(
                                                "admin.service.category.show",
                                                service.service_category.id,
                                            )}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                                        >
                                            {service.service_category.name}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-500 dark:text-gray-400">
                                            未設定
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        表示順
                                    </label>
                                    <p className="text-gray-900 dark:text-white">
                                        {service.sort_order}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                    表示設定
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        アイコン
                                    </label>
                                    {service.icon ? (
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                                <i
                                                    className={`heroicon-${service.icon} h-4 w-4`}
                                                ></i>
                                            </div>
                                            <span className="text-gray-900 dark:text-white font-mono text-sm">
                                                {service.icon}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-500 dark:text-gray-400">
                                            設定なし
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Web公開
                                    </label>
                                    <span className="text-gray-900 dark:text-white">
                                        {service.is_displayed
                                            ? "公開中"
                                            : "非公開"}
                                    </span>
                                </div>
                            </div>
                        </div>

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
                    </div>
                );
            case "plans":
                return (
                    <div>
                        <div className="flex items-center justify-end mb-4">
                            <PrimaryButton
                                href={route("admin.service.plan.create", {
                                    service_id: service.id,
                                })}
                            >
                                プランを作成
                            </PrimaryButton>
                        </div>
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
                                                            {plan.description}
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
                                                    <Badge
                                                        variant={
                                                            getStatusBadge(
                                                                plan.status,
                                                            ).variant
                                                        }
                                                        size="sm"
                                                    >
                                                        {
                                                            getStatusBadge(
                                                                plan.status,
                                                            ).text
                                                        }
                                                    </Badge>
                                                </div>
                                            </div>

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
                                                            <span>割引:</span>
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
                    </div>
                );
            case "items":
                return (
                    <div>
                        <div className="flex items-center justify-end mb-4">
                            <PrimaryButton
                                href={route("admin.service.item.create", {
                                    service_id: service.id,
                                })}
                            >
                                項目を作成
                            </PrimaryButton>
                        </div>
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
                                                <Badge
                                                    variant={
                                                        getStatusBadge(
                                                            item.status,
                                                        ).variant
                                                    }
                                                    size="sm"
                                                >
                                                    {
                                                        getStatusBadge(
                                                            item.status,
                                                        ).text
                                                    }
                                                </Badge>
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
                    </div>
                );
            default:
                return null;
        }
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
                {/* ヘッダー（カバー画像） */}
                <div className="relative w-full h-32 sm:h-44 rounded-lg overflow-hidden group bg-gradient-to-br from-slate-700 to-slate-900">
                    {service.thumbnail ? (
                        <img
                            src={service.thumbnail.url}
                            alt={service.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Squares2X2Icon className="h-16 w-16 text-white/20" />
                        </div>
                    )}
                    {/* テキストを読みやすくするグラデーション */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* 画像変更・削除ボタン */}
                    <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {service.thumbnail && (
                            <button
                                onClick={handleDetachMedia}
                                className="px-2 py-1 text-xs text-white bg-black/40 hover:bg-black/60 rounded transition-colors"
                            >
                                画像を削除
                            </button>
                        )}
                        <button
                            onClick={() => setShowMediaModal(true)}
                            className="p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
                            title="画像を変更"
                        >
                            <CameraIcon className="h-4 w-4 text-white" />
                        </button>
                    </div>

                    {/* サービス名・バッジ・編集ボタン */}
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
                            <h1 className="text-lg sm:text-2xl font-bold text-white drop-shadow truncate">
                                {service.name}
                            </h1>
                            <Badge variant={getStatusBadge(service.status).variant}>
                                {getStatusBadge(service.status).text}
                            </Badge>
                            {service.is_featured && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                    <StarIconSolid className="h-3.5 w-3.5" />
                                    注目
                                </span>
                            )}
                            {!service.is_displayed && (
                                <Badge variant="secondary">非公開</Badge>
                            )}
                        </div>

                        <SecondaryButton
                            href={route("admin.service.edit", service.id)}
                            icon={PencilIcon}
                            className="flex-shrink-0"
                        >
                            編集
                        </SecondaryButton>
                    </div>
                </div>

                {/* 統計情報 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {servicePlans.length}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                プラン数
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {serviceItems.length}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                項目数
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {service.sort_order}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                表示順
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {service.is_displayed ? "公開中" : "非公開"}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                Web表示
                            </div>
                        </div>
                    </Card>
                </div>

                {/* タブナビゲーション */}
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow">
                    <TabNavigation
                        tabs={tabs}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                    <div className="p-6">{renderTabContent()}</div>
                </div>
            </div>

            {/* メディア選択モーダル */}
            <MediaSelectModal
                show={showMediaModal}
                mediaList={mediaListState}
                multiple={false}
                uploadRoute={route("admin.media.store")}
                onClose={() => setShowMediaModal(false)}
                onSelect={handleMediaSelect}
                onMediaUploaded={handleMediaUploaded}
            />
        </AdminAuthenticatedLayout>
    );
}
