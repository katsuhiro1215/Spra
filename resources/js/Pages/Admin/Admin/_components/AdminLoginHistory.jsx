import React from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";

// LoginLog::ACTION_* に対応するバッジ色
const ACTION_VARIANTS = {
    login_success: "success",
    logout: "info",
    login_failed: "danger",
    session_expired: "warning",
    forced_logout: "orange",
};

export default function AdminLoginHistory({ loginLogs = [] }) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>ログイン履歴</CardHeader>
                <CardBody>
                    {loginLogs.length > 0 ? (
                        <Table>
                            <THead>
                                <Tr hover={false}>
                                    <Th>日時</Th>
                                    <Th>状態</Th>
                                    <Th>IPアドレス</Th>
                                    <Th>ブラウザ</Th>
                                    <Th>OS</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {loginLogs.map((log) => (
                                    <Tr key={log.id}>
                                        <Td>
                                            {new Date(
                                                log.created_at,
                                            ).toLocaleString("ja-JP")}
                                        </Td>
                                        <Td>
                                            <Badge
                                                variant={
                                                    ACTION_VARIANTS[
                                                        log.action
                                                    ] || "secondary"
                                                }
                                                size="xs"
                                            >
                                                {log.action_name}
                                            </Badge>
                                        </Td>
                                        <Td>{log.ip_address || "-"}</Td>
                                        <Td>{log.browser || "-"}</Td>
                                        <Td>{log.os || "-"}</Td>
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>
                    ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                            ログイン履歴がありません
                        </p>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
