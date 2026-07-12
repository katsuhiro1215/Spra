import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
// Icons
import {
    ArrowLeftIcon,
    PencilIcon,
    ListBulletIcon,
} from "@heroicons/react/24/outline";

export default function Show({ menu }) {
    const getLocationLabel = (location) => {
        const labels = {
            header: "ヘッダー",
            footer: "フッター",
            sidebar: "サイドバー",
        };
        return labels[location] || location;
    };

    const getLocationVariant = (location) => {
        const variants = {
            header: "info",
            footer: "success",
            sidebar: "warning",
        };
        return variants[location] || "secondary";
    };

    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.menu.index"),
        },
        {
            label: "アイテム管理",
            icon: ListBulletIcon,
            variant: "primary",
            route: route("admin.website.menu.item.index", menu.id),
        },
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.website.menu.edit", menu.id),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={menu.name}
                    description="メニューの詳細"
                    actions={headerActions}
                />
            }
        >
            <Head title={`メニュー - ${menu.name}`} />

            <div className="space-y-4">
                {/* 基本情報 */}
                <Card>
                    <CardHeader>基本情報</CardHeader>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    メニュー名
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {menu.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    スラッグ
                                </dt>
                                <dd className="mt-1">
                                    <code className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        {menu.slug}
                                    </code>
                                </dd>
                            </div>
                        </div>

                        {menu.description && (
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    説明
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {menu.description}
                                </dd>
                            </div>
                        )}

                        <div>
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                配置場所
                            </dt>
                            <dd>
                                <Badge
                                    variant={getLocationVariant(menu.location)}
                                    size="sm"
                                >
                                    {getLocationLabel(menu.location)}
                                </Badge>
                            </dd>
                        </div>
                    </div>
                </Card>

                {/* メニューアイテム */}
                {menu.menu_items && menu.menu_items.length > 0 && (
                    <Card>
                        <CardHeader>
                            メニューアイテム ({menu.menu_items.length}件)
                        </CardHeader>
                        <div className="p-6">
                            <div className="space-y-2">
                                {menu.menu_items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                                    >
                                        <div>
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {item.label}
                                            </span>
                                            {item.url && (
                                                <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                                                    {item.url}
                                                </span>
                                            )}
                                        </div>
                                        <Badge
                                            variant={
                                                item.is_active
                                                    ? "success"
                                                    : "secondary"
                                            }
                                            size="xs"
                                        >
                                            {item.is_active ? "有効" : "無効"}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <Link
                                    href={route(
                                        "admin.website.menu.item.index",
                                        menu.id,
                                    )}
                                    className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400"
                                >
                                    アイテムを管理 →
                                </Link>
                            </div>
                        </div>
                    </Card>
                )}

                {/* メタ情報 */}
                <Card>
                    <CardHeader>メタ情報</CardHeader>
                    <div className="p-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                作成日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(menu.created_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                更新日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(menu.updated_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
