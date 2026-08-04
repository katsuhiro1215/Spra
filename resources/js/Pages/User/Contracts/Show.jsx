import React, { useState, useRef } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import {
    UserCard,
    UserCardHeader,
    UserCardBody,
    UserCardTitle,
} from "@/Components/User";
import Badge from "@/Components/Badge";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FlashMessage } from "@/Components/Notifications";
import { SuccessAlert, ConfirmAlert } from "@/Components/Alerts";
import {
    DocumentTextIcon,
    CheckCircleIcon,
    PencilIcon,
} from "@heroicons/react/24/outline";
import DigitalStamp from "@/Components/DigitalStamp";

export default function Show({
    contract,
    quote = null,
    signatureImage = null,
    invoices = [],
    receipts = [],
    project = null,
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

    const { post, processing, errors, transform } = useForm({
        signature: null,
        agreed_at: new Date().toISOString(),
    });

    // タブ定義
    const tabs = [
        { id: "contract", label: "契約書", icon: "📋" },
        { id: "quote", label: "見積書", icon: "📑" },
        { id: "invoices", label: "請求書", icon: "💳" },
        { id: "receipts", label: "領収書", icon: "🧾" },
        { id: "project", label: "プロジェクト", icon: "🗂️" },
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

    // ステータスに対応するBadgeのvariant
    // （Badgeコンポーネントはclassnameを受け付けずvariantのみ反映するため注意）
    const getStatusVariant = (status) => {
        const variants = {
            draft: "secondary",
            pending_signature: "warning",
            active: "success",
            suspended: "orange",
            completed: "primary",
            cancelled: "danger",
        };
        return variants[status] || "secondary";
    };

    // 見積書ステータスラベル（契約とは別のステータス値セットのため個別定義）
    const getQuoteStatusLabel = (status) => {
        const labels = {
            draft: "下書き",
            negotiating: "交渉中",
            approved: "承認済み",
            rejected: "却下",
            contracted: "契約済み",
            cancelled: "キャンセル",
        };
        return labels[status] || status;
    };

    // 見積書ステータスに対応するBadgeのvariant
    // （Badgeコンポーネントはclassnameを受け付けずvariantのみ反映するため注意）
    const getQuoteStatusVariant = (status) => {
        const variants = {
            draft: "secondary",
            negotiating: "warning",
            approved: "success",
            rejected: "danger",
            contracted: "primary",
            cancelled: "secondary",
        };
        return variants[status] || "secondary";
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
        }).format(amount || 0);
    };

    // 署名を保存
    const handleSignSubmit = (e) => {
        e.preventDefault();

        if (!stamp) {
            setAlertState({ type: "empty-signature", isOpen: true });
            return;
        }

        // stamp は直前に確定したローカル値。setData→postだとReactのstate更新が
        // 非同期のため、post()がまだ古い(null)のdataを送信してしまい1回目は必ず
        // 失敗する。transformで送信直前に確定値を注入することで回避する。
        transform((data) => ({ ...data, signature: stamp }));

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

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/dashboard" },
        { label: "契約一覧", href: route("user.contract.index") },
        { label: contract.title, href: null },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title={contract.title}
                    description={`契約番号: ${contract.contract_number || "-"}`}
                    breadcrumbs={breadcrumbs}
                    actions={[
                        {
                            label: "戻る",
                            variant: "default",
                            onClick: handleBack,
                        },
                    ]}
                />
            }
        >
            <Head title={`${contract.title} - 契約詳細`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="space-y-6">
                {/* タブナビゲーション */}
                <UserCard>
                    <div className="flex items-center justify-between border-b border-gray-200">
                        <div className="flex flex-wrap">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? "border-blue-500 text-blue-600 bg-blue-50"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </UserCard>

                {/* Contract タブ */}
                {activeTab === "contract" && (
                    <div className="space-y-6">
                        {/* 基本情報 */}
                        <UserCard>
                            <UserCardHeader>
                                <div className="flex justify-between items-center">
                                    <UserCardTitle>基本情報</UserCardTitle>
                                    <Badge
                                        variant={getStatusVariant(
                                            contract.status,
                                        )}
                                    >
                                        {getStatusLabel(contract.status)}
                                    </Badge>
                                </div>
                            </UserCardHeader>
                            <UserCardBody>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            契約番号
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 font-mono">
                                            {contract.contract_number || "-"}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            タイトル
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {contract.title}
                                        </dd>
                                    </div>
                                    {contract.description && (
                                        <div className="md:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">
                                                契約内容
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                                                {contract.description}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </UserCardBody>
                        </UserCard>

                        {/* 契約概要 */}
                        <UserCard>
                            <UserCardHeader>
                                <UserCardTitle>契約概要</UserCardTitle>
                            </UserCardHeader>
                            <UserCardBody>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                            契約条項
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-900">
                                            {contract.current_version
                                                ?.terms_and_conditions ||
                                                "未記入"}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                            特別条項
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-900">
                                            {contract.current_version
                                                ?.special_provisions ||
                                                "未記入"}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <PrimaryButton
                                            onClick={() =>
                                                window.open(
                                                    route(
                                                        "user.contract.pdf.preview",
                                                        contract.id,
                                                    ),
                                                    "_blank",
                                                )
                                            }
                                        >
                                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                                            PDFを確認・ダウンロード
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </UserCardBody>
                        </UserCard>

                        {/* 契約金額 */}
                        <UserCard>
                            <UserCardHeader>
                                <UserCardTitle>契約金額</UserCardTitle>
                            </UserCardHeader>
                            <UserCardBody>
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-base">
                                            <span className="text-gray-600">
                                                小計:
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {formatAmount(
                                                    contract.current_version
                                                        ?.base_amount,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            <span className="text-gray-600">
                                                割引:
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                -
                                                {formatAmount(
                                                    contract.current_version
                                                        ?.discount_amount,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            <span className="text-gray-600">
                                                消費税 (
                                                {
                                                    contract.current_version
                                                        ?.tax_rate
                                                }
                                                %):
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {formatAmount(
                                                    contract.current_version
                                                        ?.tax_amount,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xl font-bold pt-3 border-t border-blue-200">
                                            <span className="text-gray-900">
                                                税込合計:
                                            </span>
                                            <span className="text-blue-600">
                                                {formatAmount(
                                                    contract.current_version
                                                        ?.total_amount,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </UserCardBody>
                        </UserCard>

                        {/* 契約期間 */}
                        <UserCard>
                            <UserCardHeader>
                                <UserCardTitle>契約期間</UserCardTitle>
                            </UserCardHeader>
                            <UserCardBody>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            開始日
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {formatDate(contract.start_date)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            終了日
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {formatDate(contract.end_date)}
                                        </dd>
                                    </div>
                                </dl>
                            </UserCardBody>
                        </UserCard>

                        {/* 詳細設定 */}
                        {(contract.payment_terms ||
                            contract.terms_and_conditions ||
                            contract.notes) && (
                            <UserCard>
                                <UserCardHeader>
                                    <UserCardTitle>詳細設定</UserCardTitle>
                                </UserCardHeader>
                                <UserCardBody>
                                    <dl className="space-y-6">
                                        {contract.payment_terms && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    支払い条件
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                                                    {contract.payment_terms}
                                                </dd>
                                            </div>
                                        )}
                                        {contract.terms_and_conditions && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    利用規約
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded">
                                                    {
                                                        contract.terms_and_conditions
                                                    }
                                                </dd>
                                            </div>
                                        )}
                                        {contract.notes && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    備考
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                                                    {contract.notes}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </UserCardBody>
                            </UserCard>
                        )}

                        {/* 署名ステータス */}
                        <UserCard>
                            <UserCardHeader>
                                <UserCardTitle>署名ステータス</UserCardTitle>
                            </UserCardHeader>
                            <UserCardBody>
                                <div className="space-y-4">
                                    {signatureStatus === "signed" ? (
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <div className="flex items-center gap-3">
                                                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                                <div>
                                                    <p className="font-medium text-green-800">
                                                        署名済み
                                                    </p>
                                                    <p className="text-sm text-green-700">
                                                        {contract.user_signed_at
                                                            ? `署名日時: ${formatDate(
                                                                  contract.user_signed_at,
                                                              )}`
                                                            : ""}
                                                    </p>
                                                </div>
                                            </div>
                                            {signatureImage && (
                                                <div className="mt-4">
                                                    <p className="text-sm text-green-700 mb-2">
                                                        署名画像:
                                                    </p>
                                                    <img
                                                        src={signatureImage}
                                                        alt="署名"
                                                        className="max-w-xs border border-green-200 rounded-lg bg-white p-2"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                            <p className="font-medium text-yellow-800">
                                                署名待ち
                                            </p>
                                            <p className="text-sm text-yellow-700 mt-1">
                                                下記のボタンから署名を行ってください。
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </UserCardBody>
                        </UserCard>

                        {/* アクションボタン */}
                        <UserCard>
                            <UserCardBody>
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
                            </UserCardBody>
                        </UserCard>
                    </div>
                )}

                {/* Quote タブ */}
                {activeTab === "quote" && (
                    <div className="space-y-6">
                        {quote ? (
                            <UserCard>
                                <UserCardHeader>
                                    <UserCardTitle>見積書情報</UserCardTitle>
                                </UserCardHeader>
                                <UserCardBody>
                                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                見積書番号
                                            </dt>
                                            <dd className="mt-1 text-sm font-mono text-gray-900">
                                                {quote.quote_number}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                タイトル
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {quote.title}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                金額
                                            </dt>
                                            <dd className="mt-1 text-sm font-semibold text-blue-600">
                                                {formatAmount(
                                                    quote.current_version
                                                        ?.total_amount || 0,
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                ステータス
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                <Badge
                                                    variant={getQuoteStatusVariant(
                                                        quote.status,
                                                    )}
                                                >
                                                    {getQuoteStatusLabel(
                                                        quote.status,
                                                    )}
                                                </Badge>
                                            </dd>
                                        </div>
                                    </dl>
                                    {quote.description && (
                                        <div className="mt-6">
                                            <dt className="text-sm font-medium text-gray-500">
                                                説明
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                                                {quote.description}
                                            </dd>
                                        </div>
                                    )}
                                    <div className="mt-6">
                                        <Link
                                            href={route(
                                                "user.quote.show",
                                                quote.id,
                                            )}
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                        >
                                            見積明細を見る →
                                        </Link>
                                    </div>
                                </UserCardBody>
                            </UserCard>
                        ) : (
                            <UserCard>
                                <UserCardBody>
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">
                                            この契約に関連する見積書はありません。
                                        </p>
                                    </div>
                                </UserCardBody>
                            </UserCard>
                        )}
                    </div>
                )}

                {/* Invoice タブ */}
                {activeTab === "invoices" && (
                    <div className="space-y-6">
                        <UserCard>
                            <UserCardHeader>
                                <UserCardTitle>請求書一覧</UserCardTitle>
                            </UserCardHeader>
                            <UserCardBody>
                                {invoices && invoices.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="border-b border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                        請求書番号
                                                    </th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                        金額
                                                    </th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                        状態
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invoices.map((invoice) => (
                                                    <tr
                                                        key={invoice.id}
                                                        className="border-b border-gray-100"
                                                    >
                                                        <td className="px-4 py-3">
                                                            <a
                                                                href={route(
                                                                    "user.invoice.show",
                                                                    invoice.id,
                                                                )}
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                {
                                                                    invoice.invoice_number
                                                                }
                                                            </a>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-900">
                                                            {formatAmount(
                                                                invoice.total_amount ||
                                                                    0,
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-900">
                                                            {invoice.status_name ||
                                                                invoice.status}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">
                                            請求書はまだ作成されていません。
                                        </p>
                                    </div>
                                )}
                            </UserCardBody>
                        </UserCard>
                    </div>
                )}

                {/* Receipt タブ */}
                {activeTab === "receipts" && (
                    <div className="space-y-6">
                        <UserCard>
                            <UserCardHeader>
                                <UserCardTitle>領収書一覧</UserCardTitle>
                            </UserCardHeader>
                            <UserCardBody>
                                {receipts && receipts.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="border-b border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                        領収書番号
                                                    </th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                        金額
                                                    </th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                        発行日
                                                    </th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                        操作
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {receipts.map((receipt) => (
                                                    <tr
                                                        key={receipt.id}
                                                        className="border-b border-gray-100"
                                                    >
                                                        <td className="px-4 py-3 text-gray-900">
                                                            {
                                                                receipt.receipt_number
                                                            }
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-900">
                                                            {formatAmount(
                                                                receipt.amount ||
                                                                    0,
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-900">
                                                            {formatDate(
                                                                receipt.issued_at,
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <Link
                                                                href={route(
                                                                    "user.receipt.show",
                                                                    receipt.id,
                                                                )}
                                                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                            >
                                                                詳細を見る
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">
                                            領収書はまだ発行されていません。
                                        </p>
                                    </div>
                                )}
                            </UserCardBody>
                        </UserCard>
                    </div>
                )}

                {/* Project タブ */}
                {activeTab === "project" && (
                    <div className="space-y-6">
                        <UserCard>
                            <UserCardHeader>
                                <UserCardTitle>プロジェクト</UserCardTitle>
                            </UserCardHeader>
                            <UserCardBody>
                                {project ? (
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {project.title}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {project.description ||
                                                    "説明なし"}
                                            </p>
                                        </div>
                                        <a
                                            href={route(
                                                "user.projects.show",
                                                project.id,
                                            )}
                                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                                        >
                                            進捗・ガントチャートを見る
                                        </a>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">
                                            この契約に関連するプロジェクトはまだありません。
                                        </p>
                                    </div>
                                )}
                            </UserCardBody>
                        </UserCard>
                    </div>
                )}
            </div>

            {/* 署名モーダル */}
            {showSignatureModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <UserCard className="w-full max-w-md max-h-screen overflow-y-auto">
                        <UserCardHeader>
                            <UserCardTitle>デジタル署名</UserCardTitle>
                        </UserCardHeader>
                        <UserCardBody>
                            <form
                                onSubmit={handleSignSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <DigitalStamp
                                        onStampChange={handleStampChange}
                                    />
                                </div>

                                <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
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
                        </UserCardBody>
                    </UserCard>
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
