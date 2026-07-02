import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    HomeIcon,
    DocumentTextIcon,
    CogIcon,
    ChartBarIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
    ArrowRightOnRectangleIcon,
    CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isPending = user.status === "pending";

    // サイドバーのナビゲーション項目
    let navigation = [
        {
            name: "ダッシュボード",
            href: route("user.dashboard"),
            icon: HomeIcon,
            current: route().current("user.dashboard"),
        },
        {
            name: "プロジェクト",
            href: "/user/projects",
            icon: DocumentTextIcon,
            current: false,
        },
        {
            name: "契約管理",
            href: route("user.contract.index"),
            icon: ChartBarIcon,
            current: route().current("user.contract.index"),
        },
        {
            name: "進捗状況",
            href: "/user/progress",
            icon: ChartBarIcon,
            current: false,
        },
        {
            name: "予約設定",
            href: "/user/reservation-settings",
            icon: CalendarDaysIcon,
            current: false,
        },
        {
            name: "設定",
            href: route("user.profile.edit"),
            icon: CogIcon,
            current: route().current("user.profile.edit"),
        },
    ];

    // Pending ユーザーはダッシュボードと設定のみアクセス可能
    if (isPending) {
        navigation = navigation.filter(
            (item) =>
                item.current === route().current("user.dashboard") ||
                route().current("user.profile.edit") ||
                item.name === "ダッシュボード" ||
                item.name === "設定",
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* モバイル用サイドバー */}
            <div
                className={`fixed inset-0 z-40 lg:hidden ${
                    sidebarOpen ? "" : "pointer-events-none"
                }`}
            >
                <div
                    className={`fixed inset-0 bg-gray-600 transition-opacity duration-300 ${
                        sidebarOpen ? "opacity-75" : "opacity-0"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                />

                <div
                    className={`relative flex w-full max-w-xs flex-1 flex-col bg-white transition-transform duration-300 ${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div
                        className={`absolute top-0 right-0 -mr-12 pt-2 transition-opacity duration-300 ${
                            sidebarOpen ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            <XMarkIcon className="h-6 w-6 text-white" />
                        </button>
                    </div>

                    {/* モバイルサイドバーコンテンツ */}
                    <div className="flex flex-shrink-0 items-center px-4 py-4 border-b border-gray-200">
                        <ApplicationLogo className="h-8 w-8 text-green-600 mr-3" />
                        <span className="text-xl font-bold text-gray-900">
                            Smart Sprouts
                        </span>
                    </div>
                    <div className="mt-5 h-0 flex-1 overflow-y-auto">
                        <nav className="px-2 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                        item.current
                                            ? "bg-green-100 text-green-900"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 ${
                                            item.current
                                                ? "text-green-500"
                                                : "text-gray-400 group-hover:text-gray-500"
                                        }`}
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* デスクトップ用サイドバー */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
                    {/* ロゴ・ブランディング */}
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

                    {/* ユーザー情報 */}
                    <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                                    <UserIcon className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ナビゲーション */}
                    <nav className="mt-5 flex-1 px-2 pb-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    item.current
                                        ? "bg-green-100 text-green-900 border-r-2 border-green-500"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 ${
                                        item.current
                                            ? "text-green-500"
                                            : "text-gray-400 group-hover:text-gray-500"
                                    }`}
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* ログアウトボタン */}
                    <div className="px-2 pb-4">
                        <Link
                            href={route("user.logout")}
                            method="post"
                            as="button"
                            className="group flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                        >
                            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500" />
                            ログアウト
                        </Link>
                    </div>
                </div>
            </div>

            {/* メインコンテンツエリア */}
            <div className="lg:pl-64">
                {/* トップバー */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </div>

                {/* デスクトップ用トップバー */}
                <div className="hidden lg:block bg-white border-b border-gray-200 px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            {header && (
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {header}
                                </h1>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* 通知アイコン */}
                            <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-full">
                                <BellIcon className="h-6 w-6" />
                            </button>

                            {/* 公開サイトへのリンク */}
                            <Link
                                href="/"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                            >
                                公開サイトを見る
                            </Link>
                        </div>
                    </div>
                </div>

                {/* メインコンテンツ */}
                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
