import React, { useState } from "react";
import {
    ClockIcon,
    ExclamationTriangleIcon,
    SparklesIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";

const TABS = [
    {
        key: "activity",
        label: "操作ログ",
        icon: <ClockIcon className="h-5 w-5" />,
    },
    {
        key: "event",
        label: "イベント",
        icon: <SparklesIcon className="h-5 w-5" />,
    },
    {
        key: "warning",
        label: "警告",
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
    },
];

export default function SidebarLogs({ logs = {}, moreUrl = "/admin/logs" }) {
    const [activeTab, setActiveTab] = useState("activity");

    const tabLogs = logs[activeTab] || [];

    return (
        <aside className="w-80 min-w-[20rem] bg-white border-l border-gray-200 h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-lg font-bold text-gray-900">最新ログ</h3>
                <Link
                    href={moreUrl}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                    もっと見る <ArrowRightIcon className="h-4 w-4" />
                </Link>
            </div>
            <div className="flex gap-2 px-4 py-2 border-b bg-gray-50">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            activeTab === tab.key
                                ? "bg-blue-100 text-blue-700"
                                : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2">
                {tabLogs.length === 0 ? (
                    <div className="text-gray-400 text-sm py-8 text-center">
                        ログはありません
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {tabLogs.slice(0, 10).map((log) => (
                            <li
                                key={log.id}
                                className="border-b last:border-none pb-2"
                            >
                                <div className="flex items-center gap-2">
                                    {activeTab === "activity" && (
                                        <ClockIcon className="h-4 w-4 text-blue-400" />
                                    )}
                                    {activeTab === "event" && (
                                        <SparklesIcon className="h-4 w-4 text-purple-400" />
                                    )}
                                    {activeTab === "warning" && (
                                        <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                                    )}
                                    <span className="text-sm font-medium text-gray-800">
                                        {log.description ||
                                            log.action_name ||
                                            log.type_name}
                                    </span>
                                    <span
                                        className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                                            log.status_color
                                                ? `bg-${log.status_color}-100 text-${log.status_color}-700`
                                                : "bg-gray-100 text-gray-500"
                                        }`}
                                    >
                                        {log.status_name ||
                                            log.status ||
                                            log.type_name}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 flex gap-2">
                                    <span>
                                        {log.performed_at
                                            ? log.performed_at
                                            : log.logged_in_at}
                                    </span>
                                    {log.ip_address && (
                                        <span>IP: {log.ip_address}</span>
                                    )}
                                    {log.user_name && (
                                        <span>by {log.user_name}</span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </aside>
    );
}
