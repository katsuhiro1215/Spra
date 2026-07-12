import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { TextButton, DeleteButton, SecondaryButton } from "@/Components/Buttons";
import DeleteAlert from "@/Components/Alerts/DeleteAlert";
import { ConfirmAlert } from "@/Components/Alerts";
import {
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";

const ApiClientTable = ({ clients }) => {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [regenerateTarget, setRegenerateTarget] = useState(null);

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            router.delete(
                route("admin.contact.api-client.destroy", deleteTarget.id),
                {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => setDeleteTarget(null),
                },
            );
        }
    };

    const handleToggleActive = (client) => {
        router.patch(
            route("admin.contact.api-client.toggle-active", client.id),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleConfirmRegenerate = () => {
        if (regenerateTarget) {
            router.post(
                route("admin.contact.api-client.regenerate", regenerateTarget.id),
                {},
                { preserveScroll: true, onFinish: () => setRegenerateTarget(null) },
            );
        }
    };

    return (
        <>
            <DeleteAlert
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.name}
            />
            <ConfirmAlert
                isOpen={!!regenerateTarget}
                onClose={() => setRegenerateTarget(null)}
                onCancel={() => setRegenerateTarget(null)}
                onConfirm={handleConfirmRegenerate}
                title="APIキーを再発行しますか？"
                message={`「${regenerateTarget?.name}」の現在のAPIキーは即座に無効になります。連携先(WordPress等)のキーも更新が必要です。`}
                confirmText="再発行する"
                cancelText="キャンセル"
                type="warning"
            />

            <Card>
                <CardHeader>APIクライアント一覧 ({clients.total}件)</CardHeader>
                <Table>
                    <THead>
                        <Tr hover={false}>
                            <Th>連携先名</Th>
                            <Th>キー(末尾)</Th>
                            <Th>ステータス</Th>
                            <Th>最終利用</Th>
                            <Th className="text-right">操作</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {clients.data && clients.data.length > 0 ? (
                            clients.data.map((client) => (
                                <Tr key={client.id}>
                                    <Td>
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {client.name}
                                        </div>
                                    </Td>
                                    <Td>
                                        <code className="text-xs text-slate-500 dark:text-slate-400">
                                            ****{client.key_preview}
                                        </code>
                                    </Td>
                                    <Td>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleToggleActive(client)
                                            }
                                        >
                                            <Badge
                                                variant={
                                                    client.is_active
                                                        ? "success"
                                                        : "secondary"
                                                }
                                                size="xs"
                                            >
                                                {client.is_active ? (
                                                    <div className="flex items-center gap-1">
                                                        <CheckCircleIcon className="h-3 w-3" />
                                                        有効
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        <XCircleIcon className="h-3 w-3" />
                                                        無効
                                                    </div>
                                                )}
                                            </Badge>
                                        </button>
                                    </Td>
                                    <Td>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            {client.last_used_at
                                                ? new Date(
                                                      client.last_used_at,
                                                  ).toLocaleString("ja-JP")
                                                : "未使用"}
                                        </div>
                                    </Td>
                                    <Td>
                                        <div className="flex justify-end items-center gap-1">
                                            <TextButton
                                                onClick={() =>
                                                    setRegenerateTarget(client)
                                                }
                                                variant="warning"
                                                title="APIキーを再発行"
                                                size="sm"
                                            >
                                                <ArrowPathIcon className="h-5 w-5" />
                                            </TextButton>
                                            <TextButton
                                                href={route(
                                                    "admin.contact.api-client.edit",
                                                    client.id,
                                                )}
                                                variant="info"
                                                title="編集"
                                                size="sm"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </TextButton>
                                            <DeleteButton
                                                onClick={() =>
                                                    setDeleteTarget(client)
                                                }
                                                title="削除"
                                                size="sm"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </DeleteButton>
                                        </div>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan="5" className="text-center py-4">
                                    データがありません
                                </Td>
                            </Tr>
                        )}
                    </TBody>
                </Table>
            </Card>
        </>
    );
};

export default ApiClientTable;
