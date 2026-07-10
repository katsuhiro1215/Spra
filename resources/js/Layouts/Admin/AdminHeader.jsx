import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
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

export default function AdminHeader({ sidebarOpen, setSidebarOpen }) {
    const { props } = usePage();
    const admin = props.auth?.admin;
    const unreadContacts = props.notifications?.unreadContacts || 0;
    const pendingResponses = props.notifications?.pendingResponses || 0;

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
                                        {(unreadContacts > 0 ||
                                            pendingResponses > 0) && (
                                            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold ring-2 ring-white dark:ring-gray-800">
                                                {unreadContacts +
                                                    pendingResponses >
                                                9
                                                    ? "9+"
                                                    : unreadContacts +
                                                      pendingResponses}
                                            </span>
                                        )}
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="80">
                                    <div className="px-4 py-3 border-b dark:border-gray-700">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            通知
                                        </p>
                                    </div>
                                    {unreadContacts > 0 ||
                                    pendingResponses > 0 ? (
                                        <div className="p-3 space-y-2">
                                            {unreadContacts > 0 && (
                                                <a
                                                    href={route(
                                                        "admin.contact.index",
                                                    )}
                                                    className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            未読お問い合わせ
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {unreadContacts}
                                                            件の新しいお問い合わせ
                                                        </p>
                                                    </div>
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-bold">
                                                        {unreadContacts}
                                                    </span>
                                                </a>
                                            )}
                                            {pendingResponses > 0 && (
                                                <a
                                                    href={route(
                                                        "admin.quote-response.index",
                                                    )}
                                                    className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            待機中の見積返信
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {pendingResponses}
                                                            件の見積返信を待機中
                                                        </p>
                                                    </div>
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 text-xs font-bold">
                                                        {pendingResponses}
                                                    </span>
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-3">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                                未読通知はありません
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
