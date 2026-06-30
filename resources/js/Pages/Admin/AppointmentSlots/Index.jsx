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
import { PlusIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Index({
    appointmentSlots,
    admins,
    slotTypes,
    statuses,
    filters,
}) {
    const [isDeleting, setIsDeleting] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        slot_type: filters.slot_type || "",
        status: filters.status || "",
        assigned_admin_id: filters.assigned_admin_id || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
    });

    // ========================================
    // Effects
    // ========================================
    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (
            data.slot_type ||
            data.status ||
            data.assigned_admin_id ||
            data.date_from ||
            data.date_to
        ) {
            setShowFilters(true);
        }
    }, [
        data.slot_type,
        data.status,
        data.assigned_admin_id,
        data.date_from,
        data.date_to,
    ]);

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.slot_type !== filters.slot_type ||
                data.status !== filters.status ||
                data.assigned_admin_id !== filters.assigned_admin_id ||
                data.date_from !== filters.date_from ||
                data.date_to !== filters.date_to
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [
        data.slot_type,
        data.status,
        data.assigned_admin_id,
        data.date_from,
        data.date_to,
    ]);

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.appointment-slots.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // フィルタークリア
    const handleClearFilters = () => {
        setData({
            search: "",
            slot_type: "",
            status: "",
            assigned_admin_id: "",
            date_from: "",
            date_to: "",
        });
        setShowFilters(false);
        get(route("admin.appointment-slots.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Delete
    // ========================================
    const handleDelete = (appointmentSlot) => {
        setDeleteTarget(appointmentSlot);
    };

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            setIsDeleting(deleteTarget.id);
            router.delete(
                route("admin.appointment-slots.destroy", deleteTarget.id),
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
            label: PageConfig.appointmentSlots.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.appointment-slots.create"),
        },
    ];

    // ========================================
    // Constants - Filters
    // ========================================
    const activeFilterCount = [
        data.slot_type,
        data.status,
        data.assigned_admin_id,
        data.date_from,
        data.date_to,
    ].filter(Boolean).length;

    // ========================================
    // Utility Functions
    // ========================================
    const getSlotTypeLabel = (type) => {
        const slot = slotTypes.find((s) => s.value === type);
        return slot ? slot.label : type;
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "available":
                return "bg-green-100 text-green-800";
            case "blocked":
                return "bg-gray-100 text-gray-800";
            case "full":
                return "bg-red-100 text-red-800";
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
                    title={PageConfig.appointmentSlots.title}
                    description={PageConfig.appointmentSlots.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.appointmentSlots.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.appointmentSlots.documentTitle} />
            {/* フラッシュメッセージ */}
            <FlashMessage />
            {/* Delete Confirmation Modal */}
            <DeleteAlert
                isOpen={!!deleteTarget}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="予約枠を削除"
                message={`${deleteTarget?.date} ${deleteTarget?.start_time ? deleteTarget.start_time.substring(0, 5) : ""} の予約枠を削除してもよろしいですか？`}
                confirmText="削除"
                cancelText="キャンセル"
            />

            <div className="w-full flex flex-col gap-4">
                {/* 検索・フィルターセクション */}
                <Card>
                    <div className="space-y-4">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                            {/* 検索バー */}
                            <div className="flex-1 max-w-md">
                                <SearchBar
                                    value={data.search}
                                    onChange={(value) => setData("search", value)}
                                    onSearch={handleSearch}
                                    placeholder={
                                        PageConfig.appointmentSlots.ui.search
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
                                    {
                                        PageConfig.appointmentSlots.ui.filter
                                            .button
                                    }
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
                                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        <XMarkIcon className="h-4 w-4 mr-1" />
                                        {
                                            PageConfig.appointmentSlots.ui
                                                .filter.clear
                                        }
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* フィルターセクション */}
                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                <FilterSelect
                                    label={
                                        PageConfig.appointmentSlots.filters
                                            .slotType.label
                                    }
                                    value={data.slot_type}
                                    onChange={(value) =>
                                        setData("slot_type", value)
                                    }
                                    options={slotTypes}
                                    placeholder={
                                        PageConfig.appointmentSlots.filters
                                            .slotType.placeholder
                                    }
                                />
                                <FilterSelect
                                    label={
                                        PageConfig.appointmentSlots.filters
                                            .status.label
                                    }
                                    value={data.status}
                                    onChange={(value) =>
                                        setData("status", value)
                                    }
                                    options={statuses}
                                    placeholder={
                                        PageConfig.appointmentSlots.filters
                                            .status.placeholder
                                    }
                                />
                                <FilterSelect
                                    label={
                                        PageConfig.appointmentSlots.filters
                                            .assignedAdmin.label
                                    }
                                    value={data.assigned_admin_id}
                                    onChange={(value) =>
                                        setData("assigned_admin_id", value)
                                    }
                                    options={admins}
                                    placeholder={
                                        PageConfig.appointmentSlots.filters
                                            .assignedAdmin.placeholder
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
                                            setData("date_from", e.target.value)
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
                                            setData("date_to", e.target.value)
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
                    {appointmentSlots.data.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">
                                {data.search || activeFilterCount > 0
                                    ? PageConfig.appointmentSlots.ui.empty
                                          .noResults
                                    : PageConfig.appointmentSlots.ui.empty
                                          .noData}
                            </p>
                            {!data.search && activeFilterCount === 0 && (
                                <div className="mt-6">
                                    <Link
                                        href={route(
                                            "admin.appointment-slots.create",
                                        )}
                                    >
                                        <CreateButton>
                                            {
                                                PageConfig.appointmentSlots
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
                                                日時
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                タイプ
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                担当者
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                予約状況
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
                                        {appointmentSlots.data.map((slot) => (
                                            <tr
                                                key={slot.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {slot.date}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {formatTime(
                                                            slot.start_time,
                                                        )}{" "}
                                                        -{" "}
                                                        {formatTime(
                                                            slot.end_time,
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">
                                                        {getSlotTypeLabel(
                                                            slot.slot_type,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">
                                                        {slot.assigned_admin
                                                            ?.profile
                                                            ?.full_name ||
                                                            "未割り当て"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {slot.current_bookings}{" "}
                                                        / {slot.max_capacity}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        残り:{" "}
                                                        {slot.max_capacity -
                                                            slot.current_bookings}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(slot.status)}`}
                                                    >
                                                        {getStatusLabel(
                                                            slot.status,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <Link
                                                        href={route(
                                                            "admin.appointment-slots.edit",
                                                            slot.id,
                                                        )}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        編集
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(slot)
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                        disabled={
                                                            isDeleting ===
                                                            slot.id
                                                        }
                                                    >
                                                        {isDeleting === slot.id
                                                            ? "削除中..."
                                                            : "削除"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination
                                links={appointmentSlots.links}
                                meta={appointmentSlots.meta}
                            />
                        </>
                    )}
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
