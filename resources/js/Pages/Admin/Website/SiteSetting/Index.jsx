import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    Cog6ToothIcon,
    Bars3Icon,
    RectangleGroupIcon,
    MagnifyingGlassIcon,
    ShareIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const GROUP_LINKS = [
    {
        group: "general",
        label: "一般",
        description: "サイト名や連絡先などの基本設定",
        icon: Cog6ToothIcon,
        route: "admin.website.siteSetting.general",
    },
    {
        group: "navigation",
        label: "ナビゲーション",
        description: "ヘッダーのロゴ・CTAボタン設定",
        icon: Bars3Icon,
        route: "admin.website.siteSetting.navigation",
    },
    {
        group: "footer",
        label: "フッター",
        description: "フッターテキスト・SNSリンク設定",
        icon: RectangleGroupIcon,
        route: "admin.website.siteSetting.footer",
    },
    {
        group: "seo",
        label: "SEO",
        description: "デフォルトのメタ情報設定",
        icon: MagnifyingGlassIcon,
        route: "admin.website.siteSetting.seo",
    },
    {
        group: "ogp",
        label: "OGP",
        description: "SNSシェア時の表示設定",
        icon: ShareIcon,
        route: "admin.website.siteSetting.ogp",
    },
];

export default function Index({ customSettings = [] }) {
    const handleDelete = (setting) => {
        if (confirm(`設定「${setting.key}」を削除しますか？`)) {
            router.delete(
                route("admin.website.siteSetting.destroy", setting.id),
            );
        }
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.siteSettings.title}
                    description={PageConfig.siteSettings.description}
                    breadcrumbs={PageConfig.siteSettings.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.siteSettings.documentTitle} />

            <FlashMessage />

            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {GROUP_LINKS.map((item) => (
                        <Link
                            key={item.group}
                            href={route(item.route)}
                            className="block"
                        >
                            <Card className="h-full hover:ring-2 hover:ring-indigo-500 transition-shadow">
                                <CardBody>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 p-2">
                                            <item.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                {item.label}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Link>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <span>個別設定（カスタム項目）</span>
                            <PrimaryButton
                                href={route("admin.website.siteSetting.create")}
                                size="sm"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                追加
                            </PrimaryButton>
                        </div>
                    </CardHeader>
                    <Table>
                        <THead>
                            <Tr hover={false}>
                                <Th>キー</Th>
                                <Th>値</Th>
                                <Th>グループ</Th>
                                <Th>説明</Th>
                                <Th className="text-right">アクション</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {customSettings.length > 0 ? (
                                customSettings.map((setting) => (
                                    <Tr key={setting.id}>
                                        <Td>
                                            <span className="font-mono text-sm">
                                                {setting.key}
                                            </span>
                                        </Td>
                                        <Td>
                                            <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs inline-block">
                                                {typeof setting.value ===
                                                "object"
                                                    ? JSON.stringify(
                                                          setting.value,
                                                      )
                                                    : String(
                                                          setting.value ?? "-",
                                                      )}
                                            </span>
                                        </Td>
                                        <Td>{setting.group || "-"}</Td>
                                        <Td>{setting.description || "-"}</Td>
                                        <Td className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={route(
                                                        "admin.website.siteSetting.edit",
                                                        setting.id,
                                                    )}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 p-1"
                                                    title="編集"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(setting)
                                                    }
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 p-1"
                                                    title="削除"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td
                                        colSpan={5}
                                        className="text-center text-slate-500 dark:text-slate-400 py-8"
                                    >
                                        カスタム設定はありません
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
