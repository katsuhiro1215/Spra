import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { getStatusBadge } from "@/Constants/Badges";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const UsersTable = ({ users, onDelete }) => {
    const getFullName = (user) => {
        return user.profile
            ? `${user.profile.last_name} ${user.profile.first_name}`
            : "-";
    };

    const getCompanyInfo = (user) => {
        if (!user.company) return null;

        const company = Array.isArray(user.company)
            ? user.company[0]
            : user.company;
        return company || null;
    };

    return (
        <Card>
            <CardHeader>ユーザー一覧 ({users.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>ユーザー情報</Th>
                        <Th>所属企業</Th>
                        <Th>ステータス</Th>
                        <Th>登録日</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {users.data.map((user) => (
                        <Tr key={user.id}>
                            <Td>
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                            <span className="text-indigo-600 dark:text-indigo-300 font-medium text-sm">
                                                {getFullName(user)
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {getFullName(user)}
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                            </Td>
                            <Td>
                                {(() => {
                                    const company = getCompanyInfo(user);
                                    return company ? (
                                        <div>
                                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {company.name}
                                            </div>
                                            {company.legal_name &&
                                                company.legal_name !==
                                                    company.name && (
                                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                                        {company.legal_name}
                                                    </div>
                                                )}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            -
                                        </div>
                                    );
                                })()}
                            </Td>
                            <Td>
                                <Badge
                                    variant={
                                        getStatusBadge(user.status).variant
                                    }
                                    size="xs"
                                >
                                    {getStatusBadge(user.status).text}
                                </Badge>
                            </Td>
                            <Td className="text-slate-500 dark:text-slate-400">
                                {new Date(user.created_at).toLocaleDateString(
                                    "ja-JP",
                                )}
                            </Td>
                            <Td className="text-right">
                                <div className="flex justify-end space-x-2">
                                    <Link
                                        href={route("admin.user.show", user.id)}
                                        className="p-1 text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded transition-colors"
                                        title="詳細"
                                    >
                                        <EyeIcon className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href={route("admin.user.edit", user.id)}
                                        className="p-1 text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
                                        title="編集"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </Link>
                                    <button
                                        onClick={() => onDelete(user)}
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
    );
};

export default UsersTable;
