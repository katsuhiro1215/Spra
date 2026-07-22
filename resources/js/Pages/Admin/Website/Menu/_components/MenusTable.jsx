import React from "react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    ListBulletIcon,
} from "@heroicons/react/24/outline";

const PURPLE_TEXT = `
    bg-transparent text-purple-600
    hover:text-purple-900 hover:bg-purple-50
    focus:ring-purple-500
    dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20
`
    .trim()
    .replace(/\s+/g, " ");

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
                                    <div className="flex justify-end items-center gap-1">
                                        <IconButton
                                            colorClasses={PURPLE_TEXT}
                                            icon={ListBulletIcon}
                                            size="lg"
                                            href={route(
                                                "admin.website.menu.item.index",
                                                menu.id,
                                            )}
                                            title="アイテム管理"
                                        />
                                        <IconButton
                                            variant="info-text"
                                            icon={EyeIcon}
                                            size="lg"
                                            href={route(
                                                "admin.website.menu.show",
                                                menu.id,
                                            )}
                                            title="詳細"
                                        />
                                        <IconButton
                                            variant="warning-text"
                                            icon={PencilIcon}
                                            size="lg"
                                            href={route(
                                                "admin.website.menu.edit",
                                                menu.id,
                                            )}
                                            title="編集"
                                        />
                                        <IconButton
                                            variant="danger-text"
                                            icon={TrashIcon}
                                            size="lg"
                                            onClick={() => onDelete(menu)}
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
