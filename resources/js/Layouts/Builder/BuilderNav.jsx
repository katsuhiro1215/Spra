import { Link } from "@inertiajs/react";
import { useState } from "react";
import {
    HomeIcon,
    MagnifyingGlassIcon,
    QuestionMarkCircleIcon,
    Cog6ToothIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function BuilderNav() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        // 検索機能は後で実装
        console.log("Search:", searchQuery);
    };

    return (
        <nav className="bg-gray-900 text-white shadow-lg relative z-50">
            <div className="px-4 py-2 flex items-center justify-between">
                {/* 左側：ロゴとダッシュボードボタン */}
                <div className="flex items-center space-x-4">
                    <ApplicationLogo className="h-8 w-auto fill-current text-white" />
                    <div className="h-6 w-px bg-gray-700"></div>
                    <Link
                        href={route("admin.dashboard")}
                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                        title="ダッシュボードに戻る"
                    >
                        <HomeIcon className="h-5 w-5 mr-2" />
                        ダッシュボード
                    </Link>
                </div>

                {/* 中央：タイトル */}
                <div className="text-center">
                    <h1 className="text-lg font-semibold">
                        ガントチャート ビルダー
                    </h1>
                </div>

                {/* 右側：検索、ヘルプ、設定 */}
                <div className="flex items-center space-x-2">
                    {/* 検索ボタン */}
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="p-2 rounded-md hover:bg-gray-800 transition-colors"
                        title="検索"
                    >
                        <MagnifyingGlassIcon className="h-5 w-5" />
                    </button>

                    {/* ヘルプボタン */}
                    <button
                        className="p-2 rounded-md hover:bg-gray-800 transition-colors"
                        title="ヘルプ"
                    >
                        <QuestionMarkCircleIcon className="h-5 w-5" />
                    </button>

                    {/* 設定ボタン */}
                    <button
                        className="p-2 rounded-md hover:bg-gray-800 transition-colors"
                        title="設定"
                    >
                        <Cog6ToothIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* 検索バー（展開時） */}
            {isSearchOpen && (
                <div className="border-t border-gray-700 px-4 py-3">
                    <form onSubmit={handleSearch} className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="プロジェクト、タスク、ユーザーを検索..."
                            className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery("");
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            )}
        </nav>
    );
}
