import React from "react";
import { Card } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { IconButton } from "@/Components/Buttons";
import { Badge } from "@/Components/Badges";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { getStatusBadge } from "@/Constants/Badges";

const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const ServicesTable = ({ services, onDelete, isDeleting }) => {
    return (
        <Card>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>順序</Th>
                        <Th>サービス名</Th>
                        <Th>カテゴリ</Th>
                        <Th>ステータス</Th>
                        <Th>作成日</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {services.data && services.data.length > 0 ? (
                        services.data.map((service) => (
                            <Tr key={service.id}>
                                <Td>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {service.sort_order}
                                    </div>
                                </Td>
                                <Td>
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {service.name}
                                        </div>
                                        {service.is_featured && (
                                            <StarIconSolid className="h-4 w-4 text-yellow-400" />
                                        )}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        {service.slug}
                                    </div>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {service.service_category?.name ||
                                            "未分類"}
                                    </span>
                                </Td>
                                <Td>
                                    <div className="flex items-center gap-1">
                                        <Badge
                                            variant={
                                                getStatusBadge(service.status)
                                                    .variant
                                            }
                                            size="xs"
                                        >
                                            {
                                                getStatusBadge(service.status)
                                                    .text
                                            }
                                        </Badge>
                                        {!service.is_displayed && (
                                            <Badge
                                                variant="secondary"
                                                size="xs"
                                            >
                                                非公開
                                            </Badge>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {formatDate(service.created_at)}
                                    </span>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <IconButton
                                            variant="info-text"
                                            icon={EyeIcon}
                                            size="lg"
                                            href={route(
                                                "admin.service.show",
                                                service.id,
                                            )}
                                            title="詳細"
                                        />
                                        <IconButton
                                            variant="warning-text"
                                            icon={PencilIcon}
                                            size="lg"
                                            href={route(
                                                "admin.service.edit",
                                                service.id,
                                            )}
                                            title="編集"
                                        />
                                        <IconButton
                                            variant="danger-text"
                                            icon={TrashIcon}
                                            size="lg"
                                            onClick={() => onDelete(service)}
                                            disabled={isDeleting === service.id}
                                            title="削除"
                                        />
                                    </div>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td
                                colSpan={6}
                                className="text-center text-slate-500 dark:text-slate-400 py-8"
                            >
                                サービスが見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default ServicesTable;
