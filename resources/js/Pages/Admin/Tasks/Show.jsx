import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const STATUS_LABEL = { todo: "未着手", in_progress: "進行中", done: "完了" };
const PRIORITY_LABEL = { high: "高", medium: "中", low: "低" };

export default function Show({ task }) {
    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.task.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout header={<PageHeader title={task.title} actions={headerActions} />}>
            <Head title={task.title} />
            <dl className="grid grid-cols-2 gap-4 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                <div>
                    <dt className="text-xs text-gray-500 dark:text-slate-400">ステータス</dt>
                    <dd className="text-gray-900 dark:text-slate-100">{STATUS_LABEL[task.status]}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500 dark:text-slate-400">優先度</dt>
                    <dd className="text-gray-900 dark:text-slate-100">{PRIORITY_LABEL[task.priority]}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500 dark:text-slate-400">期限</dt>
                    <dd className="text-gray-900 dark:text-slate-100">{task.due_date}{task.due_time ? ` ${task.due_time.slice(0, 5)}` : ""}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500 dark:text-slate-400">担当者</dt>
                    <dd className="text-gray-900 dark:text-slate-100">{task.admin?.email || "未割当"}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500 dark:text-slate-400">カテゴリ</dt>
                    <dd className="text-gray-900 dark:text-slate-100">{task.category?.name || "未分類"}</dd>
                </div>
                <div className="col-span-2">
                    <dt className="text-xs text-gray-500 dark:text-slate-400">説明</dt>
                    <dd className="whitespace-pre-wrap text-gray-900 dark:text-slate-100">{task.description || "-"}</dd>
                </div>
            </dl>
        </AdminAuthenticatedLayout>
    );
}
