import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { PlusIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import TaskBoard from "./_components/TaskBoard";
import TaskFilterBar from "./_components/TaskFilterBar";
import TaskFormModal from "./_components/TaskFormModal";

export default function Index({ tasks, categories, admins, filters }) {
    const [editingTask, setEditingTask] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleFilterChange = (key, value) => {
        router.get(route("admin.task.index"), { ...filters, [key]: value }, { preserveState: true, preserveScroll: true });
    };

    const handleStatusChange = (taskId, status) => {
        router.patch(route("admin.task.status", taskId), { status }, { preserveScroll: true });
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setShowModal(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    const headerActions = [
        {
            label: "カテゴリ管理",
            icon: Squares2X2Icon,
            variant: "secondary",
            route: route("admin.task-category.index"),
        },
        {
            label: "新規作成",
            icon: PlusIcon,
            variant: "primary",
            onClick: openCreateModal,
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={<PageHeader title="タスク管理" description="SNS投稿を含むタスクをカンバンで管理します" actions={headerActions} />}
        >
            <Head title="タスク管理" />
            <FlashMessage />
            <TaskFilterBar filters={filters} categories={categories} admins={admins} onChange={handleFilterChange} />
            <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} onCardClick={openEditModal} />
            <TaskFormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                task={editingTask}
                categories={categories}
                admins={admins}
            />
        </AdminAuthenticatedLayout>
    );
}
