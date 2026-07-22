import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";

const ACTION_LABELS = {
    created: "作成",
    sent: "送信",
    signed: "署名",
    archived: "アーカイブ",
    cancelled: "キャンセル",
    note_added: "メモ追加",
    signature_notification: "署名通知",
    reminder_sent: "署名リマインダー送信",
    reminder_failed: "署名リマインダー送信失敗",
    group_sent: "グループ一括送信",
    invoice_generated: "請求書自動生成",
    invoice_generation_failed: "請求書自動生成失敗",
    invoice_sent: "請求書送付",
    invoice_send_failed: "請求書送付失敗",
    invoice_reminder_sent: "請求書督促送付",
    invoice_reminder_failed: "請求書督促送付失敗",
    renewal_notice_sent: "契約更新案内送付",
    renewal_notice_failed: "契約更新案内送付失敗",
};

const STATUS_BADGES = {
    pending: {
        label: "ペンディング",
        className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    },
    sent: {
        label: "送信済み",
        className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    failed: {
        label: "失敗",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    },
    bounce: {
        label: "バウンス",
        className:
            "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    },
};

export default function ContractHistories({ contract }) {
    const histories = contract.histories || [];

    const actionLabel = (action) => ACTION_LABELS[action] || action;

    const formatDateTime = (datetime) => {
        if (!datetime) return "未設定";
        return new Date(datetime).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const config = STATUS_BADGES[status] || {
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
                <CardTitle>契約履歴</CardTitle>
            </CardHeader>
            <CardBody>
                <div className="space-y-4">
                    {histories.length > 0 ? (
                        histories.map((history) => (
                            <div
                                key={history.id}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                            >
                                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                            {actionLabel(history.action)}
                                        </span>
                                        {getStatusBadge(history.status)}
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatDateTime(
                                            history.sent_at ||
                                                history.created_at,
                                        )}
                                    </span>
                                </div>

                                {history.subject && (
                                    <p className="text-sm text-gray-900 dark:text-gray-100 mb-1">
                                        {history.subject}
                                    </p>
                                )}

                                {history.recipient_email && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        送付先: {history.recipient_email}
                                    </p>
                                )}

                                {history.message && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap">
                                        {history.message}
                                    </p>
                                )}

                                {history.creator && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        操作者:{" "}
                                        {history.creator.profile?.full_name ||
                                            history.creator.email}
                                    </p>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                            契約履歴がありません
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
