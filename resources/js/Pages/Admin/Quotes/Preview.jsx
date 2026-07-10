import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { ConfirmAlert, SuccessAlert } from "@/Components/Alerts";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Preview({ quote, statuses }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmAlert, setConfirmAlert] = useState({
        isOpen: false,
        title: "",
        message: "",
    });
    const [successAlert, setSuccessAlert] = useState({
        isOpen: false,
        message: "",
    });
    const { post, processing } = useForm();

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    const getRecipientEmail = () => {
        if (quote.user?.email) return quote.user.email;
        if (quote.contact?.email) return quote.contact.email;
        return "未設定";
    };

    const getRecipientName = () => {
        if (quote.user?.profile?.full_name) return quote.user.profile.full_name;
        if (quote.user?.email) return quote.user.email;
        if (quote.contact?.name) return quote.contact.name;
        return "クライアント";
    };

    const handleSendClick = () => {
        setConfirmAlert({
            isOpen: true,
            title: "見積書を送信しますか？",
            message: `${getRecipientName()} 様（${getRecipientEmail()}）に見積書を送信します。よろしいですか？`,
        });
    };

    const handleConfirmSend = () => {
        setConfirmAlert({ ...confirmAlert, isOpen: false });
        setIsSubmitting(true);
        post(route("admin.quote.send", quote.id), {
            onSuccess: () => {
                setSuccessAlert({
                    isOpen: true,
                    message: "見積書を送信しました",
                });
                setTimeout(() => {
                    window.location.href = route("admin.quote.show", quote.id);
                }, 2000);
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleCancelSend = () => {
        setConfirmAlert({ ...confirmAlert, isOpen: false });
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.quote.show", quote.id),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "見積もり一覧", href: route("admin.quote.index") },
        {
            label: quote.quote_number,
            href: route("admin.quote.show", quote.id),
        },
        { label: "送信プレビュー", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`見積もり送信プレビュー: ${quote.quote_number}`}
                    description="見積もりを送信する前に内容を確認してください"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`見積もり送信プレビュー: ${quote.quote_number}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-4xl space-y-6">
                {/* 送信先情報 */}
                <Card>
                    <CardHeader>
                        <CardTitle>送信先情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    受取人
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {getRecipientName()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    メールアドレス
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {getRecipientEmail()}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* メール本文プレビュー */}
                <Card>
                    <CardHeader>
                        <CardTitle>メール本文</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-6 border rounded-lg bg-gray-50 dark:bg-gray-900 p-6">
                            {/* メールヘッダー */}
                            <div className="pb-4 border-b border-gray-300 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    宛先: {getRecipientEmail()}
                                </p>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-2">
                                    見積もり: {quote.quote_number}
                                </h3>
                            </div>

                            {/* メール本文 */}
                            <div className="space-y-4 text-gray-900 dark:text-gray-100">
                                <p>いつもお世話になっております。</p>
                                <p>
                                    この度は、ご依頼いただいた件に関しまして、見積もりをお作りいたしました。
                                </p>
                                <p>下記の内容をご確認ください。</p>

                                {/* 見積内容 */}
                                <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-700">
                                    <p className="font-bold mb-4">
                                        【見積内容】
                                    </p>
                                    <div className="overflow-x-auto mb-4">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-200 dark:bg-gray-800">
                                                <tr>
                                                    <th className="px-4 py-2 text-left">
                                                        項目名
                                                    </th>
                                                    <th className="px-4 py-2 text-right">
                                                        単価
                                                    </th>
                                                    <th className="px-4 py-2 text-right">
                                                        数量
                                                    </th>
                                                    <th className="px-4 py-2 text-right">
                                                        金額
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {quote.current_version?.items &&
                                                quote.current_version.items
                                                    .length > 0 ? (
                                                    quote.current_version.items.map(
                                                        (item, index) => (
                                                            <tr
                                                                key={index}
                                                                className="border-b border-gray-300 dark:border-gray-700"
                                                            >
                                                                <td className="px-4 py-2">
                                                                    {item.name}
                                                                </td>
                                                                <td className="px-4 py-2 text-right">
                                                                    {formatAmount(
                                                                        item.unit_price,
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-2 text-right">
                                                                    {parseFloat(
                                                                        item.quantity,
                                                                    ).toLocaleString(
                                                                        "ja-JP",
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-2 text-right font-semibold">
                                                                    {formatAmount(
                                                                        item.amount,
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan="4"
                                                            className="px-4 py-2 text-center"
                                                        >
                                                            明細がありません
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* 金額情報 */}
                                    <div className="space-y-2 border-t border-gray-300 dark:border-gray-700 pt-4">
                                        <div className="flex justify-between">
                                            <span>小計</span>
                                            <span>
                                                {formatAmount(
                                                    quote.current_version
                                                        ?.base_amount,
                                                )}
                                            </span>
                                        </div>
                                        {quote.current_version
                                            ?.discount_amount > 0 && (
                                            <div className="flex justify-between">
                                                <span>割引</span>
                                                <span>
                                                    -
                                                    {formatAmount(
                                                        quote.current_version
                                                            .discount_amount,
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span>
                                                消費税 (
                                                {
                                                    quote.current_version
                                                        ?.tax_rate
                                                }
                                                %)
                                            </span>
                                            <span>
                                                {formatAmount(
                                                    quote.current_version
                                                        ?.tax_amount,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-bold border-t border-gray-300 dark:border-gray-700 pt-2">
                                            <span>合計</span>
                                            <span>
                                                {formatAmount(
                                                    quote.current_version
                                                        ?.total_amount,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {quote.expires_at && (
                                    <p>
                                        <strong>有効期限:</strong>{" "}
                                        {new Date(
                                            quote.expires_at,
                                        ).toLocaleDateString("ja-JP")}
                                    </p>
                                )}

                                <p className="mt-6">
                                    上記の内容でよろしければ、ご確認の上、ご連絡ください。
                                </p>
                                <p>
                                    ご不明な点がございましたら、お気軽にお問い合わせください。
                                </p>
                                <p className="mt-6">
                                    よろしくお願いいたします。
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* アクションボタン */}
                <div className="flex gap-3">
                    <PrimaryButton
                        disabled={processing || isSubmitting}
                        onClick={handleSendClick}
                    >
                        {processing || isSubmitting
                            ? "送信中..."
                            : "確認して送信"}
                    </PrimaryButton>
                    <SecondaryButton
                        onClick={() =>
                            (window.location.href = route(
                                "admin.quote.show",
                                quote.id,
                            ))
                        }
                    >
                        キャンセル
                    </SecondaryButton>
                </div>

                {/* 確認アラート */}
                <ConfirmAlert
                    isOpen={confirmAlert.isOpen}
                    title={confirmAlert.title}
                    message={confirmAlert.message}
                    onConfirm={handleConfirmSend}
                    onCancel={handleCancelSend}
                    confirmText="送信"
                    cancelText="キャンセル"
                />

                {/* 成功アラート */}
                <SuccessAlert
                    isOpen={successAlert.isOpen}
                    message={successAlert.message}
                    onClose={() =>
                        setSuccessAlert({ ...successAlert, isOpen: false })
                    }
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
