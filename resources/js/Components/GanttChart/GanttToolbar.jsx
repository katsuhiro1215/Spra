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
}) {
    const viewModes = [
        { value: "day", label: "日" },
        { value: "week", label: "週" },
        { value: "month", label: "月" },
        { value: "quarter", label: "四半期" },
    ];

    return (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
                {/* 左側：アクションボタン */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onAddTask}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        タスク追加
                    </button>

                    <button
                        onClick={onToggleFilter}
                        className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            showFilter
                                ? "border-blue-500 text-blue-700 bg-blue-50"
                                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                    >
                        <FunnelIcon className="h-4 w-4 mr-2" />
                        フィルター
                    </button>
                </div>

                {/* 中央：表示モード切替 */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-1">
                    {viewModes.map((mode) => (
                        <button
                            key={mode.value}
                            onClick={() => onViewModeChange(mode.value)}
                            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                                viewMode === mode.value
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            {mode.label}
                        </button>
                    ))}
                </div>

                {/* 右側：ズームとその他 */}
                <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-gray-100 rounded-md">
                        <button
                            onClick={onZoomOut}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-l-md transition-colors"
                            title="ズームアウト"
                        >
                            <ArrowsPointingInIcon className="h-4 w-4" />
                        </button>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <button
                            onClick={onZoomIn}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-r-md transition-colors"
                            title="ズームイン"
                        >
                            <ArrowsPointingOutIcon className="h-4 w-4" />
                        </button>
                    </div>

                    <button
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="今日へ移動"
                    >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        今日
                    </button>
                </div>
            </div>

            {/* フィルターパネル */}
            {showFilter && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-4 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                ステータス
                            </label>
                            <select className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                <option value="">すべて</option>
                                <option value="not_started">未着手</option>
                                <option value="in_progress">進行中</option>
                                <option value="completed">完了</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                担当者
                            </label>
                            <select className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                <option value="">すべて</option>
                                <option value="user1">山田太郎</option>
                                <option value="user2">佐藤花子</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                優先度
                            </label>
                            <select className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                <option value="">すべて</option>
                                <option value="high">高</option>
                                <option value="medium">中</option>
                                <option value="low">低</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                検索
                            </label>
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="タスク名..."
                                    className="w-full pl-8 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
