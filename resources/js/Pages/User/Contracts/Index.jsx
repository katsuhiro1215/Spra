import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import UserPagination from "@/Components/Layout/UserPagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody, CardTitle } from "@/Components/Card";
import Badge from "@/Components/Badge";
import {
    DocumentTextIcon,
    ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export default function Index({ contracts }) {
    const [selectedStatus, setSelectedStatus] = useState(null);

    // ページネーターから実際のデータを取得
    const contractsList = contracts?.data || contracts || [];

    // ステータスのラベル取得
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

    // ステータスのカラー取得
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

    // フィルタリング
    const filteredContracts = selectedStatus
        ? contractsList.filter((c) => c.status === selectedStatus)
        : contractsList;

    // ステータス別の契約数
    const statusCounts = {
        pending_signature: contractsList.filter(
            (c) => c.status === "pending_signature",
        ).length,
        active: contractsList.filter((c) => c.status === "active").length,
        draft: contractsList.filter((c) => c.status === "draft").length,
        all: contractsList.length,
    };

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="契約管理"
                    description="契約書の確認と署名"
                    breadcrumbs={[
                        {
                            label: "ダッシュボード",
                            href: route("user.dashboard"),
                        },
                        { label: "契約管理", href: "#" },
                    ]}
                />
            }
        >
            <Head title="契約管理" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="space-y-6">
                {/* ステータス別カード */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        type="button"
                        onClick={() => setSelectedStatus("pending_signature")}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 text-left border-l-4 border-yellow-600"
                    >
                        <div className="text-3xl font-bold text-yellow-600 mb-2">
                            {statusCounts.pending_signature}
                        </div>
                        <p className="text-sm text-gray-600">署名待ち</p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedStatus("active")}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 text-left border-l-4 border-green-600"
                    >
                        <div className="text-3xl font-bold text-green-600 mb-2">
                            {statusCounts.active}
                        </div>
                        <p className="text-sm text-gray-600">契約中</p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedStatus(null)}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 text-left border-l-4 border-indigo-600"
                    >
                        <div className="text-3xl font-bold text-indigo-600 mb-2">
                            {statusCounts.all}
                        </div>
                        <p className="text-sm text-gray-600">全件</p>
                    </button>
                </div>

                {/* 契約一覧テーブル */}
                {filteredContracts.length > 0 ? (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                        契約番号
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                        タイトル
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                        ステータス
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                        作成日
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredContracts.map((contract) => (
                                    <tr
                                        key={contract.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-indigo-600">
                                            {contract.contract_number}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {contract.title}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Badge
                                                className={getStatusColor(
                                                    contract.status,
                                                )}
                                            >
                                                {getStatusLabel(
                                                    contract.status,
                                                )}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(contract.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Link
                                                href={route(
                                                    "user.contract.show",
                                                    contract.id,
                                                )}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                詳細
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* ページネーション */}
                        {contracts.links && (
                            <UserPagination
                                links={contracts.links}
                                meta={contracts.meta}
                            />
                        )}
                    </div>
                ) : (
                    /* データなしのメッセージ */
                    <Card>
                        <CardBody>
                            <div className="text-center py-12">
                                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <h3 className="text-sm font-medium text-gray-900">
                                    {selectedStatus
                                        ? `${getStatusLabel(selectedStatus)}の契約はありません`
                                        : "契約がまだありません"}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    契約が作成されるとここに表示されます
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
