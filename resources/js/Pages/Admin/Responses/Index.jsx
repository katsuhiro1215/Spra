import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { SecondaryButton, TextButton } from "@/Components/Buttons";
import { Card } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { XMarkIcon, FunnelIcon, EyeIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const STATUS_OPTIONS = [
    { value: "draft", label: "下書き" },
    { value: "sent", label: "送信済み" },
    { value: "failed", label: "失敗" },
];

const STATUS_BADGES = {
    draft: { label: "下書き", variant: "secondary" },
    sent: { label: "送信済み", variant: "success" },
    failed: { label: "失敗", variant: "danger" },
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

    const hasActiveFilters = data.status;
    const activeFilterCount = data.status ? 1 : 0;

    const getStatusBadge = (status) =>
        STATUS_BADGES[status] || { label: status, variant: "secondary" };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.responses.title}
                    description={PageConfig.responses.description}
                    breadcrumbs={PageConfig.responses.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.responses.documentTitle} />

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
                                    placeholder={
                                        PageConfig.responses.ui.search
                                            .placeholder
                                    }
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
                                        options={STATUS_OPTIONS}
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
                    <Table>
                        <THead>
                            <Tr hover={false}>
                                <Th>お問い合わせ者</Th>
                                <Th>メールアドレス</Th>
                                <Th>ステータス</Th>
                                <Th>送信日時</Th>
                                <Th className="text-right">操作</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {responses.data && responses.data.length > 0 ? (
                                responses.data.map((response) => (
                                    <Tr key={response.id}>
                                        <Td>{response.contact?.name || "-"}</Td>
                                        <Td>{response.recipient_email}</Td>
                                        <Td>
                                            <Badge
                                                variant={
                                                    getStatusBadge(
                                                        response.status,
                                                    ).variant
                                                }
                                                size="xs"
                                            >
                                                {
                                                    getStatusBadge(
                                                        response.status,
                                                    ).label
                                                }
                                            </Badge>
                                        </Td>
                                        <Td>
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
                                        </Td>
                                        <Td>
                                            <div className="flex justify-end items-center gap-1">
                                                <TextButton
                                                    href={route(
                                                        "admin.contact.show",
                                                        response.contact_id,
                                                    )}
                                                    variant="info"
                                                    title="お問い合わせ詳細"
                                                    size="sm"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </TextButton>
                                            </div>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td
                                        colSpan={5}
                                        className="text-center py-8 text-slate-500 dark:text-slate-400"
                                    >
                                        返信が見つかりません
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>

                    {/* ページネーション */}
                    {responses.data && responses.data.length > 0 && (
                        <div className="p-4">
                            <Pagination paginationData={responses} />
                        </div>
                    )}
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
