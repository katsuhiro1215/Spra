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
        console.error("Admin authentication data is missing");
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        認証エラー
                    </h2>
                    <p className="text-gray-600">
                        管理者認証情報が見つかりません。
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 relative">
            {/* サイドバー - 最前面に配置 */}
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* メインコンテンツエリア全体 */}
            <div className="md:ml-20 relative z-10">
                {/* ヘッダー */}
                <AdminHeader
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* コンテンツエリア */}
                <div className="flex flex-col min-h-screen">
                    {/* ページヘッダー */}
                    {header && (
                        <header className="bg-white shadow-sm relative z-10">
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    {/* メインコンテンツ */}
                    <main className="flex-1 py-6 relative z-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>

                    {/* フッター */}
                    <AdminFooter />
                </div>
            </div>
        </div>
    );
}
