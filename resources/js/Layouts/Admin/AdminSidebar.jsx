import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getAdminNavigationItems } from "@/Components/NavItems/AdminNavItems";

const SUBMENU_MARGIN = 12;

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const [submenuStyle, setSubmenuStyle] = useState({});
    const navItemRefs = useRef([]);
    const submenuRef = useRef(null);

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

    // サブメニューが画面下端で切れないように位置を再計算する
    useLayoutEffect(() => {
        if (hoveredItem === null) return;

        const anchorEl = navItemRefs.current[hoveredItem];
        const menuEl = submenuRef.current;
        if (!anchorEl) return;

        const anchorRect = anchorEl.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const menuHeight = menuEl
            ? menuEl.getBoundingClientRect().height
            : 0;
        const availableHeight = viewportHeight - SUBMENU_MARGIN * 2;
        const maxHeight = Math.min(menuHeight || availableHeight, availableHeight);

        // アンカー位置から表示した場合に画面下端をはみ出す量を計算し、
        // はみ出す分だけ上にずらす（それでも入り切らない場合は画面上端に揃える）
        const overflow = anchorRect.top + menuHeight - (viewportHeight - SUBMENU_MARGIN);
        const top =
            overflow > 0
                ? Math.max(SUBMENU_MARGIN, anchorRect.top - overflow)
                : anchorRect.top;

        setSubmenuStyle({ top: `${top}px`, maxHeight: `${maxHeight}px` });
    }, [hoveredItem]);

    const { auth } = usePage().props;
    const isOwnerOrSuperAdmin =
        auth?.admin?.role === "owner" || auth?.admin?.role === "super_admin";

    const navigationItems = getAdminNavigationItems();

    // ナビゲーションアイテムのcurrentを評価
    const evaluatedNavItems = navigationItems.map((item) => {
        let isCurrent = false;

        if (Array.isArray(item.currentPath)) {
            isCurrent = item.currentPath.some((path) => route().current(path));
        } else {
            isCurrent = route().current(item.currentPath);
        }

        return {
            ...item,
            current: isCurrent,
            children: (item.children || []).filter(
                (child) => !child.ownerOnly || isOwnerOrSuperAdmin,
            ),
        };
    });

    return (
        <>
            {/* モバイル用サイドバーオーバーレイ */}
            {sidebarOpen && (
                <div className="fixed inset-0 flex z-40 md:hidden">
                    <div
                        className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-colors"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-900 transition-colors">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900 dark:focus:ring-gray-400 transition-colors"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="sr-only">
                                    サイドバーを閉じる
                                </span>
                                <svg
                                    className="h-6 w-6 text-gray-700 dark:text-white"
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
                                <ApplicationLogo className="h-8 w-auto fill-current text-gray-900 dark:text-white" />
                                <span className="ml-2 text-gray-900 dark:text-white font-semibold text-lg">
                                    Admin Panel
                                </span>
                            </div>
                            <nav className="mt-5 px-2 space-y-1">
                                {evaluatedNavItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={route(item.href)}
                                        className={`group flex flex-col items-center px-2 py-3 text-xs font-medium rounded-md transition-all duration-200 ${
                                            item.current
                                                ? "text-white shadow-lg"
                                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
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
                                                    : "text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
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
            <div className="hidden md:flex md:w-24 md:flex-col fixed inset-y-0 left-0 z-50">
                <div className="flex flex-col flex-grow bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-colors">
                    <div className="flex items-center justify-center flex-shrink-0 px-4 py-4 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors">
                        <ApplicationLogo className="h-8 w-auto fill-current text-gray-900 dark:text-white" />
                    </div>
                    <nav className="mt-5 flex-1 px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-100px)]">
                        {evaluatedNavItems.map((item, index) => (
                            <div
                                key={item.name}
                                className="relative"
                                ref={(el) => (navItemRefs.current[index] = el)}
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
                                              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
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
                                                : "text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
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

                                    {/* 現在選択中のインジケーター */}
                                    {item.current && (
                                        <div className="absolute top-1 right-1">
                                            <div
                                                className="w-2 h-2 rounded-full bg-white"
                                            ></div>
                                        </div>
                                    )}
                                </Link>

                                {/* サブメニュー（ホバー時表示） */}
                                {item.children &&
                                    item.children.length > 0 &&
                                    hoveredItem === index &&
                                    createPortal(
                                        <div
                                            ref={submenuRef}
                                            className="fixed left-24 ml-2 w-56 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 z-[9999] transform transition-all duration-200 ease-out opacity-100 scale-100 overflow-hidden"
                                            onMouseEnter={() =>
                                                handleMouseEnter(index)
                                            }
                                            onMouseLeave={handleMouseLeave}
                                            style={submenuStyle}
                                        >
                                            <div className="flex-shrink-0 px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                                {item.name}
                                            </div>
                                            <div className="py-1 flex-1 min-h-0 overflow-y-auto">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.name}
                                                        href={route(
                                                            child.href,
                                                            child.query,
                                                        )}
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
                                        </div>,
                                        document.body,
                                    )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
}
