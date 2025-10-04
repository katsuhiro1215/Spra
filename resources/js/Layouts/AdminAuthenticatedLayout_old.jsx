import AdminHeader from "@/Layouts/AdminHeader";
import AdminSidebar from "@/Layouts/AdminSidebar";
import AdminFooter from "@/Layouts/AdminFooter";
import { usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AdminAuthenticatedLayout({ header, children }) {
    const { props } = usePage();
    const admin = props.auth?.admin;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // 管理者が認証されていない場合のハンドリング
    if (!admin) {
        console.error('Admin authentication data is missing');
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">認証エラー</h2>
                    <p className="text-gray-600">管理者認証情報が見つかりません。</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            
            {/* サイドバー */}
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* メインコンテンツエリア */}
            <div className="md:pl-20 flex flex-col min-h-screen">
                {/* ページヘッダー */}
                {header && (
                    <header className="bg-white shadow-sm">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* メインコンテンツ */}
                <main className="flex-1 py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>

                {/* フッター */}
                <AdminFooter />
            </div>
        </div>
    );
}
                <div className="fixed inset-0 flex z-40 md:hidden">
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="sr-only">サイドバーを閉じる</span>
                                <svg
                                    className="h-6 w-6 text-white"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            <div className="flex-shrink-0 flex items-center px-4">
                                <ApplicationLogo className="h-8 w-auto fill-current text-white" />
                                <span className="ml-2 text-white font-semibold text-lg">
                                    Admin Panel
                                </span>
                            </div>
                            <nav className="mt-5 px-2 space-y-1">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={route(item.href)}
                                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                                            item.current
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <svg
                                            className={`mr-4 h-6 w-6 flex-shrink-0 ${
                                                item.current
                                                    ? 'text-gray-300'
                                                    : 'text-gray-400 group-hover:text-gray-300'
                                            }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d={item.icon}
                                            />
                                        </svg>
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* サイドバー */}
            <div className="flex">
                <div className="hidden md:flex md:w-64 md:flex-col">
                    <div className="flex flex-col flex-grow bg-gray-800 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4 py-4 bg-gray-900">
                            <ApplicationLogo className="h-8 w-auto fill-current text-white" />
                            <span className="ml-2 text-white font-semibold text-lg">
                                Admin Panel
                            </span>
                        </div>
                        <nav className="mt-5 flex-1 px-2 space-y-1">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={route(item.href)}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                                        item.current
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <svg
                                        className={`mr-3 h-6 w-6 flex-shrink-0 ${
                                            item.current
                                                ? 'text-gray-300'
                                                : 'text-gray-400 group-hover:text-gray-300'
                                        }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d={item.icon}
                                        />
                                    </svg>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* メインコンテンツエリア */}
                <div className="flex flex-col flex-1">
                    {/* トップナビゲーション */}
                    <nav className="bg-white shadow-sm border-b border-gray-200">
                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex items-center">
                                    <button
                                        type="button"
                                        className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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

                                <div className="flex items-center">
                                    {/* 管理者情報 */}
                                    <div className="flex items-center space-x-4">
                                        <div className="hidden sm:block">
                                            <span className="text-sm text-gray-500">ログイン中:</span>
                                            <span className="text-sm font-medium text-gray-900 ml-1">
                                                {admin.name}
                                            </span>
                                        </div>
                                        
                                        {/* 管理者ドロップダウン */}
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <button className="flex items-center text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                    <span className="sr-only">管理者メニューを開く</span>
                                                    <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                                                        <span className="text-white text-sm font-medium">
                                                            {admin.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </button>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <div className="px-4 py-3">
                                                    <p className="text-sm">ログイン中</p>
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {admin.email}
                                                    </p>
                                                </div>
                                                <div className="border-t border-gray-100"></div>
                                                <Dropdown.Link href={route("admin.profile.edit")}>
                                                    プロフィール設定
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route("admin.logout")}
                                                    method="post"
                                                    as="button"
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    ログアウト
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* ページヘッダー */}
                    {header && (
                        <header className="bg-white shadow-sm">
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    {/* メインコンテンツ */}
                    <main className="flex-1 py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
