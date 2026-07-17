import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import {
    UserCard,
    UserCardHeader,
    UserCardTitle,
    UserCardBody,
} from "@/Components/User";
import { FlashMessage } from "@/Components/Notifications";
import {
    SecondaryButton,
    PrimaryButton,
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
import Modal from "@/Components/Layout/Modal";

export default function InvoiceShow({ invoice }) {
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        payment_method: "bank_transfer",
        amount: invoice.total_amount || 0,
        payment_date: new Date().toISOString().split("T")[0],
        transaction_id: "",
        notes: "",
    });

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

    const invoiceTypeLabels = {
        deposit: "着手金",
        interim: "中間金",
        final: "完了金",
        full: "一括",
        monthly: "月額",
        other: "その他",
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString("ja-JP") : "-";

    const handleSubmitPayment = (e) => {
        e.preventDefault();
        post(route("user.invoice.payments.store", invoice.id), {
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
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title={`請求書 ${invoice.invoice_number}`}
                    description={`発行日: ${formatDate(invoice.issue_date)}`}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`請求書 ${invoice.invoice_number}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 py-8 space-y-6">
                {/* ステータスとアクション */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div
                        className={`inline-flex items-center w-fit px-3 py-1 rounded-full text-sm font-medium ${
                            isPaid
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                    >
                        {isPaid && <CheckCircleIcon className="h-4 w-4 mr-1" />}
                        {statusLabels[invoice.status]}
                    </div>
                    <div className="flex flex-wrap gap-3">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 基本情報 */}
                    <UserCard>
                        <UserCardHeader>
                            <UserCardTitle>基本情報</UserCardTitle>
                        </UserCardHeader>
                        <UserCardBody>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        請求書番号
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {invoice.invoice_number}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        発行日
                                    </p>
                                    <p className="text-gray-900">
                                        {formatDate(invoice.issue_date)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        契約内容
                                    </p>
                                    <p className="text-gray-900">
                                        {invoice.contract?.title}
                                    </p>
                                </div>
                                {invoice.invoice_type && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            請求区分
                                        </p>
                                        <p className="text-gray-900">
                                            {invoiceTypeLabels[
                                                invoice.invoice_type
                                            ] || invoice.invoice_type}
                                        </p>
                                    </div>
                                )}
                                {invoice.contract?.current_version
                                    ?.total_amount && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            契約金額（総額）
                                        </p>
                                        <p className="text-gray-900">
                                            {formatAmount(
                                                invoice.contract.current_version
                                                    .total_amount,
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </UserCardBody>
                    </UserCard>

                    {/* 支払い情報 */}
                    <UserCard>
                        <UserCardHeader>
                            <UserCardTitle>支払い情報</UserCardTitle>
                        </UserCardHeader>
                        <UserCardBody>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        請求期間
                                    </p>
                                    <p className="text-gray-900">
                                        {formatDate(
                                            invoice.billing_period_start,
                                        )}{" "}
                                        〜{" "}
                                        {formatDate(invoice.billing_period_end)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        お支払い期限
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {formatDate(invoice.due_date)}
                                    </p>
                                </div>
                                {invoice.sent_at && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            送付日時
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {new Date(
                                                invoice.sent_at,
                                            ).toLocaleString("ja-JP")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </UserCardBody>
                    </UserCard>
                </div>

                {/* 請求明細 */}
                <UserCard>
                    <UserCardHeader>
                        <UserCardTitle>請求明細</UserCardTitle>
                    </UserCardHeader>
                    <UserCardBody>
                        {invoice.items && invoice.items.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                                説明
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 w-20">
                                                数量
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 w-32">
                                                単価
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 w-32">
                                                合計
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-gray-100 hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {item.description}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm text-gray-600">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm text-gray-600">
                                                    {formatAmount(
                                                        item.unit_price,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                                    {formatAmount(item.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500">明細はありません</p>
                        )}
                    </UserCardBody>
                </UserCard>

                {/* 金額計算 */}
                <UserCard>
                    <UserCardBody>
                        <div className="space-y-2 max-w-md ml-auto">
                            <div className="flex justify-between text-gray-700">
                                <span>小計:</span>
                                <span>{formatAmount(invoice.subtotal)}</span>
                            </div>
                            {invoice.discount_amount > 0 && (
                                <div className="flex justify-between text-gray-700">
                                    <span>割引:</span>
                                    <span>
                                        -{formatAmount(invoice.discount_amount)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-700">
                                <span>消費税 ({invoice.tax_rate}%):</span>
                                <span>{formatAmount(invoice.tax_amount)}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold text-gray-900 border-t border-gray-300 pt-3">
                                <span>合計:</span>
                                <span>
                                    {formatAmount(invoice.total_amount)}
                                </span>
                            </div>
                            {invoice.paid_amount > 0 && !isPaid && (
                                <>
                                    <div className="flex justify-between text-green-700">
                                        <span>入金済み:</span>
                                        <span>
                                            {formatAmount(invoice.paid_amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-gray-900">
                                        <span>残額:</span>
                                        <span>
                                            {formatAmount(invoice.balance)}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </UserCardBody>
                </UserCard>

                {/* 備考 */}
                {invoice.notes && (
                    <UserCard>
                        <UserCardHeader>
                            <UserCardTitle>備考</UserCardTitle>
                        </UserCardHeader>
                        <UserCardBody>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {invoice.notes}
                            </p>
                        </UserCardBody>
                    </UserCard>
                )}
            </div>

            {/* 支払い通知フォームモーダル */}
            <Modal
                show={showPaymentForm}
                onClose={() => setShowPaymentForm(false)}
            >
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        入金通知
                    </h3>

                    <form onSubmit={handleSubmitPayment} className="space-y-4">
                        <FormGroup>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                備考
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                placeholder="入金に関する追加情報があればお書きください"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </AuthenticatedLayout>
    );
}
