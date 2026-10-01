import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { TextInput, SelectInput } from "@/Components/Forms";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { formatMonthLabel } from "../_components/recurrence";

export default function Index({ month, tasks, monthlyCounts, categories, admins, filters }) {
    const [keyword, setKeyword] = useState(filters.keyword || "");

    const reload = (params) => {
        router.get(route("admin.completed-task.index"), { month, ...filters, ...params }, { preserveState: true, preserveScroll: true });
    };

    const headerActions = [
        {
            label: "タスク管理に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.task.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="完了済みタスク"
                    description="完了したタスクを月ごとに確認できます（完了日時の月で分類）"
                    actions={headerActions}
                />
            }
        >
            <Head title="完了済みタスク" />
            <div className="flex flex-col gap-4 lg:flex-row">
                <Card className="lg:w-56 lg:shrink-0">
                    <ul className="divide-y divide-gray-100 dark:divide-slate-700">
                        {monthlyCounts.length === 0 && (
                            <li className="p-3 text-sm text-gray-500 dark:text-slate-400">完了済みタスクはありません</li>
                        )}
                        {monthlyCounts.map((row) => (
                            <li key={row.month}>
                                <Link
                                    href={route("admin.completed-task.index", { ...filters, month: row.month })}
                                    preserveScroll
                                    className={`flex justify-between px-3 py-2 text-sm ${
                                        row.month === month
                                            ? "bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"
                                            : "text-gray-700 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-700"
                                    }`}
                                >
                                    <span>{formatMonthLabel(row.month)}</span>
                                    <span>{row.count}件</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card className="min-w-0 flex-1">
                    <form
                        className="grid gap-3 p-4 sm:grid-cols-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            reload({ keyword });
                        }}
                    >
                        <TextInput
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="タイトルで検索（Enterで検索）"
                        />
                        <SelectInput
                            value={filters.admin_id || ""}
                            onChange={(e) => reload({ admin_id: e.target.value })}
                            options={[{ value: "", label: "すべての担当者" }, ...admins.map((a) => ({ value: a.id, label: a.email }))]}
                        />
                        <SelectInput
                            value={filters.task_category_id || ""}
                            onChange={(e) => reload({ task_category_id: e.target.value })}
                            options={[{ value: "", label: "すべてのカテゴリ" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
                        />
                    </form>
                    <h3 className="px-4 text-sm font-semibold text-gray-700 dark:text-slate-200">
                        {formatMonthLabel(month)}（{tasks.total}件）
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="mt-2 min-w-full divide-y divide-gray-200 text-sm dark:divide-slate-700">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 dark:text-slate-400">
                                    <th className="px-4 py-2">完了日時</th>
                                    <th className="px-4 py-2">タイトル</th>
                                    <th className="px-4 py-2">期限</th>
                                    <th className="px-4 py-2">担当者</th>
                                    <th className="px-4 py-2">カテゴリ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {tasks.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-slate-400">
                                            該当するタスクはありません
                                        </td>
                                    </tr>
                                )}
                                {tasks.data.map((task) => (
                                    <tr key={task.id} className="text-gray-900 dark:text-slate-100">
                                        <td className="whitespace-nowrap px-4 py-2">{formatDateTime(task.completed_at || task.updated_at)}</td>
                                        <td className="px-4 py-2">
                                            <Link href={route("admin.task.show", task.id)} className="text-indigo-600 hover:underline dark:text-indigo-300">
                                                {task.title}
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2">
                                            {task.due_date}
                                            {task.due_time ? ` ${task.due_time.slice(0, 5)}` : ""}
                                        </td>
                                        <td className="px-4 py-2">{task.admin?.email || "未割当"}</td>
                                        <td className="px-4 py-2">{task.category?.name || "未分類"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination paginationData={tasks} />
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}

function formatDateTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    const pad = (n) => String(n).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
