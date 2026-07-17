import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getUserNavigationItems } from "@/Components/NavItems/UserNavItems";

export default function UserSidebar({ sidebarOpen, setSidebarOpen }) {
    const { props } = usePage();
    const user = props.auth?.user;

    const navigationItems = getUserNavigationItems();

    return (
        <>
            {/* デスクトップ用サイドバー */}
            <div className="hidden md:flex md:w-64 md:flex-col md:bg-white md:shadow-lg md:fixed md:left-0 md:h-screen md:overflow-y-auto">
                <div className="flex flex-col flex-1 min-h-0 bg-white">
                    {/* ロゴ + 名前 */}
                    <div className="flex items-center h-16 px-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-blue-600">
                        <ApplicationLogo className="h-8 w-8 text-white mr-3" />
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-white">
                                Smart Sprouts
                            </span>
                            <span className="text-xs text-green-100">
                                管理画面
                            </span>
                        </div>
                    </div>

                    {/* ナビゲーション */}
                    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                href={route(item.href)}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    item.current
                                        ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <svg
                                    className="h-5 w-5 mr-3"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d={item.icon} />
                                </svg>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* ユーザーメニュー */}
                    <div className="flex-shrink-0 border-t border-gray-200 p-4 space-y-2">
                        <Link
                            href={route("user.settings.index")}
                            className="flex items-center px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                            <svg
                                className="h-5 w-5 mr-3"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94a6.059 6.059 0 001.362 2.716c.44.577.92.1.92.1.881-.41 1.878-.645 2.921-.645.493 0 .974.055 1.441.163.54.097.972.541.972 1.09v2.6c0 .55-.432.993-.972 1.09a6.058 6.058 0 00-1.441.163c-.343.04-.78-.063-1.201.289-.596.607-1.089 1.329-1.363 2.716.09.542-.56.94-1.11.94h-2.592a1.111 1.111 0 01-1.11-.94 6.059 6.059 0 00-1.362-2.716c-.44-.577-.92-.1-.92-.1-.881.41-1.878.645-2.921.645-.493 0-.974-.055-1.441-.163-.54-.097-.972-.541-.972-1.09v-2.6c0-.55.432-.993.972-1.09a6.058 6.058 0 001.441-.163c.343-.04.78.063 1.201-.289.596-.607 1.089-1.329 1.363-2.716zM12 15a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            設定
                        </Link>
                        <Link
                            href={route("user.logout")}
                            method="post"
                            as="button"
                            className="w-full flex items-center px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                        >
                            <svg
                                className="h-5 w-5 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            ログアウト
                        </Link>
                    </div>
                </div>
            </div>

            {/* モバイル用ハンバーガーメニュー */}
            {sidebarOpen && (
                <>
                    {createPortal(
                        <div
                            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />,
                        document.body,
                    )}
                    <div className="fixed left-0 top-16 z-50 w-64 h-full bg-white shadow-lg md:hidden overflow-y-auto">
                        {/* ロゴ + 名前 + 閉じるボタン */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center space-x-2">
                                <ApplicationLogo />
                                <span className="text-sm font-semibold text-gray-900">
                                    Spra
                                </span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1 rounded-md text-gray-500 hover:text-gray-700"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        {/* ナビゲーション */}
                        <nav className="px-2 py-3 space-y-1">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={route(item.href)}
                                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        item.current
                                            ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <svg
                                        className="h-5 w-5 mr-3"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d={item.icon} />
                                    </svg>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* ユーザーメニュー */}
                        <div className="border-t border-gray-200 p-3 space-y-2">
                            <Link
                                href={route("user.settings.index")}
                                className="flex items-center px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <svg
                                    className="h-5 w-5 mr-3"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94a6.059 6.059 0 001.362 2.716c.44.577.92.1.92.1.881-.41 1.878-.645 2.921-.645.493 0 .974.055 1.441.163.54.097.972.541.972 1.09v2.6c0 .55-.432.993-.972 1.09a6.058 6.058 0 00-1.441.163c-.343.04-.78-.063-1.201.289-.596.607-1.089 1.329-1.363 2.716.09.542-.56.94-1.11.94h-2.592a1.111 1.111 0 01-1.11-.94 6.059 6.059 0 00-1.362-2.716c-.44-.577-.92-.1-.92-.1-.881.41-1.878.645-2.921.645-.493 0-.974-.055-1.441-.163-.54-.097-.972-.541-.972-1.09v-2.6c0-.55.432-.993.972-1.09a6.058 6.058 0 001.441-.163c.343-.04.78.063 1.201-.289.596-.607 1.089-1.329 1.363-2.716zM12 15a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                設定
                            </Link>
                            <Link
                                href={route("user.logout")}
                                method="post"
                                as="button"
                                className="w-full flex items-center px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <svg
                                    className="h-5 w-5 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                ログアウト
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
