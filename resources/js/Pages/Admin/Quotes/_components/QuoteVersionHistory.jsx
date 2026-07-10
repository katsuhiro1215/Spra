import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";

export default function QuoteVersionHistory({ quote }) {
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getVersionStatusColor = (status) => {
        const colors = {
            draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
            sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            viewed: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
            revision_requested:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            approved:
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            rejected:
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            expired:
                "bg-gray-400 text-gray-700 dark:bg-gray-600 dark:text-gray-100",
        };
        return (
            colors[status] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
        );
    };

    const getVersionStatusLabel = (status) => {
        const labels = {
            draft: "下書き",
            sent: "送信済み",
            viewed: "確認済み",
            revision_requested: "修正要求",
            approved: "承認済み",
            rejected: "却下",
            expired: "期限切れ",
        };
        return labels[status] || status;
    };

    const versions = quote.versions || [];

    return (
        <>
            {versions.length > 0 ? (
                <div className="space-y-4">
                    {versions.map((version) => (
                        <Card key={version.id}>
                            <CardBody>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            バージョン
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            v{version.version}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            ステータス
                                        </p>
                                        <div>
                                            <Badge
                                                className={getVersionStatusColor(
                                                    version.status,
                                                )}
                                            >
                                                {getVersionStatusLabel(
                                                    version.status,
                                                )}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            作成日
                                        </p>
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {formatDate(version.created_at)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            現在のバージョン
                                        </p>
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {version.is_current ? (
                                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    現在有効
                                                </Badge>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    -
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            小計
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {formatAmount(version.base_amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            割引
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            -
                                            {formatAmount(
                                                version.discount_amount,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            消費税 ({version.tax_rate}%)
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {formatAmount(version.tax_amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            合計
                                        </span>
                                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                            {formatAmount(version.total_amount)}
                                        </span>
                                    </div>
                                </div>

                                {version.revision_reason && (
                                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                                        <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                                            修正理由
                                        </p>
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            {version.revision_reason}
                                        </p>
                                    </div>
                                )}

                                {version.client_feedback && (
                                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                                        <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                            クライアントフィードバック
                                        </p>
                                        <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                                            {version.client_feedback}
                                        </p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardBody>
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            バージョン情報がありません
                        </p>
                    </CardBody>
                </Card>
            )}
        </>
    );
}
