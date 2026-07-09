import React, { useState, useEffect } from "react";
import { Head, router, Link, usePage } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import {
    PrimaryButton,
    SecondaryButton,
    DangerButton,
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
} from "@heroicons/react/24/outline";
import SuccessAlert from "@/Components/Alerts/SuccessAlert";

// Custom Components
import ContractBasicInfo from "./_components/ContractBasicInfo";
import ContractItems from "./_components/ContractItems";
import ContractAmount from "./_components/ContractAmount";
import ContractVersionHistory from "./_components/ContractVersionHistory";
import ContractClientInfo from "./_components/ContractClientInfo";

export default function Show({ contract }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState("basic");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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
        { id: "amount", label: "金額情報", icon: "💰" },
        { id: "terms", label: "契約条項", icon: "📄" },
        { id: "versions", label: "バージョン履歴", icon: "📜" },
        { id: "client", label: "クライアント情報", icon: "👤" },
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

                {/* アクションボタン */}
                <div className="flex justify-end gap-3">
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
                            <Link
                                href={route("admin.contract.edit", contract.id)}
                                title="編集"
                                className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </Link>
                            {canSend && (
                                <Link
                                    href={route(
                                        "admin.contract.preview",
                                        contract.id,
                                    )}
                                    title="プレビュー"
                                    className="p-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </Link>
                            )}
                            {hasItems ? (
                                <Link
                                    href={route(
                                        "admin.contract.item.edit",
                                        contract.id,
                                    )}
                                    title="契約明細を編集"
                                    className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                >
                                    <PencilIcon className="w-5 h-5" />
                                </Link>
                            ) : (
                                <Link
                                    href={route(
                                        "admin.contract.item.create",
                                        contract.id,
                                    )}
                                    title="契約明細を作成"
                                    className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                </Link>
                            )}
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
                        {activeTab === "versions" && (
                            <ContractVersionHistory contract={contract} />
                        )}
                        {activeTab === "client" && (
                            <ContractClientInfo contract={contract} />
                        )}
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
