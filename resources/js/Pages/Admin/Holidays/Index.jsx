import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { DeleteAlert } from "@/Components/Alerts";
import { CreateButton, SecondaryButton } from "@/Components/Buttons";
import { Card } from "@/Components/Card";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import {
    PlusIcon,
    FunnelIcon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import HolidaysTable from "./_components/HolidaysTable";

export default function HolidaysIndex({
    auth,
    holidays,
    filters,
    availableYears,
}) {
    const [isDeleting, setIsDeleting] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        year: filters.year || new Date().getFullYear().toString(),
        type: filters.type || "",
    });

    // ========================================
    // Effects
    // ========================================
    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (data.year || data.type) {
            setShowFilters(true);
        }
    }, [data.year, data.type]);

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.year !== filters.year || data.type !== filters.type) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.year, data.type]);

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.schedules.holidays.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // フィルタークリア
    const handleClearFilters = () => {
        setData({
            search: "",
            year: new Date().getFullYear().toString(),
            type: "",
        });
        setShowFilters(false);
        get(route("admin.schedules.holidays.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // 前年へ移動
    const handlePreviousYear = () => {
        const currentYear = parseInt(data.year) || new Date().getFullYear();
        const newYear = (currentYear - 1).toString();
        get(route("admin.schedules.holidays.index"), {
            data: {
                search: data.search,
                year: newYear,
                type: data.type,
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
        get(route("admin.schedules.holidays.index"), {
            data: {
                search: data.search,
                year: newYear,
                type: data.type,
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
    const handleDelete = (holiday) => {
        setDeleteTarget(holiday);
    };

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            setIsDeleting(deleteTarget.id);
            router.delete(
                route("admin.schedules.holidays.destroy", deleteTarget.id),
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
            label: PageConfig.holidays.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.schedules.holidays.create"),
        },
    ];

    const hasActiveFilters = data.search || data.year || data.type;

    const activeFilterCount = [data.year, data.type].filter(Boolean).length;

    // 年の選択肢を生成
    const yearOptions =
        availableYears?.map((year) => ({
            value: year.toString(),
            label: `${year}年`,
        })) || [];

    // 種類の選択肢
    const typeOptions = [
        { value: "national", label: "国民の祝日" },
        { value: "international", label: "国際的な祝日" },
    ];

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <PageHeader
                    title={PageConfig.holidays.title}
                    description={PageConfig.holidays.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.holidays.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.holidays.documentTitle} />

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
                                    placeholder="祝日名で検索..."
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
                                        label="種類"
                                        value={data.type}
                                        onChange={(value) =>
                                            setData("type", value)
                                        }
                                        options={typeOptions}
                                        placeholder="すべての種類"
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

                {/* 祝日一覧テーブル */}
                {holidays.length > 0 ? (
                    <HolidaysTable
                        holidays={holidays}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                        currentYear={data.year}
                        onPreviousYear={handlePreviousYear}
                        onNextYear={handleNextYear}
                        processing={processing}
                    />
                ) : (
                    <Card>
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
                            <div className="text-slate-500 dark:text-slate-400 text-6xl mb-4">
                                📅
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mb-2">
                                {data.year}年の祝日データがありません
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                この年の祝日を登録してください
                            </p>
                            <CreateButton
                                href={route("admin.schedules.holidays.create")}
                                size="md"
                            ></CreateButton>
                        </div>
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
