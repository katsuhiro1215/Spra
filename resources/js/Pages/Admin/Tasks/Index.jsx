import React from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import TaskBoard from "./_components/TaskBoard";
import TaskFilterBar from "./_components/TaskFilterBar";

export default function Index({ tasks, categories, admins, filters }) {
    const handleFilterChange = (key, value) => {
        router.get(route("admin.task.index"), { ...filters, [key]: value }, { preserveState: true, preserveScroll: true });
    };

    const handleStatusChange = (taskId, status) => {
        router.patch(route("admin.task.status", taskId), { status }, { preserveScroll: true });
    };

    // 「新規作成」ボタンはTask 13でモーダル開閉のstateと一緒に追加する
    const headerActions = [
        {
            label: "カテゴリ管理",
            icon: Squares2X2Icon,
            variant: "secondary",
            route: route("admin.task-category.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={<PageHeader title="タスク管理" description="SNS投稿を含むタスクをカンバンで管理します" actions={headerActions} />}
        >
            <Head title="タスク管理" />
            <FlashMessage />
            <TaskFilterBar filters={filters} categories={categories} admins={admins} onChange={handleFilterChange} />
            <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} />
        </AdminAuthenticatedLayout>
    );
}
