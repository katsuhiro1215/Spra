import { useMemo, useState, useRef } from "react";

// 行の高さを統一（GanttTaskListと合わせる）
const ROW_HEIGHT = 36;

export default function GanttCanvas({
    tasks = [],
    milestones = [],
    viewMode = "month",
    startDate,
    endDate,
    onTaskBarClick,
    onTaskUpdate,
    onTaskProgressUpdate,
    readOnly = false,
}) {
    const [dragState, setDragState] = useState({
        isDragging: false,
        dragType: null, // 'move', 'resize-left', 'resize-right'
        taskId: null,
        startX: 0,
        originalLeft: 0,
        originalWidth: 0,
    });

    const [contextMenu, setContextMenu] = useState({
        show: false,
        x: 0,
        y: 0,
        task: null,
    });

    const canvasRef = useRef(null);
    // セルの幅を決定
    const cellWidth = useMemo(() => {
        switch (viewMode) {
            case "day":
                return 60;
            case "week":
                return 80;
            case "month":
                return 100;
            case "quarter":
                return 120;
            default:
                return 100;
        }
    }, [viewMode]);

    // 期間の総日数を計算
    const totalDays = useMemo(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }, [startDate, endDate]);

    // 今日の日付の位置を計算
    const todayPosition = useMemo(() => {
        const start = new Date(startDate);
        const today = new Date();
        const daysFromStart = Math.ceil(
            (today - start) / (1000 * 60 * 60 * 24),
        );
        return (daysFromStart / totalDays) * 100;
    }, [startDate, totalDays]);

    // マイルストーンの位置を計算
    const milestonePositions = useMemo(() => {
        const start = new Date(startDate);
        return (milestones || [])
            .filter((m) => m.due_date)
            .map((m) => {
                const dueDate = new Date(m.due_date);
                const daysFromStart = Math.ceil(
                    (dueDate - start) / (1000 * 60 * 60 * 24),
                );
                return {
                    id: m.id,
                    title: m.title,
                    position: (daysFromStart / totalDays) * 100,
                };
            })
            .filter((m) => m.position >= 0 && m.position <= 100);
    }, [milestones, startDate, totalDays]);

    // 週末の日付を計算
    const weekendColumns = useMemo(() => {
        const weekends = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        let current = new Date(start);

        while (current <= end) {
            const day = current.getDay();
            if (day === 0 || day === 6) {
                // 日曜日または土曜日
                const daysFromStart = Math.ceil(
                    (current - start) / (1000 * 60 * 60 * 24),
                );
                weekends.push((daysFromStart / totalDays) * 100);
            }
            current.setDate(current.getDate() + 1);
        }
        return weekends;
    }, [startDate, endDate, totalDays]);

    // タスクバーの位置とサイズを計算
    const calculateTaskBar = (task) => {
        const start = new Date(startDate);
        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.endDate);

        // 開始位置（日数ベース）
        const startDays = Math.max(
            0,
            Math.ceil((taskStart - start) / (1000 * 60 * 60 * 24)),
        );

        // 期間（日数）
        const durationDays = Math.ceil(
            (taskEnd - taskStart) / (1000 * 60 * 60 * 24),
        );

        // ピクセル単位に変換
        const left = (startDays / totalDays) * 100;
        const width = (durationDays / totalDays) * 100;

        return { left, width };
    };

    // タスクの進捗色を取得
    const getTaskColor = (task) => {
        switch (task.status) {
            case "completed":
                return "bg-green-500 dark:bg-green-600";
            case "in_progress":
                return "bg-blue-500 dark:bg-blue-600";
            case "not_started":
                return "bg-gray-400 dark:bg-slate-600";
            default:
                return "bg-gray-400 dark:bg-slate-600";
        }
    };

    // タスクバーのマウスダウン
    const handleTaskBarMouseDown = (e, task, type) => {
        e.stopPropagation();
        const { left, width } = calculateTaskBar(task);
        setDragState({
            isDragging: true,
            dragType: type,
            taskId: task.id,
            startX: e.clientX,
            originalLeft: left,
            originalWidth: width,
        });
    };

    // マウス移動
    const handleMouseMove = (e) => {
        if (!dragState.isDragging || !canvasRef.current) return;

        const canvasWidth = canvasRef.current.offsetWidth;
        const deltaX = e.clientX - dragState.startX;
        const deltaPercent = (deltaX / canvasWidth) * 100;

        // タスクを再帰的に検索して更新
        const updateTask = (taskList) => {
            return taskList.map((t) => {
                if (t.id === dragState.taskId) {
                    const start = new Date(startDate);
                    const taskStart = new Date(t.startDate);
                    const taskEnd = new Date(t.endDate);
                    const duration = Math.ceil(
                        (taskEnd - taskStart) / (1000 * 60 * 60 * 24),
                    );

                    if (dragState.dragType === "move") {
                        const newLeft = Math.max(
                            0,
                            Math.min(
                                100 - dragState.originalWidth,
                                dragState.originalLeft + deltaPercent,
                            ),
                        );
                        const newStartDays = Math.round(
                            (newLeft / 100) * totalDays,
                        );
                        const newStartDate = new Date(start);
                        newStartDate.setDate(
                            newStartDate.getDate() + newStartDays,
                        );
                        const newEndDate = new Date(newStartDate);
                        newEndDate.setDate(newEndDate.getDate() + duration);

                        return {
                            ...t,
                            startDate: newStartDate.toISOString().split("T")[0],
                            endDate: newEndDate.toISOString().split("T")[0],
                        };
                    } else if (dragState.dragType === "resize-left") {
                        const newLeft = Math.max(
                            0,
                            dragState.originalLeft + deltaPercent,
                        );
                        const newWidth = dragState.originalWidth - deltaPercent;
                        if (newWidth > 2) {
                            const newStartDays = Math.round(
                                (newLeft / 100) * totalDays,
                            );
                            const newStartDate = new Date(start);
                            newStartDate.setDate(
                                newStartDate.getDate() + newStartDays,
                            );
                            return {
                                ...t,
                                startDate: newStartDate
                                    .toISOString()
                                    .split("T")[0],
                            };
                        }
                    } else if (dragState.dragType === "resize-right") {
                        const newWidth = Math.max(
                            2,
                            dragState.originalWidth + deltaPercent,
                        );
                        const newDuration = Math.round(
                            (newWidth / 100) * totalDays,
                        );
                        const newEndDate = new Date(taskStart);
                        newEndDate.setDate(newEndDate.getDate() + newDuration);
                        return {
                            ...t,
                            endDate: newEndDate.toISOString().split("T")[0],
                        };
                    }
                }
                if (t.children) {
                    return { ...t, children: updateTask(t.children) };
                }
                return t;
            });
        };

        // プレビュー表示のみ（実際の更新はマウスアップ時）
        const updatedTasks = updateTask(tasks);
        if (onTaskUpdate) {
            onTaskUpdate(updatedTasks, true); // プレビューフラグ
        }
    };

    // マウスアップ
    const handleMouseUp = (e) => {
        if (dragState.isDragging && onTaskUpdate) {
            handleMouseMove(e); // 最終位置で更新
            setTimeout(() => {
                onTaskUpdate(tasks, false); // 確定
            }, 0);
        }
        setDragState({
            isDragging: false,
            dragType: null,
            taskId: null,
            startX: 0,
            originalLeft: 0,
            originalWidth: 0,
        });
    };

    // コンテキストメニューを表示
    const handleContextMenu = (e, task) => {
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

    // タスクを再帰的にレンダリング
    const renderTaskBars = (taskList, level = 0) => {
        return taskList.map((task) => {
            const { left, width } = calculateTaskBar(task);
            const hasChildren = task.children && task.children.length > 0;

            return (
                <div key={task.id}>
                    {/* タスクバー行 */}
                    <div
                        className="relative border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                        style={{ height: `${ROW_HEIGHT}px` }}
                    >
                        {/* タスクバー */}
                        <div
                            className={`absolute top-1/2 transform -translate-y-1/2 rounded ${getTaskColor(task)} shadow-sm hover:shadow-md transition-shadow group`}
                            style={{
                                left: `${left}%`,
                                width: `${width}%`,
                                minWidth: "30px",
                                height: "24px",
                                cursor: readOnly
                                    ? "pointer"
                                    : dragState.isDragging
                                      ? "grabbing"
                                      : "grab",
                            }}
                            onMouseDown={(e) =>
                                !readOnly &&
                                handleTaskBarMouseDown(e, task, "move")
                            }
                            onClick={() =>
                                onTaskBarClick && onTaskBarClick(task)
                            }
                            onContextMenu={(e) => handleContextMenu(e, task)}
                        >
                            {/* 左端リサイズハンドル */}
                            {!readOnly && (
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white hover:bg-opacity-30"
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        handleTaskBarMouseDown(
                                            e,
                                            task,
                                            "resize-left",
                                        );
                                    }}
                                />
                            )}

                            {/* 右端リサイズハンドル */}
                            {!readOnly && (
                                <div
                                    className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white hover:bg-opacity-30"
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        handleTaskBarMouseDown(
                                            e,
                                            task,
                                            "resize-right",
                                        );
                                    }}
                                />
                            )}
                            {/* 進捗バー */}
                            {task.progress !== undefined &&
                                task.progress > 0 && (
                                    <div
                                        className="absolute inset-0 bg-black bg-opacity-20 rounded-l"
                                        style={{ width: `${task.progress}%` }}
                                    />
                                )}

                            {/* タスク名（バー内） */}
                            <div className="absolute inset-0 flex items-center px-2">
                                <span className="text-xs font-medium text-white truncate">
                                    {task.name}
                                </span>
                            </div>

                            {/* ホバー時の詳細 */}
                            <div className="absolute top-full left-0 mt-1 hidden group-hover:block z-20">
                                <div className="bg-gray-900 text-white text-xs rounded py-2 px-3 shadow-lg whitespace-nowrap">
                                    <div className="font-medium mb-1">
                                        {task.name}
                                    </div>
                                    <div className="text-gray-300">
                                        開始: {task.startDate}
                                    </div>
                                    <div className="text-gray-300">
                                        終了: {task.endDate}
                                    </div>
                                    {task.assignee && (
                                        <div className="text-gray-300">
                                            担当: {task.assignee}
                                        </div>
                                    )}
                                    {task.progress !== undefined && (
                                        <div className="text-gray-300">
                                            進捗: {task.progress}%
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 子タスク */}
                    {hasChildren && renderTaskBars(task.children, level + 1)}
                </div>
            );
        });
    };

    // グリッド線を生成
    const gridColumns = useMemo(() => {
        const columns = [];
        const numColumns = Math.ceil(totalDays / 7); // 週単位でグリッド
        for (let i = 0; i <= numColumns; i++) {
            columns.push(i);
        }
        return columns;
    }, [totalDays]);

    return (
        <div
            ref={canvasRef}
            className="relative bg-white dark:bg-slate-900 overflow-x-auto overflow-y-auto"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={closeContextMenu}
        >
            {/* グリッド背景 */}
            <div className="absolute inset-0 flex">
                {gridColumns.map((col) => (
                    <div
                        key={col}
                        className="border-r border-gray-200 dark:border-slate-700"
                        style={{ width: `${cellWidth}px` }}
                    />
                ))}
            </div>

            {/* 週末の背景色 */}
            <div className="absolute inset-0 flex pointer-events-none">
                {weekendColumns.map((position, idx) => (
                    <div
                        key={`weekend-${idx}`}
                        className="absolute top-0 bottom-0 bg-gray-100 dark:bg-slate-800 opacity-50"
                        style={{
                            left: `${position}%`,
                            width: `${(1 / totalDays) * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* マイルストーンライン */}
            {milestonePositions.map((milestone) => (
                <div
                    key={milestone.id}
                    className="absolute top-0 bottom-0 w-0 border-l-2 border-dashed border-purple-400 z-10 pointer-events-none"
                    style={{ left: `${milestone.position}%` }}
                >
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-1">
                        <div className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                            🚩 {milestone.title}
                        </div>
                    </div>
                </div>
            ))}

            {/* 今日の日付ライン */}
            {todayPosition >= 0 && todayPosition <= 100 && (
                <div
                    id="gantt-today-marker"
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
                    style={{ left: `${todayPosition}%` }}
                >
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-1">
                        <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                            今日
                        </div>
                    </div>
                </div>
            )}

            {/* タスクバー */}
            <div className="relative z-10">
                {tasks.length > 0 ? (
                    renderTaskBars(tasks)
                ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-slate-400 text-sm">
                        タスクがありません
                    </div>
                )}
            </div>

            {/* コンテキストメニュー */}
            {contextMenu.show && contextMenu.task && (
                <div
                    className="fixed bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50"
                    style={{
                        left: `${contextMenu.x}px`,
                        top: `${contextMenu.y}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {!readOnly && (
                        <button
                            className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-2"
                            onClick={() => {
                                if (onTaskProgressUpdate) {
                                    const newProgress = prompt(
                                        `${contextMenu.task.name}の進捗率を入力してください (0-100):`,
                                        contextMenu.task.progress || 0,
                                    );
                                    if (newProgress !== null) {
                                        const progress = Math.min(
                                            100,
                                            Math.max(
                                                0,
                                                parseInt(newProgress) || 0,
                                            ),
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
                    )}
                    <button
                        className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-2"
                        onClick={() => {
                            onTaskBarClick && onTaskBarClick(contextMenu.task);
                            closeContextMenu();
                        }}
                    >
                        <span>✏️</span>
                        <span>詳細を表示</span>
                    </button>
                    {!readOnly && (
                        <>
                            <div className="border-t border-gray-200 dark:border-slate-700 my-1"></div>
                            <button
                                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center space-x-2"
                                onClick={() => {
                                    if (
                                        confirm(
                                            `「${contextMenu.task.name}」を削除してもよろしいですか？`,
                                        )
                                    ) {
                                        console.log(
                                            "Delete task:",
                                            contextMenu.task,
                                        );
                                    }
                                    closeContextMenu();
                                }}
                            >
                                <span>🗑️</span>
                                <span>削除</span>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
