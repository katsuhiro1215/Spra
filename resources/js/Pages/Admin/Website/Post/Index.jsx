import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { PrimaryButton } from "@/Components/Buttons";
import { PlusIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import PostsFilterBar from "./_components/PostsFilterBar";
import PostsTable from "./_components/PostsTable";

const DEFAULT_TRASHED = "without_trashed";

const buildFilterState = (filters) => ({
    search: filters.search || "",
    status: filters.status || "",
    category_id: filters.category_id || "",
    author_id: filters.author_id || "",
    trashed: filters.trashed || DEFAULT_TRASHED,
});

export default function Index({
    posts,
    categories,
    authors,
    filters = {},
    stats = {},
}) {
    // ========================================
    // State & Form
    // ========================================
    const [activeTab, setActiveTab] = useState(
        filters.trashed || DEFAULT_TRASHED,
    );
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm(
        buildFilterState(filters),
    );

    // ========================================
    // Effects
    // ========================================
    useEffect(() => {
        setActiveTab(filters.trashed || DEFAULT_TRASHED);
        setData(buildFilterState(filters));
    }, [filters.trashed]);

    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (data.status || data.category_id || data.author_id) {
            setShowFilters(true);
        }
    }, [data.status, data.category_id, data.author_id]);

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.status !== filters.status ||
                data.category_id !== filters.category_id ||
                data.author_id !== filters.author_id
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.status, data.category_id, data.author_id]);

    // ========================================
    // Handlers - Tab
    // ========================================
    const handleTabChange = (tab) => {
        router.get(
            route("admin.website.post.index"),
            {
                search: data.search,
                status: data.status,
                category_id: data.category_id,
                author_id: data.author_id,
                trashed: tab,
            },
            {
                preserveState: false,
                preserveScroll: true,
            },
        );
    };

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.website.post.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            status: "",
            category_id: "",
            author_id: "",
            trashed: activeTab,
        });
        setShowFilters(false);
        get(route("admin.website.post.index", { trashed: activeTab }), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Delete / Restore
    // ========================================
    const handleDelete = (post) => {
        const confirmed = confirm(
            `「${post.title}」を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.website.post.destroy", post.id));
        }
    };

    const handleRestore = (post) => {
        const confirmed = confirm(
            `「${post.title}」を復元してもよろしいですか？`,
        );
        if (confirmed) {
            router.post(route("admin.website.post.restore", post.id));
        }
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.posts.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.website.post.create"),
        },
    ];

    // ========================================
    // Constants - Tabs & Filters
    // ========================================
    const tabs = [
        {
            key: "with_trashed",
            label: "すべて",
            count: stats?.total ?? posts.total,
        },
        {
            key: "without_trashed",
            label: "有効一覧",
            count: stats?.active ?? posts.total,
        },
        {
            key: "only_trashed",
            label: "削除済み",
            count: stats?.trashed ?? 0,
        },
    ];

    const hasActiveFilters =
        data.search || data.status || data.category_id || data.author_id;

    const activeFilterCount = [
        data.status,
        data.category_id,
        data.author_id,
    ].filter(Boolean).length;

    // ========================================
    // Render
    // ========================================
    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.posts.title}
                    description={PageConfig.posts.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.posts.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.posts.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* タブ + 検索 + フィルタートグル */}
                <PostsFilterBar
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    data={data}
                    setData={setData}
                    onSearch={handleSearch}
                    searchDisabled={processing}
                    categories={categories}
                    authors={authors}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    activeFilterCount={activeFilterCount}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                />

                {posts.data.length > 0 ? (
                    <>
                        {/* 統計情報 */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <div className="p-4 text-center">
                                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        {stats?.total ?? posts.total}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        総数
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <div className="p-4 text-center">
                                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {stats?.published ?? 0}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        公開
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <div className="p-4 text-center">
                                    <div className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                                        {stats?.draft ?? 0}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        下書き
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <div className="p-4 text-center">
                                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        {stats?.trashed ?? 0}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        削除済み
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* 一覧ヘッダー */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                投稿一覧 ({posts.total}件)
                            </h2>
                        </div>

                        {/* 投稿一覧テーブル */}
                        <PostsTable
                            posts={posts}
                            onDelete={handleDelete}
                            onRestore={handleRestore}
                            trashed={activeTab}
                        />

                        {/* ページネーション */}
                        {posts?.last_page > 1 && (
                            <Pagination paginationData={posts} />
                        )}
                    </>
                ) : (
                    /* データがない場合 */
                    <Card className="text-center py-12">
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            📝
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {filters.search
                                ? "検索に一致する投稿がありません"
                                : activeTab === "only_trashed"
                                  ? "削除済みの投稿はありません"
                                  : "投稿がまだありません"}
                        </p>
                        {!filters.search && activeTab !== "only_trashed" && (
                            <PrimaryButton
                                href={route("admin.website.post.create")}
                                size="md"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                最初の投稿を作成
                            </PrimaryButton>
                        )}
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
