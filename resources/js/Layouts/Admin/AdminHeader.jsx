import { useState, useEffect } from "react";
import { usePage, Link, router } from "@inertiajs/react";
// Components
import Dropdown from "@/Components/Layout/Dropdown";
// Icons
import {
    BellIcon,
    MoonIcon,
    SunIcon,
    SwatchIcon,
    DocumentTextIcon,
} from "@heroicons/react/24/outline";

const NOTIFICATION_DOT_CLASSES = {
    sky: "bg-sky-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    gray: "bg-gray-400",
};

const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMinutes < 1) return "たった今";
    if (diffMinutes < 60) return `${diffMinutes}分前`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}時間前`;
    return date.toLocaleDateString("ja-JP");
};

export default function AdminHeader({ sidebarOpen, setSidebarOpen }) {
    const { props } = usePage();
    const admin = props.auth?.admin;
    const unreadCount = props.adminNotifications?.unreadCount || 0;
    const notificationItems = props.adminNotifications?.items || [];

    const handleReadAll = (e) => {
        e.preventDefault();
        router.post(route("admin.notifications.read-all"));
    };

    // デバッグ: admin データを確認
    useEffect(() => {
        console.log("Admin data:", admin);
        console.log("Admin profile:", admin?.profile);
    }, [admin]);

    // ダークモード状態管理
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("admin-dark-mode");
            if (saved !== null) {
                return JSON.parse(saved);
            }
            // デフォルトはライトモード
            return false;
        }
        return false;
    });

    // カラーテーマ状態管理
    const [colorTheme, setColorTheme] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("admin-color-theme") || "indigo";
        }
        return "indigo";
    });

    // 初回レンダリング時にダークモードの状態を確実に適用
    useEffect(() => {
        const htmlElement = document.documentElement;
        console.log("Dark mode state changed:", isDarkMode);
        console.log("HTML classes before:", htmlElement.classList.toString());

        if (isDarkMode) {
            htmlElement.classList.add("dark");
        } else {
            htmlElement.classList.remove("dark");
        }

        console.log("HTML classes after:", htmlElement.classList.toString());
        localStorage.setItem("admin-dark-mode", JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    // カラーテーマ適用
    useEffect(() => {
        localStorage.setItem("admin-color-theme", colorTheme);
        // テーマカラーをCSSカスタムプロパティとして設定
        const root = document.documentElement;
        const themeColors = {
            indigo: { primary: "#4f46e5", hover: "#4338ca" },
            blue: { primary: "#2563eb", hover: "#1d4ed8" },
            purple: { primary: "#9333ea", hover: "#7e22ce" },
            pink: { primary: "#ec4899", hover: "#db2777" },
            green: { primary: "#10b981", hover: "#059669" },
        };
        const colors = themeColors[colorTheme] || themeColors.indigo;
        root.style.setProperty("--color-primary", colors.primary);
        root.style.setProperty("--color-primary-hover", colors.hover);
    }, [colorTheme]);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const newValue = !prev;
            console.log("Toggling dark mode:", prev, "->", newValue);
            return newValue;
        });
    };

    // 管理者の名前を取得
    const getFullName = (adminUser) => {
        return adminUser?.profile
            ? `${adminUser.profile.last_name} ${adminUser.profile.first_name}`
            : "Unknown";
    };

    const themes = [
        { name: "Indigo", value: "indigo", color: "bg-indigo-600" },
        { name: "Blue", value: "blue", color: "bg-blue-600" },
        { name: "Purple", value: "purple", color: "bg-purple-600" },
        { name: "Pink", value: "pink", color: "bg-pink-600" },
        { name: "Green", value: "green", color: "bg-green-600" },
    ];

    return (
        <>
            {/* Admin識別バー */}
            <div className="bg-red-600 text-white text-center py-1 text-sm font-medium">
                🔒 管理者モード - Admin Panel
            </div>

            {/* トップナビゲーション */}
            <nav className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <button
                                type="button"
                                className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
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
                            {/* カラーテーマ切替 */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
                                        <SwatchIcon className="h-6 w-6" />
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="48">
                                    <div className="px-4 py-3 border-b dark:border-gray-700">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            カラーテーマ
                                        </p>
                                    </div>
                                    <div className="p-3 space-y-2">
                                        {themes.map((theme) => (
                                            <button
                                                key={theme.value}
                                                onClick={() =>
                                                    setColorTheme(theme.value)
                                                }
                                                className={`w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                                    colorTheme === theme.value
                                                        ? "bg-gray-100 dark:bg-gray-700"
                                                        : ""
                                                }`}
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded-full ${theme.color} mr-3`}
                                                ></div>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {theme.name}
                                                </span>
                                                {colorTheme === theme.value && (
                                                    <span
                                                        className="ml-auto font-bold"
                                                        style={{
                                                            color: "var(--color-primary)",
                                                        }}
                                                    >
                                                        ✓
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>

                            {/* ログメニュー */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
                                        <DocumentTextIcon className="h-6 w-6" />
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="64">
                                    <div className="px-4 py-3 border-b dark:border-gray-700">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            システムログ
                                        </p>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                            ログ機能は近日実装予定です
                                        </p>
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>

                            {/* ダークモード切替 */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                            >
                                {isDarkMode ? (
                                    <SunIcon className="h-6 w-6" />
                                ) : (
                                    <MoonIcon className="h-6 w-6" />
                                )}
                            </button>

                            {/* 通知アイコン */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="relative p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
                                        <BellIcon className="h-6 w-6" />
                                        {/* 通知バッジ（未読件数） */}
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-white text-xs font-bold ring-2 ring-white dark:ring-gray-800">
                                                {unreadCount > 9
                                                    ? "9+"
                                                    : unreadCount}
                                            </span>
                                        )}
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="80">
                                    <div className="px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            通知
                                        </p>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={handleReadAll}
                                                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                            >
                                                すべて既読にする
                                            </button>
                                        )}
                                    </div>
                                    {notificationItems.length > 0 ? (
                                        <div className="max-h-96 overflow-y-auto">
                                            {notificationItems.map((item) => (
                                                <Link
                                                    key={item.id}
                                                    href={route(
                                                        "admin.notifications.read",
                                                        item.id,
                                                    )}
                                                    className={`block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700 last:border-none ${
                                                        item.read_at
                                                            ? ""
                                                            : "bg-sky-50 dark:bg-sky-900/10"
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-2">
                                                        {!item.read_at && (
                                                            <span
                                                                className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                                                                    NOTIFICATION_DOT_CLASSES[
                                                                        item
                                                                            .data
                                                                            .color
                                                                    ] ||
                                                                    NOTIFICATION_DOT_CLASSES.gray
                                                                }`}
                                                            />
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {
                                                                    item.data
                                                                        .title
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {
                                                                    item.data
                                                                        .message
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                                {formatRelativeTime(
                                                                    item.created_at,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-3">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                                通知はありません
                                            </p>
                                        </div>
                                    )}
                                </Dropdown.Content>
                            </Dropdown>

                            {/* 管理者情報 */}
                            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                                <div className="hidden sm:block">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        ログイン中:
                                    </span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 ml-1">
                                        {getFullName(admin)}
                                    </span>
                                </div>

                                {/* 管理者ドロップダウン */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center text-sm rounded-full bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                            <span className="sr-only">
                                                管理者メニューを開く
                                            </span>
                                            <div className="h-8 w-8 rounded-full bg-gray-800 dark:bg-gray-600 flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">
                                                    {getFullName(admin)
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <div className="px-4 py-3">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                ログイン中
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {admin?.email || "No email"}
                                            </p>
                                        </div>
                                        <div className="border-t border-gray-100 dark:border-gray-700"></div>
                                        <Dropdown.Link
                                            href={route("admin.profile.edit")}
                                        >
                                            プロフィール設定
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("admin.security.edit")}
                                        >
                                            セキュリティ設定
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("admin.logout")}
                                            method="post"
                                            as="button"
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
        </>
    );
}
