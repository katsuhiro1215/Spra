import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { IconButton } from "@/Components/Buttons";
import { ArrowLeftIcon, PencilIcon, StopCircleIcon } from "@heroicons/react/24/outline";
import RecurringTaskFormModal from "../_components/RecurringTaskFormModal";
import { describeRecurrence } from "../_components/recurrence";

export default function Index({ templates, categories, admins }) {
    const [editing, setEditing] = useState(null);

    const handleStop = (template) => {
        if (
            confirm(
                `「${template.title}」の繰り返しを停止しますか？\n今日以降の未着手のタスクも削除されます（着手済み・完了済みのタスクは残ります）。`,
            )
        ) {
            router.delete(route("admin.recurring-task.destroy", template.id), { preserveScroll: true });
        }
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
                    title="繰り返し設定"
                    description="毎日・毎週自動で作られるタスクの時刻や曜日を変更・停止します。新しい繰り返しはタスク管理の「新規作成」から追加します"
                    actions={headerActions}
                />
            }
        >
            <Head title="繰り返し設定" />
            <FlashMessage />
            <Card>
                {templates.length === 0 ? (
                    <p className="p-6 text-sm text-gray-500 dark:text-slate-400">繰り返し設定はまだありません。</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-slate-700">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 dark:text-slate-400">
                                    <th className="px-4 py-3">タイトル</th>
                                    <th className="px-4 py-3">頻度</th>
                                    <th className="px-4 py-3">時刻</th>
                                    <th className="px-4 py-3">担当者</th>
                                    <th className="px-4 py-3">カテゴリ</th>
                                    <th className="px-4 py-3">次回</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {templates.map((template) => (
                                    <tr key={template.id} className="text-gray-900 dark:text-slate-100">
                                        <td className="px-4 py-3 font-medium">{template.title}</td>
                                        <td className="px-4 py-3">{describeRecurrence(template.recurrence_rule)}</td>
                                        <td className="px-4 py-3">{template.due_time ? template.due_time.slice(0, 5) : "-"}</td>
                                        <td className="px-4 py-3">{template.admin?.email || "未割当"}</td>
                                        <td className="px-4 py-3">
                                            {template.category ? (
                                                <span
                                                    className="inline-block rounded-full px-2 py-0.5 text-xs text-white"
                                                    style={{ backgroundColor: template.category.color || "#9CA3AF" }}
                                                >
                                                    {template.category.name}
                                                </span>
                                            ) : (
                                                "未分類"
                                            )}
                                        </td>
                                        <td className="px-4 py-3">{template.next_occurrence_date || "-"}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <IconButton icon={PencilIcon} onClick={() => setEditing(template)} title="編集" />
                                                <IconButton
                                                    icon={StopCircleIcon}
                                                    variant="danger-text"
                                                    onClick={() => handleStop(template)}
                                                    title="停止"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
            {editing && (
                <RecurringTaskFormModal
                    key={editing.id}
                    show
                    onClose={() => setEditing(null)}
                    template={editing}
                    categories={categories}
                    admins={admins}
                />
            )}
        </AdminAuthenticatedLayout>
    );
}
