import { Head } from "@inertiajs/react";
import { useState } from "react";
import BuilderLayout from "@/Layouts/BuilderLayout";
// Gantt Components
import GanttToolbar from "@/Components/GanttChart/GanttToolbar";
import GanttTimeline from "@/Components/GanttChart/GanttTimeline";
import GanttTaskList from "@/Components/GanttChart/GanttTaskList";
import GanttCanvas from "@/Components/GanttChart/GanttCanvas";
// Mock Data
import { mockTasks, getProjectDateRange } from "@/Data/mockGanttData";

export default function Index() {
    const [viewMode, setViewMode] = useState("month");
    const [showFilter, setShowFilter] = useState(false);
    const [tasks, setTasks] = useState(mockTasks);
    const { startDate, endDate } = getProjectDateRange();

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

    return (
        <BuilderLayout>
            <Head title="ガントチャート - Spra Admin" />

            <div className="h-full flex flex-col">
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
            </div>
        </BuilderLayout>
    );
}
