import { useState } from "react";
import {
    ChevronDownIcon,
    CalendarIcon,
    RectangleStackIcon,
} from "@heroicons/react/24/outline";

export default function BuilderHeader() {
    const [activeTab, setActiveTab] = useState("project");

    const tabs = [
        { id: "project", label: "プロジェクト", icon: RectangleStackIcon },
        { id: "schedule", label: "スケジュール", icon: CalendarIcon },
        { id: "master", label: "マスタ情報", icon: RectangleStackIcon },
    ];

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm relative z-40">
            <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* タブメニュー */}
                    <div className="flex items-center space-x-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {tab.label}
                                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                                </button>
                            );
                        })}
                    </div>

                    {/* 右側：追加のアクション */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                            プロジェクト:{" "}
                            <span className="font-medium text-gray-700">
                                サンプルプロジェクト
                            </span>
                        </span>
                    </div>
                </div>

                {/* タブコンテンツプレビュー（今後拡張可能） */}
                {activeTab === "project" && (
                    <div className="mt-3 text-sm text-gray-500">
                        プロジェクト関連の機能は近日実装予定
                    </div>
                )}
                {activeTab === "schedule" && (
                    <div className="mt-3 text-sm text-gray-500">
                        スケジュール管理機能は近日実装予定
                    </div>
                )}
                {activeTab === "master" && (
                    <div className="mt-3 text-sm text-gray-500">
                        マスタ情報管理機能は近日実装予定
                    </div>
                )}
            </div>
        </header>
    );
}
