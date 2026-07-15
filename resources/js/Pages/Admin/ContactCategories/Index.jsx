import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import { SecondaryButton, CreateButton } from "@/Components/Buttons";
import { DeleteAlert } from "@/Components/Alerts";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
// Icons
import { PlusIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// Components
import ContactCategoryTable from "./_components/ContactCategoryTable";

export default function Index({ categories = {}, filters = {}, stats = {} }) {
    // ========================================
    // State & Form
    // ========================================
    const [showFilters, setShowFilters] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        is_active: filters.is_active ?? "",
    });

    // ========================================
    // Effects
    // ========================================
    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (data.is_active !== "") {
            setShowFilters(true);
        }
    }, [data.is_active]);

    // フィルター変更時に検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.is_active !== (filters.is_active ?? "")) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.is_active]);

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.contact.category.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            is_active: "",
        });
        get(route("admin.contact.category.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Delete
    // ========================================
    const handleDelete = (category) => {
        setDeleteTarget(category);
    };

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            setIsDeleting(deleteTarget.id);
            router.delete(
                route("admin.contact.category.destroy", deleteTarget.id),
                {
                    onFinish: () => {
                        setIsDeleting(null);
                        setDeleteTarget(null);
                    },
                },
            );
        }
    };

    const handleCancelDelete = () => {
        setDeleteTarget(null);
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.contactCategories.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.contact.category.create"),
        },
    ];

    // ========================================
    // Checks
    // ========================================
    const hasActiveFilters = data.is_active !== "";
    const noResults =
        categories.data && categories.data.length === 0 && !hasActiveFilters;
    const noFilterResults =
        categories.data && categories.data.length === 0 && hasActiveFilters;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.contactCategories.title}
                    description={PageConfig.contactCategories.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.contactCategories.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.contactCategories.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            {/* 削除アラート */}
            <DeleteAlert
                show={!!deleteTarget}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.name}
            />

            <div className="w-full flex flex-col gap-4">
                {/* 検索・フィルターカード */}
                {/* 検索バー + フィルタートグル */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    {/* 検索バー */}
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={data.search}
                            onChange={(value) => setData("search", value)}
                            onSearch={handleSearch}
                            placeholder="カテゴリ名で検索..."
                            disabled={processing}
                        />
                    </div>

                    {/* フィルターボタン */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                                hasActiveFilters
                                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                            }`}
                        >
                            <FunnelIcon className="h-4 w-4 mr-1" />
                            フィルター
                        </button>
                    </div>
                </div>

                {/* フィルターパネル */}
                {showFilters && (
                    <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FilterSelect
                                label="ステータス"
                                value={data.is_active}
                                onChange={(value) =>
                                    setData("is_active", value)
                                }
                                options={[
                                    {
                                        value: "",
                                        label: "すべて",
                                    },
                                    {
                                        value: "1",
                                        label: "有効",
                                    },
                                    {
                                        value: "0",
                                        label: "無効",
                                    },
                                ]}
                            />
                            {/* フィルタークリアボタン */}
                            <div className="flex items-end">
                                <SecondaryButton
                                    onClick={handleClearFilters}
                                    disabled={!hasActiveFilters}
                                    size="md"
                                    className="w-full"
                                >
                                    <XMarkIcon className="h-4 w-4 mr-1" />
                                    フィルターをクリア
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                )}

                {/* 統計情報 */}
                {stats && (
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.total || 0}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    全体
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {stats.active || 0}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    有効
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                                    {stats.inactive || 0}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    無効
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* テーブルまたは空状態 */}
                {noResults ? (
                    <Card>
                        <div className="p-12 text-center">
                            <div className="text-gray-500 dark:text-gray-400">
                                {PageConfig.contactCategories.ui.empty.noData}
                            </div>
                            <CreateButton
                                href={route("admin.contact.category.create")}
                                className="mt-4"
                            >
                                最初のカテゴリを作成
                            </CreateButton>
                        </div>
                    </Card>
                ) : noFilterResults ? (
                    <Card>
                        <div className="p-12 text-center">
                            <div className="text-gray-500 dark:text-gray-400">
                                {
                                    PageConfig.contactCategories.ui.empty
                                        .noResults
                                }
                            </div>
                            <SecondaryButton
                                onClick={handleClearFilters}
                                className="mt-4"
                            >
                                <XMarkIcon className="h-4 w-4 mr-2" />
                                フィルターをクリア
                            </SecondaryButton>
                        </div>
                    </Card>
                ) : (
                    <>
                        <ContactCategoryTable
                            categories={categories}
                            onDelete={handleDelete}
                            isDeleting={isDeleting}
                        />
                        {categories.links && (
                            <Pagination paginationData={categories} />
                        )}
                    </>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
