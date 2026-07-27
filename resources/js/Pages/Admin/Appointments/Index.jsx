import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { DeleteAlert } from "@/Components/Alerts";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import {
    CreateButton,
    SecondaryButton,
    IconButton,
} from "@/Components/Buttons";
import { Card } from "@/Components/Card";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import {
    PlusIcon,
    FunnelIcon,
    XMarkIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
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
        const now = new Date();
        // タイムゾーンの影響を受けないようローカル日付から直接組み立てる
        const toDateString = (date) =>
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        setData({
            search: "",
            status: "",
            company_id: "",
            project_id: "",
            date_from: toDateString(
                new Date(now.getFullYear(), now.getMonth(), 1),
            ),
            date_to: toDateString(
                new Date(now.getFullYear(), now.getMonth() + 1, 0),
            ),
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
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200";
            case "confirmed":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200";
            case "completed":
                return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200";
            case "cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200";
            case "no_show":
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
        }
    };

    const getStatusLabel = (status) => {
        const s = statuses.find((st) => st.value === status);
        return s ? s.label : status;
    };

    const formatTime = (time) => {
        return time ? time.substring(0, 5) : "";
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
        });
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
            <FlashMessage />

            {/* Delete Confirmation Modal */}
            <DeleteAlert
                show={!!deleteTarget}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.subject}
            />

            <div className="w-full flex flex-col gap-4">
                {/* 検索・フィルターセクション */}
                <div className="space-y-4">
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
                                    PageConfig.appointments.ui.search
                                        .placeholder
                                }
                            />
                        </div>

                        {/* フィルター切り替えボタン */}
                        <div className="flex-shrink-0">
                            <SecondaryButton
                                onClick={() => setShowFilters(!showFilters)}
                                className="relative"
                            >
                                <FunnelIcon className="h-4 w-4 mr-2" />
                                {PageConfig.appointments.ui.filter.button}
                                {activeFilterCount > 0 && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </SecondaryButton>

                            {activeFilterCount > 0 && (
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                >
                                    <XMarkIcon className="h-4 w-4 mr-1" />
                                    {
                                        PageConfig.appointments.ui.filter
                                            .clear
                                    }
                                </button>
                            )}
                        </div>
                    </div>

                    {/* フィルターセクション */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <FilterSelect
                                label={
                                    PageConfig.appointments.filters.status
                                        .label
                                }
                                value={data.status}
                                onChange={(value) =>
                                    setData("status", value)
                                }
                                options={statuses}
                                placeholder={
                                    PageConfig.appointments.filters.status
                                        .placeholder
                                }
                            />
                            <FilterSelect
                                label={
                                    PageConfig.appointments.filters.company
                                        .label
                                }
                                value={data.company_id}
                                onChange={(value) =>
                                    setData("company_id", value)
                                }
                                options={companies}
                                placeholder={
                                    PageConfig.appointments.filters.company
                                        .placeholder
                                }
                            />
                            <FilterSelect
                                label={
                                    PageConfig.appointments.filters.project
                                        .label
                                }
                                value={data.project_id}
                                onChange={(value) =>
                                    setData("project_id", value)
                                }
                                options={projects}
                                placeholder={
                                    PageConfig.appointments.filters.project
                                        .placeholder
                                }
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    開始日
                                </label>
                                <input
                                    type="date"
                                    value={data.date_from}
                                    onChange={(e) =>
                                        setData("date_from", e.target.value)
                                    }
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    終了日
                                </label>
                                <input
                                    type="date"
                                    value={data.date_to}
                                    onChange={(e) =>
                                        setData("date_to", e.target.value)
                                    }
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 一覧テーブル */}
                <Card>
                    {appointments.data.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">
                                {data.search || activeFilterCount > 0
                                    ? PageConfig.appointments.ui.empty.noResults
                                    : PageConfig.appointments.ui.empty.noData}
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
                                                PageConfig.appointments.actions
                                                    .create
                                            }
                                        </CreateButton>
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Table>
                                <THead>
                                    <Tr>
                                        <Th>予約日時</Th>
                                        <Th>件名</Th>
                                        <Th>予約者</Th>
                                        <Th>企業/プロジェクト</Th>
                                        <Th>担当者</Th>
                                        <Th>ステータス</Th>
                                        <Th className="text-right tracking-wider">
                                            操作
                                        </Th>
                                    </Tr>
                                </THead>
                                <TBody>
                                    {appointments.data.map((appointment) => (
                                        <Tr key={appointment.id}>
                                            <Td>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {formatDate(
                                                        appointment
                                                            .appointment_slot
                                                            ?.date,
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
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
                                            </Td>
                                            <Td>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {appointment.subject}
                                                </div>
                                                {appointment.description && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                                        {
                                                            appointment.description
                                                        }
                                                    </div>
                                                )}
                                            </Td>
                                            <Td>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {appointment.booker_name}
                                                </div>
                                                {appointment.is_guest_booking && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 mt-1">
                                                        一般クライアント
                                                    </span>
                                                )}
                                                {appointment.source ===
                                                    "instagram" && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200 mt-1 ml-1">
                                                        Instagram
                                                    </span>
                                                )}
                                            </Td>
                                            <Td>
                                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                                    {appointment.company
                                                        ?.name || "-"}
                                                </div>
                                                {appointment.project && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {
                                                            appointment.project
                                                                .title
                                                        }
                                                    </div>
                                                )}
                                            </Td>
                                            <Td>
                                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                                    {appointment
                                                        .appointment_slot
                                                        ?.assigned_admin
                                                        ?.profile?.full_name ||
                                                        "未割り当て"}
                                                </span>
                                            </Td>
                                            <Td>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(appointment.status)}`}
                                                >
                                                    {getStatusLabel(
                                                        appointment.status,
                                                    )}
                                                </span>
                                            </Td>
                                            <Td className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {appointment.status ===
                                                        "pending" && (
                                                        <button
                                                            onClick={() =>
                                                                handleConfirm(
                                                                    appointment,
                                                                )
                                                            }
                                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
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
                                                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                                            title="キャンセル"
                                                        >
                                                            <XCircleIcon className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    <IconButton
                                                        variant="info-text"
                                                        icon={EyeIcon}
                                                        size="lg"
                                                        href={route(
                                                            "admin.appointments.show",
                                                            appointment.id,
                                                        )}
                                                        title="詳細"
                                                    />
                                                    <IconButton
                                                        variant="warning-text"
                                                        icon={PencilIcon}
                                                        size="lg"
                                                        href={route(
                                                            "admin.appointments.edit",
                                                            appointment.id,
                                                        )}
                                                        title="編集"
                                                    />
                                                    <IconButton
                                                        variant="danger-text"
                                                        icon={TrashIcon}
                                                        size="lg"
                                                        onClick={() =>
                                                            handleDelete(
                                                                appointment,
                                                            )
                                                        }
                                                        disabled={
                                                            isDeleting ===
                                                            appointment.id
                                                        }
                                                        title="削除"
                                                    />
                                                </div>
                                            </Td>
                                        </Tr>
                                    ))}
                                </TBody>
                            </Table>

                            <Pagination paginationData={appointments} />
                        </>
                    )}
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
