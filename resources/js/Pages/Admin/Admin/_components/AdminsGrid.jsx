import React from "react";
// Components
import { Card } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import Avatar from "@/Components/Avatar";
// Icons
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
// Constants
import { getRoleBadge, getStatusBadge } from "@/Constants/Badges";
import { getFullName, formatDate } from "./adminDisplay";

const AdminsGrid = ({ admins, onDelete }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {admins.data.map((admin) => (
                <Card key={admin.id} className="h-full">
                    <div className="flex flex-col gap-3 h-full">
                        <div className="flex items-center gap-3 min-w-0">
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
                            <div className="min-w-0">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                    {getFullName(admin)}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                    {admin.email}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge
                                variant={getRoleBadge(admin.role).variant}
                                size="xs"
                            >
                                {getRoleBadge(admin.role).text}
                            </Badge>
                            <Badge
                                variant={getStatusBadge(admin.status).variant}
                                size="xs"
                            >
                                {getStatusBadge(admin.status).text}
                            </Badge>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                            <div>登録日: {formatDate(admin.created_at)}</div>
                            <div>
                                最終ログイン:{" "}
                                {formatDate(admin.last_login_at)}
                            </div>
                        </div>

                        <div className="flex justify-end items-center gap-1 mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                            <IconButton
                                variant="info-text"
                                icon={EyeIcon}
                                size="lg"
                                href={route("admin.admin.show", admin.id)}
                                title="詳細"
                            />
                            <IconButton
                                variant="warning-text"
                                icon={PencilIcon}
                                size="lg"
                                href={route("admin.admin.edit", admin.id)}
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
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default AdminsGrid;
