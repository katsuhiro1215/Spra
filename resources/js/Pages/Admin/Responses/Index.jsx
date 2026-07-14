import React, { useState, useEffect } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { SecondaryButton } from "@/Components/Buttons";
import { Card } from "@/Components/Card";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
// Icons
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
// Component
import Badge from "@/Components/Badge";

// Page Config
const PageConfig = {
    title: "返信管理",
    description: "全お問い合わせからの返信を一元管理します",
    breadcrumbs: [
        { label: "ダッシュボード", href: route("admin.dashboard") },
        { label: "返信管理", href: route("admin.response.index") },
    ],
};

export default function Index({ responses = {}, filters = {} }) {
    // ========================================
    // State & Form
    // ========================================
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        status: filters.status || "",
    });

    // ========================================
    // Effects
    // ========================================
    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (data.status) {
            setShowFilters(true);
        }
    }, [data.status]);

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.status !== filters.status) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.status]);

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.response.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // フィルタークリア
    const handleClearFilters = () => {
        setData({
            search: "",
            status: "",
        });
        setShowFilters(false);
        get(route("admin.response.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Constants - Options & Config
    // ========================================
    const statusOptions = [
        { value: "draft", label: "下書き" },
        { value: "sent", label: "送信済み" },
        { value: "failed", label: "失敗" },
    ];

    const hasActiveFilters = data.status;
    const activeFilterCount = data.status ? 1 : 0;

    // ステータスバッジの取得
    const getStatusBadge = (status) => {
        const statusMap = {
            draft: { label: "下書き", color: "slate" },
            sent: { label: "送信済み", color: "green" },
            failed: { label: "失敗", color: "red" },
        };
        return statusMap[status] || { label: status, color: "slate" };
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.title}
                    description={PageConfig.description}
                    breadcrumbs={PageConfig.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.title} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 検索・フィルターカード */}
                <Card>
                    <div className="p-4 space-y-3">
                        {/* 検索バー + フィルタートグル */}
                        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                            {/* 検索バー */}
                            <div className="flex-1 max-w-md">
                                <SearchBar
                                    value={data.search}
                                    onChange={(value) =>
                                        setData("search", value)
                                    }
                                    onSearch={handleSearch}
                                    placeholder="お問い合わせ者名またはメールアドレスで検索..."
                                    disabled={processing}
                                />
                            </div>

                            {/* フィルタートグルボタン */}
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
                                    <div className="flex items-end">
                                        <SecondaryButton
                                            onClick={handleClearFilters}
                                            className="w-full"
                                        >
                                            <XMarkIcon className="h-4 w-4 mr-2" />
                                            フィルターをクリア
                                        </SecondaryButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* 一覧テーブル */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">
                                        お問い合わせ者
                                    </th>
                                    <th className="px-6 py-3 font-semibold">
                                        メールアドレス
                                    </th>
                                    <th className="px-6 py-3 font-semibold">
                                        ステータス
                                    </th>
                                    <th className="px-6 py-3 font-semibold">
                                        送信日時
                                    </th>
                                    <th className="px-6 py-3 font-semibold">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {responses.data && responses.data.length > 0 ? (
                                    responses.data.map((response) => {
                                        const statusBadge = getStatusBadge(
                                            response.status,
                                        );
                                        return (
                                            <tr
                                                key={response.id}
                                                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                            >
                                                <td className="px-6 py-4">
                                                    {response.contact?.name ||
                                                        "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {response.recipient_email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        color={
                                                            statusBadge.color
                                                        }
                                                    >
                                                        {statusBadge.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {response.sent_at
                                                        ? new Date(
                                                              response.sent_at,
                                                          ).toLocaleDateString(
                                                              "ja-JP",
                                                              {
                                                                  year: "numeric",
                                                                  month: "2-digit",
                                                                  day: "2-digit",
                                                                  hour: "2-digit",
                                                                  minute: "2-digit",
                                                              },
                                                          )
                                                        : "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.contact.show",
                                                                response.contact_id,
                                                            )}
                                                        >
                                                            <SecondaryButton>
                                                                詳細
                                                            </SecondaryButton>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            返信が見つかりません
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ページネーション */}
                    {responses.links && responses.links.length > 0 && (
                        <Pagination links={responses.links} />
                    )}
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
