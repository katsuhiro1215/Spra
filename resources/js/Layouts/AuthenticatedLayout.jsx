import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import UserSidebar from "./User/UserSidebar";
import UserHeader from "./User/UserHeader";
import UserFooter from "./User/UserFooter";

export default function AuthenticatedLayout({ header, children }) {
    const { props } = usePage();
    const user = props.auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // User側は常にlightモードのみ。Admin側でダークモードを有効にした状態から
    // SPA遷移でUser側ページに来た場合、<html>に残った 'dark' クラスを確実に外す。
    useEffect(() => {
        document.documentElement.classList.remove("dark");
    }, []);

    // ユーザーが認証されていない場合のハンドリング
    if (!user) {
        console.error("User authentication data is missing");
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        認証エラー
                    </h2>
                    <p className="text-gray-600">
                        ユーザー認証情報が見つかりません。
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* サイドバー */}
            <UserSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="md:ml-64 relative z-10">
                {/* ヘッダー */}
                <UserHeader
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                {/* メインコンテンツエリア */}
                <div className="flex flex-col min-h-screen">
                    {/* ページヘッダー */}
                    {header}

                    {/* メインコンテンツ */}
                    <main className="flex-1 p-6 relative z-10 bg-gray-50 transition-colors">
                        {children}
                    </main>
                </div>

                {/* フッター */}
                <UserFooter />
            </div>
        </div>
    );
}
