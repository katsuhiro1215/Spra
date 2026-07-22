import React from "react";
import { Card } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import Avatar from "@/Components/Avatar";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getRoleBadge, getStatusBadge } from "@/Constants/Badges";
import { getFullName, formatDate } from "./adminDisplay";

const AdminsTable = ({ admins, onDelete }) => {
    return (
        <Card>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>No</Th>
                        <Th>ユーザー情報</Th>
                        <Th>役割</Th>
                        <Th>ステータス</Th>
                        <Th>登録日</Th>
                        <Th>最終ログイン日</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {admins.data.map((admin, index) => (
                        <Tr key={admin.id}>
                            <Td>{index + 1}</Td>
                            <Td>
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <Avatar
                                            name={getFullName(admin)
                                                .charAt(0)
                                                .toUpperCase()}
                                            size="md"
                                            rounded="full"
                                            variant="primary"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {getFullName(admin)}
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            {admin.email}
                                        </div>
                                    </div>
                                </div>
                            </Td>
                            <Td>
                                <Badge
                                    variant={getRoleBadge(admin.role).variant}
                                    size="xs"
                                >
                                    {getRoleBadge(admin.role).text}
                                </Badge>
                            </Td>
                            <Td>
                                <Badge
                                    variant={
                                        getStatusBadge(admin.status).variant
                                    }
                                    size="xs"
                                >
                                    {getStatusBadge(admin.status).text}
                                </Badge>
                            </Td>
                            <Td>{formatDate(admin.created_at)}</Td>
                            <Td>{formatDate(admin.last_login_at)}</Td>
                            <Td>
                                <div className="flex justify-end items-center gap-1">
                                    <IconButton
                                        variant="info-text"
                                        icon={EyeIcon}
                                        size="lg"
                                        href={route(
                                            "admin.admin.show",
                                            admin.id,
                                        )}
                                        title="詳細"
                                    />
                                    <IconButton
                                        variant="warning-text"
                                        icon={PencilIcon}
                                        size="lg"
                                        href={route(
                                            "admin.admin.edit",
                                            admin.id,
                                        )}
                                        title="編集"
                                    />
                                    <IconButton
                                        variant="danger-text"
                                        icon={TrashIcon}
                                        size="lg"
                                        onClick={() => onDelete(admin)}
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
};

export default AdminsTable;
