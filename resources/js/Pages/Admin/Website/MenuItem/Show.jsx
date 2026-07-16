import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function Show({ menu, menuItem }) {
    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.menu.item.index", menu.id),
        },
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.website.menu.item.edit", [
                menu.id,
                menuItem.id,
            ]),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={menuItem.label}
                    description="メニューアイテムの詳細"
                    actions={headerActions}
                />
            }
        >
            <Head title={`メニューアイテム - ${menuItem.label}`} />

            <div className="space-y-4">
                {/* 基本情報 */}
                <Card>
                    <CardHeader>基本情報</CardHeader>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    ラベル
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {menuItem.label}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    メニュー
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    <Link
                                        href={route(
                                            "admin.website.menu.show",
                                            menu.id,
                                        )}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                                    >
                                        {menu.name}
                                    </Link>
                                </dd>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    親アイテム
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {menuItem.parent ? (
                                        <Link
                                            href={route(
                                                "admin.website.menu.item.show",
                                                [menu.id, menuItem.parent.id],
                                            )}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                                        >
                                            {menuItem.parent.label}
                                        </Link>
                                    ) : (
                                        "-"
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    表示順
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {menuItem.sort_order ?? "-"}
                                </dd>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* リンク設定 */}
                <Card>
                    <CardHeader>リンク設定</CardHeader>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    ページ
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {menuItem.page ? (
                                        <Link
                                            href={route(
                                                "admin.website.page.show",
                                                menuItem.page.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                                        >
                                            {menuItem.page.title}
                                        </Link>
                                    ) : (
                                        "-"
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    ターゲット
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {menuItem.target || "_self"}
                                </dd>
                            </div>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                URL
                            </dt>
                            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                {menuItem.url || "-"}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                ステータス
                            </dt>
                            <dd>
                                <Badge
                                    variant={
                                        menuItem.is_active
                                            ? "success"
                                            : "secondary"
                                    }
                                    size="sm"
                                >
                                    {menuItem.is_active ? "有効" : "無効"}
                                </Badge>
                            </dd>
                        </div>
                    </div>
                </Card>

                {/* 子アイテム */}
                {menuItem.children && menuItem.children.length > 0 && (
                    <Card>
                        <CardHeader>
                            子アイテム ({menuItem.children.length}件)
                        </CardHeader>
                        <div className="p-6">
                            <div className="space-y-2">
                                {menuItem.children.map((child) => (
                                    <Link
                                        key={child.id}
                                        href={route(
                                            "admin.website.menu.item.show",
                                            [menu.id, child.id],
                                        )}
                                        className="block p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {child.label}
                                            </span>
                                            <Badge
                                                variant={
                                                    child.is_active
                                                        ? "success"
                                                        : "secondary"
                                                }
                                                size="xs"
                                            >
                                                {child.is_active
                                                    ? "有効"
                                                    : "無効"}
                                            </Badge>
                                        </div>
                                    </Link>
                                ))}
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
                                {new Date(menuItem.created_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                更新日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(menuItem.updated_at).toLocaleString(
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
