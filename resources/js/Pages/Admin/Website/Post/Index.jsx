import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
// Icons
import { PlusIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// Post Components
import PostsTable from "./_components/PostsTable";

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
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        status: filters.status || "",
        category_id: filters.category_id || "",
        author_id: filters.author_id || "",
        trashed: filters.trashed || "",
    });

    // ========================================
    // Effects
    // ========================================
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
            trashed: "",
        });
        setShowFilters(false);
        get(route("admin.website.post.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Delete
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
    // Constants - Filters
    // ========================================
    const hasActiveFilters =
        data.search || data.status || data.category_id || data.author_id;

    const activeFilterCount = [
        data.status,
        data.category_id,
        data.author_id,
    ].filter(Boolean).length;

    const statusOptions = [
        { value: "", label: "すべて" },
        { value: "published", label: "公開" },
        { value: "draft", label: "下書き" },
    ];

    const trashedTabs = [
        { value: "", label: "すべて", key: "all" },
        { value: "only", label: "削除済み", key: "only" },
    ];

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
                />
            }
        >
            <Head title={PageConfig.posts.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 削除済みタブ */}
                <Card>
                    <div className="p-4">
                        <div className="flex gap-2">
                            {trashedTabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => {
                                        setData("trashed", tab.value);
                                        get(route("admin.website.post.index"), {
                                            preserveState: true,
                                            preserveScroll: true,
                                        });
                                    }}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        data.trashed === tab.value
                                            ? "bg-indigo-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* 検索・フィルターカード */}
                <Card>
                    <div className="p-4 space-y-3">
                        {/* 検索 + フィルタートグル */}
                        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                            {/* 検索バー */}
                            <div className="flex-1 max-w-md">
                                <SearchBar
                                    value={data.search}
                                    onChange={(value) =>
                                        setData("search", value)
                                    }
                                    onSearch={handleSearch}
                                    placeholder={
                                        PageConfig.posts.ui?.search
                                            ?.placeholder ||
                                        "タイトル、内容で検索..."
                                    }
                                    disabled={processing}
                                />
                            </div>

                            {/* フィルタートグルボタン */}
                            <div className="flex-shrink-0">
                                <SecondaryButton
                                    onClick={() => setShowFilters(!showFilters)}
                                    size="sm"
                                    className="relative"
                                >
                                    <FunnelIcon className="h-4 w-4 mr-2" />
                                    フィルター
                                    {activeFilterCount > 0 && (
                                        <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500 text-white text-xs font-medium">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </SecondaryButton>
                            </div>
                        </div>

                        {/* フィルターセクション（折りたたみ可能）*/}
                        {showFilters && (
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    <FilterSelect
                                        label="ステータス"
                                        value={data.status}
                                        onChange={(value) =>
                                            setData("status", value)
                                        }
                                        options={statusOptions}
                                    />

                                    <FilterSelect
                                        label="カテゴリ"
                                        value={data.category_id}
                                        onChange={(value) =>
                                            setData("category_id", value)
                                        }
                                        options={[
                                            { value: "", label: "すべて" },
                                            ...categories.map((cat) => ({
                                                value: cat.id,
                                                label: cat.name,
                                            })),
                                        ]}
                                    />

                                    <FilterSelect
                                        label="作成者"
                                        value={data.author_id}
                                        onChange={(value) =>
                                            setData("author_id", value)
                                        }
                                        options={[
                                            { value: "", label: "すべて" },
                                            ...authors.map((author) => ({
                                                value: author.id,
                                                label: author.name,
                                            })),
                                        ]}
                                    />

                                    <div className="flex items-end">
                                        <SecondaryButton
                                            onClick={handleClearFilters}
                                            disabled={!hasActiveFilters}
                                            size="md"
                                            className="w-full"
                                        >
                                            <XMarkIcon className="h-4 w-4 mr-2" />
                                            クリア
                                        </SecondaryButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* 投稿一覧テーブル */}
                <PostsTable posts={posts} onDelete={handleDelete} />

                {/* ページネーション */}
                {posts?.last_page > 1 && <Pagination paginationData={posts} />}

                {/* データがない場合 */}
                {posts?.data?.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            📝
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {filters.search
                                ? "検索に一致する投稿がありません"
                                : data.trashed === "only"
                                  ? "削除済みの投稿はありません"
                                  : "投稿がまだありません"}
                        </p>
                        {!filters.search && data.trashed !== "only" && (
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
