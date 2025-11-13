import { usePage } from "@inertiajs/react";
// Components
import Dropdown from "@/Components/Layout/Dropdown";

export default function AdminHeader({ sidebarOpen, setSidebarOpen }) {
    const { props } = usePage();
    const admin = props.auth?.admin;

    return (
        <>
            {/* Admin識別バー */}
            <div className="bg-red-600 text-white text-center py-1 text-sm font-medium">
                🔒 管理者モード - Admin Panel
            </div>

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
                                        {admin?.name || 'Unknown'}
                                    </span>
                                </div>
                                
                                {/* 管理者ドロップダウン */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            <span className="sr-only">管理者メニューを開く</span>
                                            <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">
                                                    {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                                                </span>
                                            </div>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <div className="px-4 py-3">
                                            <p className="text-sm">ログイン中</p>
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {admin?.email || 'No email'}
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
        </>
    );
}