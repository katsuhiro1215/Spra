import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { TextButton, DeleteButton } from "@/Components/Buttons";
import DeleteAlert from "@/Components/Alerts/DeleteAlert";
// Icons
import {
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

const ResponseTemplateTable = ({ templates }) => {
    const [isDeleting, setIsDeleting] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleDeleteClick = (template) => {
        setDeleteTarget(template);
        setIsDeleting(template.id);
    };

    const handleCancelDelete = () => {
        setDeleteTarget(null);
        setIsDeleting(null);
    };

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            router.delete(
                route("admin.response.template.destroy", deleteTarget.id),
                {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => handleCancelDelete(),
                },
            );
        }
    };

    const getCategoryLabel = (category) => {
        const labels = {
            general: "一般",
            estimate: "見積もり",
            technical: "技術",
            sales: "営業",
            support: "サポート",
            other: "その他",
        };
        return labels[category] || category;
    };

    return (
        <>
            {/* 削除確認アラート */}
            <DeleteAlert
                show={!!deleteTarget}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.name}
            />

            <Card>
                <CardHeader>テンプレート一覧 ({templates.total}件)</CardHeader>
                <Table>
                    <THead>
                        <Tr hover={false}>
                            <Th>順序</Th>
                            <Th>テンプレート名</Th>
                            <Th>カテゴリ</Th>
                            <Th>件名</Th>
                            <Th>ステータス</Th>
                            <Th className="text-right">操作</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {templates.data && templates.data.length > 0 ? (
                            templates.data.map((template) => (
                                <Tr key={template.id}>
                                    <Td>
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {template.sort_order}
                                        </div>
                                    </Td>
                                    <Td>
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {template.name}
                                        </div>
                                    </Td>
                                    <Td>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            {getCategoryLabel(
                                                template.category,
                                            )}
                                        </div>
                                    </Td>
                                    <Td>
                                        <div className="max-w-xs truncate text-sm text-slate-600 dark:text-slate-400">
                                            {template.subject || "-"}
                                        </div>
                                    </Td>
                                    <Td>
                                        <Badge
                                            variant={
                                                template.status === "active"
                                                    ? "success"
                                                    : "secondary"
                                            }
                                            size="xs"
                                        >
                                            {template.status === "active" ? (
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
                                    </Td>
                                    <Td>
                                        <div className="flex justify-end items-center gap-1">
                                            <TextButton
                                                href={route(
                                                    "admin.response.template.edit",
                                                    template.id,
                                                )}
                                                variant="info"
                                                title="編集"
                                                size="sm"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </TextButton>
                                            <DeleteButton
                                                onClick={() =>
                                                    handleDeleteClick(template)
                                                }
                                                disabled={
                                                    isDeleting === template.id
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
                                <Td colSpan="6" className="text-center py-4">
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

export default ResponseTemplateTable;
