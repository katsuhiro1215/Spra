import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardBody } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import {
    DocumentTextIcon,
    TagIcon,
    Squares2X2Icon,
    NewspaperIcon,
    FolderIcon,
    Bars3Icon,
    Cog6ToothIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Index({ stats = {} }) {
    const headerActions = [
        {
            label: PageConfig.pages.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.website.page.create"),
        },
    ];

    const sections = [
        {
            name: "固定ページ",
            description: "会社概要・お問い合わせなどの固定ページを管理します",
            icon: DocumentTextIcon,
            count: stats.pages,
            countLabel: "件",
            route: route("admin.website.page.index"),
            createRoute: route("admin.website.page.create"),
        },
        {
            name: "ページタイプ",
            description: "ページのレイアウト・種別を管理します",
            icon: Squares2X2Icon,
            count: stats.pageTypes,
            countLabel: "件",
            route: route("admin.website.page.type.index"),
            createRoute: route("admin.website.page.type.create"),
        },
        {
            name: "セクション",
            description: "ページを構成するセクションを管理します",
            icon: FolderIcon,
            count: stats.sections,
            countLabel: "件",
            route: route("admin.website.section.index"),
            createRoute: route("admin.website.section.create"),
        },
        {
            name: "投稿",
            description: "ブログ・お知らせなどの投稿を管理します",
            icon: NewspaperIcon,
            count: stats.posts,
            countLabel: `件（公開 ${stats.publishedPosts ?? 0}件）`,
            route: route("admin.website.post.index"),
            createRoute: route("admin.website.post.create"),
        },
        {
            name: "投稿カテゴリ",
            description: "投稿のカテゴリを管理します",
            icon: TagIcon,
            count: stats.postCategories,
            countLabel: "件",
            route: route("admin.website.post.category.index"),
            createRoute: route("admin.website.post.category.create"),
        },
        {
            name: "メニュー",
            description: "サイトのナビゲーションメニューを管理します",
            icon: Bars3Icon,
            count: stats.menus,
            countLabel: "件",
            route: route("admin.website.menu.index"),
            createRoute: route("admin.website.menu.create"),
        },
        {
            name: "サイト設定",
            description: "一般・ナビゲーション・フッター・SEO・OGPの設定を行います",
            icon: Cog6ToothIcon,
            count: stats.siteSettings,
            countLabel: "件",
            route: route("admin.website.siteSetting.index"),
            createRoute: null,
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.websiteDashboard.title}
                    description={PageConfig.websiteDashboard.description}
                    actions={headerActions}
                />
            }
        >
            <Head title={PageConfig.websiteDashboard.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sections.map((section) => (
                        <Card key={section.name} className="h-full">
                            <CardBody>
                                <Link
                                    href={section.route}
                                    className="flex items-start gap-3 group"
                                >
                                    <div className="flex-shrink-0 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 p-2.5">
                                        <section.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                            {section.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            {section.description}
                                        </p>
                                        {section.count !== undefined && (
                                            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                                                {section.count}
                                                <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
                                                    {section.countLabel}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </Link>
                                {section.createRoute && (
                                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                                        <Link
                                            href={section.createRoute}
                                            className="inline-flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                                        >
                                            <PlusIcon className="h-3.5 w-3.5 mr-1" />
                                            新規作成
                                        </Link>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
