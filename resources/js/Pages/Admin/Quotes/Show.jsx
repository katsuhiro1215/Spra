import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
// Icons
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Show({ quote, statuses }) {
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.quote.edit", quote.id),
        },
        ...(["draft", "reviewed"].includes(quote.status)
            ? [
                  {
                      label: "送信",
                      icon: PaperAirplaneIcon,
                      variant: "secondary",
                      route: route("admin.quote.preview", quote.id),
                  },
              ]
            : []),
        {
            label: "契約書を作成",
            icon: PencilIcon,
            variant: "success",
            route: route("admin.contract.create", {
                quote_id: quote.id,
            }),
        },
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.quote.index"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "見積もり一覧", href: route("admin.quote.index") },
        { label: quote.quote_number, href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`見積もり詳細: ${quote.quote_number}`}
                    description="見積もり情報の詳細を表示しています"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`見積もり: ${quote.quote_number}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl space-y-6">
                {/* 基本情報 */}
                <Card>
                    <CardHeader>
                        <CardTitle>基本情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    見積番号
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {quote.quote_number}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    ステータス
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {statuses[quote.status] || quote.status}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    タイトル
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {quote.title}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    有効期限
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {quote.expires_at
                                        ? new Date(
                                              quote.expires_at,
                                          ).toLocaleDateString("ja-JP")
                                        : "未設定"}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 要件・仕様 */}
                <Card>
                    <CardHeader>
                        <CardTitle>要件・仕様</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    要件
                                </p>
                                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                    {quote.requirements || "未設定"}
                                </p>
                            </div>
                            {quote.custom_specifications && (
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                        カスタム仕様
                                    </p>
                                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                        {typeof quote.custom_specifications ===
                                        "string"
                                            ? quote.custom_specifications
                                            : JSON.stringify(
                                                  quote.custom_specifications,
                                                  null,
                                                  2,
                                              )}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>

                {/* 明細 */}
                <Card>
                    <CardHeader>
                        <CardTitle>見積明細</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            項目名
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            数量
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            単価
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            金額
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quote.items && quote.items.length > 0 ? (
                                        quote.items.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-gray-100 dark:border-gray-800"
                                            >
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                    <div className="font-medium">
                                                        {item.name}
                                                    </div>
                                                    {item.description && (
                                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                            {item.description}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">
                                                    {parseFloat(
                                                        item.quantity,
                                                    ).toLocaleString("ja-JP")}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">
                                                    {formatAmount(
                                                        item.unit_price,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900 dark:text-gray-100">
                                                    {formatAmount(item.amount)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400"
                                            >
                                                明細がありません
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>

                {/* 金額情報 */}
                <Card>
                    <CardHeader>
                        <CardTitle>金額情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                    小計
                                </span>
                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {formatAmount(quote.base_amount)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                    割引
                                </span>
                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    -{formatAmount(quote.discount_amount)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                    消費税 ({quote.tax_rate}%)
                                </span>
                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {formatAmount(quote.tax_amount)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    合計
                                </span>
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {formatAmount(quote.total_amount)}
                                </span>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* クライアント情報 */}
                <Card>
                    <CardHeader>
                        <CardTitle>クライアント情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {quote.user && (
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        ユーザー
                                    </p>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {quote.user.profile?.full_name ||
                                            quote.user.email}
                                    </p>
                                </div>
                            )}
                            {quote.contact && (
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        お問い合わせ
                                    </p>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {quote.contact.name}
                                    </p>
                                </div>
                            )}
                            {quote.company && (
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        会社
                                    </p>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {quote.company.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
