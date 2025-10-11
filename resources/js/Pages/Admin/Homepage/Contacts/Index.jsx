import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    EyeIcon,
    TrashIcon,
    UserIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

export default function Index() {
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
        filters?.category || ""
    );

    const statusOptions = [
        { value: "new", label: "新規", color: "bg-blue-100 text-blue-800" },
        {
            value: "in_progress",
            label: "対応中",
            color: "bg-yellow-100 text-yellow-800",
        },
        {
            value: "resolved",
            label: "解決済み",
            color: "bg-green-100 text-green-800",
        },
        {
            value: "closed",
            label: "クローズ",
            color: "bg-gray-100 text-gray-800",
        },
    ];

    const categoryOptions = [
        { value: "estimate", label: "見積もり" },
        { value: "partnership", label: "業務提携" },
        { value: "support", label: "サポート" },
        { value: "other", label: "その他" },
    ];

    const handleSearch = () => {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (statusFilter) params.status = statusFilter;
        if (categoryFilter) params.category = categoryFilter;

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
                selectedContacts.filter((id) => id !== contactId)
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
            (opt) => opt.value === category
        );
        return categoryOption?.label || category;
    };

    return (
        <AdminLayout>
            <Head title="お問い合わせ管理" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* ヘッダー */}
                    <div className="bg-white shadow rounded-lg mb-6">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    お問い合わせ管理
                                </h1>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() =>
                                            setShowFilters(!showFilters)
                                        }
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
                                    <div className="text-sm text-gray-500">
                                        総件数
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {stats.new}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        新規
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {stats.in_progress}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        対応中
                                    </div>
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
                                    <div className="text-sm text-gray-500">
                                        7日以内
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* フィルター */}
                        {showFilters && (
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                <div className="grid grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            検索
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value
                                                    )
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
                                                setCategoryFilter(
                                                    e.target.value
                                                )
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
                                            className="px-3 py-1 border border-gray-300 rounded text-sm"
                                        >
                                            <option value="">
                                                担当者を選択
                                            </option>
                                            {admins.map((admin) => (
                                                <option
                                                    key={admin.id}
                                                    value={admin.id}
                                                >
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
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedContacts.length ===
                                                    (contacts?.data?.length ||
                                                        0) &&
                                                (contacts?.data?.length || 0) >
                                                    0
                                            }
                                            onChange={(e) =>
                                                handleSelectAll(
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-gray-300"
                                        />
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("created_at")}
                                    >
                                        受信日時
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("name")}
                                    >
                                        お客様情報
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        カテゴリ・件名
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ステータス
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        担当者
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {(contacts?.data || []).map((contact) => (
                                    <tr
                                        key={contact.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedContacts.includes(
                                                    contact.id
                                                )}
                                                onChange={(e) =>
                                                    handleSelectContact(
                                                        contact.id,
                                                        e.target.checked
                                                    )
                                                }
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                {contact.created_at
                                                    ? new Date(
                                                          contact.created_at
                                                      ).toLocaleDateString(
                                                          "ja-JP"
                                                      )
                                                    : "不明"}
                                                <br />
                                                <span className="text-xs text-gray-500">
                                                    {contact.created_at
                                                        ? new Date(
                                                              contact.created_at
                                                          ).toLocaleTimeString(
                                                              "ja-JP",
                                                              {
                                                                  hour: "2-digit",
                                                                  minute: "2-digit",
                                                              }
                                                          )
                                                        : ""}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {contact.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {contact.email}
                                                </div>
                                                {contact.company && (
                                                    <div className="text-xs text-gray-400">
                                                        {contact.company}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">
                                                    {getCategoryLabel(
                                                        contact.category
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-900">
                                                    {contact.subject}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(contact.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {contact.assigned_admin ? (
                                                <div className="flex items-center">
                                                    <UserIcon className="h-4 w-4 mr-1" />
                                                    {
                                                        contact.assigned_admin
                                                            .name
                                                    }
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">
                                                    未割当
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {contact?.id && (
                                                    <Link
                                                        href={route(
                                                            "admin.homepage.contacts.show",
                                                            contact.id
                                                        )}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        handleDelete(contact.id)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* ページネーション */}
                        {contacts?.links && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-700">
                                        {contacts.from || 0} -{" "}
                                        {contacts.to || 0} /{" "}
                                        {contacts.total || 0} 件
                                    </div>
                                    <div className="flex space-x-1">
                                        {contacts.links.map((link, index) =>
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-3 py-2 text-sm border rounded ${
                                                        link.active
                                                            ? "bg-blue-500 text-white border-blue-500"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            link.label || "",
                                                    }}
                                                />
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="px-3 py-2 text-sm border rounded opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            link.label || "",
                                                    }}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
