import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Button } from "@/Components/Buttons";
import { ArrowPathIcon, CheckCircleIcon, PlusIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import TaskBoard from "./_components/TaskBoard";
import TaskFilterBar from "./_components/TaskFilterBar";
import TaskFormModal from "./_components/TaskFormModal";

export default function Index({ tasks, completedMonths, categories, admins, filters }) {
    const [editingTask, setEditingTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkProcessing, setBulkProcessing] = useState(false);

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

    const exitSelectMode = () => {
        setSelectMode(false);
        setSelectedIds([]);
    };

    const selection = {
        active: selectMode,
        selectedIds,
        toggle: (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
        setMany: (ids, checked) =>
            setSelectedIds((prev) => (checked ? [...new Set([...prev, ...ids])] : prev.filter((x) => !ids.includes(x)))),
    };

    const handleBulkComplete = () => {
        if (!confirm(`選択した${selectedIds.length}件のタスクを完了にしますか？`)) return;

        router.patch(
            route("admin.task.bulk-status"),
            { task_ids: selectedIds, status: "done" },
            {
                preserveScroll: true,
                onStart: () => setBulkProcessing(true),
                onFinish: () => setBulkProcessing(false),
                onSuccess: exitSelectMode,
            },
        );
    };

    const headerActions = [
        {
            label: "カテゴリ管理",
            icon: Squares2X2Icon,
            variant: "secondary",
            route: route("admin.task-category.index"),
        },
        {
            label: "繰り返し設定",
            icon: ArrowPathIcon,
            variant: "secondary",
            route: route("admin.recurring-task.index"),
        },
        {
            label: selectMode ? "選択を終了" : "まとめて完了",
            icon: CheckCircleIcon,
            variant: "secondary",
            onClick: selectMode ? exitSelectMode : () => setSelectMode(true),
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
            {selectMode && (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-100">
                    <span>
                        カードをクリックして選択してください（列ごとの「すべて選択」も使えます）。選択中: {selectedIds.length}件
                    </span>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={exitSelectMode}>キャンセル</Button>
                        <Button onClick={handleBulkComplete} disabled={selectedIds.length === 0 || bulkProcessing}>
                            選択したタスクを完了にする
                        </Button>
                    </div>
                </div>
            )}
            <TaskBoard
                tasks={tasks}
                completedMonths={completedMonths}
                onStatusChange={handleStatusChange}
                onCardClick={openEditModal}
                selection={selection}
            />
            <TaskFormModal
                key={editingTask?.id ?? "new"}
                show={showModal}
                onClose={() => setShowModal(false)}
                task={editingTask}
                categories={categories}
                admins={admins}
            />
        </AdminAuthenticatedLayout>
    );
}
