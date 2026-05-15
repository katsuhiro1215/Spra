import React, { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { FlashMessage } from "@/Components/Notifications";
import {
    PrimaryButton,
    SecondaryButton,
    DangerButton,
} from "@/Components/Buttons";
import { FormField, FormSelect, FormTextarea } from "@/Components/Forms";
import {
    PencilIcon,
    TrashIcon,
    PaperAirplaneIcon,
    DocumentArrowDownIcon,
    CurrencyYenIcon,
} from "@heroicons/react/24/outline";
import {
    PAYMENT_METHOD_OPTIONS,
    PAYMENT_TYPE_OPTIONS,
} from "@/Constants/SelectOptions";

export default function Show({ invoice, payments }) {
    // ========================================
    // State
    // ========================================
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: "",
        payment_method: "bank_transfer",
        payment_type: "full",
        payment_date: new Date().toISOString().split("T")[0],
        transaction_id: "",
        notes: "",
    });

    // ========================================
    // Handlers - Actions
    // ========================================
    const handleSend = () => {
        if (confirm("この請求書を送付済みにしてもよろしいですか？")) {
            router.patch(route("admin.invoice.send", invoice.id));
        }
    };

    const handleDelete = () => {
        if (
            confirm(
                `請求書「${invoice.invoice_number}」を削除してもよろしいですか？`,
            )
        ) {
            router.delete(route("admin.invoice.destroy", invoice.id), {
                onSuccess: () => {
                    router.visit(route("admin.invoice.index"));
                },
            });
        }
    };

    const handleRecordPayment = (e) => {
        e.preventDefault();
        post(route("admin.invoice.payments.store", invoice.id), {
            onSuccess: () => {
                reset();
                setShowPaymentForm(false);
            },
        });
    };

    // ========================================
    // Render - Helper Functions
    // ========================================
    const getStatusColor = (status) => {
        const colors = {
            draft: "bg-gray-100 text-gray-800",
            sent: "bg-blue-100 text-blue-800",
            viewed: "bg-green-100 text-green-800",
            paid: "bg-emerald-100 text-emerald-800",
            overdue: "bg-red-100 text-red-800",
            cancelled: "bg-gray-100 text-gray-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getStatusLabel = (status) => {
        const labels = {
            draft: "下書き",
            sent: "送付済み",
            viewed: "確認済み",
            paid: "支払済み",
            overdue: "期限超過",
            cancelled: "キャンセル",
        };
        return labels[status] || status;
    };

    const getPaymentMethodLabel = (method) => {
        const option = PAYMENT_METHOD_OPTIONS.find((o) => o.value === method);
        return option?.label || method;
    };

    const getPaymentTypeLabel = (type) => {
        const option = PAYMENT_TYPE_OPTIONS.find((o) => o.value === type);
        return option?.label || type;
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const isOverdue = () => {
        if (
            !invoice.due_date ||
            invoice.status === "paid" ||
            invoice.status === "cancelled"
        ) {
            return false;
        }
        return new Date(invoice.due_date) < new Date();
    };

    const totalPaid =
        payments?.reduce((sum, p) => {
            if (p.status === "completed") {
                return sum + parseFloat(p.amount);
            }
            return sum;
        }, 0) || 0;

    const remainingAmount = invoice.total_amount - totalPaid;
    const paymentProgress = (totalPaid / invoice.total_amount) * 100;

    // ========================================
    // Constants - Header & Breadcrumbs
    // ========================================
    const headerActions = [
        ...(invoice.status === "draft"
            ? [
                  {
                      label: "送付",
                      icon: PaperAirplaneIcon,
                      variant: "primary",
                      onClick: handleSend,
                  },
                  {
                      label: "編集",
                      icon: PencilIcon,
                      variant: "secondary",
                      route: route("admin.invoice.edit", invoice.id),
                  },
              ]
            : []),
        ...(["sent", "viewed", "overdue"].includes(invoice.status)
            ? [
                  {
                      label: "入金記録",
                      icon: CurrencyYenIcon,
                      variant: "primary",
                      onClick: () => setShowPaymentForm(!showPaymentForm),
                  },
              ]
            : []),
        ...(invoice.status !== "draft"
            ? [
                  {
                      label: "PDF",
                      icon: DocumentArrowDownIcon,
                      variant: "secondary",
                      href: route("admin.invoice.pdf", invoice.id),
                      target: "_blank",
                  },
              ]
            : []),
        ...(invoice.status === "draft"
            ? [
                  {
                      label: "削除",
                      icon: TrashIcon,
                      variant: "danger",
                      onClick: handleDelete,
                  },
              ]
            : []),
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "請求書一覧", href: route("admin.invoice.index") },
        { label: "請求書詳細", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`請求書詳細: ${invoice.invoice_number || invoice.id.substring(0, 8)}`}
                    description="請求書の詳細情報"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="請求書詳細" />

            <FlashMessage />

            {/* 期限超過警告 */}
            {isOverdue() && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-red-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                支払期限を過ぎています
                            </h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* 基本情報 */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>基本情報</CardTitle>
                            <Badge className={getStatusColor(invoice.status)}>
                                {getStatusLabel(invoice.status)}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    請求書番号
                                </label>
                                <p className="mt-1 text-base text-gray-900">
                                    {invoice.invoice_number ||
                                        invoice.id.substring(0, 8)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    件名
                                </label>
                                <p className="mt-1 text-base text-gray-900">
                                    {invoice.title || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    契約
                                </label>
                                <p className="mt-1 text-base text-gray-900">
                                    {invoice.contract ? (
                                        <a
                                            href={route(
                                                "admin.contract.show",
                                                invoice.contract.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {invoice.contract.contract_number ||
                                                invoice.contract.id.substring(
                                                    0,
                                                    8,
                                                )}{" "}
                                            - {invoice.contract.title}
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    支払期限
                                </label>
                                <p
                                    className={`mt-1 text-base ${isOverdue() ? "text-red-600 font-semibold" : "text-gray-900"}`}
                                >
                                    {formatDate(invoice.due_date)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    請求期間
                                </label>
                                <p className="mt-1 text-base text-gray-900">
                                    {invoice.billing_period_start &&
                                    invoice.billing_period_end
                                        ? `${formatDate(invoice.billing_period_start)} ～ ${formatDate(invoice.billing_period_end)}`
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* クライアント情報 */}
                <Card>
                    <CardHeader>
                        <CardTitle>クライアント情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    ユーザー
                                </label>
                                <p className="mt-1 text-base text-gray-900">
                                    {invoice.user?.profile?.full_name ||
                                        invoice.user?.email ||
                                        "-"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    会社
                                </label>
                                <p className="mt-1 text-base text-gray-900">
                                    {invoice.company?.name || "-"}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 請求明細 */}
                <Card>
                    <CardHeader>
                        <CardTitle>請求明細</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Table>
                            <THead>
                                <Tr hover={false}>
                                    <Th>品目</Th>
                                    <Th>説明</Th>
                                    <Th className="text-right">数量</Th>
                                    <Th className="text-right">単価</Th>
                                    <Th className="text-right">金額</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {invoice.items?.map((item, index) => (
                                    <Tr key={index}>
                                        <Td className="font-medium">
                                            {item.name}
                                        </Td>
                                        <Td className="text-gray-600 text-sm">
                                            {item.description || "-"}
                                        </Td>
                                        <Td className="text-right">
                                            {item.quantity}
                                        </Td>
                                        <Td className="text-right">
                                            {formatAmount(item.unit_price)}
                                        </Td>
                                        <Td className="text-right font-semibold">
                                            {formatAmount(item.amount)}
                                        </Td>
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>

                        <div className="mt-6 border-t pt-6">
                            <div className="space-y-2 max-w-md ml-auto">
                                <div className="flex justify-between text-gray-700">
                                    <span>小計</span>
                                    <span>{formatAmount(invoice.subtotal)}</span>
                                </div>
                                {invoice.discount_amount > 0 && (
                                    <div className="flex justify-between text-red-600">
                                        <span>値引き</span>
                                        <span>
                                            -{formatAmount(invoice.discount_amount)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-700">
                                    <span>
                                        消費税 ({(invoice.tax_rate * 100).toFixed(1)}%)
                                    </span>
                                    <span>{formatAmount(invoice.tax_amount)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t-2">
                                    <span>合計金額</span>
                                    <span className="text-blue-600">
                                        {formatAmount(invoice.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 支払い状況 */}
                {invoice.status !== "draft" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>支払い状況</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-700">入金済み</span>
                                    <span className="font-semibold">
                                        {formatAmount(totalPaid)} /{" "}
                                        {formatAmount(invoice.total_amount)}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full ${paymentProgress >= 100 ? "bg-green-500" : "bg-blue-500"}`}
                                        style={{
                                            width: `${Math.min(paymentProgress, 100)}%`,
                                        }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-gray-600">
                                        進捗: {paymentProgress.toFixed(1)}%
                                    </span>
                                    {remainingAmount > 0 && (
                                        <span className="text-red-600 font-semibold">
                                            残高: {formatAmount(remainingAmount)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* 入金記録フォーム */}
                            {showPaymentForm && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-4">
                                        入金記録
                                    </h4>
                                    <form
                                        onSubmit={handleRecordPayment}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                label="入金額"
                                                type="number"
                                                name="amount"
                                                value={data.amount}
                                                onChange={(e) =>
                                                    setData("amount", e.target.value)
                                                }
                                                error={errors.amount}
                                                min="0"
                                                step="1"
                                                required
                                            />
                                            <FormField
                                                label="入金日"
                                                type="date"
                                                name="payment_date"
                                                value={data.payment_date}
                                                onChange={(e) =>
                                                    setData("payment_date", e.target.value)
                                                }
                                                error={errors.payment_date}
                                                required
                                            />
                                            <FormSelect
                                                label="支払方法"
                                                name="payment_method"
                                                value={data.payment_method}
                                                onChange={(e) =>
                                                    setData(
                                                        "payment_method",
                                                        e.target.value,
                                                    )
                                                }
                                                error={errors.payment_method}
                                                options={PAYMENT_METHOD_OPTIONS}
                                                required
                                            />
                                            <FormSelect
                                                label="支払区分"
                                                name="payment_type"
                                                value={data.payment_type}
                                                onChange={(e) =>
                                                    setData("payment_type", e.target.value)
                                                }
                                                error={errors.payment_type}
                                                options={PAYMENT_TYPE_OPTIONS}
                                            />
                                            <FormField
                                                label="取引ID"
                                                name="transaction_id"
                                                value={data.transaction_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "transaction_id",
                                                        e.target.value,
                                                    )
                                                }
                                                error={errors.transaction_id}
                                                placeholder="銀行振込番号など"
                                            />
                                        </div>
                                        <FormTextarea
                                            label="備考"
                                            name="notes"
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData("notes", e.target.value)
                                            }
                                            error={errors.notes}
                                            rows={2}
                                        />
                                        <div className="flex justify-end space-x-3">
                                            <SecondaryButton
                                                type="button"
                                                onClick={() => {
                                                    setShowPaymentForm(false);
                                                    reset();
                                                }}
                                            >
                                                キャンセル
                                            </SecondaryButton>
                                            <PrimaryButton
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing ? "処理中..." : "記録"}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* 支払い履歴 */}
                            {payments && payments.length > 0 ? (
                                <Table>
                                    <THead>
                                        <Tr hover={false}>
                                            <Th>入金日</Th>
                                            <Th>金額</Th>
                                            <Th>支払方法</Th>
                                            <Th>支払区分</Th>
                                            <Th>取引ID</Th>
                                            <Th>備考</Th>
                                        </Tr>
                                    </THead>
                                    <TBody>
                                        {payments.map((payment) => (
                                            <Tr key={payment.id}>
                                                <Td>
                                                    {formatDate(payment.payment_date)}
                                                </Td>
                                                <Td className="font-semibold">
                                                    {formatAmount(payment.amount)}
                                                </Td>
                                                <Td>
                                                    {getPaymentMethodLabel(
                                                        payment.payment_method,
                                                    )}
                                                </Td>
                                                <Td>
                                                    {payment.payment_type
                                                        ? getPaymentTypeLabel(
                                                              payment.payment_type,
                                                          )
                                                        : "-"}
                                                </Td>
                                                <Td>
                                                    {payment.transaction_id || "-"}
                                                </Td>
                                                <Td className="text-sm text-gray-600">
                                                    {payment.notes || "-"}
                                                </Td>
                                            </Tr>
                                        ))}
                                    </TBody>
                                </Table>
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    入金記録はありません
                                </p>
                            )}
                        </CardBody>
                    </Card>
                )}

                {/* 備考 */}
                {invoice.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>備考</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {invoice.notes}
                            </p>
                        </CardBody>
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
