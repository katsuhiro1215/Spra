import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card, CardHeader, CardTitle } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { FlashMessage } from "@/Components/Notifications";
import FilterSelect from "@/Components/FilterSelect";
import { EyeIcon } from "@heroicons/react/24/outline";

const STATUS_VARIANTS = {
    pending: "warning",
    completed: "success",
    failed: "danger",
    refunded: "secondary",
};

const formatAmount = (amount) =>
    new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(amount || 0);

const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("ja-JP") : "-";

export default function Index({ payments, filters, stats, statuses, methods }) {
    const handleFilterChange = (key, value) => {
        router.get(
            route("admin.payment.index"),
            { ...filters, [key]: value || undefined },
            { preserveState: true, preserveScroll: true },
        );
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "入金台帳", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="💰 入金台帳"
                    description="全請求書横断で入金記録を確認します（記録・確認は各請求書の詳細画面から行います）"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="入金台帳" />
            <FlashMessage />

            <div className="w-full space-y-4">
                <Card>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FilterSelect
                            label="ステータス"
                            value={filters.status || ""}
                            onChange={(value) =>
                                handleFilterChange("status", value)
                            }
                            options={[
                                { value: "", label: "すべて" },
                                ...Object.entries(statuses).map(
                                    ([value, label]) => ({ value, label }),
                                ),
                            ]}
                        />
                        <FilterSelect
                            label="支払方法"
                            value={filters.payment_method || ""}
                            onChange={(value) =>
                                handleFilterChange("payment_method", value)
                            }
                            options={[
                                { value: "", label: "すべて" },
                                ...Object.entries(methods).map(
                                    ([value, label]) => ({ value, label }),
                                ),
                            ]}
                        />
                    </div>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {stats.total || 0}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                総件数
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {stats.completed || 0}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                完了
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {stats.pending || 0}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                保留中
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {formatAmount(stats.total_amount)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                完了済み合計
                            </div>
                        </div>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>入金一覧 ({payments.total}件)</CardTitle>
                    </CardHeader>
                    <Table>
                        <THead>
                            <Tr hover={false}>
                                <Th>請求書番号</Th>
                                <Th>クライアント</Th>
                                <Th>金額</Th>
                                <Th>支払方法</Th>
                                <Th>支払日</Th>
                                <Th>ステータス</Th>
                                <Th className="text-right">操作</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {payments.data && payments.data.length > 0 ? (
                                payments.data.map((payment) => (
                                    <Tr key={payment.id}>
                                        <Td>
                                            {payment.invoice ? (
                                                <Link
                                                    href={route(
                                                        "admin.invoice.show",
                                                        payment.invoice.id,
                                                    )}
                                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    {
                                                        payment.invoice
                                                            .invoice_number
                                                    }
                                                </Link>
                                            ) : (
                                                "-"
                                            )}
                                        </Td>
                                        <Td>
                                            {payment.invoice?.user?.profile
                                                ?.full_name ||
                                                payment.invoice?.user
                                                    ?.email ||
                                                "-"}
                                        </Td>
                                        <Td>
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                {formatAmount(payment.amount)}
                                            </span>
                                        </Td>
                                        <Td>{payment.method_name}</Td>
                                        <Td>
                                            {formatDate(payment.payment_date)}
                                        </Td>
                                        <Td>
                                            <Badge
                                                variant={
                                                    STATUS_VARIANTS[
                                                        payment.status
                                                    ] || "secondary"
                                                }
                                                size="xs"
                                            >
                                                {payment.status_name}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <div className="flex justify-end">
                                                <Link
                                                    href={route(
                                                        "admin.payment.show",
                                                        payment.id,
                                                    )}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="詳細"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </Link>
                                            </div>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td colSpan="7" className="text-center py-8">
                                        入金記録がありません
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                </Card>
                {payments.links && <Pagination paginationData={payments} />}
            </div>
        </AdminAuthenticatedLayout>
    );
}
