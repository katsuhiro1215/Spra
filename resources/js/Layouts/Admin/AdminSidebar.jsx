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
        // ダッシュボード
        {
            name: "ダッシュボード",
            href: "admin.dashboard",
            icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
            current: route().current("admin.dashboard"),
            children: [],
        },
        // 営業管理（ビジネスフローの開始）
        {
            name: "営業管理",
            href: "admin.contact.index",
            icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155",
            current:
                route().current("admin.contact.*") ||
                route().current("admin.quote.*") ||
                route().current("admin.contract.*"),
            children: [
                { name: "お問い合わせ一覧", href: "admin.contact.index" },
                { name: "見積管理", href: "admin.quote.index" },
                { name: "契約管理", href: "admin.contract.index" },
            ],
        },
        // 請求管理（ビジネスフローの中盤）
        {
            name: "請求管理",
            href: "admin.invoice.index",
            icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
            current:
                route().current("admin.invoice.*") ||
                route().current("admin.payment.*"),
            children: [
                { name: "請求書一覧", href: "admin.invoice.index" },
                { name: "請求書作成", href: "admin.invoice.create" },
                { name: "支払い管理", href: "admin.payment.index" },
                { name: "期限超過請求", href: "admin.invoice.overdue" },
            ],
        },
        // プロジェクト管理（契約後の実行フェーズ）
        {
            name: "プロジェクト管理",
            href: "admin.project.index",
            icon: "M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122",
            current: route().current("admin.project.*"),
            children: [
                { name: "プロジェクト一覧", href: "admin.project.index" },
                { name: "新規プロジェクト", href: "admin.project.create" },
                { name: "ガンチャート", href: "admin.gantt.index" },
            ],
        },
        // 顧客管理
        {
            name: "顧客管理",
            href: "admin.user.index",
            icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
            current:
                route().current("admin.user.*") ||
                route().current("admin.company.*"),
            children: [
                { name: "ユーザー一覧", href: "admin.user.index" },
                { name: "新規ユーザー", href: "admin.user.create" },
                { name: "会社一覧", href: "admin.company.index" },
                { name: "新規会社", href: "admin.company.create" },
            ],
        },
        // サービス管理
        {
            name: "サービス管理",
            href: "admin.service.index",
            icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
            current: route().current("admin.service.*"),
            children: [
                { name: "サービス一覧", href: "admin.service.index" },
                { name: "新規サービス", href: "admin.service.create" },
                {
                    name: "カテゴリ管理",
                    href: "admin.service.category.index",
                },
            ],
        },
        // コンテンツ管理
        {
            name: "コンテンツ管理",
            href: "admin.homepage.pages.index",
            icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
            current:
                route().current("admin.homepage.*") ||
                route().current("admin.faq.*") ||
                route().current("admin.media.*"),
            children: [
                { name: "ページ管理", href: "admin.homepage.pages.index" },
                { name: "ブログ管理", href: "admin.homepage.blogs.index" },
                {
                    name: "ブログカテゴリ",
                    href: "admin.homepage.blogCategories.index",
                },
                { name: "FAQ管理", href: "admin.faq.index" },
                { name: "メディア管理", href: "admin.media.index" },
                {
                    name: "サイト設定",
                    href: "admin.homepage.site-settings.index",
                },
            ],
        },
        // システム管理
        {
            name: "システム管理",
            href: "admin.admin.index",
            icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
            current:
                route().current("admin.admin.*") ||
                route().current("admin.systemSetting.*"),
            children: [
                { name: "管理者一覧", href: "admin.admin.index" },
                { name: "新規管理者", href: "admin.admin.create" },
                { name: "システム設定", href: "admin.systemSetting.index" },
            ],
        },
    ];

    return (
        <>
            {/* モバイル用サイドバーオーバーレイ */}
            {sidebarOpen && (
                <div className="fixed inset-0 flex z-40 md:hidden">
                    <div
                        className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-colors"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800 dark:bg-gray-900 transition-colors">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:focus:ring-gray-400 transition-colors"
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
                                        className={`group flex flex-col items-center px-2 py-3 text-xs font-medium rounded-md transition-all duration-200 ${
                                            item.current
                                                ? "text-white shadow-lg"
                                                : "text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white"
                                        }`}
                                        style={
                                            item.current
                                                ? {
                                                      backgroundColor:
                                                          "var(--color-primary)",
                                                  }
                                                : {}
                                        }
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <svg
                                            className={`h-6 w-6 mb-1 ${
                                                item.current
                                                    ? "text-white"
                                                    : "text-gray-400 dark:text-gray-500 group-hover:text-gray-300 dark:group-hover:text-gray-400"
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
                <div className="flex flex-col flex-grow bg-gray-800 dark:bg-gray-900 transition-colors">
                    <div className="flex items-center justify-center flex-shrink-0 px-4 py-4 bg-gray-900 dark:bg-gray-950 transition-colors">
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
                                    className={`group flex flex-col items-center px-2 py-3 text-xs font-medium rounded-md transition-all duration-200 relative ${
                                        item.current
                                            ? "text-white shadow-lg"
                                            : hoveredItem === index &&
                                                item.children?.length > 0
                                              ? "bg-gray-700 dark:bg-gray-800 text-white"
                                              : "text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white"
                                    }`}
                                    style={
                                        item.current
                                            ? {
                                                  backgroundColor:
                                                      "var(--color-primary)",
                                              }
                                            : {}
                                    }
                                >
                                    <svg
                                        className={`h-6 w-6 mb-1 ${
                                            item.current
                                                ? "text-white"
                                                : "text-gray-400 dark:text-gray-500 group-hover:text-gray-300 dark:group-hover:text-gray-400"
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
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            "var(--color-primary)",
                                                    }}
                                                ></div>
                                            </div>
                                        )}
                                </Link>

                                {/* サブメニュー（ホバー時表示） */}
                                {item.children &&
                                    item.children.length > 0 &&
                                    hoveredItem === index && (
                                        <div
                                            className="absolute left-full top-0 ml-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 py-2 z-[100] transform transition-all duration-200 ease-out opacity-100 scale-100"
                                            onMouseEnter={() =>
                                                handleMouseEnter(index)
                                            }
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                                {item.name}
                                            </div>
                                            <div className="py-1">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.name}
                                                        href={route(child.href)}
                                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l-2 border-transparent"
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.borderLeftColor =
                                                                "var(--color-primary)";
                                                            e.currentTarget.style.color =
                                                                "var(--color-primary)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.borderLeftColor =
                                                                "transparent";
                                                            e.currentTarget.style.color =
                                                                "";
                                                        }}
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
