import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

export default function Index({ pendingUsers }) {
    const { props } = usePage();
    const [selectedUsers, setSelectedUsers] = useState(new Set());

    const toggleSelect = (userId) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedUsers.size === pendingUsers.data.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(pendingUsers.data.map((u) => u.id)));
        }
    };

    return (
        <>
            <Head title="オンボーディング管理" />
            <AdminLayout>
                <div className="space-y-6">
                    {/* ヘッダー */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                オンボーディング管理
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                承認待ちのユーザー登録
                            </p>
                        </div>
                    </div>

                    {/* 統計情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                承認待ち
                            </div>
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                                {pendingUsers.total}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                このページ
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {pendingUsers.data.length}
                            </div>
                        </div>
                    </div>

                    {/* テーブル */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                        {pendingUsers.data.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                            <tr>
                                                <th className="px-6 py-3 text-left">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedUsers.size ===
                                                                pendingUsers
                                                                    .data
                                                                    .length &&
                                                            pendingUsers.data
                                                                .length > 0
                                                        }
                                                        onChange={
                                                            toggleSelectAll
                                                        }
                                                        className="rounded"
                                                    />
                                                </th>
                                                <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                    メールアドレス
                                                </th>
                                                <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                    会社名
                                                </th>
                                                <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                    登録日時
                                                </th>
                                                <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                    アクション
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                            {pendingUsers.data.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                                >
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUsers.has(
                                                                user.id,
                                                            )}
                                                            onChange={() =>
                                                                toggleSelect(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="rounded"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            {user.email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-gray-700 dark:text-gray-300">
                                                            {user.company
                                                                ?.name ||
                                                                "未設定"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-gray-600 dark:text-gray-400">
                                                            {formatDistanceToNow(
                                                                new Date(
                                                                    user.created_at,
                                                                ),
                                                                {
                                                                    addSuffix: true,
                                                                    locale: ja,
                                                                },
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            href={route(
                                                                "admin.onboarding.detail",
                                                                user.id,
                                                            )}
                                                            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                                                        >
                                                            確認
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* ページネーション */}
                                {/* <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                                    <PaginationLinks
                                        links={pendingUsers.links}
                                    />
                                </div> */}
                            </>
                        ) : (
                            <div className="px-6 py-12 text-center">
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    承認待ちのユーザーはいません
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
