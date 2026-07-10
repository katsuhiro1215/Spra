import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import {
    EnvelopeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";

export default function MailHistory({ contract }) {
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "sent":
                return (
                    <Badge variant="green" className="flex items-center gap-1">
                        <CheckCircleIcon className="h-3 w-3" />
                        送信済み
                    </Badge>
                );
            case "failed":
            case "bounce":
                return (
                    <Badge variant="red" className="flex items-center gap-1">
                        <XCircleIcon className="h-3 w-3" />
                        失敗
                    </Badge>
                );
            case "pending":
                return (
                    <Badge variant="yellow" className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        処理中
                    </Badge>
                );
            default:
                return <Badge variant="gray">不明</Badge>;
        }
    };

    // メール送信のみをフィルタリング
    const mailHistories =
        contract.histories?.filter((h) => h.action === "sent") || [];

    if (!mailHistories || mailHistories.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <EnvelopeIcon className="h-5 w-5" />
                        メール送信履歴
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="text-center py-8">
                        <EnvelopeIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                            送信履歴はまだありません
                        </p>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <EnvelopeIcon className="h-5 w-5" />
                    メール送信履歴
                </CardTitle>
            </CardHeader>
            <CardBody>
                <div className="overflow-x-auto">
                    <Table>
                        <THead>
                            <Tr>
                                <Th>日時</Th>
                                <Th>受信者</Th>
                                <Th>件名</Th>
                                <Th>ステータス</Th>
                                <Th>備考</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {mailHistories.map((history) => (
                                <Tr key={history.id}>
                                    <Td className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(
                                            history.sent_at ||
                                                history.created_at,
                                        )}
                                    </Td>
                                    <Td className="text-sm text-gray-900 dark:text-gray-100">
                                        {history.recipient_email}
                                    </Td>
                                    <Td className="text-sm text-gray-700 dark:text-gray-300">
                                        {history.subject}
                                    </Td>
                                    <Td>{getStatusBadge(history.status)}</Td>
                                    <Td className="text-sm text-gray-600 dark:text-gray-400">
                                        {history.message || "-"}
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                </div>
            </CardBody>
        </Card>
    );
}
