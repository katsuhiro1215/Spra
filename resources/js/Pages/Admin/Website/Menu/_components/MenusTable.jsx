import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    ListBulletIcon,
} from "@heroicons/react/24/outline";

const MenusTable = ({ menus, onDelete }) => {
    const getLocationLabel = (location) => {
        const labels = {
            header: "ヘッダー",
            footer: "フッター",
            sidebar: "サイドバー",
        };
        return labels[location] || location;
    };

    const getLocationVariant = (location) => {
        const variants = {
            header: "info",
            footer: "success",
            sidebar: "warning",
        };
        return variants[location] || "secondary";
    };

    return (
        <Card>
            <CardHeader>メニュー一覧 ({menus.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>メニュー名</Th>
                        <Th>スラッグ</Th>
                        <Th>配置場所</Th>
                        <Th>アイテム数</Th>
                        <Th>作成日</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {menus.data && menus.data.length > 0 ? (
                        menus.data.map((menu) => (
                            <Tr key={menu.id}>
                                <Td>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {menu.name}
                                        </div>
                                        {menu.description && (
                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                {menu.description}
                                            </div>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        {menu.slug}
                                    </code>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={getLocationVariant(
                                            menu.location,
                                        )}
                                        size="xs"
                                    >
                                        {getLocationLabel(menu.location)}
                                    </Badge>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {menu.menu_items?.length || 0}件
                                    </span>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {new Date(
                                            menu.created_at,
                                        ).toLocaleDateString("ja-JP")}
                                    </span>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.website.menu.item.index",
                                                menu.id,
                                            )}
                                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 p-1"
                                            title="アイテム管理"
                                        >
                                            <ListBulletIcon className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.website.menu.show",
                                                menu.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                                            title="詳細"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.website.menu.edit",
                                                menu.id,
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                                            title="編集"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(menu)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
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
                                メニューが見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default MenusTable;
