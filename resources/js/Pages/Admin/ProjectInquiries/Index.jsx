import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Badge } from "@/Components/Badges";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import ProjectInquiriesTable from "./_components/ProjectInquiriesTable";

export default function Index({ inquiries, admins, filters = {} }) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        status: filters.status || "",
        assigned_admin: filters.assigned_admin || "",
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.status !== filters.status ||
                data.assigned_admin !== filters.assigned_admin
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.status, data.assigned_admin]);

    const handleSearch = () => {
        get(route("admin.project-inquiries.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            status: "",
            assigned_admin: "",
        });
        get(route("admin.project-inquiries.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (inquiry) => {
        const confirmed = confirm(
            `問い合わせ ${inquiry.inquiry_code} を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.project-inquiries.destroy", inquiry.id));
        }
    };

    const headerActions = [
        {
            label: "新規作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.project-inquiries.create"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "プロジェクト問い合わせ", href: null },
    ];

    const hasActiveFilters = data.search || data.status || data.assigned_admin;

    const statusOptions = [
        { value: "", label: "すべて" },
        { value: "new", label: "新規受付" },
        { value: "in_discussion", label: "相談中" },
        { value: "estimated", label: "見積済み" },
        { value: "contracted", label: "契約済み" },
        { value: "cancelled", label: "キャンセル" },
    ];

    const adminOptions = [
        { value: "", label: "すべて" },
        ...admins.map((admin) => ({
            value: admin.id,
            label: admin.name,
        })),
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="プロジェクト問い合わせ"
                    description="問い合わせから見積、契約までの入口管理"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="プロジェクト問い合わせ一覧" />

            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 検索とフィルター */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                検索・フィルター
                            </h3>
                        </div>
                        {hasActiveFilters && (
                            <Badge
                                variant="info"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                フィルター中
                            </Badge>
                        )}
                    </div>

                    <div className="space-y-4">
                        <SearchBar
                            value={data.search}
                            onChange={(value) => setData("search", value)}
                            onSearch={handleSearch}
                            placeholder="問い合わせ番号、タイトル、クライアント名で検索..."
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FilterSelect
                                label="ステータス"
                                value={data.status}
                                onChange={(value) => setData("status", value)}
                                options={statusOptions}
                            />

                            <FilterSelect
                                label="担当者"
                                value={data.assigned_admin}
                                onChange={(value) =>
                                    setData("assigned_admin", value)
                                }
                                options={adminOptions}
                            />

                            {hasActiveFilters && (
                                <div className="flex items-end">
                                    <button
                                        onClick={handleClearFilters}
                                        className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                                    >
                                        フィルターをクリア
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* テーブル */}
                <ProjectInquiriesTable
                    inquiries={inquiries}
                    onDelete={handleDelete}
                />

                {/* ページネーション */}
                {inquiries.data && inquiries.data.length > 0 && (
                    <Pagination
                        links={inquiries.links}
                        currentPage={inquiries.current_page}
                        lastPage={inquiries.last_page}
                        total={inquiries.total}
                    />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
