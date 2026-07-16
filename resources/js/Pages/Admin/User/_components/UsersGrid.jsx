import React from "react";
// Components
import { Card } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import Avatar from "@/Components/Avatar";
// Icons
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
// Constants
import { getStatusBadge } from "@/Constants/Badges";

const getFullName = (user) =>
    user.profile
        ? `${user.profile.last_name} ${user.profile.first_name}`
        : "-";

const getCompanyInfo = (user) => {
    if (!user.company) return null;
    return Array.isArray(user.company) ? user.company[0] : user.company;
};

const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("ja-JP") : "-";

const UsersGrid = ({ users, onDelete }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users.data.map((user) => {
                const company = getCompanyInfo(user);

                return (
                    <Card key={user.id} className="h-full">
                        <div className="flex flex-col gap-3 h-full">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex-shrink-0 h-10 w-10">
                                    <Avatar
                                        name={getFullName(user)
                                            .charAt(0)
                                            .toUpperCase()}
                                        size="md"
                                        rounded="full"
                                        variant="primary"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                        {getFullName(user)}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                        {user.email}
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-slate-700 dark:text-slate-300 truncate">
                                {company ? (
                                    company.name
                                ) : (
                                    <span className="text-slate-400 dark:text-slate-500">
                                        所属企業なし
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Badge
                                    variant={
                                        getStatusBadge(user.status).variant
                                    }
                                    size="xs"
                                >
                                    {getStatusBadge(user.status).text}
                                </Badge>
                            </div>

                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                登録日: {formatDate(user.created_at)}
                            </div>

                            <div className="flex justify-end items-center gap-1 mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                                <IconButton
                                    variant="info-text"
                                    icon={EyeIcon}
                                    size="lg"
                                    href={route("admin.user.show", user.id)}
                                    title="詳細"
                                />
                                <IconButton
                                    variant="warning-text"
                                    icon={PencilIcon}
                                    size="lg"
                                    href={route("admin.user.edit", user.id)}
                                    title="編集"
                                />
                                <IconButton
                                    variant="danger-text"
                                    icon={TrashIcon}
                                    size="lg"
                                    onClick={() => onDelete(user)}
                                    title="削除"
                                />
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default UsersGrid;
