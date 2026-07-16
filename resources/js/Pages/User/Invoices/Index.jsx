import React, { useMemo } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import UserPagination from "@/Components/Layout/UserPagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { EyeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function InvoiceIndex({ invoices, filters }) {
    const { flash } = usePage().props;

    // ステータスカラー設定
    const statusColors = {
        draft: "gray",
        sent: "blue",
        viewed: "indigo",
        paid: "green",
        overdue: "red",
        cancelled: "gray",
    };

    const statusLabels = {
        draft: "下書き",
        sent: "送付済み",
        viewed: "確認済み",
        paid: "支払済み",
        overdue: "期限切れ",
        cancelled: "キャンセル",
    };

    // ローカルでのフィルタリング
    const filteredInvoices = useMemo(() => {
        return invoices.data.filter((invoice) => {
            if (filters.status && invoice.status !== filters.status) {
                return false;
            }
            return true;
        });
    }, [invoices.data, filters]);

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/dashboard" },
        { label: "請求書一覧", href: null },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="請求書一覧"
                    description="過去の請求書を確認できます"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="請求書一覧" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
                {filteredInvoices.length === 0 ? (
                    <Card>
                        <CardBody>
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400">
                                    請求書はまだありません
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {filteredInvoices.map((invoice) => (
                            <Link
                                key={invoice.id}
                                href={route("user.invoice.show", invoice.id)}
                            >
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardBody>
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            {/* 左側: 基本情報 */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            請求書番号
                                                        </p>
                                                        <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                            {
                                                                invoice.invoice_number
                                                            }
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                            発行日:{" "}
                                                            {new Date(
                                                                invoice.issue_date,
                                                            ).toLocaleDateString(
                                                                "ja-JP",
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 中央: 期間と期限 */}
                                            <div className="flex-1 md:text-center">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    請求期間
                                                </p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {new Date(
                                                        invoice.billing_period_start,
                                                    ).toLocaleDateString(
                                                        "ja-JP",
                                                    )}{" "}
                                                    〜{" "}
                                                    {new Date(
                                                        invoice.billing_period_end,
                                                    ).toLocaleDateString(
                                                        "ja-JP",
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    期限:{" "}
                                                    {new Date(
                                                        invoice.due_date,
                                                    ).toLocaleDateString(
                                                        "ja-JP",
                                                    )}
                                                </p>
                                            </div>

                                            {/* 右側: 金額とステータス */}
                                            <div className="flex-1 md:text-right">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    請求額
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {formatAmount(
                                                        invoice.total_amount,
                                                    )}
                                                </p>
                                                <div className="flex gap-2 mt-2 md:justify-end">
                                                    <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                                                        {
                                                            statusLabels[
                                                                invoice.status
                                                            ]
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            {/* アクション */}
                                            <div className="flex gap-2">
                                                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                                                    <ArrowDownTrayIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
