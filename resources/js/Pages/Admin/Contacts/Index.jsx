import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";

import BasicButton from "@/Components/Buttons/BasicButton";
import DeleteAlert from "@/Components/Alerts/DeleteAlert";
// Icons
import {
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    EyeIcon,
    TrashIcon,
    UserIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    GlobeAltIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
import {
    CONTACT_SOURCE_OPTIONS,
    CONTACT_STATUS_OPTIONS,
    CONTACT_CATEGORY_OPTIONS,
} from "@/Constants/SelectOptions";
// Admin Components
import ContactsTable from "./_components/ContactsTable";

export default function Index() {
    // ========================================
    // State & Form
    // ========================================
    // const [activeTab, setActiveTab] = useState(
    //     filters.trashed || "without_trashed",
    // );

    // const { data, setData, get, processing } = useForm({
    //     search: filters.search || "",
    //     status: filters.status || "",
    //     trashed: filters.trashed || "without_trashed",
    // });

    const {
        contacts = {},
        stats = {},
        filters = {},
        admins = [],
    } = usePage().props;
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [bulkAction, setBulkAction] = useState({
        show: false,
        status: "",
        assigned_to: "",
    });

    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "");
    const [categoryFilter, setCategoryFilter] = useState(
        filters?.category || "",
    );
    const [sourceFilter, setSourceFilter] = useState(filters?.source || "");

    const statusOptions = CONTACT_STATUS_OPTIONS.map((option) => ({
        ...option,
        color:
            option.value === "new"
                ? "bg-blue-100 text-blue-800"
                : option.value === "in_progress"
                  ? "bg-yellow-100 text-yellow-800"
                  : option.value === "replied"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800",
    }));

    const categoryOptions = CONTACT_CATEGORY_OPTIONS;
    const sourceOptions = CONTACT_SOURCE_OPTIONS;

    const handleSearch = () => {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (statusFilter) params.status = statusFilter;
        if (categoryFilter) params.category = categoryFilter;
        if (sourceFilter) params.source = sourceFilter;

        router.get(route("admin.homepage.contacts.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSort = (field) => {
        const currentSortBy = filters?.sort_by;
        const currentSortOrder = filters?.sort_order;

        let newSortOrder = "desc";
        if (currentSortBy === field && currentSortOrder === "desc") {
            newSortOrder = "asc";
        }

        const params = {};
        // 現在のフィルターを保持（空でない値のみ）
        if (filters?.search) params.search = filters.search;
        if (filters?.status) params.status = filters.status;
        if (filters?.category) params.category = filters.category;
        if (filters?.source) params.source = filters.source;

        // ソートパラメータを追加
        params.sort_by = field;
        params.sort_order = newSortOrder;

        router.get(route("admin.homepage.contacts.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSelectAll = (checked) => {
        if (checked && contacts?.data) {
            setSelectedContacts(contacts.data.map((contact) => contact.id));
        } else {
            setSelectedContacts([]);
        }
    };

    const handleSelectContact = (contactId, checked) => {
        if (checked) {
            setSelectedContacts([...selectedContacts, contactId]);
        } else {
            setSelectedContacts(
                selectedContacts.filter((id) => id !== contactId),
            );
        }
    };

    const handleBulkUpdate = () => {
        if (selectedContacts.length === 0) return;

        const data = {
            contact_ids: selectedContacts,
            status: bulkAction.status,
        };

        // assigned_toが空でない場合のみ追加
        if (bulkAction.assigned_to) {
            data.assigned_to = bulkAction.assigned_to;
        }

        router.patch(route("admin.homepage.contacts.bulk-update"), data, {
            onSuccess: () => {
                setSelectedContacts([]);
                setBulkAction({ show: false, status: "", assigned_to: "" });
            },
        });
    };

    const handleDelete = (contactId) => {
        if (confirm("このお問い合わせを削除してもよろしいですか？")) {
            router.delete(route("admin.homepage.contacts.destroy", contactId));
        }
    };

    const handleExport = () => {
        const exportParams = {};
        if (filters?.search) exportParams.search = filters.search;
        if (filters?.status) exportParams.status = filters.status;
        if (filters?.category) exportParams.category = filters.category;
        if (filters?.source) exportParams.source = filters.source;

        window.open(route("admin.homepage.contacts.export", exportParams));
    };

    const getStatusBadge = (status) => {
        const statusOption = statusOptions.find((opt) => opt.value === status);
        return (
            <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                    statusOption?.color || "bg-gray-100 text-gray-800"
                }`}
            >
                {statusOption?.label || status}
            </span>
        );
    };

    const getCategoryLabel = (category) => {
        const categoryOption = categoryOptions.find(
            (opt) => opt.value === category,
        );
        return categoryOption?.label || category;
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "お問い合わせ一覧", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.contacts.title}
                    description={PageConfig.contacts.description}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.contacts.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            {/* ヘッダー */}
            <div className="w-full flex flex-col gap-4">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <FunnelIcon className="h-4 w-4 mr-2" />
                                フィルター
                            </button>
                            <button
                                onClick={handleExport}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                                エクスポート
                            </button>
                        </div>
                    </div>
                </div>

                {/* 統計情報 */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-5 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                                {stats.total}
                            </div>
                            <div className="text-sm text-gray-500">総件数</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {stats.new}
                            </div>
                            <div className="text-sm text-gray-500">新規</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {stats.in_progress}
                            </div>
                            <div className="text-sm text-gray-500">対応中</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {stats.resolved}
                            </div>
                            <div className="text-sm text-gray-500">
                                解決済み
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {stats.recent}
                            </div>
                            <div className="text-sm text-gray-500">7日以内</div>
                        </div>
                    </div>
                </div>

                {/* フィルター */}
                {showFilters && (
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-5 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    検索
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        placeholder="名前、メール、会社名、件名で検索"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ステータス
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">すべて</option>
                                    {statusOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    カテゴリ
                                </label>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) =>
                                        setCategoryFilter(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">すべて</option>
                                    {categoryOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    流入元
                                </label>
                                <select
                                    value={sourceFilter}
                                    onChange={(e) =>
                                        setSourceFilter(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">すべて</option>
                                    {sourceOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleSearch}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    検索
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 一括操作 */}
                {selectedContacts.length > 0 && (
                    <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-700">
                                {selectedContacts.length}件選択中
                            </span>
                            <div className="flex items-center space-x-4">
                                <select
                                    value={bulkAction.status}
                                    onChange={(e) =>
                                        setBulkAction({
                                            ...bulkAction,
                                            status: e.target.value,
                                        })
                                    }
                                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                                >
                                    <option value="">ステータスを選択</option>
                                    {statusOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={bulkAction.assigned_to}
                                    onChange={(e) =>
                                        setBulkAction({
                                            ...bulkAction,
                                            assigned_to: e.target.value,
                                        })
                                    }
                                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                                >
                                    <option value="">担当者を選択</option>
                                    {admins.map((admin) => (
                                        <option key={admin.id} value={admin.id}>
                                            {admin.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleBulkUpdate}
                                    disabled={!bulkAction.status}
                                    className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                                >
                                    更新
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* テーブル */}
            <ContactsTable contacts={contacts} onDelete={handleDelete} />

            {/* ページネーション */}
            {contacts.data.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                    <Pagination paginationData={contacts} />
                </div>
            )}

        </AdminAuthenticatedLayout>
    );
}
