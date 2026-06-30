import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import Avatar from "@/Components/Avatar";
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";
import { getStatusBadge } from "@/Constants/Badges";

export default function CompanyEmployees({ users = [] }) {
    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                            従業員一覧
                        </h2>
                        <Badge
                            text={`${users.length}名`}
                            variant="neutral"
                            size="sm"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardBody>
                {users && users.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                    >
                                        ユーザー
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                    >
                                        連絡先
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                    >
                                        ステータス
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                    >
                                        登録日
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                    >
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    src={
                                                        user.profile?.media?.url
                                                    }
                                                    alt={
                                                        user.profile
                                                            ?.full_name ||
                                                        user.email
                                                    }
                                                    size="sm"
                                                />
                                                <div>
                                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                        {user.profile
                                                            ?.full_name ||
                                                            "未設定"}
                                                    </div>
                                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                {user.profile?.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                        <PhoneIcon className="h-4 w-4" />
                                                        {user.profile.phone}
                                                    </div>
                                                )}
                                                {user.email && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                        <EnvelopeIcon className="h-4 w-4" />
                                                        {user.email}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge
                                                {...getStatusBadge(user.status)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                            {formatDate(user.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={route(
                                                    "admin.user.show",
                                                    user.id,
                                                )}
                                                className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                                詳細
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <UserIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
                        <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                            従業員がいません
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            この企業に所属する従業員はまだ登録されていません。
                        </p>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
