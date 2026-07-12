import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody, CardHeader, CardTitle } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    ArrowLeftIcon,
    PaperAirplaneIcon,
    EyeIcon,
    DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import ContractConfirmAlert from "@/Components/Alerts/ContractConfirmAlert";

export default function Preview({ contract }) {
    const [sending, setSending] = useState(false);
    const [showConfirmAlert, setShowConfirmAlert] = useState(false);
    const [pdfError, setPdfError] = useState(false);
    const currentVersion = contract.currentVersion || contract.versions?.[0];
    const items = currentVersion?.items || [];

    const handleSend = () => {
        setShowConfirmAlert(true);
    };

    const handleConfirmSend = () => {
        setSending(true);
        router.post(
            route("admin.contract.send", contract.id),
            {},
            {
                onSuccess: () => {
                    router.visit(route("admin.contract.show", contract.id));
                },
                onError: () => {
                    setSending(false);
                    setShowConfirmAlert(false);
                },
            },
        );
    };

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contract.show", contract.id),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "契約一覧", href: route("admin.contract.index") },
        {
            label: contract.contract_number,
            href: route("admin.contract.show", contract.id),
        },
        { label: "プレビュー", href: null },
    ];

    const subtotal = currentVersion?.base_amount || 0;
    const discount = currentVersion?.discount_amount || 0;
    const taxRate = currentVersion?.tax_rate || 10;
    const taxAmount = currentVersion?.tax_amount || 0;
    const total = currentVersion?.total_amount || 0;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="契約書プレビュー"
                    description={`契約書「${contract.contract_number}」の送信前プレビュー`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="契約書プレビュー" />
            <FlashMessage />

            {/* 送信確認アラート */}
            <ContractConfirmAlert
                isOpen={showConfirmAlert}
                onClose={() => setShowConfirmAlert(false)}
                onConfirm={handleConfirmSend}
                contractDetails={{
                    serviceName: contract.title,
                    contractPeriod: `${contract.start_date} 〜 ${contract.end_date || "期限なし"}`,
                    price: currentVersion?.total_amount || 0,
                }}
            />

            <div className="w-full mx-auto space-y-6">
                {/* 送信確認 */}
                <Card className="border-2 border-blue-500">
                    <CardBody>
                        <div className="flex items-start gap-4">
                            <EyeIcon className="h-6 w-6 text-blue-600 mt-1" />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2">
                                    📨 送信前の最終確認
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    以下の内容で契約書を送信します。内容をご確認ください。
                                    送信後は編集できません。修正が必要な場合は「戻る」をクリックしてください。
                                </p>
                                <div className="flex gap-3 flex-wrap">
                                    <SecondaryButton
                                        onClick={() =>
                                            router.visit(
                                                route(
                                                    "admin.contract.show",
                                                    contract.id,
                                                ),
                                            )
                                        }
                                    >
                                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                        戻って編集
                                    </SecondaryButton>
                                    <PrimaryButton
                                        onClick={handleSend}
                                        disabled={sending}
                                    >
                                        <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                                        {sending ? "送信中..." : "送信する"}
                                    </PrimaryButton>
                                    <SecondaryButton
                                        onClick={() => {
                                            const link =
                                                document.createElement("a");
                                            link.href = route(
                                                "admin.contract.pdf",
                                                contract.id,
                                            );
                                            link.download = true;
                                            link.click();
                                        }}
                                    >
                                        <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                                        PDF ダウンロード
                                    </SecondaryButton>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* PDF プレビュー */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>
                                📄 契約書 PDF プレビュー (4ページ)
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            {!pdfError ? (
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                    <iframe
                                        src={route(
                                            "admin.contract.pdf.preview",
                                            contract.id,
                                        )}
                                        className="w-full h-screen md:h-[800px] border-0"
                                        onError={() => setPdfError(true)}
                                        title="契約書 PDF プレビュー"
                                    />
                                </div>
                            ) : (
                                <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                                    <p className="text-red-800 dark:text-red-200">
                                        ❌
                                        PDFの読み込みに失敗しました。内容を確認して、もう一度お試しください。
                                    </p>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* 契約内容サマリー */}
                    <Card>
                        <CardHeader>
                            <CardTitle>📋 契約内容サマリー</CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-6">
                            {/* 基本情報 */}
                            <div>
                                <h3 className="font-semibold mb-3">契約基本情報</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            契約件名
                                        </p>
                                        <p className="font-medium">
                                            {contract.title}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            契約期間
                                        </p>
                                        <p className="font-medium">
                                            {contract.start_date} 〜{" "}
                                            {contract.end_date || "期限なし"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 契約者情報 */}
                            <div>
                                <h3 className="font-semibold mb-3">委託者（乙）</h3>
                                <p className="font-medium">
                                    {contract.user?.profile?.full_name ||
                                        contract.user?.email}
                                </p>
                                {contract.company && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {contract.company.name}
                                    </p>
                                )}
                            </div>

                            {/* 金額情報 */}
                            <div>
                                <h3 className="font-semibold mb-3">金額情報</h3>
                                <div className="space-y-2 max-w-xs">
                                    <div className="flex justify-between">
                                        <span>小計</span>
                                        <span className="font-medium">
                                            ¥{subtotal.toLocaleString()}
                                        </span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-red-600">
                                            <span>割引</span>
                                            <span className="font-medium">
                                                -¥{discount.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>消費税 ({taxRate}%)</span>
                                        <span className="font-medium">
                                            ¥{taxAmount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t-2 border-gray-300 dark:border-gray-700 text-lg font-bold">
                                        <span>合計</span>
                                        <span>¥{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 契約条項の有無 */}
                            <div>
                                <h3 className="font-semibold mb-3">
                                    契約ドキュメント
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <span className="text-lg mr-2">
                                            {currentVersion?.terms_and_conditions
                                                ? "✅"
                                                : "⚠️"}
                                        </span>
                                        <span>契約条項</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-lg mr-2">
                                            {currentVersion?.special_provisions
                                                ? "✅"
                                                : "⚠️"}
                                        </span>
                                        <span>特別条項</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-lg mr-2">
                                            {currentVersion?.notes ? "✅" : "⚠️"}
                                        </span>
                                        <span>備考</span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
