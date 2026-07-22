import React, { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { SecondaryButton } from "@/Components/Buttons";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { PlusIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import { INVOICE_STATUS_OPTIONS } from "@/Constants/SelectOptions";
import InvoicesTable from "./_components/InvoicesTable";

export default function Index({ invoices, filters = {}, stats = {} }) {
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
        get(route("admin.invoice.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({ search: "", status: "" });
        setShowFilters(false);
        get(route("admin.invoice.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Actions
    // ========================================
    const handleDelete = (invoice) => {
        const confirmed = confirm(
            `請求書「${invoice.invoice_number}」を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.invoice.destroy", invoice.id));
        }
    };

    const handleSend = (invoice) => {
        const confirmed = confirm(
            `請求書「${invoice.invoice_number}」をクライアントに送付してもよろしいですか？`,
        );
        if (confirmed) {
            router.patch(route("admin.invoice.send", invoice.id));
        }
    };

    const handleConfirmPayment = (invoice) => {
        const confirmed = confirm(
            `請求書「${invoice.invoice_number}」の入金を確認しますか？請求額に達している場合は領収書を作成します（送付は内容確認後に行います）。`,
        );
        if (confirmed) {
            router.post(route("admin.invoice.confirm-payment", invoice.id));
        }
    };

    const handleResend = (invoice) => {
        const confirmed = confirm(
            `請求書「${invoice.invoice_number}」を再送信しますか？`,
        );
        if (confirmed) {
            router.post(route("admin.invoice.resend", invoice.id));
        }
    };

    // ========================================
    // Constants - Header Actions & Filters
    // ========================================
    const headerActions = [
        {
            label: PageConfig.invoices.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.invoice.create"),
        },
    ];

    const hasActiveFilters = data.search || data.status;
    const activeFilterCount = data.status ? 1 : 0;

    // 金額フォーマット
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.invoices.title}
                    description={PageConfig.invoices.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.invoices.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.invoices.documentTitle} />

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
                                PageConfig.invoices.ui.search.placeholder
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
                            {PageConfig.invoices.ui.filter.button}
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
                                options={INVOICE_STATUS_OPTIONS}
                            />
                            <div className="flex items-end">
                                <SecondaryButton
                                    onClick={handleClearFilters}
                                    disabled={!hasActiveFilters}
                                    size="md"
                                    icon={XMarkIcon}
                                    className="w-full"
                                >
                                    {PageConfig.invoices.ui.filter.clear}
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
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {stats.sent || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    送付済み
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {stats.paid || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    支払済み
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {stats.overdue || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    期限超過
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
                    </div>
                )}

                {stats?.total_amount !== undefined && (
                    <Card>
                        <div className="p-4 grid grid-cols-2 gap-4 text-center">
                            <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                                未収金額: {formatAmount(stats.total_amount)}
                            </div>
                            <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                                入金済み: {formatAmount(stats.paid_amount)}
                            </div>
                        </div>
                    </Card>
                )}

                {/* テーブル */}
                <InvoicesTable
                    invoices={invoices}
                    onDelete={handleDelete}
                    onSend={handleSend}
                    onConfirmPayment={handleConfirmPayment}
                    onResend={handleResend}
                />

                {/* ページネーション */}
                {invoices.data.length > 0 && (
                    <Pagination paginationData={invoices} />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
