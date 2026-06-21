import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { DeleteAlert } from "@/Components/Alerts";
import { CreateButton, SecondaryButton } from "@/Components/Buttons";
import { Card } from "@/Components/Card";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
// Icons
import {
    PlusIcon,
    FunnelIcon,
    XMarkIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Index({
    appointments,
    companies,
    projects,
    statuses,
    filters,
}) {
    const [isDeleting, setIsDeleting] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        status: filters.status || "",
        company_id: filters.company_id || "",
        project_id: filters.project_id || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
    });

    // ========================================
    // Effects
    // ========================================
    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (
            data.status ||
            data.company_id ||
            data.project_id ||
            data.date_from ||
            data.date_to
        ) {
            setShowFilters(true);
        }
    }, [
        data.status,
        data.company_id,
        data.project_id,
        data.date_from,
        data.date_to,
    ]);

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.status !== filters.status ||
                data.company_id !== filters.company_id ||
                data.project_id !== filters.project_id ||
                data.date_from !== filters.date_from ||
                data.date_to !== filters.date_to
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [
        data.status,
        data.company_id,
        data.project_id,
        data.date_from,
        data.date_to,
    ]);

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.appointments.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // フィルタークリア
    const handleClearFilters = () => {
        setData({
            search: "",
            status: "",
            company_id: "",
            project_id: "",
            date_from: "",
            date_to: "",
        });
        setShowFilters(false);
        get(route("admin.appointments.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Actions
    // ========================================
    const handleDelete = (appointment) => {
        setDeleteTarget(appointment);
    };

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            setIsDeleting(deleteTarget.id);
            router.delete(
                route("admin.appointments.destroy", deleteTarget.id),
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

    const handleConfirm = (appointment) => {
        if (confirm("この予約を確定しますか？")) {
            router.post(route("admin.appointments.confirm", appointment.id));
        }
    };

    const handleCancel = (appointment) => {
        const reason = prompt("キャンセル理由を入力してください（任意）:");
        if (reason !== null) {
            router.post(route("admin.appointments.cancel", appointment.id), {
                cancellation_reason: reason,
            });
        }
    };

    const handleComplete = (appointment) => {
        if (confirm("この予約を完了にしますか？")) {
            router.post(route("admin.appointments.complete", appointment.id));
        }
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.appointments.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.appointments.create"),
        },
    ];

    // ========================================
    // Constants - Filters
    // ========================================
    const activeFilterCount = [
        data.status,
        data.company_id,
        data.project_id,
        data.date_from,
        data.date_to,
    ].filter(Boolean).length;

    // ========================================
    // Utility Functions
    // ========================================
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "confirmed":
                return "bg-blue-100 text-blue-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            case "no_show":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusLabel = (status) => {
        const s = statuses.find((st) => st.value === status);
        return s ? s.label : status;
    };

    const formatTime = (time) => {
        return time ? time.substring(0, 5) : "";
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.appointments.title}
                    description={PageConfig.appointments.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.appointments.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.appointments.documentTitle} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <FlashMessage />

                    {/* 検索・フィルターセクション */}
                    <Card className="mb-6">
                        <div className="space-y-4">
                            {/* 検索バー */}
                            <SearchBar
                                value={data.search}
                                onChange={(value) => setData("search", value)}
                                onSearch={handleSearch}
                                placeholder={
                                    PageConfig.appointments.ui.search
                                        .placeholder
                                }
                            />

                            {/* フィルター切り替えボタン */}
                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <FunnelIcon className="h-4 w-4 mr-2" />
                                    {PageConfig.appointments.ui.filter.button}
                                    {activeFilterCount > 0 && (
                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>

                                {activeFilterCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleClearFilters}
                                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        <XMarkIcon className="h-4 w-4 mr-1" />
                                        {
                                            PageConfig.appointments.ui.filter
                                                .clear
                                        }
                                    </button>
                                )}
                            </div>

                            {/* フィルターセクション */}
                            {showFilters && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                    <FilterSelect
                                        label={
                                            PageConfig.appointments.filters
                                                .status.label
                                        }
                                        value={data.status}
                                        onChange={(value) =>
                                            setData("status", value)
                                        }
                                        options={statuses}
                                        placeholder={
                                            PageConfig.appointments.filters
                                                .status.placeholder
                                        }
                                    />
                                    <FilterSelect
                                        label={
                                            PageConfig.appointments.filters
                                                .company.label
                                        }
                                        value={data.company_id}
                                        onChange={(value) =>
                                            setData("company_id", value)
                                        }
                                        options={companies}
                                        placeholder={
                                            PageConfig.appointments.filters
                                                .company.placeholder
                                        }
                                    />
                                    <FilterSelect
                                        label={
                                            PageConfig.appointments.filters
                                                .project.label
                                        }
                                        value={data.project_id}
                                        onChange={(value) =>
                                            setData("project_id", value)
                                        }
                                        options={projects}
                                        placeholder={
                                            PageConfig.appointments.filters
                                                .project.placeholder
                                        }
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            開始日
                                        </label>
                                        <input
                                            type="date"
                                            value={data.date_from}
                                            onChange={(e) =>
                                                setData(
                                                    "date_from",
                                                    e.target.value,
                                                )
                                            }
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            終了日
                                        </label>
                                        <input
                                            type="date"
                                            value={data.date_to}
                                            onChange={(e) =>
                                                setData(
                                                    "date_to",
                                                    e.target.value,
                                                )
                                            }
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* 一覧テーブル */}
                    <Card>
                        {appointments.data.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">
                                    {data.search || activeFilterCount > 0
                                        ? PageConfig.appointments.ui.empty
                                              .noResults
                                        : PageConfig.appointments.ui.empty
                                              .noData}
                                </p>
                                {!data.search && activeFilterCount === 0 && (
                                    <div className="mt-6">
                                        <Link
                                            href={route(
                                                "admin.appointments.create",
                                            )}
                                        >
                                            <CreateButton>
                                                {
                                                    PageConfig.appointments
                                                        .actions.create
                                                }
                                            </CreateButton>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    予約日時
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    件名
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    企業/プロジェクト
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    担当者
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ステータス
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    操作
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {appointments.data.map(
                                                (appointment) => (
                                                    <tr
                                                        key={appointment.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {appointment
                                                                    .appointment_slot
                                                                    ?.date ||
                                                                    "-"}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {formatTime(
                                                                    appointment
                                                                        .appointment_slot
                                                                        ?.start_time,
                                                                )}{" "}
                                                                -{" "}
                                                                {formatTime(
                                                                    appointment
                                                                        .appointment_slot
                                                                        ?.end_time,
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {
                                                                    appointment.subject
                                                                }
                                                            </div>
                                                            {appointment.description && (
                                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                    {
                                                                        appointment.description
                                                                    }
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900">
                                                                {appointment
                                                                    .company
                                                                    ?.name ||
                                                                    "-"}
                                                            </div>
                                                            {appointment.project && (
                                                                <div className="text-sm text-gray-500">
                                                                    {
                                                                        appointment
                                                                            .project
                                                                            .name
                                                                    }
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="text-sm text-gray-900">
                                                                {appointment
                                                                    .appointment_slot
                                                                    ?.assigned_admin
                                                                    ?.profile
                                                                    ?.full_name ||
                                                                    "未割り当て"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(appointment.status)}`}
                                                            >
                                                                {getStatusLabel(
                                                                    appointment.status,
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end space-x-2">
                                                                {appointment.status ===
                                                                    "pending" && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleConfirm(
                                                                                appointment,
                                                                            )
                                                                        }
                                                                        className="text-blue-600 hover:text-blue-900"
                                                                        title="確定"
                                                                    >
                                                                        <CheckCircleIcon className="h-5 w-5" />
                                                                    </button>
                                                                )}
                                                                {[
                                                                    "pending",
                                                                    "confirmed",
                                                                ].includes(
                                                                    appointment.status,
                                                                ) && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleCancel(
                                                                                appointment,
                                                                            )
                                                                        }
                                                                        className="text-red-600 hover:text-red-900"
                                                                        title="キャンセル"
                                                                    >
                                                                        <XCircleIcon className="h-5 w-5" />
                                                                    </button>
                                                                )}
                                                                <Link
                                                                    href={route(
                                                                        "admin.appointments.edit",
                                                                        appointment.id,
                                                                    )}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    編集
                                                                </Link>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            appointment,
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-900"
                                                                    disabled={
                                                                        isDeleting ===
                                                                        appointment.id
                                                                    }
                                                                >
                                                                    {isDeleting ===
                                                                    appointment.id
                                                                        ? "削除中..."
                                                                        : "削除"}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <Pagination
                                    links={appointments.links}
                                    meta={appointments.meta}
                                />
                            </>
                        )}
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteAlert
                isOpen={!!deleteTarget}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="予約を削除"
                message={`「${deleteTarget?.subject}」の予約を削除してもよろしいですか？`}
                confirmText="削除"
                cancelText="キャンセル"
            />
        </AdminAuthenticatedLayout>
    );
}
