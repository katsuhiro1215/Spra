import React, { useState, useRef } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardBody, CardTitle } from "@/Components/Card";
import Badge from "@/Components/Badge";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FlashMessage } from "@/Components/Notifications";
import { SuccessAlert, ConfirmAlert } from "@/Components/Alerts";
import {
    ArrowLeftIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    PencilIcon,
} from "@heroicons/react/24/outline";
import DigitalStamp from "@/Components/DigitalStamp";

export default function Show({
    contract,
    quote = null,
    invoices = [],
    receipts = [],
}) {
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [signatureStatus, setSignatureStatus] = useState(
        contract.user_signed_at ? "signed" : "unsigned",
    );
    const [stamp, setStamp] = useState(null);
    const [alertState, setAlertState] = useState({
        type: null, // 'empty-signature', 'success', 'error'
        isOpen: false,
    });
    const [activeTab, setActiveTab] = useState("contract");

    const { data, setData, post, processing, errors } = useForm({
        signature: null,
        agreed_at: new Date().toISOString(),
    });

    // タブ定義
    const tabs = [
        { id: "contract", label: "契約書", icon: "📋" },
        { id: "quote", label: "見積書", icon: "📑" },
        { id: "invoices", label: "請求書", icon: "💳" },
        { id: "receipts", label: "領収書", icon: "🧾" },
    ];

    // ステータスラベル
    const getStatusLabel = (status) => {
        const labels = {
            draft: "下書き",
            pending_signature: "署名待ち",
            active: "契約中",
            suspended: "一時停止",
            completed: "完了",
            cancelled: "キャンセル",
        };
        return labels[status] || status;
    };

    // ステータスカラー
    const getStatusColor = (status) => {
        const colors = {
            draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
            pending_signature:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
            active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
            suspended:
                "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
            completed:
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
            cancelled:
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        };
        return (
            colors[status] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
        );
    };

    // 日付フォーマット
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // 金額フォーマット
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount);
    };

    // 税込合計計算
    const getTotalWithTax = () => {
        const amount = parseFloat(contract.amount) || 0;
        const taxRate = parseFloat(contract.tax_rate) || 0;
        return amount * (1 + taxRate / 100);
    };

    // 署名を保存
    const handleSignSubmit = (e) => {
        e.preventDefault();

        if (!stamp) {
            setAlertState({ type: "empty-signature", isOpen: true });
            return;
        }

        setData("signature", stamp);

        // 署名を送信
        post(route("user.contract.sign", contract.id), {
            onSuccess: () => {
                setShowSignatureModal(false);
                setSignatureStatus("signed");
                setAlertState({ type: "success", isOpen: true });
                setTimeout(() => {
                    router.reload();
                }, 2000);
            },
            onError: (errors) => {
                console.error("署名送信エラー:", errors);
                setAlertState({ type: "error", isOpen: true });
            },
        });
    };

    // スタンプの変更を処理
    const handleStampChange = (stampData) => {
        setStamp(stampData);
    };

    // 戻るボタン
    const handleBack = () => {
        router.visit(route("user.contract.index"));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${contract.title} - 契約詳細`} />
            <FlashMessage />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>戻る</span>
                    </button>
                </div>

                {/* タブナビゲーション */}
                <Card>
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                                    }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Contract タブ */}
                {activeTab === "contract" && (
                    <div className="space-y-6">
                        {/* 基本情報 */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>基本情報</CardTitle>
                                    <Badge
                                        className={getStatusColor(
                                            contract.status,
                                        )}
                                    >
                                        {getStatusLabel(contract.status)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            契約番号
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-mono">
                                            {contract.contract_number || "-"}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            タイトル
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {contract.title}
                                        </dd>
                                    </div>
                                    {contract.description && (
                                        <div className="md:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                契約内容
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                                {contract.description}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </CardBody>
                        </Card>

                        {/* 契約書PDF表示 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>契約書</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div
                                    style={{
                                        height: "500px",
                                        overflow: "auto",
                                        backgroundColor: "#f5f5f5",
                                        borderRadius: "8px",
                                        marginBottom: "16px",
                                    }}
                                >
                                    <iframe
                                        src={route(
                                            "user.contract.pdf.preview",
                                            contract.id,
                                        )}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            border: "none",
                                        }}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <PrimaryButton
                                        onClick={() => {
                                            window.open(
                                                route(
                                                    "user.contract.pdf",
                                                    contract.id,
                                                ),
                                            );
                                        }}
                                    >
                                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                                        PDFダウンロード
                                    </PrimaryButton>
                                </div>
                            </CardBody>
                        </Card>

                        {/* 契約金額 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>契約金額</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-base">
                                            <span className="text-gray-600 dark:text-gray-300">
                                                契約金額:
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                {formatAmount(contract.amount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            <span className="text-gray-600 dark:text-gray-300">
                                                消費税 ({contract.tax_rate}%):
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                {formatAmount(
                                                    contract.amount *
                                                        (contract.tax_rate /
                                                            100),
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xl font-bold pt-3 border-t border-blue-200 dark:border-blue-800">
                                            <span className="text-gray-900 dark:text-gray-100">
                                                税込合計:
                                            </span>
                                            <span className="text-blue-600 dark:text-blue-400">
                                                {formatAmount(
                                                    getTotalWithTax(),
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* 契約期間 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>契約期間</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            開始日
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {formatDate(contract.start_date)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            終了日
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {formatDate(contract.end_date)}
                                        </dd>
                                    </div>
                                </dl>
                            </CardBody>
                        </Card>

                        {/* 詳細設定 */}
                        {(contract.payment_terms ||
                            contract.terms_and_conditions ||
                            contract.notes) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>詳細設定</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <dl className="space-y-6">
                                        {contract.payment_terms && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    支払い条件
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                                    {contract.payment_terms}
                                                </dd>
                                            </div>
                                        )}
                                        {contract.terms_and_conditions && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    利用規約
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-4 rounded">
                                                    {
                                                        contract.terms_and_conditions
                                                    }
                                                </dd>
                                            </div>
                                        )}
                                        {contract.notes && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    備考
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                                    {contract.notes}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </CardBody>
                            </Card>
                        )}

                        {/* 署名ステータス */}
                        <Card>
                            <CardHeader>
                                <CardTitle>署名ステータス</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-4">
                                    {signatureStatus === "signed" ? (
                                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                            <div className="flex items-center gap-3">
                                                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                                <div>
                                                    <p className="font-medium text-green-800 dark:text-green-200">
                                                        署名済み
                                                    </p>
                                                    <p className="text-sm text-green-700 dark:text-green-300">
                                                        {contract.user_signed_at
                                                            ? `署名日時: ${formatDate(
                                                                  contract.user_signed_at,
                                                              )}`
                                                            : ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                            <p className="font-medium text-yellow-800 dark:text-yellow-200">
                                                署名待ち
                                            </p>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                                下記のボタンから署名を行ってください。
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardBody>
                        </Card>

                        {/* アクションボタン */}
                        <Card>
                            <CardBody>
                                <div className="flex gap-3">
                                    {signatureStatus !== "signed" &&
                                        contract.status ===
                                            "pending_signature" && (
                                            <PrimaryButton
                                                onClick={() =>
                                                    setShowSignatureModal(true)
                                                }
                                            >
                                                <PencilIcon className="h-5 w-5 mr-2" />
                                                署名する
                                            </PrimaryButton>
                                        )}
                                    <SecondaryButton onClick={handleBack}>
                                        戻る
                                    </SecondaryButton>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                )}

                {/* Quote タブ */}
                {activeTab === "quote" && (
                    <div className="space-y-6">
                        {quote ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>見積書情報</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                見積書番号
                                            </dt>
                                            <dd className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                                                {quote.quote_number}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                タイトル
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {quote.title}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                金額
                                            </dt>
                                            <dd className="mt-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                {formatAmount(
                                                    quote.total_amount || 0,
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                ステータス
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {quote.status}
                                            </dd>
                                        </div>
                                    </dl>
                                    {quote.description && (
                                        <div className="mt-6">
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                説明
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                                {quote.description}
                                            </dd>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        ) : (
                            <Card>
                                <CardBody>
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            この契約に関連する見積書はありません。
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        )}
                    </div>
                )}

                {/* Invoice タブ */}
                {activeTab === "invoices" && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>請求書一覧</CardTitle>
                            </CardHeader>
                            <CardBody>
                                {invoices && invoices.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="border-b border-gray-200 dark:border-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                        請求書番号
                                                    </th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                        金額
                                                    </th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                        状態
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invoices.map((invoice) => (
                                                    <tr
                                                        key={invoice.id}
                                                        className="border-b border-gray-100 dark:border-gray-700"
                                                    >
                                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                            {
                                                                invoice.invoice_number
                                                            }
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                            {formatAmount(
                                                                invoice.amount ||
                                                                    0,
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                            {invoice.status}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            請求書はまだ作成されていません。
                                        </p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                )}

                {/* Receipt タブ */}
                {activeTab === "receipts" && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>領収書一覧</CardTitle>
                            </CardHeader>
                            <CardBody>
                                {receipts && receipts.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="border-b border-gray-200 dark:border-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                        領収書番号
                                                    </th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                        金額
                                                    </th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                        発行日
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {receipts.map((receipt) => (
                                                    <tr
                                                        key={receipt.id}
                                                        className="border-b border-gray-100 dark:border-gray-700"
                                                    >
                                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                            {
                                                                receipt.receipt_number
                                                            }
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                            {formatAmount(
                                                                receipt.amount ||
                                                                    0,
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                            {formatDate(
                                                                receipt.issued_at,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            領収書はまだ発行されていません。
                                        </p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>

            {/* 署名モーダル */}
            {showSignatureModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <Card className="w-full max-w-md max-h-screen overflow-y-auto">
                        <CardHeader>
                            <CardTitle>デジタル署名</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <form
                                onSubmit={handleSignSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <DigitalStamp
                                        onStampChange={handleStampChange}
                                    />
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm text-blue-800 dark:text-blue-200">
                                    <p>
                                        この契約に同意し、デジタル署名を行うことで、契約の効力が生じます。
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                        onClick={handleSignSubmit}
                                    >
                                        {processing
                                            ? "送信中..."
                                            : "署名を送信"}
                                    </PrimaryButton>
                                    <SecondaryButton
                                        type="button"
                                        disabled={processing}
                                        onClick={() =>
                                            setShowSignatureModal(false)
                                        }
                                    >
                                        キャンセル
                                    </SecondaryButton>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* アラート */}
            <SuccessAlert
                isOpen={alertState.type === "success" && alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                title="署名が完了しました"
                message="契約に正常に署名されました。ページを再読み込みしています..."
                autoClose={true}
                autoCloseDelay={2000}
            />

            <ConfirmAlert
                isOpen={
                    alertState.type === "empty-signature" && alertState.isOpen
                }
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                onConfirm={() =>
                    setAlertState({ ...alertState, isOpen: false })
                }
                title="署名が必要です"
                message="契約に署名してください。署名欄に署名を記入してください。"
                confirmText="OK"
                type="warning"
                showCancel={false}
            />

            <ConfirmAlert
                isOpen={alertState.type === "error" && alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                onConfirm={() =>
                    setAlertState({ ...alertState, isOpen: false })
                }
                title="エラー"
                message="署名の送信に失敗しました。もう一度お試しください。"
                confirmText="OK"
                type="error"
                showCancel={false}
            />
        </AuthenticatedLayout>
    );
}
