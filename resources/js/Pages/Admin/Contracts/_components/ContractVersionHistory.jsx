import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";

export default function ContractVersionHistory({ contract }) {
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    const formatDateTime = (datetime) => {
        if (!datetime) return "未設定";
        const date = new Date(datetime);
        return date.toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: {
                label: "下書き",
                className:
                    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
            },
            pending_review: {
                label: "レビュー待ち",
                className:
                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            },
            approved: {
                label: "承認済み",
                className:
                    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            },
            sent: {
                label: "送信済み",
                className:
                    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            },
            signed: {
                label: "署名済み",
                className:
                    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
            },
            active: {
                label: "有効",
                className:
                    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            },
            superseded: {
                label: "旧バージョン",
                className:
                    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
            },
            cancelled: {
                label: "キャンセル",
                className:
                    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            },
        };

        const config = statusConfig[status] || {
            label: status,
            className:
                "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        };

        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
            >
                {config.label}
            </span>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>バージョン履歴</CardTitle>
            </CardHeader>
            <CardBody>
                <div className="space-y-4">
                    {contract.versions && contract.versions.length > 0 ? (
                        contract.versions.map((version, index) => (
                            <div
                                key={version.id}
                                className={`border rounded-lg p-4 ${
                                    version.is_current
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                        : "border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                            v{version.version}
                                        </span>
                                        {getStatusBadge(version.status)}
                                        {version.is_current && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                現在のバージョン
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDateTime(version.created_at)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            タイトル
                                        </p>
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {contract.title}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            合計金額
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {formatAmount(version.total_amount)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            小計
                                        </p>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {formatAmount(version.base_amount)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            割引
                                        </p>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {formatAmount(
                                                version.discount_amount,
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            消費税 ({version.tax_rate}%)
                                        </p>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {formatAmount(version.tax_amount)}
                                        </p>
                                    </div>
                                </div>

                                {version.revision_reason && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            変更理由
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {version.revision_reason}
                                        </p>
                                    </div>
                                )}

                                {(version.approved_at ||
                                    version.sent_at ||
                                    version.signed_at) && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            {version.approved_at && (
                                                <div>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        承認日時
                                                    </p>
                                                    <p className="text-gray-900 dark:text-gray-100">
                                                        {formatDateTime(
                                                            version.approved_at,
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                            {version.sent_at && (
                                                <div>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        送信日時
                                                    </p>
                                                    <p className="text-gray-900 dark:text-gray-100">
                                                        {formatDateTime(
                                                            version.sent_at,
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                            {version.signed_at && (
                                                <div>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        署名日時
                                                    </p>
                                                    <p className="text-gray-900 dark:text-gray-100">
                                                        {formatDateTime(
                                                            version.signed_at,
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                            バージョン履歴がありません
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
