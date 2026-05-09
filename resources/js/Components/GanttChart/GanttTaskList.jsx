import {
    ChevronRightIcon,
    ChevronDownIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

// 行の高さを統一（GanttCanvasと合わせる）
const ROW_HEIGHT = 36;

export default function GanttTaskList({
    tasks = [],
    onTaskClick,
    onEditTask,
    onDeleteTask,
    onTaskReorder,
    onTaskProgressUpdate,
}) {
    // デフォルトで全て展開
    const getAllTaskIds = (taskList) => {
        const ids = new Set();
        taskList.forEach((task) => {
            if (task.children && task.children.length > 0) {
                ids.add(task.id);
                getAllTaskIds(task.children).forEach((id) => ids.add(id));
            }
        });
        return ids;
    };

    const [expandedTasks, setExpandedTasks] = useState(() =>
        getAllTaskIds(tasks),
    );

    // ドラッグ&ドロップの状態管理
    const [dragState, setDragState] = useState({
        draggedTask: null,
        draggedFromLevel: 0,
        draggedFromParentId: null,
        draggedFromIndex: 0,
        dropTarget: null,
        dropPosition: null, // 'before', 'after', 'child'
        isDragging: false,
    });

    // コンテキストメニューの状態
    const [contextMenu, setContextMenu] = useState({
        show: false,
        x: 0,
        y: 0,
        task: null,
    });

    const toggleExpand = (taskId) => {
        const newExpanded = new Set(expandedTasks);
        if (newExpanded.has(taskId)) {
            newExpanded.delete(taskId);
        } else {
            newExpanded.add(taskId);
        }
        setExpandedTasks(newExpanded);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800 border-green-200";
            case "in_progress":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "not_started":
                return "bg-gray-100 text-gray-800 border-gray-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "completed":
                return "完了";
            case "in_progress":
                return "進行中";
            case "not_started":
                return "未着手";
            default:
                return "不明";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high":
                return "text-red-600";
            case "medium":
                return "text-yellow-600";
            case "low":
                return "text-gray-600";
            default:
                return "text-gray-600";
        }
    };

    // アバター生成
    const renderAvatar = (name, size = "sm") => {
        const sizeClass = size === "sm" ? "h-6 w-6 text-xs" : "h-8 w-8 text-sm";
        const initial = name ? name.charAt(0).toUpperCase() : "?";
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-yellow-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-indigo-500",
        ];
        const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

        return (
            <div
                className={`${sizeClass} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-medium flex-shrink-0`}
                title={name}
            >
                {initial}
            </div>
        );
    };

    // 日付フォーマット
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    // ドラッグ開始
    const handleDragStart = (e, task, level, parentId, index, isFirstTask) => {
        if (isFirstTask) {
            e.preventDefault();
            return;
        }

        e.dataTransfer.effectAllowed = "move";
        setDragState({
            draggedTask: task,
            draggedFromLevel: level,
            draggedFromParentId: parentId,
            draggedFromIndex: index,
            dropTarget: null,
            dropPosition: null,
            isDragging: true,
        });
    };

    // ドラッグオーバー
    const handleDragOver = (e, targetTask, targetLevel) => {
        e.preventDefault();
        e.stopPropagation();

        if (
            !dragState.isDragging ||
            dragState.draggedTask.id === targetTask.id
        ) {
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        const mouseX = e.clientX - rect.left;
        const rowHeight = rect.height;

        let dropPosition = "before";

        // 上半分か下半分か判定
        if (mouseY > rowHeight / 2) {
            dropPosition = "after";
        }

        // 右側にドラッグした場合は子要素として追加
        const indentWidth = 16;
        const currentIndent = targetLevel * indentWidth + 8;
        if (mouseX > currentIndent + 100 && dropPosition === "after") {
            dropPosition = "child";
        }

        setDragState((prev) => ({
            ...prev,
            dropTarget: targetTask.id,
            dropPosition: dropPosition,
        }));
    };

    // ドラッグ終了
    const handleDragEnd = () => {
        setDragState({
            draggedTask: null,
            draggedFromLevel: 0,
            draggedFromParentId: null,
            draggedFromIndex: 0,
            dropTarget: null,
            dropPosition: null,
            isDragging: false,
        });
    };

    // ドロップ
    const handleDrop = (e, targetTask) => {
        e.preventDefault();
        e.stopPropagation();

        if (
            !dragState.isDragging ||
            !dragState.draggedTask ||
            dragState.draggedTask.id === targetTask.id
        ) {
            handleDragEnd();
            return;
        }

        if (onTaskReorder) {
            onTaskReorder({
                draggedTask: dragState.draggedTask,
                targetTask: targetTask,
                dropPosition: dragState.dropPosition,
            });
        }

        handleDragEnd();
    };

    // コンテキストメニューを表示
    const handleContextMenu = (e, task, isFirstTask) => {
        if (isFirstTask) return; // トップタスクは無効
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            show: true,
            x: e.clientX,
            y: e.clientY,
            task: task,
        });
    };

    // コンテキストメニューを閉じる
    const closeContextMenu = () => {
        setContextMenu({ show: false, x: 0, y: 0, task: null });
    };

    const renderTask = (
        task,
        level = 0,
        parentId = null,
        index = 0,
        isFirstTask = false,
    ) => {
        const hasChildren = task.children && task.children.length > 0;
        const isExpanded = expandedTasks.has(task.id);

        const isDragging =
            dragState.isDragging && dragState.draggedTask?.id === task.id;
        const isDropTarget = dragState.dropTarget === task.id;
        const dropPosition = dragState.dropPosition;

        return (
            <div key={task.id}>
                {/* ドロップターゲット表示（上） */}
                {isDropTarget && dropPosition === "before" && (
                    <div className="h-0.5 bg-blue-500 relative">
                        <div className="absolute left-0 top-0 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                )}

                <div
                    draggable={!isFirstTask}
                    onDragStart={(e) =>
                        handleDragStart(
                            e,
                            task,
                            level,
                            parentId,
                            index,
                            isFirstTask,
                        )
                    }
                    onDragOver={(e) => handleDragOver(e, task, level)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, task)}
                    onContextMenu={(e) =>
                        handleContextMenu(e, task, isFirstTask)
                    }
                    className={`flex items-center border-b border-gray-200 hover:bg-gray-50 group relative ${
                        isDragging ? "opacity-50" : ""
                    } ${isFirstTask ? "" : "cursor-move"} ${
                        isDropTarget && dropPosition === "child"
                            ? "bg-blue-50"
                            : ""
                    }`}
                    style={{
                        height: `${ROW_HEIGHT}px`,
                        paddingLeft: `${level * 16 + 8}px`,
                    }}
                >
                    {/* 展開/折りたたみボタン */}
                    <div className="w-5 flex-shrink-0">
                        {hasChildren && (
                            <button
                                onClick={() => toggleExpand(task.id)}
                                className="p-0.5 hover:bg-gray-200 rounded"
                            >
                                {isExpanded ? (
                                    <ChevronDownIcon className="h-3.5 w-3.5 text-gray-600" />
                                ) : (
                                    <ChevronRightIcon className="h-3.5 w-3.5 text-gray-600" />
                                )}
                            </button>
                        )}
                    </div>

                    {/* タスク名 */}
                    <div
                        className="flex-1 min-w-0 pr-2 cursor-pointer"
                        onClick={() => onTaskClick && onTaskClick(task)}
                    >
                        <div className="flex items-center">
                            <span
                                className={`text-sm truncate ${
                                    task.status === "completed"
                                        ? "line-through text-gray-500"
                                        : "text-gray-900"
                                } ${hasChildren ? "font-medium" : ""}`}
                                title={task.name}
                            >
                                {task.name}
                            </span>
                            {task.priority && (
                                <span
                                    className={`ml-1 text-xs ${getPriorityColor(task.priority)}`}
                                >
                                    ●
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 日付範囲 */}
                    <div className="w-24 flex-shrink-0 text-xs text-gray-600 pr-2">
                        {formatDate(task.startDate)} -{" "}
                        {formatDate(task.endDate)}
                    </div>

                    {/* ステータス */}
                    <div className="w-20 flex-shrink-0 pr-2">
                        <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(task.status)}`}
                        >
                            {getStatusLabel(task.status)}
                        </span>
                    </div>

                    {/* 担当者 */}
                    <div className="w-28 flex-shrink-0 pr-2">
                        {task.assignee && (
                            <div className="flex items-center space-x-1.5">
                                {renderAvatar(task.assignee)}
                                <span className="text-xs text-gray-700 truncate">
                                    {task.assignee}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* アクションボタン */}
                    <div className="flex items-center space-x-0.5 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEditTask && onEditTask(task)}
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="編集"
                        >
                            <PencilIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => onDeleteTask && onDeleteTask(task)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="削除"
                        >
                            <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>

                {/* 子タスク */}
                {hasChildren && isExpanded && (
                    <div>
                        {task.children.map((child, childIndex) =>
                            renderTask(
                                child,
                                level + 1,
                                task.id,
                                childIndex,
                                false,
                            ),
                        )}
                    </div>
                )}

                {/* ドロップターゲット表示（下） */}
                {isDropTarget && dropPosition === "after" && (
                    <div className="h-0.5 bg-blue-500 relative">
                        <div className="absolute left-0 top-0 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className="bg-white border-r border-gray-300 overflow-y-auto relative"
            onClick={closeContextMenu}
        >
            {/* ヘッダー */}
            <div className="sticky top-0 bg-gray-100 border-b-2 border-gray-300 z-10 text-xs font-semibold text-gray-700">
                <div
                    className="flex items-center"
                    style={{ height: `${ROW_HEIGHT}px` }}
                >
                    <div className="w-5 flex-shrink-0"></div>
                    <div className="flex-1 px-2">タスク名</div>
                    <div className="w-24 flex-shrink-0 px-2">期間</div>
                    <div className="w-20 flex-shrink-0 px-2">ステータス</div>
                    <div className="w-28 flex-shrink-0 px-2">担当者</div>
                    <div className="w-16 flex-shrink-0"></div>
                </div>
            </div>

            {/* タスクリスト */}
            <div>
                {tasks.length > 0 ? (
                    tasks.map((task, index) =>
                        renderTask(task, 0, null, index, index === 0),
                    )
                ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        タスクがありません
                    </div>
                )}
            </div>

            {/* コンテキストメニュー */}
            {contextMenu.show && contextMenu.task && (
                <div
                    className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    style={{
                        left: `${contextMenu.x}px`,
                        top: `${contextMenu.y}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                        onClick={() => {
                            if (onTaskProgressUpdate) {
                                const newProgress = prompt(
                                    `${contextMenu.task.name}の進捗率を入力してください (0-100):`,
                                    contextMenu.task.progress || 0,
                                );
                                if (newProgress !== null) {
                                    const progress = Math.min(
                                        100,
                                        Math.max(0, parseInt(newProgress) || 0),
                                    );
                                    onTaskProgressUpdate(
                                        contextMenu.task.id,
                                        progress,
                                    );
                                }
                            }
                            closeContextMenu();
                        }}
                    >
                        <span>📊</span>
                        <span>進捗率を変更</span>
                    </button>
                    <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                        onClick={() => {
                            onEditTask && onEditTask(contextMenu.task);
                            closeContextMenu();
                        }}
                    >
                        <span>✏️</span>
                        <span>編集</span>
                    </button>
                    <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                        onClick={() => {
                            const hasChildren =
                                contextMenu.task.children &&
                                contextMenu.task.children.length > 0;
                            const newExpanded = new Set(expandedTasks);
                            if (hasChildren) {
                                if (newExpanded.has(contextMenu.task.id)) {
                                    newExpanded.delete(contextMenu.task.id);
                                } else {
                                    newExpanded.add(contextMenu.task.id);
                                }
                                setExpandedTasks(newExpanded);
                            }
                            closeContextMenu();
                        }}
                    >
                        <span>🔽</span>
                        <span>展開/折りたたみ</span>
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        onClick={() => {
                            onDeleteTask && onDeleteTask(contextMenu.task);
                            closeContextMenu();
                        }}
                    >
                        <span>🗑️</span>
                        <span>削除</span>
                    </button>
                </div>
            )}
        </div>
    );
}
