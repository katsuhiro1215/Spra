import { useState } from "react";
import { usePage } from "@inertiajs/react";
import AdminHeader from "@/Layouts/Admin/AdminHeader";
import AdminSidebar from "@/Layouts/Admin/AdminSidebar";
import AdminFooter from "@/Layouts/Admin/AdminFooter";

export default function AdminAuthenticatedLayout({ header, children }) {
    const { props } = usePage();
    const admin = props.auth?.admin;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // 管理者が認証されていない場合のハンドリング
    if (!admin) {
        console.error("Admin authentication data is missing");
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center transition-colors">
                <div className="text-center">
                    <div className="text-red-600 dark:text-red-400 text-6xl mb-4">
                        ⚠️
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        認証エラー
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        管理者認証情報が見つかりません。
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors relative">
            {/* サイドバー - 最前面に配置 */}
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* メインコンテンツエリア全体 */}
            <div className="md:ml-24 relative z-10">
                {/* ヘッダー */}
                <AdminHeader
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* コンテンツエリア */}
                <div className="flex flex-col min-h-screen">
                    {/* ページヘッダー */}
                    {header}

                    {/* メインコンテンツ */}
                    <main className="flex-1 p-6 relative z-10 bg-gray-50 dark:bg-gray-950 transition-colors">
                        {children}
                    </main>

                    {/* フッター */}
                    <AdminFooter />
                </div>
            </div>
        </div>
    );
}
