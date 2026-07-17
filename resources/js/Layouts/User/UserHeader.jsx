import { usePage, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    MagnifyingGlassIcon,
    BellIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Dropdown from "@/Components/Layout/Dropdown";

const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMinutes < 1) return "たった今";
    if (diffMinutes < 60) return `${diffMinutes}分前`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}時間前`;
    return date.toLocaleDateString("ja-JP");
};

export default function UserHeader({ sidebarOpen, setSidebarOpen }) {
    const { props } = usePage();
    const user = props.auth?.user;
    const displayName = user?.profile?.full_name || user?.name || "";
    const unreadCount = props.userNotifications?.unreadCount || 0;
    const notificationItems = props.userNotifications?.items || [];
    const [searchQuery, setSearchQuery] = useState("");

    const handleReadAll = (e) => {
        e.preventDefault();
        router.post(route("user.notifications.read-all"));
    };

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
                            {/* 公開サイトボタン */}
                            <Link
                                href={route("home")}
                                target="_blank"
                                className="ml-4 px-3 py-2 border border-green-400 hover:bg-green-100 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
                            >
                                公開サイト
                            </Link>
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
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors relative">
                                        <BellIcon className="h-6 w-6" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-white text-xs font-bold ring-2 ring-white">
                                                {unreadCount > 9
                                                    ? "9+"
                                                    : unreadCount}
                                            </span>
                                        )}
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="80">
                                    <div className="px-4 py-3 border-b flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-900">
                                            通知
                                        </p>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={handleReadAll}
                                                className="text-xs text-indigo-600 hover:underline"
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
                                                        "user.notifications.read",
                                                        item.id,
                                                    )}
                                                    className={`block px-4 py-3 hover:bg-gray-100 transition-colors border-b last:border-none ${
                                                        item.read_at
                                                            ? ""
                                                            : "bg-sky-50"
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-2">
                                                        {!item.read_at && (
                                                            <span className="mt-1 h-2 w-2 rounded-full bg-sky-500 flex-shrink-0" />
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {
                                                                    item.data
                                                                        .title
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {
                                                                    item.data
                                                                        .message
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-1">
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
                                            <p className="text-sm text-gray-500 text-center py-4">
                                                通知はありません
                                            </p>
                                        </div>
                                    )}
                                </Dropdown.Content>
                            </Dropdown>

                            {/* ヘルプ */}
                            {/* <Link
                                href={route("contact.index")}
                                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                                title="Adminへお問い合わせ"
                            >
                                <QuestionMarkCircleIcon className="h-6 w-6" />
                            </Link> */}

                            {/* ユーザーメニュー */}
                            <div className="flex items-center ml-2 pl-2 border-l border-gray-200">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                            <span className="sr-only">
                                                ユーザーメニューを開く
                                            </span>
                                            {user?.profile?.media ? (
                                                <img
                                                    src={
                                                        user.profile.media.url
                                                    }
                                                    alt={displayName}
                                                    className="h-8 w-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                                    <span className="text-white text-sm font-medium">
                                                        {displayName
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <div className="px-4 py-3">
                                            <p className="text-sm text-gray-600">
                                                ログイン中
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {displayName}
                                            </p>
                                        </div>
                                        <div className="border-t border-gray-100"></div>
                                        <Dropdown.Link
                                            href={route("user.profile.edit")}
                                        >
                                            プロフィール
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("user.settings.index")}
                                        >
                                            設定
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("user.logout")}
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
        </>
    );
}
