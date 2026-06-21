import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { DeleteAlert } from "@/Components/Alerts";
import { SecondaryButton, CreateButton } from "@/Components/Buttons";
import { Card } from "@/Components/Card";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
// Icons
import {
    PlusIcon,
    FunnelIcon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// Components
import ExceptionsTable from "./_components/ExceptionsTable";

export default function ExceptionsIndex({
    auth,
    exceptions,
    filters,
    availableYears,
}) {
    const [isDeleting, setIsDeleting] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        year: filters.year || new Date().getFullYear().toString(),
        is_open: filters.is_open || "",
    });

    // ========================================
    // Effects
    // ========================================
    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (data.year || data.is_open) {
            setShowFilters(true);
        }
    }, [data.year, data.is_open]);

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.year !== filters.year ||
                data.is_open !== filters.is_open
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.year, data.is_open]);

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.schedules.exceptions.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // フィルタークリア
    const handleClearFilters = () => {
        setData({
            search: "",
            year: new Date().getFullYear().toString(),
            is_open: "",
        });
        setShowFilters(false);
        get(route("admin.schedules.exceptions.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // 前年へ移動
    const handlePreviousYear = () => {
        const currentYear = parseInt(data.year) || new Date().getFullYear();
        const newYear = (currentYear - 1).toString();
        get(route("admin.schedules.exceptions.index"), {
            data: {
                search: data.search,
                year: newYear,
                is_open: data.is_open,
            },
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setData("year", newYear);
            },
        });
    };

    // 来年へ移動
    const handleNextYear = () => {
        const currentYear = parseInt(data.year) || new Date().getFullYear();
        const newYear = (currentYear + 1).toString();
        get(route("admin.schedules.exceptions.index"), {
            data: {
                search: data.search,
                year: newYear,
                is_open: data.is_open,
            },
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setData("year", newYear);
            },
        });
    };

    // ========================================
    // Handlers - Delete
    // ========================================
    const handleDelete = (exception) => {
        setDeleteTarget(exception);
    };

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            setIsDeleting(deleteTarget.id);
            router.delete(
                route("admin.schedules.exceptions.destroy", deleteTarget.id),
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
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.exceptions.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.schedules.exceptions.create"),
        },
    ];

    const hasActiveFilters = data.search || data.year || data.is_open;

    const activeFilterCount = [data.year, data.is_open].filter(Boolean).length;

    // 年の選択肢を生成
    const yearOptions =
        availableYears?.map((year) => ({
            value: year.toString(),
            label: `${year}年`,
        })) || [];

    // 営業状態の選択肢
    const isOpenOptions = [
        { value: "1", label: "営業" },
        { value: "0", label: "休業" },
    ];

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <PageHeader
                    title={PageConfig.exceptions.title}
                    description={PageConfig.exceptions.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.exceptions.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.exceptions.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            {/* 削除アラート */}
            <DeleteAlert
                show={!!deleteTarget}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                itemName={
                    deleteTarget
                        ? new Date(
                              deleteTarget.exception_date,
                          ).toLocaleDateString("ja-JP")
                        : ""
                }
            />

            <div className="w-full flex flex-col gap-4">
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
                                    placeholder="理由で検索..."
                                    disabled={processing}
                                />
                            </div>

                            {/* フィルタートグルボタン */}
                            <div className="flex-shrink-0">
                                <SecondaryButton
                                    onClick={() => setShowFilters(!showFilters)}
                                    icon={FunnelIcon}
                                >
                                    フィルター
                                    {activeFilterCount > 0 && (
                                        <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </SecondaryButton>
                            </div>
                        </div>

                        {/* 詳細フィルター（折りたたみ可能） */}
                        {showFilters && (
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <FilterSelect
                                        label="年"
                                        value={data.year}
                                        onChange={(value) =>
                                            setData("year", value)
                                        }
                                        options={yearOptions}
                                        placeholder="すべての年"
                                    />
                                    <FilterSelect
                                        label="営業状態"
                                        value={data.is_open}
                                        onChange={(value) =>
                                            setData("is_open", value)
                                        }
                                        options={isOpenOptions}
                                        placeholder="すべて"
                                    />
                                    <div className="flex items-end">
                                        {hasActiveFilters && (
                                            <SecondaryButton
                                                onClick={handleClearFilters}
                                                icon={XMarkIcon}
                                                className="w-full"
                                            >
                                                フィルタークリア
                                            </SecondaryButton>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* 例外日一覧テーブル */}
                {exceptions.length > 0 ? (
                    <ExceptionsTable
                        exceptions={exceptions}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                        currentYear={data.year}
                        onPreviousYear={handlePreviousYear}
                        onNextYear={handleNextYear}
                        processing={processing}
                    />
                ) : (
                    <Card>
                        {/* 年ナビゲーション */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <div className="flex items-center justify-between">
                                <SecondaryButton
                                    onClick={handlePreviousYear}
                                    icon={ChevronLeftIcon}
                                    disabled={processing}
                                >
                                    前年
                                </SecondaryButton>
                                <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                    {data.year}年
                                </div>
                                <SecondaryButton
                                    onClick={handleNextYear}
                                    icon={ChevronRightIcon}
                                    disabled={processing}
                                >
                                    来年
                                </SecondaryButton>
                            </div>
                        </div>
                        <div className="text-center py-12">
                            <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                                📅
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 mb-4">
                                {data.year}年の例外日データがありません
                            </p>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
                                この年の例外日を登録してください
                            </p>
                            <CreateButton
                                href={route(
                                    "admin.schedules.exceptions.create",
                                )}
                                size="md"
                            ></CreateButton>
                        </div>
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
