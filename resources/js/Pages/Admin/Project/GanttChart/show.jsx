import { Head, Link } from "@inertiajs/react";
import { useState, useMemo } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Gantt Components
import GanttToolbar from "@/Components/GanttChart/GanttToolbar";
import GanttTimeline from "@/Components/GanttChart/GanttTimeline";
import GanttTaskList from "@/Components/GanttChart/GanttTaskList";
import GanttCanvas from "@/Components/GanttChart/GanttCanvas";

export default function Index({ project, currentVersion, milestones = [], items = [] }) {
    const [viewMode, setViewMode] = useState("month");
    const [showFilter, setShowFilter] = useState(false);

    // ProjectItemsをガントチャートタスク形式に変換
    const convertItemsToTasks = useMemo(() => {
        if (!items || items.length === 0) return [];

        return items.map((item) => ({
            id: item.id,
            name: item.name,
            start: new Date(item.start_date),
            end: new Date(item.end_date),
            progress: item.status === "completed" ? 100 : item.status === "in_progress" ? 50 : 0,
            type: "task",
            resource: item.assigned_to || "未割当",
            dependencies: [],
            status: item.status,
            priority: item.priority,
            description: item.description,
            children: [],
        }));
    }, [items]);

    const [tasks, setTasks] = useState(convertItemsToTasks);

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

    // ツールバーのイベントハンドラー
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    const handleZoomIn = () => {
        console.log("Zoom in");
    };

    const handleZoomOut = () => {
        console.log("Zoom out");
    };

    const handleAddTask = () => {
        console.log("Add task");
        // TODO: タスク追加モーダルを表示
    };

    const handleToggleFilter = () => {
        setShowFilter(!showFilter);
    };

    // タスクリストのイベントハンドラー
    const handleTaskClick = (task) => {
        console.log("Task clicked:", task);
    };

    const handleEditTask = (task) => {
        console.log("Edit task:", task);
        // TODO: タスク編集モーダルを表示
    };

    const handleDeleteTask = (task) => {
        if (confirm(`「${task.name}」を削除してもよろしいですか？`)) {
            console.log("Delete task:", task);
            // TODO: タスク削除処理
        }
    };

    // タスクの順序変更・階層変更
    const handleTaskReorder = ({ draggedTask, targetTask, dropPosition }) => {
        const cloneTasks = JSON.parse(JSON.stringify(tasks));

        // ドラッグされたタスクを削除する再帰関数
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

        // ターゲット位置にタスクを挿入する再帰関数
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

        // タスクを削除してから挿入
        removeTask(cloneTasks);
        insertTask(cloneTasks);

        setTasks(cloneTasks);
    };

    // ガントチャートのイベントハンドラー
    const handleTaskBarClick = (task) => {
        console.log("Task bar clicked:", task);
    };

    // タスクの更新（ドラッグ＆リサイズ）
    const handleTaskUpdate = (updatedTasks, isPreview) => {
        if (!isPreview) {
            setTasks(updatedTasks);
        }
    };

    // 進捗率の更新
    const handleTaskProgressUpdate = (taskId, progress) => {
        const updateProgress = (taskList) => {
            return taskList.map((task) => {
                if (task.id === taskId) {
                    return { ...task, progress };
                }
                if (task.children) {
                    return { ...task, children: updateProgress(task.children) };
                }
                return task;
            });
        };
        setTasks(updateProgress(tasks));
    };

    const headerActions = [
        {
            label: "プロジェクト詳細に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.project.show", project.id),
        },
    ];

    return (
        <AdminAuthenticatedLayout breadcrumbs={breadcrumbs}>
            <Head title={`${project.title} - ガントチャート`} />

            <PageHeader
                title="ガントチャート"
                description={project.title}
                actions={headerActions}
            />

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
                            <Link href={route("admin.project.versions.show", [project.id, currentVersion.id])}>
                                <SecondaryButton>
                                    バージョン詳細を確認
                                </SecondaryButton>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex overflow-hidden">
                    {/* 左側：タスクリスト */}
                    <div className="w-[600px] flex-shrink-0 overflow-y-auto">
                        <GanttTaskList
                            tasks={tasks}
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
                                tasks={tasks}
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
        </AdminAuthenticatedLayout>
    );
}
