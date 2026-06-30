import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function QuoteResponseDetail({ response }) {
    const handleGoBack = () => {
        window.history.back();
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getResponseTypeLabel = (type) => {
        const labels = {
            request: "ご依頼をお願いします",
            decline: "今回は見送ります。",
            revision_request: "お見積りの見直しを依頼",
            other: "その他",
        };
        return labels[type] || type;
    };

    const getResponseTypeBadgeColor = (type) => {
        const colors = {
            request: "bg-green-100 text-green-800",
            decline: "bg-red-100 text-red-800",
            revision_request: "bg-yellow-100 text-yellow-800",
            other: "bg-blue-100 text-blue-800",
        };
        return colors[type] || "bg-gray-100 text-gray-800";
    };

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            onClick: handleGoBack,
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "見積もり一覧", href: route("admin.quote.index") },
        {
            label: "お客様返信管理",
            href: route("admin.quote-response.index"),
        },
        { label: "返信詳細", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="お客様返信詳細"
                    description={`見積番号: ${response.quote.quote_number}`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="お客様返信詳細" />

            <FlashMessage />

            <div className="max-w-4xl space-y-6">
                {/* 返信情報 */}
                <Card>
                    <CardHeader>
                        <CardTitle>返信情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    見積番号
                                </p>
                                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                                    <Link
                                        href={route(
                                            "admin.quote.show",
                                            response.quote_id,
                                        )}
                                        className="hover:underline"
                                    >
                                        {response.quote.quote_number}
                                    </Link>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    お客様メールアドレス
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {response.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    見積タイトル
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {response.quote.title}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    返信内容
                                </p>
                                <p>
                                    <span
                                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${getResponseTypeBadgeColor(
                                            response.response_type,
                                        )}`}
                                    >
                                        {getResponseTypeLabel(
                                            response.response_type,
                                        )}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 返信テキスト（その他の場合） */}
                {response.response_text && (
                    <Card>
                        <CardHeader>
                            <CardTitle>返信テキスト</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                    {response.response_text}
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                )}

                {/* タイムライン */}
                <Card>
                    <CardHeader>
                        <CardTitle>タイムライン</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 bg-indigo-600 rounded-full mt-2"></div>
                                    <div className="w-1 h-12 bg-gray-300 dark:bg-gray-600"></div>
                                </div>
                                <div className="pb-8">
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                        見積メール送信
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(response.created_at)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 bg-green-600 rounded-full mt-2"></div>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                        お客様が返信
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(response.responded_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 見積情報プレビュー */}
                <Card>
                    <CardHeader>
                        <CardTitle>見積情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    見積金額
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    ¥
                                    {new Intl.NumberFormat("ja-JP").format(
                                        response.quote.total_amount || 0,
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    見積ステータス
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                                    {response.quote.status}
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    見積説明
                                </p>
                                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                    {response.quote.requirements || "-"}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
