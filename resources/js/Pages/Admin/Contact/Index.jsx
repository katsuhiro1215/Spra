import React, { useState, useEffect } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { SecondaryButton, DeleteButton } from "@/Components/Buttons";
import DeleteAlert from "@/Components/Alerts/DeleteAlert";
import { Card } from "@/Components/Card";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import {
    XMarkIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import {
    CONTACT_SOURCE_OPTIONS,
    CONTACT_STATUS_OPTIONS,
} from "@/Constants/SelectOptions";
import ContactsTable from "./_components/ContactsTable";

export default function Index({
    contacts = {},
    stats = {},
    filters = {},
    categories = [],
    admins = [],
}) {
    // ========================================
    // State & Form
    // ========================================
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [isDeleting, setIsDeleting] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [bulkAction, setBulkAction] = useState({
        show: false,
        status: "",
        assigned_to: "",
    });

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        status: filters.status || "",
        category: filters.category || "",
        source: filters.source || "",
    });

    // ========================================
    // Effects
    // ========================================
    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (data.status || data.category || data.source) {
            setShowFilters(true);
        }
    }, [data.status, data.category, data.source]);

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.status !== filters.status ||
                data.category !== filters.category ||
                data.source !== filters.source
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.status, data.category, data.source]);

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.contact.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // フィルタークリア
    const handleClearFilters = () => {
        setData({
            search: "",
            status: "",
            category: "",
            source: "",
        });
        setShowFilters(false);
        get(route("admin.contact.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Bulk Actions
    // ========================================
    const handleSelectAll = (checked) => {
        if (checked && contacts?.data) {
            setSelectedContacts(contacts.data.map((contact) => contact.id));
        } else {
            setSelectedContacts([]);
        }
    };

    const handleSelectContact = (contactId) => {
        if (selectedContacts.includes(contactId)) {
            setSelectedContacts(
                selectedContacts.filter((id) => id !== contactId),
            );
        } else {
            setSelectedContacts([...selectedContacts, contactId]);
        }
    };

    const handleBulkUpdate = () => {
        if (selectedContacts.length === 0) return;

        const updateData = {
            contact_ids: selectedContacts,
            status: bulkAction.status,
        };

        // assigned_toが空でない場合のみ追加
        if (bulkAction.assigned_to) {
            updateData.assigned_to = bulkAction.assigned_to;
        }

        router.patch(route("admin.contact.bulk-update"), updateData, {
            onSuccess: () => {
                setSelectedContacts([]);
                setBulkAction({ show: false, status: "", assigned_to: "" });
            },
        });
    };

    // ========================================
    // Handlers - Delete
    // ========================================
    const handleDelete = (contact) => {
        setDeleteTarget(contact);
    };

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            setIsDeleting(deleteTarget.id);
            router.delete(route("admin.contact.destroy", deleteTarget.id), {
                onFinish: () => {
                    setIsDeleting(null);
                    setDeleteTarget(null);
                },
            });
        }
    };

    const handleCancelDelete = () => {
        setDeleteTarget(null);
    };

    // ========================================
    // Handlers - Export
    // ========================================
    const handleExport = () => {
        window.open(route("admin.contact.export", data));
    };

    // ========================================
    // Constants - Options & Config
    // ========================================
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

    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));
    const sourceOptions = CONTACT_SOURCE_OPTIONS;

    const hasActiveFilters = data.status || data.category || data.source;

    const activeFilterCount = [data.status, data.category, data.source].filter(
        Boolean,
    ).length;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.contacts.title}
                    description={PageConfig.contacts.description}
                    breadcrumbs={PageConfig.contacts.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.contacts.documentTitle} />

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
                {/* 検索バー + フィルタートグル + エクスポート */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    {/* 検索バー */}
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={data.search}
                            onChange={(value) =>
                                setData("search", value)
                            }
                            onSearch={handleSearch}
                            placeholder="名前、メール、会社名、件名で検索..."
                            disabled={processing}
                        />
                    </div>

                    {/* フィルター・エクスポートボタン */}
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
                            <FunnelIcon className="h-4 w-4 mr-2" />
                            フィルター
                            {activeFilterCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        <SecondaryButton onClick={handleExport}>
                            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                            エクスポート
                        </SecondaryButton>
                    </div>
                </div>

                {/* フィルター展開エリア */}
                {showFilters && (
                    <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <FilterSelect
                                label="ステータス"
                                value={data.status}
                                onChange={(value) =>
                                    setData("status", value)
                                }
                                options={statusOptions}
                            />
                            <FilterSelect
                                label="カテゴリ"
                                value={data.category}
                                onChange={(value) =>
                                    setData("category", value)
                                }
                                options={categoryOptions}
                            />
                            <FilterSelect
                                label="流入元"
                                value={data.source}
                                onChange={(value) =>
                                    setData("source", value)
                                }
                                options={sourceOptions}
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
                <div className="grid grid-cols-5 gap-4">
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.total || 0}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                総件数
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {stats.new || 0}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                新規
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {stats.in_progress || 0}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                対応中
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {stats.replied || 0}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                返信済み
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {stats.recent || 0}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                7日以内
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 一括操作 */}
                {selectedContacts.length > 0 && (
                    <Card>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-700 dark:text-blue-400 font-medium">
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
                                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    >
                                        <option value="">
                                            ステータスを選択
                                        </option>
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
                                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    >
                                        <option value="">担当者を選択</option>
                                        {admins.map((admin) => (
                                            <option
                                                key={admin.id}
                                                value={admin.id}
                                            >
                                                {admin.email}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleBulkUpdate}
                                        disabled={!bulkAction.status}
                                        className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                                    >
                                        更新
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* テーブル */}
                <ContactsTable
                    contacts={contacts}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                    selectedContacts={selectedContacts}
                    onSelect={handleSelectContact}
                />

                {/* ページネーション */}
                {contacts.data && contacts.data.length > 0 && (
                    <Pagination paginationData={contacts} />
                )}

                {/* データがない場合 */}
                {contacts.data.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            👤
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {filters.search
                                ? PageConfig.contacts.ui.empty.noResults
                                : PageConfig.contacts.ui.empty.noData}
                        </p>
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
