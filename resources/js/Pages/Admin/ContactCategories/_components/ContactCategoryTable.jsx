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

const ContactCategoryTable = ({ categories, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleCancelDelete = () => {
        setDeleteTarget(null);
        setIsDeleting(null);
    };

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            router.delete(
                route("admin.contact.category.destroy", deleteTarget.id),
                {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => handleCancelDelete(),
                },
            );
        }
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
                <CardHeader>カテゴリ一覧 ({categories.total}件)</CardHeader>
                <Table>
                    <THead>
                        <Tr hover={false}>
                            <Th>順序</Th>
                            <Th>カテゴリ名</Th>
                            <Th>説明</Th>
                            <Th>ステータス</Th>
                            <Th className="text-right">操作</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {categories.data && categories.data.length > 0 ? (
                            categories.data.map((category) => (
                                <Tr key={category.id}>
                                    <Td>
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {category.sort_order}
                                        </div>
                                    </Td>
                                    <Td>
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {category.name}
                                        </div>
                                    </Td>
                                    <Td>
                                        <div className="max-w-xs truncate text-sm text-slate-600 dark:text-slate-400">
                                            {category.description || "-"}
                                        </div>
                                    </Td>
                                    <Td>
                                        <Badge
                                            variant={
                                                category.is_active
                                                    ? "success"
                                                    : "secondary"
                                            }
                                            size="xs"
                                        >
                                            {category.is_active ? (
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
                                                    "admin.contact.category.edit",
                                                    category.id,
                                                )}
                                                variant="info"
                                                title="編集"
                                                size="sm"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </TextButton>
                                            <TextButton
                                                onClick={() =>
                                                    onDelete(category)
                                                }
                                                disabled={
                                                    isDeleting === category.id
                                                }
                                                variant="danger"
                                                title="削除"
                                                size="sm"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </TextButton>
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

export default ContactCategoryTable;
