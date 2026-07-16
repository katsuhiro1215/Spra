import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { TextButton, DangerButton, PrimaryButton } from "@/Components/Buttons";
import DeleteAlert from "@/Components/Alerts/DeleteAlert";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

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

export default function Show({ payment }) {
    const [showDelete, setShowDelete] = useState(false);

    const handleConfirmDelete = () => {
        router.delete(route("admin.payment.destroy", payment.id), {
            onFinish: () => setShowDelete(false),
        });
    };

    const handleConfirmPayment = () => {
        if (!confirm(`${formatAmount(payment.amount)} の入金を確認しますか？`)) {
            return;
        }
        router.post(route("admin.payment.confirm", payment.id));
    };

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.payment.index"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "入金台帳", href: route("admin.payment.index") },
        { label: payment.id.substring(0, 8), href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="入金詳細"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="入金詳細" />
            <FlashMessage />

            <DeleteAlert
                show={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleConfirmDelete}
                customMessage="この入金記録を削除しますか？請求書のステータスが自動的に再計算されます。"
            />

            <div className="max-w-3xl space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>入金情報</CardTitle>
                            <Badge
                                variant={
                                    STATUS_VARIANTS[payment.status] ||
                                    "secondary"
                                }
                            >
                                {payment.status_name}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    金額
                                </dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {formatAmount(payment.amount)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    支払方法
                                </dt>
                                <dd className="mt-1 text-gray-900 dark:text-gray-100">
                                    {payment.method_name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    支払日
                                </dt>
                                <dd className="mt-1 text-gray-900 dark:text-gray-100">
                                    {formatDate(payment.payment_date)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    トランザクションID
                                </dt>
                                <dd className="mt-1 text-gray-900 dark:text-gray-100">
                                    {payment.transaction_id || "-"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    確認者
                                </dt>
                                <dd className="mt-1 text-gray-900 dark:text-gray-100">
                                    {payment.confirmed_by
                                        ? payment.confirmed_by.profile
                                              ?.full_name ||
                                          payment.confirmed_by.email
                                        : "-"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    確認日時
                                </dt>
                                <dd className="mt-1 text-gray-900 dark:text-gray-100">
                                    {payment.confirmed_at
                                        ? new Date(
                                              payment.confirmed_at,
                                          ).toLocaleString("ja-JP")
                                        : "-"}
                                </dd>
                            </div>
                            {payment.notes && (
                                <div className="md:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        備考
                                    </dt>
                                    <dd className="mt-1 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                        {payment.notes}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </CardBody>
                </Card>

                {payment.invoice && (
                    <Card>
                        <CardHeader>
                            <CardTitle>関連請求書</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {payment.invoice.invoice_number}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {payment.invoice.user?.profile
                                            ?.full_name ||
                                            payment.invoice.user?.email}
                                    </p>
                                </div>
                                <TextButton
                                    href={route(
                                        "admin.invoice.show",
                                        payment.invoice.id,
                                    )}
                                    variant="primary"
                                >
                                    <DocumentTextIcon className="h-4 w-4 mr-1" />
                                    請求書を開く
                                </TextButton>
                            </div>
                        </CardBody>
                    </Card>
                )}

                <div className="flex justify-end gap-3">
                    <DangerButton onClick={() => setShowDelete(true)}>
                        入金記録を削除
                    </DangerButton>
                    {payment.status === "pending" && (
                        <PrimaryButton onClick={handleConfirmPayment}>
                            入金を確認しました
                        </PrimaryButton>
                    )}
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
