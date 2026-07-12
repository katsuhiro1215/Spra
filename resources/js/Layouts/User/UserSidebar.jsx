import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function UserSidebar({ sidebarOpen, setSidebarOpen }) {
    const { props } = usePage();
    const user = props.auth?.user;

    const navigationItems = [
        {
            name: "ダッシュボード",
            href: "user.dashboard",
            icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
            current: route().current("user.dashboard"),
        },
        {
            name: "見積書",
            href: "user.quote.index",
            icon: "M12 7.5h1.386c.361 0 .951-.646.951-1.646V4.854c0-1-1.395-2.854-1.395-2.854H8.5c-1.5 0-3 1.5-3 3v2.25m9-13.5h2.25A2.25 2.25 0 0121 4.5v15A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V4.5A2.25 2.25 0 015.25 2.25z",
            current: route().current("user.quote.*"),
        },
        {
            name: "契約書",
            href: "user.contract.index",
            icon: "M9 12h3.75M9 15h3.75M9 18h3.75m6-11.25a6 6 0 11-12 0 6 6 0 0112 0zM3.75 7.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z",
            current: route().current("user.contract.*"),
        },
        {
            name: "請求書",
            href: "user.invoice.index",
            icon: "M12 7.5h1.386c.361 0 .951-.646.951-1.646V4.854c0-1-1.395-2.854-1.395-2.854H8.5c-1.5 0-3 1.5-3 3v2.25m9-13.5h2.25A2.25 2.25 0 0121 4.5v15A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V4.5A2.25 2.25 0 015.25 2.25z",
            current: route().current("user.invoice.*"),
        },
        {
            name: "領収書",
            href: "user.receipt.index",
            icon: "M12 7.5h1.386c.361 0 .951-.646.951-1.646V4.854c0-1-1.395-2.854-1.395-2.854H8.5c-1.5 0-3 1.5-3 3v2.25m9-13.5h2.25A2.25 2.25 0 0121 4.5v15A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V4.5A2.25 2.25 0 015.25 2.25z",
            current: route().current("user.receipt.*"),
        },
        {
            name: "進捗状況",
            href: "user.progress.index",
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            current: route().current("user.progress.*"),
        },
        {
            name: "予約",
            href: "user.appointments.index",
            icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
            current: route().current("user.appointments.*"),
        },
        {
            name: "プロジェクト",
            href: "user.projects.index",
            icon: "M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122",
            current: route().current("user.projects.*"),
        },
        {
            name: "プロフィール",
            href: "user.profile.edit",
            icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
            current: route().current("user.profile.*"),
        },
        {
            name: "設定",
            href: "user.settings.index",
            icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94a6.059 6.059 0 001.362 2.716c.44.577.92.1.92.1.881-.41 1.878-.645 2.921-.645.493 0 .974.055 1.441.163.54.097.972.541.972 1.09v2.6c0 .55-.432.993-.972 1.09a6.058 6.058 0 00-1.441.163c-.343.04-.78-.063-1.201.289-.596.607-1.089 1.329-1.363 2.716.09.542-.56.94-1.11.94h-2.592a1.111 1.111 0 01-1.11-.94 6.059 6.059 0 00-1.362-2.716c-.44-.577-.92-.1-.92-.1-.881.41-1.878.645-2.921.645-.493 0-.974-.055-1.441-.163-.54-.097-.972-.541-.972-1.09v-2.6c0-.55.432-.993.972-1.09a6.058 6.058 0 001.441-.163c.343-.04.78.063 1.201-.289.596-.607 1.089-1.329 1.363-2.716zM12 15a3 3 0 11-6 0 3 3 0 016 0z",
            current: route().current("user.settings.*"),
        },
    ];

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
                        <div className="flex items-center px-4 py-2 text-sm text-gray-600">
                            <svg
                                className="h-5 w-5 mr-3"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
                                <path d="M9 15a6 6 0 1112 0H9z" />
                            </svg>
                            <span className="truncate">{user?.name}</span>
                        </div>
                        <Link
                            href={route("user.profile.edit")}
                            className="flex items-center px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
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
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            プロフィール
                        </Link>
                        <form
                            method="POST"
                            action={route("user.logout")}
                            className="block"
                        >
                            <button
                                type="submit"
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
                            </button>
                        </form>
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
                            <div className="flex items-center px-4 py-2 text-sm text-gray-600">
                                <svg
                                    className="h-5 w-5 mr-3"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
                                    <path d="M9 15a6 6 0 1112 0H9z" />
                                </svg>
                                <span className="truncate">{user?.name}</span>
                            </div>
                            <Link
                                href={route("user.profile.edit")}
                                className="flex items-center px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
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
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                プロフィール
                            </Link>
                            <form
                                method="POST"
                                action={route("user.logout")}
                                className="block"
                            >
                                <button
                                    type="submit"
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
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
