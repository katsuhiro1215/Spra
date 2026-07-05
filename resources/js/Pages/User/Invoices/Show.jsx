import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import UserAuthLayout from "@/Layouts/UserAuthLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import {
    SecondaryButton,
    PrimaryButton,
    DangerButton,
} from "@/Components/Buttons";
import {
    ArrowDownTrayIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
    FormGroup,
    TextInput,
    SelectInput,
    InputError,
} from "@/Components/Forms";
import Modal from "@/Components/Modal";

export default function InvoiceShow({ invoice }) {
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        payment_method: "bank_transfer",
        amount: invoice.total_amount || 0,
        payment_date: new Date().toISOString().split("T")[0],
        transaction_id: "",
        notes: "",
    });

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

    const paymentMethods = {
        bank_transfer: "銀行振込",
        credit_card: "クレジットカード",
        cash: "現金",
        other: "その他",
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    const handleSubmitPaymentNotification = (e) => {
        e.preventDefault();
        post(route("user.invoice.payment-notification.store", invoice.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowPaymentForm(false);
            },
        });
    };

    const handleDownloadReceipt = () => {
        window.location.href = route(
            "user.invoice.receipt.download",
            invoice.id,
        );
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/dashboard" },
        { label: "請求書一覧", href: route("user.invoice.index") },
        { label: invoice.invoice_number, href: null },
    ];

    const hasReceipt = invoice.receipt && invoice.receipt.id;
    const isPaid = invoice.status === "paid";
    const canSubmitPayment =
        invoice.status !== "paid" &&
        invoice.status !== "cancelled" &&
        invoice.status !== "draft";

    return (
        <UserAuthLayout>
            <Head title={`請求書 ${invoice.invoice_number}`} />

            <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 py-8">
                <PageHeader
                    title={`請求書 ${invoice.invoice_number}`}
                    description={`発行日: ${new Date(invoice.issue_date).toLocaleDateString("ja-JP")}`}
                    breadcrumbs={breadcrumbs}
                />

                {/* ステータスとアクション */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                isPaid
                                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                                    : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
                            }`}
                        >
                            {isPaid && (
                                <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                            )}
                            {statusLabels[invoice.status]}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <SecondaryButton
                            onClick={() =>
                                window.open(
                                    route("user.invoice.pdf", invoice.id),
                                    "_blank",
                                )
                            }
                            className="inline-flex items-center"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                            PDF をダウンロード
                        </SecondaryButton>

                        {canSubmitPayment && (
                            <PrimaryButton
                                onClick={() => setShowPaymentForm(true)}
                            >
                                入金しました
                            </PrimaryButton>
                        )}

                        {hasReceipt && (
                            <PrimaryButton
                                onClick={handleDownloadReceipt}
                                className="inline-flex items-center"
                            >
                                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                                領収書をダウンロード
                            </PrimaryButton>
                        )}
                    </div>
                </div>

                {/* 請求書情報 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* 基本情報 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>基本情報</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        請求書番号
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {invoice.invoice_number}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        発行日
                                    </p>
                                    <p className="text-gray-900 dark:text-white">
                                        {new Date(
                                            invoice.issue_date,
                                        ).toLocaleDateString("ja-JP")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        契約内容
                                    </p>
                                    <p className="text-gray-900 dark:text-white">
                                        {invoice.contract?.title}
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* 支払い情報 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>支払い情報</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        請求期間
                                    </p>
                                    <p className="text-gray-900 dark:text-white">
                                        {new Date(
                                            invoice.billing_period_start,
                                        ).toLocaleDateString("ja-JP")}{" "}
                                        〜{" "}
                                        {new Date(
                                            invoice.billing_period_end,
                                        ).toLocaleDateString("ja-JP")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        お支払い期限
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {new Date(
                                            invoice.due_date,
                                        ).toLocaleDateString("ja-JP")}
                                    </p>
                                </div>
                                {invoice.sent_at && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            送付日時
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {new Date(
                                                invoice.sent_at,
                                            ).toLocaleString("ja-JP")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* 請求明細 */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>請求明細</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {invoice.items && invoice.items.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                説明
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white w-20">
                                                数量
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white w-32">
                                                単価
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white w-32">
                                                合計
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                            >
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                    {item.description}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                                                    {formatAmount(
                                                        item.unit_price,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                                                    {formatAmount(item.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                明細はありません
                            </p>
                        )}
                    </CardBody>
                </Card>

                {/* 金額計算 */}
                <Card className="mb-6">
                    <CardBody>
                        <div className="space-y-2 max-w-md ml-auto">
                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span>小計:</span>
                                <span>{formatAmount(invoice.subtotal)}</span>
                            </div>
                            {invoice.discount_amount > 0 && (
                                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                    <span>割引:</span>
                                    <span>
                                        -{formatAmount(invoice.discount_amount)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span>消費税 ({invoice.tax_rate * 100}%):</span>
                                <span>{formatAmount(invoice.tax_amount)}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white border-t border-gray-300 dark:border-gray-600 pt-3">
                                <span>合計:</span>
                                <span>
                                    {formatAmount(invoice.total_amount)}
                                </span>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 備考 */}
                {invoice.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>備考</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {invoice.notes}
                            </p>
                        </CardBody>
                    </Card>
                )}
            </div>

            {/* 支払い通知フォームモーダル */}
            <Modal
                show={showPaymentForm}
                onClose={() => setShowPaymentForm(false)}
            >
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        入金通知
                    </h3>

                    <form
                        onSubmit={handleSubmitPaymentNotification}
                        className="space-y-4"
                    >
                        <FormGroup>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                支払方法 <span className="text-red-500">*</span>
                            </label>
                            <SelectInput
                                value={data.payment_method}
                                onChange={(e) =>
                                    setData("payment_method", e.target.value)
                                }
                                className="w-full"
                            >
                                {Object.entries(paymentMethods).map(
                                    ([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ),
                                )}
                            </SelectInput>
                            <InputError message={errors.payment_method} />
                        </FormGroup>

                        <FormGroup>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                金額 <span className="text-red-500">*</span>
                            </label>
                            <TextInput
                                type="number"
                                value={data.amount}
                                onChange={(e) =>
                                    setData("amount", e.target.value)
                                }
                                step="0.01"
                                className="w-full"
                            />
                            <InputError message={errors.amount} />
                        </FormGroup>

                        <FormGroup>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                支払い日 <span className="text-red-500">*</span>
                            </label>
                            <TextInput
                                type="date"
                                value={data.payment_date}
                                onChange={(e) =>
                                    setData("payment_date", e.target.value)
                                }
                                className="w-full"
                            />
                            <InputError message={errors.payment_date} />
                        </FormGroup>

                        <FormGroup>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                トランザクションID
                            </label>
                            <TextInput
                                type="text"
                                value={data.transaction_id}
                                onChange={(e) =>
                                    setData("transaction_id", e.target.value)
                                }
                                placeholder="例: 振込通知番号"
                                className="w-full"
                            />
                            <InputError message={errors.transaction_id} />
                        </FormGroup>

                        <FormGroup>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                備考
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                placeholder="入金に関する追加情報があればお書きください"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                            />
                            <InputError message={errors.notes} />
                        </FormGroup>

                        <div className="flex justify-end gap-3">
                            <SecondaryButton
                                onClick={() => setShowPaymentForm(false)}
                                type="button"
                            >
                                キャンセル
                            </SecondaryButton>
                            <PrimaryButton disabled={processing} type="submit">
                                {processing ? "送信中..." : "送信"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </UserAuthLayout>
    );
}
