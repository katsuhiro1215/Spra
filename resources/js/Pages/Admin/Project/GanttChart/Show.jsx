import { Head, Link, useForm, router } from "@inertiajs/react";
import { useState, useMemo, useEffect } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Gantt Components
import GanttToolbar from "@/Components/GanttChart/GanttToolbar";
import GanttTimeline from "@/Components/GanttChart/GanttTimeline";
import GanttTaskList from "@/Components/GanttChart/GanttTaskList";
import GanttCanvas from "@/Components/GanttChart/GanttCanvas";
import GanttTaskModal from "@/Components/GanttChart/GanttTaskModal";

const VIEW_MODES = ["day", "week", "month", "quarter"];

const toDateInput = (value) => {
    if (!value) return "";
    return new Date(value).toISOString().split("T")[0];
};

export default function Show({
    project,
    currentVersion,
    milestones = [],
    items = [],
    admins = [],
}) {
    const [viewMode, setViewMode] = useState("month");
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({
        status: "",
        assignedTo: "",
        priority: "",
        search: "",
    });

    // ProjectItemsをガントチャートタスク形式に変換
    const convertItemsToTasks = useMemo(() => {
        if (!items || items.length === 0) return [];

        return items.map((item) => ({
            id: item.id,
            name: item.name,
            startDate: item.start_date,
            endDate: item.end_date,
            progress: item.progress ?? 0,
            type: "task",
            resource:
                item.assignee?.profile?.full_name ||
                item.assignee?.email ||
                "未割当",
            dependencies: [],
            status: item.status,
            priority: item.priority,
            description: item.description,
            milestoneId: item.milestone_id,
            assignedTo: item.assigned_to,
            serviceItemId: item.service_item_id,
            estimatedHours: item.estimated_hours,
            children: [],
        }));
    }, [items]);

    const [tasks, setTasks] = useState(convertItemsToTasks);

    // サーバーからitemsが更新されたらタスクを再同期（作成・編集・削除後の再取得を反映）
    useEffect(() => {
        setTasks(convertItemsToTasks);
    }, [convertItemsToTasks]);

    // フィルター適用後のタスク
    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            if (filters.status && task.status !== filters.status) {
                return false;
            }
            if (filters.priority && task.priority !== filters.priority) {
                return false;
            }
            if (filters.assignedTo) {
                if (filters.assignedTo === "unassigned") {
                    if (task.assignedTo) return false;
                } else if (task.assignedTo !== filters.assignedTo) {
                    return false;
                }
            }
            if (
                filters.search &&
                !task.name
                    ?.toLowerCase()
                    .includes(filters.search.toLowerCase())
            ) {
                return false;
            }
            return true;
        });
    }, [tasks, filters]);

    // プロジェクトの期間を取得
    const getProjectDateRange = () => {
        const startDate = currentVersion?.start_date
            ? new Date(currentVersion.start_date)
            : new Date();
        const endDate = currentVersion?.estimated_end_date
            ? new Date(currentVersion.estimated_end_date)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        return { startDate, endDate };
    };

    const { startDate, endDate } = getProjectDateRange();

    const breadcrumbs = [
        { label: "プロジェクト", href: route("admin.project.index") },
        {
            label: project.title,
            href: route("admin.project.show", project.id),
        },
        { label: "ガントチャート" },
    ];

    // ===== タスク追加・編集モーダル =====
    const emptyTaskForm = () => ({
        title: "",
        description: "",
        milestone_id: "",
        start_date: toDateInput(currentVersion?.start_date) || toDateInput(new Date()),
        end_date:
            toDateInput(currentVersion?.estimated_end_date) ||
            toDateInput(new Date()),
        estimated_hours: "",
        status: "not_started",
        priority: "medium",
        assigned_to: "",
        progress: 0,
    });

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
        transform,
    } = useForm(emptyTaskForm());

    const [taskModal, setTaskModal] = useState({
        show: false,
        mode: "create",
        taskId: null,
    });

    const openCreateModal = () => {
        if (!currentVersion) return;
        clearErrors();
        reset();
        setData(emptyTaskForm());
        setTaskModal({ show: true, mode: "create", taskId: null });
    };

    const openEditModal = (task) => {
        clearErrors();
        setData({
            title: task.name || "",
            description: task.description || "",
            milestone_id: task.milestoneId || "",
            start_date: task.startDate || "",
            end_date: task.endDate || "",
            estimated_hours: task.estimatedHours || "",
            status: task.status || "not_started",
            priority: task.priority || "medium",
            assigned_to: task.assignedTo || "",
            progress: task.progress ?? 0,
        });
        setTaskModal({ show: true, mode: "edit", taskId: task.id });
    };

    const closeTaskModal = () => {
        setTaskModal({ show: false, mode: "create", taskId: null });
        reset();
        clearErrors();
    };

    const handleTaskModalSubmit = (e) => {
        e.preventDefault();
        if (!currentVersion) return;

        if (taskModal.mode === "create") {
            transform((formData) => ({ items: [formData] }));
            post(
                route("admin.project.versions.items.store", {
                    project: project.id,
                    version: currentVersion.id,
                }),
                {
                    preserveScroll: true,
                    onSuccess: () => closeTaskModal(),
                    onFinish: () => transform((formData) => formData),
                },
            );
        } else {
            put(
                route("admin.project.versions.items.update", {
                    project: project.id,
                    version: currentVersion.id,
                    item: taskModal.taskId,
                }),
                {
                    preserveScroll: true,
                    onSuccess: () => closeTaskModal(),
                },
            );
        }
    };

    // サーバーへタスクの変更（日程・進捗など）を反映する
    const persistTaskUpdate = (task) => {
        if (!currentVersion) return;
        router.put(
            route("admin.project.versions.items.update", {
                project: project.id,
                version: currentVersion.id,
                item: task.id,
            }),
            {
                title: task.name,
                description: task.description || "",
                milestone_id: task.milestoneId || "",
                start_date: task.startDate,
                end_date: task.endDate,
                estimated_hours: task.estimatedHours || "",
                status: task.status,
                progress: task.progress ?? 0,
                priority: task.priority || "medium",
                assigned_to: task.assignedTo || "",
            },
            { preserveScroll: true, preserveState: true },
        );
    };

    // ツールバーのイベントハンドラー
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    const handleZoomIn = () => {
        const index = VIEW_MODES.indexOf(viewMode);
        if (index > 0) setViewMode(VIEW_MODES[index - 1]);
    };

    const handleZoomOut = () => {
        const index = VIEW_MODES.indexOf(viewMode);
        if (index < VIEW_MODES.length - 1) setViewMode(VIEW_MODES[index + 1]);
    };

    const handleAddTask = () => {
        openCreateModal();
    };

    const handleToggleFilter = () => {
        setShowFilter(!showFilter);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleJumpToToday = () => {
        document
            .getElementById("gantt-today-marker")
            ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    };

    // タスクリストのイベントハンドラー
    const handleTaskClick = (task) => {
        openEditModal(task);
    };

    const handleEditTask = (task) => {
        openEditModal(task);
    };

    const handleDeleteTask = (task) => {
        if (!currentVersion) return;
        if (confirm(`「${task.name}」を削除してもよろしいですか？`)) {
            router.delete(
                route("admin.project.versions.items.destroy", {
                    project: project.id,
                    version: currentVersion.id,
                    item: task.id,
                }),
                { preserveScroll: true },
            );
        }
    };

    // タスクの順序変更（ドラッグ&ドロップ）。並び替え結果はsort_orderとしてサーバーに保存する
    const handleTaskReorder = ({ draggedTask, targetTask, dropPosition }) => {
        const cloneTasks = JSON.parse(JSON.stringify(tasks));

        const removeTask = (taskList) => {
            for (let i = 0; i < taskList.length; i++) {
                if (taskList[i].id === draggedTask.id) {
                    taskList.splice(i, 1);
                    return true;
                }
                if (taskList[i].children) {
                    if (removeTask(taskList[i].children)) {
                        return true;
                    }
                }
            }
            return false;
        };

        const insertTask = (taskList) => {
            for (let i = 0; i < taskList.length; i++) {
                if (taskList[i].id === targetTask.id) {
                    if (dropPosition === "before") {
                        taskList.splice(i, 0, draggedTask);
                    } else if (dropPosition === "after") {
                        taskList.splice(i + 1, 0, draggedTask);
                    } else if (dropPosition === "child") {
                        if (!taskList[i].children) {
                            taskList[i].children = [];
                        }
                        taskList[i].children.push(draggedTask);
                    }
                    return true;
                }
                if (taskList[i].children) {
                    if (insertTask(taskList[i].children)) {
                        return true;
                    }
                }
            }
            return false;
        };

        removeTask(cloneTasks);
        insertTask(cloneTasks);

        setTasks(cloneTasks);
        persistTaskOrder(cloneTasks);
    };

    // 表示中の並び順（トップレベル・ネスト先とも上から順）をフラットなID配列にしてサーバーへ保存する
    const persistTaskOrder = (taskList) => {
        if (!currentVersion) return;

        const flattenIds = (list) =>
            list.reduce((ids, task) => {
                ids.push(task.id);
                if (task.children && task.children.length > 0) {
                    ids.push(...flattenIds(task.children));
                }
                return ids;
            }, []);

        router.post(
            route("admin.project.versions.items.reorder", {
                project: project.id,
                version: currentVersion.id,
            }),
            { order: flattenIds(taskList) },
            { preserveScroll: true, preserveState: true },
        );
    };

    // ガントチャートのイベントハンドラー
    const handleTaskBarClick = (task) => {
        openEditModal(task);
    };

    // タスクの更新（ドラッグ＆リサイズ）
    const handleTaskUpdate = (updatedTasks, isPreview) => {
        if (isPreview) {
            setTasks(updatedTasks);
            return;
        }

        // 変更されたタスクを特定してサーバーに保存
        const changedTask = updatedTasks.find((newTask) => {
            const oldTask = tasks.find((t) => t.id === newTask.id);
            return (
                oldTask &&
                (oldTask.startDate !== newTask.startDate ||
                    oldTask.endDate !== newTask.endDate)
            );
        });

        setTasks(updatedTasks);

        if (changedTask) {
            persistTaskUpdate(changedTask);
        }
    };

    // 進捗率の更新
    const handleTaskProgressUpdate = (taskId, progress) => {
        let target = null;
        const updateProgress = (taskList) => {
            return taskList.map((task) => {
                if (task.id === taskId) {
                    target = { ...task, progress };
                    return target;
                }
                if (task.children) {
                    return {
                        ...task,
                        children: updateProgress(task.children),
                    };
                }
                return task;
            });
        };
        setTasks(updateProgress(tasks));

        if (target) {
            persistTaskUpdate(target);
        }
    };

    const headerActions = [
        {
            label: "プロジェクト詳細に戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.project.show", project.id),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="ガントチャート"
                    description={project.title}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`${project.title} - ガントチャート`} />

            <div className="h-[calc(100vh-280px)] flex flex-col">
                {/* ツールバー */}
                <GanttToolbar
                    viewMode={viewMode}
                    onViewModeChange={handleViewModeChange}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onAddTask={handleAddTask}
                    onToggleFilter={handleToggleFilter}
                    showFilter={showFilter}
                    onJumpToToday={handleJumpToToday}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    admins={admins}
                />

                {/* メインエリア */}
                {!currentVersion ? (
                    <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                        <div className="text-center">
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                プロジェクトバージョンが作成されていません
                            </p>
                            <Link href={route("admin.project.versions.create", project.id)}>
                                <SecondaryButton>
                                    バージョンを作成
                                </SecondaryButton>
                            </Link>
                        </div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                        <div className="text-center">
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                このバージョンにはアイテムが登録されていません
                            </p>
                            <SecondaryButton onClick={openCreateModal}>
                                タスクを追加
                            </SecondaryButton>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex overflow-hidden">
                    {/* 左側：タスクリスト */}
                    <div className="w-[600px] flex-shrink-0 overflow-y-auto">
                        <GanttTaskList
                            tasks={filteredTasks}
                            onTaskClick={handleTaskClick}
                            onEditTask={handleEditTask}
                            onDeleteTask={handleDeleteTask}
                            onTaskReorder={handleTaskReorder}
                            onTaskProgressUpdate={handleTaskProgressUpdate}
                        />
                    </div>

                    {/* 右側：ガントチャート */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* タイムライン */}
                        <div className="flex-shrink-0">
                            <GanttTimeline
                                viewMode={viewMode}
                                startDate={startDate}
                                endDate={endDate}
                            />
                        </div>

                        {/* キャンバス */}
                        <div className="flex-1 overflow-auto">
                            <GanttCanvas
                                tasks={filteredTasks}
                                milestones={milestones}
                                viewMode={viewMode}
                                startDate={startDate}
                                endDate={endDate}
                                onTaskBarClick={handleTaskBarClick}
                                onTaskUpdate={handleTaskUpdate}
                                onTaskProgressUpdate={handleTaskProgressUpdate}
                            />
                        </div>
                    </div>
                    </div>
                )}
            </div>

            {/* タスク追加・編集モーダル */}
            <GanttTaskModal
                show={taskModal.show}
                mode={taskModal.mode}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={handleTaskModalSubmit}
                onClose={closeTaskModal}
                milestones={milestones}
                admins={admins}
            />
        </AdminAuthenticatedLayout>
    );
}
