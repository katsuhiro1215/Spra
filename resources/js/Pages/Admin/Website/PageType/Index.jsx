import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import { PrimaryButton, SecondaryButton, CreateButton } from "@/Components/Buttons";
import TabNavigation from "@/Components/TabNavigation";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { PlusIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import PageTypesTable from "./_components/PageTypesTable";

export default function Index({ pageTypes, filters = {}, stats = {} }) {
    // ========================================
    // State & Form
    // ========================================
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        is_system: filters.is_system || "",
        is_dynamic: filters.is_dynamic || "",
    });

    // ========================================
    // Effects
    // ========================================
    useEffect(() => {
        if (data.is_system || data.is_dynamic) {
            setShowFilters(true);
        }
    }, [data.is_system, data.is_dynamic]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.is_system !== filters.is_system ||
                data.is_dynamic !== filters.is_dynamic
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.is_system, data.is_dynamic]);

    // ========================================
    // Handlers
    // ========================================
    const handleSearch = () => {
        get(route("admin.website.page.type.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            is_system: "",
            is_dynamic: "",
        });
        setShowFilters(false);
        get(route("admin.website.page.type.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (pageType) => {
        if (pageType.is_system) {
            alert("システムページタイプは削除できません。");
            return;
        }
        const confirmed = confirm(
            `「${pageType.name}」を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(
                route("admin.website.page.type.destroy", pageType.id),
            );
        }
    };

    // ========================================
    // Constants
    // ========================================
    const headerActions = [
        {
            label: "ページタイプ作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.website.page.type.create"),
        },
    ];

    const hasActiveFilters = data.is_system || data.is_dynamic;
    const activeFilterCount = [data.is_system, data.is_dynamic].filter(
        Boolean,
    ).length;

    const systemOptions = [
        { value: "", label: "すべて" },
        { value: "true", label: "システム" },
        { value: "false", label: "カスタム" },
    ];

    const dynamicOptions = [
        { value: "", label: "すべて" },
        { value: "true", label: "動的" },
        { value: "false", label: "静的" },
    ];

    // ========================================
    // Render
    // ========================================
    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.pageTypes.title}
                    description={PageConfig.pageTypes.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.pageTypes.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.pageTypes.title} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 検索・フィルター */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={data.search}
                            onChange={(value) => setData("search", value)}
                            onSearch={handleSearch}
                            placeholder="ページタイプ名、スラッグで検索..."
                            disabled={processing}
                        />
                    </div>

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

                {showFilters && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <FilterSelect
                                label="システムページ"
                                value={data.is_system}
                                onChange={(value) =>
                                    setData("is_system", value)
                                }
                                options={systemOptions}
                            />

                            <FilterSelect
                                label="動的ページ"
                                value={data.is_dynamic}
                                onChange={(value) =>
                                    setData("is_dynamic", value)
                                }
                                options={dynamicOptions}
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

                {/* テーブル */}
                <PageTypesTable pageTypes={pageTypes} onDelete={handleDelete} />

                {/* ページネーション */}
                {pageTypes?.last_page > 1 && (
                    <Pagination paginationData={pageTypes} />
                )}

                {/* データがない場合 */}
                {pageTypes?.data?.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            📄
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4"></p>
                        <CreateButton
                            href={route("admin.website.page.type.create")}
                            size="md"
                        >
                            {PageConfig.pageTypes.ui.empty.createFirst}
                        </CreateButton>
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
