import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
// Icons
import {
    ArrowLeftIcon,
    CheckIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

export default function QuoteResponseIndex({ responses, filters }) {
    const [selectedFilter, setSelectedFilter] = useState(
        filters.status || "pending",
    );

    const handleFilterChange = (status) => {
        setSelectedFilter(status);
        window.location.href = route("admin.quote-response.index", {
            status: status !== "all" ? status : undefined,
        });
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

    const getStatusBadgeColor = (respondedAt) => {
        return respondedAt
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800";
    };

    const getStatusLabel = (respondedAt) => {
        return respondedAt ? "返信済み" : "返信待ち";
    };

    const headerActions = [
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
        { label: "お客様返信管理", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="お客様返信管理"
                    description="見積もりに対するお客様からの返信を確認・管理できます"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="お客様返信管理" />

            <FlashMessage />

            <div className="max-w-7xl space-y-6">
                {/* ステータスフィルタ */}
                <Card>
                    <CardHeader>
                        <CardTitle>フィルタ</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => handleFilterChange("all")}
                                className={`px-4 py-2 rounded-lg font-medium transition ${
                                    selectedFilter === "all" || !filters.status
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                            >
                                すべて
                            </button>
                            <button
                                onClick={() => handleFilterChange("pending")}
                                className={`px-4 py-2 rounded-lg font-medium transition ${
                                    selectedFilter === "pending"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                            >
                                返信待ち
                            </button>
                            <button
                                onClick={() => handleFilterChange("responded")}
                                className={`px-4 py-2 rounded-lg font-medium transition ${
                                    selectedFilter === "responded"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                            >
                                返信済み
                            </button>
                        </div>
                    </CardBody>
                </Card>

                {/* レスポンス一覧 */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            返信一覧（全 {responses.length} 件）
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        {responses.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold">
                                                見積番号
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold">
                                                メールアドレス
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold">
                                                返信内容
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold">
                                                状態
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold">
                                                返信日時
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold">
                                                送信日時
                                            </th>
                                            <th className="px-4 py-3 text-center font-semibold">
                                                アクション
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {responses.map((response) => (
                                            <tr
                                                key={response.id}
                                                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                            >
                                                <td className="px-4 py-3 font-medium text-indigo-600 dark:text-indigo-400">
                                                    <Link
                                                        href={route(
                                                            "admin.quote.show",
                                                            response.quote_id,
                                                        )}
                                                        className="hover:underline"
                                                    >
                                                        {
                                                            response.quote
                                                                .quote_number
                                                        }
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {response.email}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {response.response_type ? (
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-medium ${getResponseTypeBadgeColor(
                                                                response.response_type,
                                                            )}`}
                                                        >
                                                            {getResponseTypeLabel(
                                                                response.response_type,
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(
                                                            response.responded_at,
                                                        )}`}
                                                    >
                                                        {getStatusLabel(
                                                            response.responded_at,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    {formatDate(
                                                        response.responded_at,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    {formatDate(
                                                        response.created_at,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {response.responded_at && (
                                                        <Link
                                                            href={route(
                                                                "admin.quote-response.detail",
                                                                response.id,
                                                            )}
                                                            className="text-indigo-600 hover:text-indigo-900 hover:underline text-sm font-medium"
                                                        >
                                                            詳細
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>返信データがありません</p>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
