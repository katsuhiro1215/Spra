import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import MediaSelectModal from "@/Components/Media/MediaSelectModal";
import {
    ArrowLeftIcon,
    PencilIcon,
    CameraIcon,
    MegaphoneIcon,
} from "@heroicons/react/24/outline";

const STATUS_BADGE_VARIANTS = {
    開催中: "success",
    開催前: "info",
    終了: "secondary",
    停止中: "danger",
};

const formatDiscount = (campaign) => {
    if (campaign.discount_type === "percentage") {
        return `${campaign.discount_value}% OFF`;
    }
    return `${new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(campaign.discount_value)} OFF`;
};

export default function Show({ campaign, mediaList = [] }) {
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaListState, setMediaListState] = useState(mediaList);

    const handleMediaSelect = (mediaId) => {
        router.post(
            route("admin.campaign.attach-media", campaign.id),
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
            router.delete(route("admin.campaign.detach-media", campaign.id), {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.campaign.index"),
        },
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.campaign.edit", campaign.id),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={campaign.name}
                    description="キャンペーンの詳細"
                    actions={headerActions}
                />
            }
        >
            <Head title={`キャンペーン - ${campaign.name}`} />

            <div className="space-y-4">
                <Card>
                    <CardHeader>サムネイル画像</CardHeader>
                    <div className="p-6">
                        <div className="relative w-full sm:w-64 h-36 rounded-lg overflow-hidden group bg-gradient-to-br from-slate-700 to-slate-900">
                            {campaign.media ? (
                                <img
                                    src={campaign.media.url}
                                    alt={campaign.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <MegaphoneIcon className="h-10 w-10 text-white/20" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {campaign.media && (
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
                        </div>
                    </div>
                </Card>

                <Card>
                    <CardHeader>基本情報</CardHeader>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    コード
                                </dt>
                                <dd className="mt-1">
                                    <code className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        {campaign.code}
                                    </code>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    状態
                                </dt>
                                <dd className="mt-1">
                                    <Badge
                                        variant={
                                            STATUS_BADGE_VARIANTS[
                                                campaign.status_label
                                            ] || "secondary"
                                        }
                                        size="sm"
                                    >
                                        {campaign.status_label}
                                    </Badge>
                                </dd>
                            </div>
                        </div>

                        {campaign.description && (
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    説明
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {campaign.description}
                                </dd>
                            </div>
                        )}
                    </div>
                </Card>

                <Card>
                    <CardHeader>割引設定</CardHeader>
                    <div className="p-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                割引
                            </span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {formatDiscount(campaign)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                開始日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(campaign.starts_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                終了日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(campaign.ends_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <CardHeader>メタ情報</CardHeader>
                    <div className="p-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                作成日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(campaign.created_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                更新日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(campaign.updated_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

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
