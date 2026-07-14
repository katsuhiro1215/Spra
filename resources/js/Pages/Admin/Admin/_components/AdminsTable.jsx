import React, { useState } from "react";
import { Link } from "@inertiajs/react";
// Components
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { PrimaryButton } from "@/Components/Buttons";
import Avatar from "@/Components/Avatar";
// Icons
import {
    EyeIcon,
    ListBulletIcon,
    PencilIcon,
    TrashIcon,
    Squares2X2Icon,
} from "@heroicons/react/24/outline";
// Constants
import { getRoleBadge, getStatusBadge } from "@/Constants/Badges";

const AdminsTable = ({ admins, onDelete }) => {
    const [view, setView] = useState("list");

    const handleViewChange = (viewType) => {
        setView(viewType);
    };

    const getFullName = (admin) => {
        return admin.profile
            ? `${admin.profile.last_name} ${admin.profile.first_name}`
            : "-";
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-6">
                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                    管理者一覧 ({admins.total}件)
                </h2>
                <div className="flex gap-4">
                    <PrimaryButton useTheme onClick={() => handleViewChange("list")}>
                        <ListBulletIcon className="h-5 w-5" />
                    </PrimaryButton>
                    <PrimaryButton useTheme onClick={() => handleViewChange("grid")}>
                        <Squares2X2Icon className="h-5 w-5" />
                    </PrimaryButton>
                </div>
            </div>
            {view === "list" ? (
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
                                            variant={
                                                getRoleBadge(admin.role).variant
                                            }
                                            size="xs"
                                        >
                                            {getRoleBadge(admin.role).text}
                                        </Badge>
                                    </Td>
                                    <Td>
                                        <Badge
                                            variant={
                                                getStatusBadge(admin.status)
                                                    .variant
                                            }
                                            size="xs"
                                        >
                                            {getStatusBadge(admin.status).text}
                                        </Badge>
                                    </Td>
                                    <Td>
                                        {new Date(
                                            admin.created_at,
                                        ).toLocaleDateString("ja-JP")}
                                    </Td>
                                    <Td>
                                        {new Date(
                                            admin.last_login_at,
                                        ).toLocaleDateString("ja-JP")}
                                    </Td>
                                    <Td>
                                        <div className="flex justify-end items-center gap-2">
                                            <Link
                                                href={route(
                                                    "admin.admin.show",
                                                    admin.id,
                                                )}
                                                className="p-1 text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded transition-colors"
                                                title="詳細"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                            </Link>
                                            <Link
                                                href={route(
                                                    "admin.admin.edit",
                                                    admin.id,
                                                )}
                                                className="p-1 text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
                                                title="編集"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => onDelete(admin)}
                                                className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                title="削除"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {admins.data.map((admin) => (
                        <Card key={admin.id}>
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                            <span className="text-indigo-600 dark:text-indigo-300 font-medium text-sm">
                                                {getFullName(admin)
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </div>
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
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminsTable;
