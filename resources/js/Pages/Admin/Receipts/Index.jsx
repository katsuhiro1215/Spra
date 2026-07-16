import React, { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { SecondaryButton, IconButton } from "@/Components/Buttons";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
// Icons
import {
    PlusIcon,
    FunnelIcon,
    XMarkIcon,
    ArrowDownTrayIcon,
    PaperAirplaneIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

const STATUS_BADGES = {
    draft: { label: "下書き", variant: "secondary" },
    issued: { label: "発行済み", variant: "info" },
    sent: { label: "送付済み", variant: "success" },
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(amount || 0);

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

export default function Index({ receipts, filters = {}, stats = {}, statuses = {} }) {
    // ========================================
    // State & Form
    // ========================================
    const [showFilters, setShowFilters] = useState(!!filters?.status);

    const { data, setData, get, processing } = useForm({
        search: filters?.search || "",
        status: filters?.status || "",
    });

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.receipt.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({ search: "", status: "" });
        setShowFilters(false);
        get(route("admin.receipt.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Actions
    // ========================================
    const handleDelete = (receipt) => {
        const confirmed = confirm(
            `領収書「${receipt.receipt_number}」を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.receipt.destroy", receipt.id));
        }
    };

    const handleSend = (receipt) => {
        const confirmed = confirm(
            `領収書「${receipt.receipt_number}」をメールで送付しますか？`,
        );
        if (confirmed) {
            router.post(route("admin.receipts.send", receipt.id));
        }
    };

    const handleDownload = (receipt) => {
        window.location.href = route("admin.receipts.download", receipt.id);
    };

    // ========================================
    // Constants - Header Actions & Filters
    // ========================================
    const headerActions = [
        {
            label: PageConfig.receipts.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.receipt.create"),
        },
    ];

    const statusOptions = Object.entries(statuses).map(([value, label]) => ({
        value,
        label,
    }));

    const hasActiveFilters = data.search || data.status;
    const activeFilterCount = data.status ? 1 : 0;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.receipts.title}
                    description={PageConfig.receipts.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.receipts.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.receipts.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 検索 + フィルタートグル */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={data.search}
                            onChange={(value) => setData("search", value)}
                            onSearch={handleSearch}
                            placeholder={
                                PageConfig.receipts.ui.search.placeholder
                            }
                            disabled={processing}
                        />
                    </div>

                    <div className="flex-shrink-0">
                        <SecondaryButton
                            onClick={() => setShowFilters(!showFilters)}
                            size="md"
                            icon={FunnelIcon}
                            className="relative"
                            aria-expanded={showFilters}
                        >
                            {PageConfig.receipts.ui.filter.button}
                            {activeFilterCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500 text-white text-xs font-medium">
                                    {activeFilterCount}
                                </span>
                            )}
                        </SecondaryButton>
                    </div>
                </div>

                {/* フィルターセクション */}
                {showFilters && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <FilterSelect
                                label="ステータス"
                                value={data.status}
                                onChange={(value) => setData("status", value)}
                                options={statusOptions}
                            />
                            <div className="flex items-end">
                                <SecondaryButton
                                    onClick={handleClearFilters}
                                    disabled={!hasActiveFilters}
                                    size="md"
                                    icon={XMarkIcon}
                                    className="w-full"
                                >
                                    {PageConfig.receipts.ui.filter.clear}
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                )}

                {/* 統計情報 */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {stats.total || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    総件数
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-slate-600 dark:text-slate-300">
                                    {stats.draft || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    下書き
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {stats.issued || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    発行済み
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {stats.sent || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    送付済み
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(stats.total_amount || 0)}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    総領収金額
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* テーブル */}
                <Card>
                    <Table>
                        <THead>
                            <Tr hover={false}>
                                <Th>領収書番号</Th>
                                <Th>宛先</Th>
                                <Th>請求書</Th>
                                <Th>金額</Th>
                                <Th>ステータス</Th>
                                <Th>発行日</Th>
                                <Th className="text-right">アクション</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {receipts.data && receipts.data.length > 0 ? (
                                receipts.data.map((receipt) => (
                                    <Tr key={receipt.id}>
                                        <Td>
                                            <Link
                                                href={route(
                                                    "admin.receipt.show",
                                                    receipt.id,
                                                )}
                                                className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
                                            >
                                                {receipt.receipt_number}
                                            </Link>
                                        </Td>
                                        <Td>
                                            <div className="text-sm text-slate-900 dark:text-slate-100">
                                                {receipt.user?.name ||
                                                    receipt.user?.email}
                                            </div>
                                            {receipt.company && (
                                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                                    {receipt.company.name}
                                                </div>
                                            )}
                                        </Td>
                                        <Td>
                                            {receipt.invoice && (
                                                <Link
                                                    href={route(
                                                        "admin.invoice.show",
                                                        receipt.invoice.id,
                                                    )}
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                                                >
                                                    {
                                                        receipt.invoice
                                                            .invoice_number
                                                    }
                                                </Link>
                                            )}
                                        </Td>
                                        <Td className="font-medium text-slate-900 dark:text-slate-100">
                                            {formatCurrency(
                                                receipt.total_amount,
                                            )}
                                        </Td>
                                        <Td>
                                            <Badge
                                                variant={
                                                    STATUS_BADGES[
                                                        receipt.status
                                                    ]?.variant || "secondary"
                                                }
                                            >
                                                {STATUS_BADGES[
                                                    receipt.status
                                                ]?.label || receipt.status}
                                            </Badge>
                                        </Td>
                                        <Td className="text-slate-500 dark:text-slate-400">
                                            {receipt.issued_at
                                                ? formatDate(
                                                      receipt.issued_at,
                                                  )
                                                : "-"}
                                        </Td>
                                        <Td>
                                            <div className="flex justify-end items-center gap-1">
                                                <IconButton
                                                    variant="info-text"
                                                    icon={EyeIcon}
                                                    size="lg"
                                                    href={route(
                                                        "admin.receipt.show",
                                                        receipt.id,
                                                    )}
                                                    title="詳細"
                                                />
                                                <IconButton
                                                    variant="success-text"
                                                    icon={ArrowDownTrayIcon}
                                                    size="lg"
                                                    onClick={() =>
                                                        handleDownload(
                                                            receipt,
                                                        )
                                                    }
                                                    title="ダウンロード"
                                                />
                                                {receipt.status !==
                                                    "sent" && (
                                                    <>
                                                        <IconButton
                                                            variant="warning-text"
                                                            icon={PencilIcon}
                                                            size="lg"
                                                            href={route(
                                                                "admin.receipt.edit",
                                                                receipt.id,
                                                            )}
                                                            title="編集"
                                                        />
                                                        <IconButton
                                                            variant="danger-text"
                                                            icon={TrashIcon}
                                                            size="lg"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    receipt,
                                                                )
                                                            }
                                                            title="削除"
                                                        />
                                                    </>
                                                )}
                                                {receipt.status ===
                                                    "issued" && (
                                                    <IconButton
                                                        variant="info-text"
                                                        icon={
                                                            PaperAirplaneIcon
                                                        }
                                                        size="lg"
                                                        onClick={() =>
                                                            handleSend(
                                                                receipt,
                                                            )
                                                        }
                                                        title="送付"
                                                    />
                                                )}
                                            </div>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td
                                        colSpan={7}
                                        className="text-center py-12 text-slate-500 dark:text-slate-400"
                                    >
                                        領収書が見つかりませんでした
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                </Card>

                {/* ページネーション */}
                {receipts.data && receipts.data.length > 0 && (
                    <Pagination paginationData={receipts} />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
