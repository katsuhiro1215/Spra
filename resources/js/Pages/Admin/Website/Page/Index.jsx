import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { Badge } from "@/Components/Badges";
import TabNavigation from "@/Components/TabNavigation";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import {
    PlusIcon,
    FunnelIcon,
    XMarkIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import PagesTable from "./_components/PagesTable";

export default function Index({ pages, filters = {}, stats = {} }) {
    // ========================================
    // State & Form
    // ========================================
    const [activeTab, setActiveTab] = useState(filters.trashed || "without");
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        is_published: filters.is_published || "",
        trashed: filters.trashed || "without",
    });

    // ========================================
    // Effects
    // ========================================
    // propsが更新されたらstateも更新
    useEffect(() => {
        setActiveTab(filters.trashed || "without");
        setData({
            search: filters.search || "",
            is_published: filters.is_published || "",
            trashed: filters.trashed || "without",
        });
    }, [filters.trashed]);

    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (data.is_published) {
            setShowFilters(true);
        }
    }, [data.is_published]);

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.is_published !== filters.is_published) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.is_published]);

    // ========================================
    // Handlers - Tab
    // ========================================
    const handleTabChange = (tab) => {
        router.get(
            route("admin.website.page.index"),
            {
                search: data.search,
                is_published: data.is_published,
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
        get(route("admin.website.page.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            is_published: "",
            trashed: activeTab,
        });
        setShowFilters(false);
        get(route("admin.website.page.index", { trashed: activeTab }), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Delete
    // ========================================
    const handleDelete = (page) => {
        const confirmed = confirm(
            `「${page.title}」を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.website.page.destroy", page.id));
        }
    };

    const handleRestore = (page) => {
        const confirmed = confirm(
            `「${page.title}」を復元してもよろしいですか？`,
        );
        if (confirmed) {
            router.post(route("admin.website.page.restore", page.id));
        }
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.pages.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.website.page.create"),
        },
    ];

    // ========================================
    // Constants - Filters
    // ========================================
    const tabs = [
        {
            key: "with",
            label: "すべて",
            count: stats?.total || pages.total,
        },
        {
            key: "without",
            label: "有効",
            count: stats?.active || pages.total,
        },
        {
            key: "only",
            label: "削除済み",
            count: stats?.trashed || 0,
        },
    ];

    const hasActiveFilters = data.search || data.is_published;

    const activeFilterCount = [data.is_published].filter(Boolean).length;

    const publishedOptions = [
        { value: "", label: "すべて" },
        { value: "true", label: "公開中" },
        { value: "false", label: "非公開" },
    ];

    // ========================================
    // Render
    // ========================================
    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.pages.title}
                    description={PageConfig.pages.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.pages.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.pages.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 検索・フィルターカード */}
                {/* タブ + 検索 + フィルタートグル */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    {/* タブナビゲーション */}
                    <div className="flex-shrink-0">
                        <TabNavigation
                            tabs={tabs}
                            activeTab={activeTab}
                            onChange={handleTabChange}
                        />
                    </div>

                    {/* 検索バー */}
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={data.search}
                            onChange={(value) =>
                                setData("search", value)
                            }
                            onSearch={handleSearch}
                            placeholder={
                                PageConfig.pages.ui?.search
                                    ?.placeholder ||
                                "ページタイトルで検索..."
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <FilterSelect
                                label="公開状態"
                                value={data.is_published}
                                onChange={(value) =>
                                    setData("is_published", value)
                                }
                                options={publishedOptions}
                            />

                            <div className="hidden lg:block lg:col-span-2"></div>

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

                {/* ページ一覧テーブル */}
                <PagesTable
                    pages={pages}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                    trashed={data.trashed}
                />

                {/* ページネーション */}
                {pages?.last_page > 1 && <Pagination paginationData={pages} />}

                {/* データがない場合 */}
                {pages?.data?.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            📄
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {filters.search
                                ? "検索に一致するページがありません"
                                : data.trashed === "only"
                                  ? "削除済みのページはありません"
                                  : "ページがまだありません"}
                        </p>
                        {!filters.search && data.trashed !== "only" && (
                            <PrimaryButton
                                href={route("admin.website.page.create")}
                                size="md"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                最初のページを作成
                            </PrimaryButton>
                        )}
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
