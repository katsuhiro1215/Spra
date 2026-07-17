import React from "react";
import { Link } from "@inertiajs/react";
import { Card } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
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
                        <Th>サービス名</Th>
                        <Th>カテゴリ</Th>
                        <Th>ステータス</Th>
                        <Th>表示順</Th>
                        <Th>作成日</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {services.data && services.data.length > 0 ? (
                        services.data.map((service) => (
                            <Tr key={service.id}>
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
                                            <Badge variant="secondary" size="xs">
                                                非公開
                                            </Badge>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {service.sort_order}
                                    </span>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {formatDate(service.created_at)}
                                    </span>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.service.show",
                                                service.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                                            title="詳細"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.service.edit",
                                                service.id,
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                                            title="編集"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(service)}
                                            disabled={
                                                isDeleting === service.id
                                            }
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="削除"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
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
