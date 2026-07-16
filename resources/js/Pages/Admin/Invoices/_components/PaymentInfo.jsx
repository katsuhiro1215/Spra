import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import { Card, CardBody } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { Badge } from "@/Components/Badges";
import { FormField, FormSelect, FormTextarea } from "@/Components/Forms";
import {
    PAYMENT_METHOD_OPTIONS,
    PAYMENT_TYPE_OPTIONS,
} from "@/Constants/SelectOptions";

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

const getPaymentMethodLabel = (method) => {
    const option = PAYMENT_METHOD_OPTIONS.find((o) => o.value === method);
    return option?.label || method;
};

const getPaymentTypeLabel = (type) => {
    const option = PAYMENT_TYPE_OPTIONS.find((o) => o.value === type);
    return option?.label || type;
};

export default function PaymentInfo({ invoice, payments }) {
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: "",
        payment_method: "bank_transfer",
        payment_type: "full",
        payment_date: new Date().toISOString().split("T")[0],
        transaction_id: "",
        notes: "",
    });

    const handleRecordPayment = (e) => {
        e.preventDefault();
        post(route("admin.invoice.payments.store", invoice.id), {
            onSuccess: () => {
                reset();
                setShowPaymentForm(false);
            },
        });
    };

    const handleConfirmPayment = (payment) => {
        if (!confirm(`${formatAmount(payment.amount)} の入金を確認しますか？`)) {
            return;
        }
        router.post(route("admin.payment.confirm", payment.id), {}, {
            preserveScroll: true,
        });
    };

    const pendingPayments =
        payments?.filter((p) => p.status === "pending") || [];
    const confirmedPayments =
        payments?.filter((p) => p.status !== "pending") || [];

    const totalPaid =
        payments?.reduce((sum, p) => {
            if (p.status === "completed") {
                return sum + parseFloat(p.amount);
            }
            return sum;
        }, 0) || 0;

    const remainingAmount = invoice.total_amount - totalPaid;
    const paymentProgress = (totalPaid / invoice.total_amount) * 100;

    return (
        <Card>
            <CardBody>
                {/* 支払進捗 */}
                {invoice.status !== "draft" && (
                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-700 dark:text-gray-300">
                                入金済み
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {formatAmount(totalPaid)} /{" "}
                                {formatAmount(invoice.total_amount)}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full transition-all ${paymentProgress >= 100 ? "bg-green-500" : "bg-blue-500"}`}
                                style={{
                                    width: `${Math.min(paymentProgress, 100)}%`,
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-gray-600 dark:text-gray-400">
                                進捗: {paymentProgress.toFixed(1)}%
                            </span>
                            {remainingAmount > 0 && (
                                <span className="text-red-600 dark:text-red-400 font-semibold">
                                    残高: {formatAmount(remainingAmount)}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* 確認待ちの入金報告 */}
                {pendingPayments.length > 0 && (
                    <div className="mb-6 border border-yellow-300 dark:border-yellow-700 rounded-lg overflow-hidden">
                        <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                            確認待ちの入金報告
                        </div>
                        <div className="divide-y divide-yellow-200 dark:divide-yellow-800">
                            {pendingPayments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between gap-4 p-4"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {formatAmount(payment.amount)}
                                            </span>
                                            <Badge variant="warning">
                                                {payment.status_name}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {formatDate(payment.payment_date)}{" "}
                                            ・{" "}
                                            {getPaymentMethodLabel(
                                                payment.payment_method,
                                            )}
                                            {payment.transaction_id &&
                                                ` ・ ${payment.transaction_id}`}
                                        </p>
                                        {payment.notes && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {payment.notes}
                                            </p>
                                        )}
                                    </div>
                                    <PrimaryButton
                                        onClick={() =>
                                            handleConfirmPayment(payment)
                                        }
                                    >
                                        入金を確認しました
                                    </PrimaryButton>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 入金記録フォーム */}
                {showPaymentForm && (
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
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

                {/* 入金履歴 */}
                {confirmedPayments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <THead>
                                <Tr hover={false}>
                                    <Th>入金日</Th>
                                    <Th>金額</Th>
                                    <Th>支払方法</Th>
                                    <Th>支払区分</Th>
                                    <Th>取引ID</Th>
                                    <Th>備考</Th>
                                    <Th>ステータス</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {confirmedPayments.map((payment) => (
                                    <Tr key={payment.id}>
                                        <Td className="text-gray-900 dark:text-white">
                                            {formatDate(payment.payment_date)}
                                        </Td>
                                        <Td className="font-semibold text-gray-900 dark:text-white">
                                            {formatAmount(payment.amount)}
                                        </Td>
                                        <Td className="text-gray-700 dark:text-gray-300">
                                            {getPaymentMethodLabel(
                                                payment.payment_method,
                                            )}
                                        </Td>
                                        <Td className="text-gray-700 dark:text-gray-300">
                                            {payment.payment_type
                                                ? getPaymentTypeLabel(
                                                      payment.payment_type,
                                                  )
                                                : "-"}
                                        </Td>
                                        <Td className="text-gray-600 dark:text-gray-400">
                                            {payment.transaction_id || "-"}
                                        </Td>
                                        <Td className="text-sm text-gray-600 dark:text-gray-400">
                                            {payment.notes || "-"}
                                        </Td>
                                        <Td>
                                            <Badge
                                                variant={
                                                    payment.status ===
                                                    "completed"
                                                        ? "success"
                                                        : payment.status ===
                                                            "failed"
                                                          ? "danger"
                                                          : "secondary"
                                                }
                                            >
                                                {payment.status_name}
                                            </Badge>
                                        </Td>
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        入金記録はありません
                    </p>
                )}
            </CardBody>
        </Card>
    );
}
