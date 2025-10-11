import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });
    const navItemRefs = useRef([]);

    const handleMouseEnter = (index) => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }
        setHoveredItem(index);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setHoveredItem(null);
        }, 200); // 200ms の遅延
        setHoverTimeout(timeout);
    };

    // クリーンアップ
    useEffect(() => {
        return () => {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }
        };
    }, [hoverTimeout]);

    const navigationItems = [
        {
            name: "ダッシュボード",
            href: "admin.dashboard",
            icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z",
            current: route().current("admin.dashboard"),
            children: [],
        },
        {
            name: "ホームページ管理",
            href: "admin.homepage.pages.index",
            icon: "M12 21V9l-2 2m0 0l-2-2m2 2V3m0 18l2-2m-2 2l2 2m6-6h-3m3 0a3 3 0 01-3 3h-3m3-3a3 3 0 00-3-3h-3m3 3V9a3 3 0 00-3-3h-3",
            current: route().current("admin.homepage.*"),
            children: [
                { name: "ページ管理", href: "admin.homepage.pages.index" },
                {
                    name: "サービスカテゴリ",
                    href: "admin.homepage.services.index",
                },
                { name: "サービス管理", href: "admin.homepage.services.index" },
                { name: "ブログ管理", href: "admin.homepage.blogs.index" },
                {
                    name: "ブログカテゴリ管理",
                    href: "admin.homepage.blogCategories.index",
                },
                { name: "FAQ管理", href: "admin.homepage.faqs.index" },
                { name: "お問い合わせ", href: "admin.homepage.contacts.index" },
                {
                    name: "サイト設定",
                    href: "admin.homepage.site-settings.index",
                },
            ],
        },
        {
            name: "ユーザー管理",
            href: "admin.users.index",
            icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
            current: route().current("admin.users.*"),
            children: [
                { name: "生徒管理", href: "admin.users.index" },
                { name: "保護者管理", href: "admin.users.index" },
                { name: "ユーザー一覧", href: "admin.users.index" },
                { name: "新規ユーザー", href: "admin.users.create" },
                { name: "権限管理", href: "admin.users.index" },
            ],
        },
        {
            name: "メディア管理",
            href: "admin.media.index",
            icon: "M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477M15.999 5.207l-.86-1.214m-.86 13.819l-.86-1.214",
            current: route().current("admin.media.*"),
            children: [
                { name: "メディア一覧", href: "admin.media.index" },
                { name: "ファイルアップロード", href: "admin.media.create" },
                { name: "フォルダ管理", href: "admin.media.index" },
            ],
        },
        {
            name: "コンテンツ管理",
            href: "admin.content.index",
            icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
            current: route().current("admin.content.*"),
            children: [
                { name: "記事管理", href: "admin.users.index" },
                { name: "カテゴリ", href: "admin.users.index" },
            ],
        },
        {
            name: "設定",
            href: "admin.settings.index",
            icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
            current: route().current("admin.settings.*"),
            children: [
                { name: "一般設定", href: "admin.users.index" },
                { name: "セキュリティ", href: "admin.users.index" },
                { name: "システム", href: "admin.users.index" },
            ],
        },
    ];

    return (
        <>
            {/* モバイル用サイドバーオーバーレイ */}
            {sidebarOpen && (
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
                                <span className="sr-only">
                                    サイドバーを閉じる
                                </span>
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
                                        className={`group flex flex-col items-center px-2 py-3 text-xs font-medium rounded-md transition-colors ${
                                            item.current
                                                ? "bg-gray-900 text-white"
                                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                        }`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <svg
                                            className={`h-6 w-6 mb-1 ${
                                                item.current
                                                    ? "text-gray-300"
                                                    : "text-gray-400 group-hover:text-gray-300"
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

            {/* デスクトップ用サイドバー */}
            <div className="hidden md:flex md:w-20 md:flex-col fixed inset-y-0 left-0 z-50">
                <div className="flex flex-col flex-grow bg-gray-800">
                    <div className="flex items-center justify-center flex-shrink-0 px-4 py-4 bg-gray-900">
                        <ApplicationLogo className="h-8 w-auto fill-current text-white" />
                    </div>
                    <nav className="mt-5 flex-1 px-2 space-y-1">
                        {navigationItems.map((item, index) => (
                            <div
                                key={item.name}
                                className="relative"
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Link
                                    href={route(item.href)}
                                    className={`group flex flex-col items-center px-2 py-3 text-xs font-medium rounded-md transition-colors relative ${
                                        item.current
                                            ? "bg-gray-900 text-white"
                                            : hoveredItem === index &&
                                              item.children?.length > 0
                                            ? "bg-gray-700 text-white"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                                >
                                    <svg
                                        className={`h-6 w-6 mb-1 ${
                                            item.current
                                                ? "text-gray-300"
                                                : "text-gray-400 group-hover:text-gray-300"
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
                                    <span className="text-center leading-tight">
                                        {item.name}
                                    </span>

                                    {/* サブメニューがある場合のインジケーター */}
                                    {item.children &&
                                        item.children.length > 0 && (
                                            <div className="absolute top-1 right-1">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            </div>
                                        )}
                                </Link>

                                {/* サブメニュー（ホバー時表示） */}
                                {item.children &&
                                    item.children.length > 0 &&
                                    hoveredItem === index && (
                                        <div
                                            className="absolute left-full top-0 ml-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[100] transform transition-all duration-200 ease-out opacity-100 scale-100"
                                            onMouseEnter={() =>
                                                handleMouseEnter(index)
                                            }
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50">
                                                {item.name}
                                            </div>
                                            <div className="py-1">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.name}
                                                        href={route(child.href)}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-l-2 border-transparent hover:border-blue-500"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
}
