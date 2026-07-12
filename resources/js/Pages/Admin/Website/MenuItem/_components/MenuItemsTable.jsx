import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const MenuItemsTable = ({ menu, menuItems, onDelete }) => {
    return (
        <Card>
            <CardHeader>メニューアイテム一覧 ({menuItems.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>ラベル</Th>
                        <Th>URL / ページ</Th>
                        <Th>親アイテム</Th>
                        <Th>ステータス</Th>
                        <Th>表示順</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {menuItems.data && menuItems.data.length > 0 ? (
                        menuItems.data.map((item) => (
                            <Tr key={item.id}>
                                <Td>
                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {item.label}
                                    </span>
                                </Td>
                                <Td>
                                    {item.page ? (
                                        <Link
                                            href={route(
                                                "admin.website.page.show",
                                                item.page.id,
                                            )}
                                            className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            {item.page.title}
                                        </Link>
                                    ) : item.url ? (
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            {item.url}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-slate-400 dark:text-slate-500">
                                            -
                                        </span>
                                    )}
                                </Td>
                                <Td>
                                    {item.parent ? (
                                        <Link
                                            href={route(
                                                "admin.website.menu.item.show",
                                                [menu.id, item.parent.id],
                                            )}
                                            className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            {item.parent.label}
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            -
                                        </span>
                                    )}
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            item.is_active
                                                ? "success"
                                                : "secondary"
                                        }
                                        size="xs"
                                    >
                                        {item.is_active ? "有効" : "無効"}
                                    </Badge>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {item.sort_order ?? "-"}
                                    </span>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.website.menu.item.show",
                                                [menu.id, item.id],
                                            )}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                                            title="詳細"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.website.menu.item.edit",
                                                [menu.id, item.id],
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                                            title="編集"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(item)}
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
                                メニューアイテムが見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default MenuItemsTable;
