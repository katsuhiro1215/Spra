import React, { useState, useEffect } from "react";
import { Head, router, usePage, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import {
    PrimaryButton,
    SecondaryButton,
    DangerButton,
    TextButton,
} from "@/Components/Buttons";
import { Card, CardBody } from "@/Components/Card";
import {
    ArrowLeftIcon,
    PencilIcon,
    DocumentTextIcon,
    PaperAirplaneIcon,
    PlusIcon,
    CheckCircleIcon,
    XCircleIcon,
    SparklesIcon,
} from "@heroicons/react/24/outline";
import SuccessAlert from "@/Components/Alerts/SuccessAlert";
import { ConfirmAlert } from "@/Components/Alerts";
import DigitalStamp from "@/Components/DigitalStamp";

// Custom Components
import ContractBasicInfo from "./_components/ContractBasicInfo";
import ContractItems from "./_components/ContractItems";
import ContractBenefits from "./_components/ContractBenefits";
import ContractAmount from "./_components/ContractAmount";
import ContractVersionHistory from "./_components/ContractVersionHistory";
import ContractClientInfo from "./_components/ContractClientInfo";
import BillingInfo from "./_components/BillingInfo";

export default function Show({ contract }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState("basic");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showAdminSignatureModal, setShowAdminSignatureModal] =
        useState(false);
    const [adminStamp, setAdminStamp] = useState(null);
    const [alertState, setAlertState] = useState({
        type: null, // 'empty-signature', 'success', 'error'
        isOpen: false,
    });

    const { post, processing, errors, transform } = useForm({
        signature_image: null,
        method: "typed",
    });

    // フラッシュメッセージの成功時に Alert を表示
    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
            setShowSuccessAlert(true);
        }
    }, [flash?.success]);

    const tabs = [
        { id: "basic", label: "基本情報", icon: "📋" },
        { id: "items", label: "契約明細", icon: "📝" },
        { id: "benefits", label: "契約特典", icon: "🎫" },
        { id: "amount", label: "金額情報", icon: "💰" },
        { id: "terms", label: "契約条項", icon: "📄" },
        ...(contract.type === "monthly"
            ? [{ id: "billing", label: "請求設定", icon: "🗓️" }]
            : []),
        { id: "versions", label: "バージョン履歴", icon: "📜" },
        { id: "client", label: "クライアント情報", icon: "👤" },
        { id: "quote", label: "見積書", icon: "📑" },
        { id: "invoices", label: "請求書", icon: "💵" },
        { id: "receipts", label: "領収書", icon: "🧾" },
    ];

    const STATUSES = {
        draft: "下書き",
        pending_review: "レビュー待ち",
        approved: "承認済み",
        sent: "送信済み",
        pending_signature: "署名待ち",
        signed: "署名済み",
        active: "有効",
        suspended: "一時停止",
        completed: "完了",
        cancelled: "キャンセル",
    };

    const currentVersion = contract.current_version || contract.versions?.[0];
    const hasItems = currentVersion?.items?.length > 0;
    const hasTerms =
        currentVersion?.terms_and_conditions ||
        currentVersion?.special_provisions;
    const canSend = hasItems && hasTerms && currentVersion?.status === "draft";
    const readyForNextSteps = contract.signature_status === "fully_signed";

    // ========================================
    // アクションハンドラー
    // ========================================

    const handleAddItems = () => {
        if (contract.quote_id) {
            // QuoteItemからコピー
            router.get(route("admin.contract.item.create", contract.id));
        } else {
            alert("見積書がないため、明細を追加できません");
        }
    };

    const handleEditTerms = () => {
        router.get(route("admin.contract.terms.edit", contract.id));
    };

    const handlePreview = () => {
        router.get(route("admin.contract.preview", contract.id));
    };

    const handleEdit = () => {
        router.get(route("admin.contract.edit", contract.id));
    };

    const handleDelete = () => {
        if (confirm(`契約「${contract.title}」を削除してもよろしいですか？`)) {
            router.delete(route("admin.contract.destroy", contract.id));
        }
    };

    const handleCreateProject = () => {
        // 契約データをクエリパラメータで渡して Project/Create に遷移
        router.get(route("admin.project.create"), {
            contract_id: contract.id,
        });
    };

    const handleCreateInvoice = () => {
        // 請求書作成ページへ遷移（contract_id パラメータを渡す）
        router.get(route("admin.invoice.create"), { contract_id: contract.id });
    };

    const handleAdminSignSubmit = (e) => {
        e.preventDefault();

        if (!adminStamp) {
            setAlertState({ type: "empty-signature", isOpen: true });
            return;
        }

        // adminStamp は直前に確定したローカル値。setData→postだとReactのstate更新が
        // 非同期のため、post()がまだ古い(null)のdataを送信してしまい1回目は必ず
        // 失敗する。transformで送信直前に確定値を注入することで回避する。
        transform((data) => ({ ...data, signature_image: adminStamp }));

        post(route("admin.contract.signature.admin.store", contract.id), {
            onSuccess: () => {
                setShowAdminSignatureModal(false);
                setAlertState({ type: "success", isOpen: true });
                setTimeout(() => {
                    router.reload();
                }, 2000);
            },
            onError: (errors) => {
                console.error("Admin署名送信エラー:", errors);
                setAlertState({ type: "error", isOpen: true });
            },
        });
    };

    const handleAdminStampChange = (stampData) => {
        setAdminStamp(stampData);
    };

    // ========================================
    // Header Actions & Breadcrumbs
    // ========================================

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contract.index"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "契約一覧", href: route("admin.contract.index") },
        { label: contract.contract_number || contract.title, href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`契約詳細: ${contract.contract_number}`}
                    description={`${STATUSES[contract.status] || contract.status} • ${contract.title}`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`契約: ${contract.contract_number}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            {contract.contract_group && (
                <div className="mb-4">
                    <TextButton
                        href={route(
                            "admin.contract-group.show",
                            contract.contract_group.id,
                        )}
                        variant="primary"
                        size="sm"
                    >
                        📎 グループ: {contract.contract_group.title}
                    </TextButton>
                </div>
            )}

            {/* 成功アラート */}
            <SuccessAlert
                isOpen={showSuccessAlert}
                onClose={() => setShowSuccessAlert(false)}
                title="処理完了"
                message={successMessage || "処理が正常に完了しました。"}
                autoClose={true}
                autoCloseDelay={4000}
            />

            <div className="max-w-7xl space-y-6">
                {/* ワークフロー進捗 */}
                {contract.status === "draft" && (
                    <Card>
                        <CardBody>
                            <h3 className="text-lg font-semibold mb-4">
                                📌 契約書作成ワークフロー
                            </h3>
                            <div className="space-y-3">
                                <div
                                    className={`flex items-center gap-3 ${hasItems ? "text-green-600" : "text-gray-500"}`}
                                >
                                    {hasItems ? (
                                        <CheckCircleIcon className="h-5 w-5" />
                                    ) : (
                                        <XCircleIcon className="h-5 w-5" />
                                    )}
                                    <span className="font-medium">
                                        ① 契約明細の追加
                                    </span>
                                    {!hasItems && (
                                        <SecondaryButton
                                            size="sm"
                                            onClick={handleAddItems}
                                        >
                                            <PlusIcon className="h-4 w-4 mr-1" />
                                            明細を追加
                                        </SecondaryButton>
                                    )}
                                </div>
                                <div
                                    className={`flex items-center gap-3 ${hasTerms ? "text-green-600" : "text-gray-500"}`}
                                >
                                    {hasTerms ? (
                                        <CheckCircleIcon className="h-5 w-5" />
                                    ) : (
                                        <XCircleIcon className="h-5 w-5" />
                                    )}
                                    <span className="font-medium">
                                        ② 契約条項の記入
                                    </span>
                                    <SecondaryButton
                                        size="sm"
                                        onClick={handleEditTerms}
                                    >
                                        <PencilIcon className="h-4 w-4 mr-1" />
                                        {hasTerms ? "条項を編集" : "条項を記入"}
                                    </SecondaryButton>
                                </div>
                                <div
                                    className={`flex items-center gap-3 ${canSend ? "text-blue-600" : "text-gray-400"}`}
                                >
                                    <PaperAirplaneIcon className="h-5 w-5" />
                                    <span className="font-medium">
                                        ③ プレビューと送信
                                    </span>
                                    {canSend && (
                                        <PrimaryButton
                                            size="sm"
                                            onClick={handlePreview}
                                        >
                                            <PaperAirplaneIcon className="h-4 w-4 mr-1" />
                                            プレビュー
                                        </PrimaryButton>
                                    )}
                                    {!canSend && (
                                        <span className="text-sm text-gray-500">
                                            (明細と条項を入力後に送信可能)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                )}

                {/* 署名状態と次のステップ */}
                {(contract.status === "pending_signature" ||
                    contract.status === "active") && (
                    <Card>
                        <CardBody>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">
                                        ✍️ 署名状況
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                ユーザー署名
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {contract.user_signed_at ? (
                                                    <>
                                                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                                        <span className="text-green-600 font-semibold">
                                                            署名済み
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircleIcon className="h-5 w-5 text-yellow-600" />
                                                        <span className="text-yellow-600 font-semibold">
                                                            署名待ち
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            {contract.user_signed_at && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    署名日時:{" "}
                                                    {new Date(
                                                        contract.user_signed_at,
                                                    ).toLocaleDateString(
                                                        "ja-JP",
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                Admin 署名
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {contract.admin_signed_at ? (
                                                    <>
                                                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                                        <span className="text-green-600 font-semibold">
                                                            署名済み
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircleIcon className="h-5 w-5 text-yellow-600" />
                                                        <span className="text-yellow-600 font-semibold">
                                                            署名待ち
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            {contract.admin_signed_at && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    署名日時:{" "}
                                                    {new Date(
                                                        contract.admin_signed_at,
                                                    ).toLocaleDateString(
                                                        "ja-JP",
                                                    )}
                                                </p>
                                            )}
                                            {contract.user_signed_at &&
                                                !contract.admin_signed_at && (
                                                    <button
                                                        onClick={() =>
                                                            setShowAdminSignatureModal(
                                                                true,
                                                            )
                                                        }
                                                        className="mt-3 w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                                                    >
                                                        署名する
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                </div>

                                {/* 完全署名後のプロジェクト・請求書作成ボタン */}
                                {readyForNextSteps && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                            次のステップ
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <button
                                                onClick={handleCreateProject}
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                            >
                                                <SparklesIcon className="h-5 w-5" />
                                                プロジェクトを作成
                                            </button>
                                            <button
                                                onClick={handleCreateInvoice}
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                            >
                                                <DocumentTextIcon className="h-5 w-5" />
                                                請求書を作成
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                                            プロジェクトと請求書は平行して作成できます。
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                )}

                {/* アクションボタン */}
                <div className="flex justify-end gap-3 flex-wrap">
                    {contract.status === "draft" && (
                        <>
                            <SecondaryButton onClick={handleEdit}>
                                <PencilIcon className="h-4 w-4 mr-2" />
                                基本情報を編集
                            </SecondaryButton>
                            <DangerButton onClick={handleDelete}>
                                削除
                            </DangerButton>
                        </>
                    )}
                    {contract.user_signed_at &&
                        !contract.admin_signed_at &&
                        (contract.signature_required_from === "admin" ||
                            contract.signature_required_from === "both") && (
                            <SecondaryButton
                                onClick={() =>
                                    setShowAdminSignatureModal(true)
                                }
                            >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Admin署名
                            </SecondaryButton>
                        )}
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
                        <div className="flex items-center gap-2 pr-4">
                            <TextButton
                                href={route("admin.contract.edit", contract.id)}
                                variant="primary"
                                size="sm"
                                title="編集"
                            >
                                <PencilIcon className="w-4 h-4 mr-1" />
                                編集
                            </TextButton>

                            {hasItems ? (
                                <TextButton
                                    href={route(
                                        "admin.contract.item.edit",
                                        contract.id,
                                    )}
                                    variant="primary"
                                    size="sm"
                                    title="契約明細を編集"
                                >
                                    <PencilIcon className="w-4 h-4 mr-1" />
                                    契約明細編集
                                </TextButton>
                            ) : (
                                <TextButton
                                    href={route(
                                        "admin.contract.item.create",
                                        contract.id,
                                    )}
                                    variant="success"
                                    size="sm"
                                    title="契約明細を作成"
                                >
                                    <PlusIcon className="w-4 h-4 mr-1" />
                                    契約明細を作成
                                </TextButton>
                            )}

                            {canSend && (
                                <TextButton
                                    href={route(
                                        "admin.contract.preview",
                                        contract.id,
                                    )}
                                    variant="skyblue"
                                    size="sm"
                                    title="プレビュー"
                                >
                                    <PaperAirplaneIcon className="w-4 h-4 mr-1" />
                                    プレビュー
                                </TextButton>
                            )}

                            <TextButton
                                href={route("admin.contract.pdf", contract.id)}
                                variant="default"
                                size="sm"
                                title="PDFダウンロード"
                            >
                                <DocumentTextIcon className="w-4 h-4 mr-1" />
                                PDF
                            </TextButton>
                        </div>
                    </div>

                    {/* タブコンテンツ */}
                    <CardBody>
                        {activeTab === "basic" && (
                            <ContractBasicInfo
                                contract={contract}
                                statuses={STATUSES}
                            />
                        )}
                        {activeTab === "items" && (
                            <ContractItems contract={contract} />
                        )}
                        {activeTab === "benefits" && (
                            <ContractBenefits contract={contract} />
                        )}
                        {activeTab === "amount" && (
                            <ContractAmount contract={contract} />
                        )}
                        {activeTab === "terms" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        契約条項
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg whitespace-pre-wrap">
                                        {currentVersion?.terms_and_conditions ||
                                            "未記入"}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        特別条項
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg whitespace-pre-wrap">
                                        {currentVersion?.special_provisions ||
                                            "未記入"}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        備考
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg whitespace-pre-wrap">
                                        {currentVersion?.notes || "未記入"}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "billing" &&
                            contract.type === "monthly" && (
                                <BillingInfo contract={contract} />
                            )}
                        {activeTab === "versions" && (
                            <ContractVersionHistory contract={contract} />
                        )}
                        {activeTab === "client" && (
                            <ContractClientInfo contract={contract} />
                        )}
                        {activeTab === "quote" && (
                            <>
                                {contract.quote ? (
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                見積書番号
                                            </span>
                                            <p className="mt-1 text-gray-900 dark:text-gray-100">
                                                {contract.quote.quote_number}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                タイトル
                                            </span>
                                            <p className="mt-1 text-gray-900 dark:text-gray-100">
                                                {contract.quote.title}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                金額
                                            </span>
                                            <p className="mt-1 text-lg font-semibold text-blue-600 dark:text-blue-400">
                                                ¥
                                                {(
                                                    contract.quote
                                                        .total_amount || 0
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                ステータス
                                            </span>
                                            <p className="mt-1 text-gray-900 dark:text-gray-100">
                                                {contract.quote.status}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">
                                        この契約に関連する見積書はありません。
                                    </p>
                                )}
                            </>
                        )}
                        {activeTab === "invoices" && (
                            <>
                                <p className="text-gray-500 dark:text-gray-400">
                                    請求書表示機能は準備中です。
                                </p>
                            </>
                        )}
                        {activeTab === "receipts" && (
                            <>
                                <p className="text-gray-500 dark:text-gray-400">
                                    領収書表示機能は準備中です。
                                </p>
                            </>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* Admin署名モーダル */}
            {showAdminSignatureModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <Card className="w-full max-w-md max-h-screen overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">
                                Admin署名
                            </h2>
                            <form
                                onSubmit={handleAdminSignSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <DigitalStamp
                                        onStampChange={handleAdminStampChange}
                                    />
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm text-blue-800 dark:text-blue-200">
                                    <p>
                                        この契約に対してAdmin署名を行います。
                                        <br />
                                        署名後、契約は有効状態となります。
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "送信中..."
                                            : "署名を送信"}
                                    </PrimaryButton>
                                    <SecondaryButton
                                        type="button"
                                        disabled={processing}
                                        onClick={() =>
                                            setShowAdminSignatureModal(false)
                                        }
                                    >
                                        キャンセル
                                    </SecondaryButton>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}

            {/* アラート */}
            <SuccessAlert
                isOpen={alertState.type === "success" && alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                title="署名が完了しました"
                message="Admin署名が正常に完了しました。ページを再読み込みしています..."
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
                message="Admin署名を作成してください。"
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
                message="Admin署名の送信に失敗しました。もう一度お試しください。"
                confirmText="OK"
                type="error"
                showCancel={false}
            />
        </AdminAuthenticatedLayout>
    );
}
