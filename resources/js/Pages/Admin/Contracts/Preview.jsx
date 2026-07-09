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
} from "@heroicons/react/24/outline";
import ContractConfirmAlert from "@/Components/Alerts/ContractConfirmAlert";

export default function Preview({ contract }) {
    const [sending, setSending] = useState(false);
    const [showConfirmAlert, setShowConfirmAlert] = useState(false);
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

            <div className="max-w-5xl mx-auto space-y-6">
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
                                <div className="flex gap-3">
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
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 契約書プレビュー */}
                <Card>
                    <CardBody className="p-12 bg-white dark:bg-gray-900">
                        {/* ヘッダー */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2">
                                業務委託契約書
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                契約番号: {contract.contract_number}
                            </p>
                        </div>

                        {/* 基本情報 */}
                        <div className="mb-8 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
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
                            {contract.description && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        契約概要
                                    </p>
                                    <p className="whitespace-pre-wrap">
                                        {contract.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* クライアント情報 */}
                        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <h3 className="font-semibold mb-2">委託者（乙）</h3>
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

                        {/* 契約明細 */}
                        <div className="mb-8">
                            <h3 className="font-semibold mb-4">業務内容</h3>
                            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-800">
                                    <tr>
                                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
                                            項目名
                                        </th>
                                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
                                            説明
                                        </th>
                                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right">
                                            数量
                                        </th>
                                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right">
                                            単価
                                        </th>
                                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right">
                                            金額
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                                {item.name}
                                            </td>
                                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm">
                                                {item.description || "-"}
                                            </td>
                                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right">
                                                {item.quantity}
                                            </td>
                                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right">
                                                ¥
                                                {item.unit_price.toLocaleString()}
                                            </td>
                                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right">
                                                ¥{item.amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* 金額サマリー */}
                            <div className="mt-4 flex justify-end">
                                <div className="w-64 space-y-2">
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
                        </div>

                        {/* 契約条項 */}
                        {currentVersion?.terms_and_conditions && (
                            <div className="mb-8">
                                <h3 className="font-semibold mb-4">契約条項</h3>
                                <div className="whitespace-pre-wrap text-sm leading-relaxed border-l-4 border-blue-500 pl-4">
                                    {currentVersion.terms_and_conditions}
                                </div>
                            </div>
                        )}

                        {/* 特別条項 */}
                        {currentVersion?.special_provisions && (
                            <div className="mb-8">
                                <h3 className="font-semibold mb-4">特別条項</h3>
                                <div className="whitespace-pre-wrap text-sm leading-relaxed border-l-4 border-yellow-500 pl-4">
                                    {currentVersion.special_provisions}
                                </div>
                            </div>
                        )}

                        {/* 署名欄 */}
                        <div className="mt-12 pt-8 border-t-2 border-gray-300 dark:border-gray-700">
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
                                上記の内容で契約を締結することに合意します。
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="font-semibold mb-2">
                                        委託者（乙）
                                    </p>
                                    <p>署名: _____________________</p>
                                    <p className="mt-2 text-sm">
                                        日付: _____________________
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold mb-2">
                                        受託者（甲）
                                    </p>
                                    <p>署名: _____________________</p>
                                    <p className="mt-2 text-sm">
                                        日付: _____________________
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
