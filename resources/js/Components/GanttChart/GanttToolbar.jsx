import {
    MagnifyingGlassIcon,
    PlusIcon,
    FunnelIcon,
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
    CalendarIcon,
} from "@heroicons/react/24/outline";

export default function GanttToolbar({
    viewMode = "month",
    onViewModeChange,
    onZoomIn,
    onZoomOut,
    onAddTask,
    onToggleFilter,
    showFilter = false,
    onJumpToToday,
    filters = { status: "", assignedTo: "", priority: "", search: "" },
    onFilterChange,
    admins = [],
    readOnly = false,
}) {
    const viewModes = [
        { value: "day", label: "日" },
        { value: "week", label: "週" },
        { value: "month", label: "月" },
        { value: "quarter", label: "四半期" },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 py-3">
            <div className="flex items-center justify-between">
                {/* 左側：アクションボタン */}
                <div className="flex items-center space-x-2">
                    {!readOnly && (
                        <button
                            onClick={onAddTask}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            タスク追加
                        </button>
                    )}

                    <button
                        onClick={onToggleFilter}
                        className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            showFilter
                                ? "border-blue-500 text-blue-700 bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:bg-blue-900/30"
                                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                        }`}
                    >
                        <FunnelIcon className="h-4 w-4 mr-2" />
                        フィルター
                    </button>
                </div>

                {/* 中央：表示モード切替 */}
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-slate-800 rounded-md p-1">
                    {viewModes.map((mode) => (
                        <button
                            key={mode.value}
                            onClick={() => onViewModeChange(mode.value)}
                            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                                viewMode === mode.value
                                    ? "bg-white text-gray-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                                    : "text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200"
                            }`}
                        >
                            {mode.label}
                        </button>
                    ))}
                </div>

                {/* 右側：ズームとその他 */}
                <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-md">
                        <button
                            onClick={onZoomOut}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700 rounded-l-md transition-colors"
                            title="ズームアウト"
                        >
                            <ArrowsPointingInIcon className="h-4 w-4" />
                        </button>
                        <div className="h-6 w-px bg-gray-300 dark:bg-slate-600"></div>
                        <button
                            onClick={onZoomIn}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700 rounded-r-md transition-colors"
                            title="ズームイン"
                        >
                            <ArrowsPointingOutIcon className="h-4 w-4" />
                        </button>
                    </div>

                    <button
                        onClick={onJumpToToday}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="今日へ移動"
                    >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        今日
                    </button>
                </div>
            </div>

            {/* フィルターパネル */}
            {showFilter && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                    <div className="grid grid-cols-4 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
                                ステータス
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) =>
                                    onFilterChange &&
                                    onFilterChange("status", e.target.value)
                                }
                                className="w-full text-sm rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">すべて</option>
                                <option value="not_started">未着手</option>
                                <option value="in_progress">進行中</option>
                                <option value="completed">完了</option>
                                <option value="on_hold">保留</option>
                                <option value="cancelled">キャンセル</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
                                担当者
                            </label>
                            <select
                                value={filters.assignedTo}
                                onChange={(e) =>
                                    onFilterChange &&
                                    onFilterChange(
                                        "assignedTo",
                                        e.target.value,
                                    )
                                }
                                className="w-full text-sm rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">すべて</option>
                                <option value="unassigned">未割当</option>
                                {admins.map((admin) => (
                                    <option key={admin.id} value={admin.id}>
                                        {admin.profile?.full_name ||
                                            admin.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
                                優先度
                            </label>
                            <select
                                value={filters.priority}
                                onChange={(e) =>
                                    onFilterChange &&
                                    onFilterChange("priority", e.target.value)
                                }
                                className="w-full text-sm rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">すべて</option>
                                <option value="urgent">緊急</option>
                                <option value="high">高</option>
                                <option value="medium">中</option>
                                <option value="low">低</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
                                検索
                            </label>
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) =>
                                        onFilterChange &&
                                        onFilterChange(
                                            "search",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="タスク名..."
                                    className="w-full pl-8 text-sm rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
