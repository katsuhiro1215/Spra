import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function ServiceItemsTable({
    serviceItems,
    onDelete,
    isDeleting,
}) {
    if (!serviceItems || serviceItems.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                    サービス項目が見つかりませんでした。
                </p>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const badges = {
            active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            inactive:
                "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        };
        const labels = {
            active: "有効",
            inactive: "無効",
        };
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}
            >
                {labels[status]}
            </span>
        );
    };

    const getItemTypeBadge = (type) => {
        const badges = {
            plan_base:
                "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
            included:
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            optional:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            addon: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        };
        const labels = {
            plan_base: "プラン基本",
            included: "含まれる",
            optional: "固有オプション",
            addon: "共通オプション",
        };
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${badges[type]}`}
            >
                {labels[type]}
            </span>
        );
    };

    return (
        <Card>
            <CardHeader>管理者一覧 ({serviceItems.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th scope="col">順序</Th>
                        <Th scope="col">項目名</Th>
                        <Th scope="col">サービス</Th>
                        <Th scope="col">プラン</Th>
                        <Th scope="col">タイプ</Th>
                        <Th scope="col">価格</Th>
                        <Th scope="col">ステータス</Th>
                        <Th scope="col" className="text-right">
                            アクション
                        </Th>
                    </Tr>
                </THead>
                <TBody>
                    {serviceItems.map((item) => (
                        <Tr key={item.id}>
                            <Td>
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {item.sort_order}
                                </div>
                            </Td>
                            <Td>
                                <div className="flex items-center">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                                            {item.name}
                                            {item.is_required && (
                                                <CheckCircleIcon className="ml-2 h-4 w-4 text-green-500" />
                                            )}
                                        </div>
                                        {item.description && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                {item.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Td>
                            <Td>
                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                    {item.service?.name || "---"}
                                </div>
                            </Td>
                            <Td>
                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                    {item.service_plan?.name || "---"}
                                </div>
                            </Td>
                            <Td>{getItemTypeBadge(item.item_type)}</Td>
                            <Td>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    ¥
                                    {Number(
                                        item.standard_price,
                                    ).toLocaleString()}
                                </div>
                                {item.estimated_days && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.estimated_days}日
                                    </div>
                                )}
                            </Td>
                            <Td>{getStatusBadge(item.status)}</Td>
                            <Td>
                                <div className="flex items-center justify-end gap-1">
                                    <IconButton
                                    variant="info-text"
                                    icon={EyeIcon}
                                    size="lg"
                                    href={route(
                                        "admin.service.item.show",
                                        item.id,
                                    )}
                                    title="詳細"
                                    />
                                    <IconButton
                                    variant="warning-text"
                                    icon={PencilIcon}
                                    size="lg"
                                    href={route(
                                        "admin.service.item.edit",
                                        item.id,
                                    )}
                                    title="編集"
                                    />
                                    <IconButton
                                    variant="danger-text"
                                    icon={TrashIcon}
                                    size="lg"
                                    onClick={() => onDelete(item)}
                                    disabled={isDeleting === item.id}
                                    title="削除"
                                    />
                                </div>
                            </Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </Card>
    );
}
