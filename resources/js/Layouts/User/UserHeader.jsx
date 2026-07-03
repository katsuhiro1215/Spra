import { usePage, Link } from "@inertiajs/react";
import { useState } from "react";
import {
    MagnifyingGlassIcon,
    BellIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

export default function UserHeader({ sidebarOpen, setSidebarOpen }) {
    const { props } = usePage();
    const user = props.auth?.user;
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // 検索機能は後で実装
    };

    return (
        <>
            {/* トップナビゲーション */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* 左: メニューボタン */}
                        <div className="flex items-center">
                            <button
                                type="button"
                                className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                <span className="sr-only">メニューを開く</span>
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* 中央: 検索バー */}
                        <div className="flex-1 mx-4 max-w-md">
                            <form
                                onSubmit={handleSearchSubmit}
                                className="relative"
                            >
                                <input
                                    type="text"
                                    placeholder="検索..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </form>
                        </div>

                        {/* 右: 通知、ヘルプ */}
                        <div className="flex items-center gap-4">
                            {/* 通知 */}
                            <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors relative">
                                <BellIcon className="h-6 w-6" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* ヘルプ */}
                            {/* <Link
                                href={route("contact.index")}
                                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                                title="Adminへお問い合わせ"
                            >
                                <QuestionMarkCircleIcon className="h-6 w-6" />
                            </Link> */}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
