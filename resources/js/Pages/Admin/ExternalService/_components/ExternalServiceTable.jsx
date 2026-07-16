import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { TextButton, DeleteButton } from "@/Components/Buttons";
import DeleteAlert from "@/Components/Alerts/DeleteAlert";
import {
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
    ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

const formatDateTime = (v) => (v ? new Date(v).toLocaleString("ja-JP") : "未実行");

const syncStatusBadge = (service) => {
    if (!service.api_base_url) {
        return <span className="text-xs text-slate-400 dark:text-slate-500">未設定</span>;
    }
    if (service.last_sync_status === "success") {
        return (
            <Badge variant="success" size="xs">
                取得成功: {formatDateTime(service.last_synced_at)}
            </Badge>
        );
    }
    if (service.last_sync_status === "failed") {
        return (
            <Badge variant="danger" size="xs" title={service.last_sync_error}>
                取得失敗
            </Badge>
        );
    }
    return <span className="text-xs text-slate-400 dark:text-slate-500">未取得</span>;
};

const ExternalServiceTable = ({ services }) => {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [syncingId, setSyncingId] = useState(null);

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            router.delete(
                route("admin.external-service.destroy", deleteTarget.id),
                {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => setDeleteTarget(null),
                },
            );
        }
    };

    const handleToggleActive = (service) => {
        router.patch(
            route("admin.external-service.toggle-active", service.id),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleSync = (service) => {
        setSyncingId(service.id);
        router.post(
            route("admin.external-service.sync", service.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setSyncingId(null),
            },
        );
    };

    return (
        <>
            <DeleteAlert
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.name}
            />

            <Card>
                <CardHeader>外部サービス一覧 ({services.total}件)</CardHeader>
                <Table>
                    <THead>
                        <Tr hover={false}>
                            <Th>サービス</Th>
                            <Th>分類</Th>
                            <Th>API連携</Th>
                            <Th>ステータス</Th>
                            <Th className="text-right">操作</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {services.data && services.data.length > 0 ? (
                            services.data.map((service) => (
                                <Tr key={service.id}>
                                    <Td>
                                        <a
                                            href={service.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                            {service.icon && (
                                                <span>{service.icon}</span>
                                            )}
                                            {service.name}
                                            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                                        </a>
                                        {service.description && (
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xs truncate">
                                                {service.description}
                                            </div>
                                        )}
                                    </Td>
                                    <Td>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                            {service.category || "-"}
                                        </span>
                                    </Td>
                                    <Td>{syncStatusBadge(service)}</Td>
                                    <Td>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(service)}
                                        >
                                            <Badge
                                                variant={
                                                    service.is_active
                                                        ? "success"
                                                        : "secondary"
                                                }
                                                size="xs"
                                            >
                                                {service.is_active ? (
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
                                        <div className="flex justify-end items-center gap-1">
                                            {service.api_base_url && (
                                                <TextButton
                                                    onClick={() => handleSync(service)}
                                                    variant="info"
                                                    title="データを取得"
                                                    size="sm"
                                                    disabled={syncingId === service.id}
                                                >
                                                    <ArrowPathIcon
                                                        className={`h-5 w-5 ${
                                                            syncingId === service.id
                                                                ? "animate-spin"
                                                                : ""
                                                        }`}
                                                    />
                                                </TextButton>
                                            )}
                                            <TextButton
                                                href={route(
                                                    "admin.external-service.edit",
                                                    service.id,
                                                )}
                                                variant="info"
                                                title="編集"
                                                size="sm"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </TextButton>
                                            <DeleteButton
                                                onClick={() => setDeleteTarget(service)}
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

export default ExternalServiceTable;
