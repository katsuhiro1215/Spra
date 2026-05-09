import { usePage } from "@inertiajs/react";
import { useState } from "react";
// Builder Components
import BuilderNav from "@/Layouts/Builder/BuilderNav";
import BuilderHeader from "@/Layouts/Builder/BuilderHeader";
import BuilderFooter from "@/Layouts/Builder/BuilderFooter";

export default function BuilderLayout({ children }) {
    const { props } = usePage();
    const admin = props.auth?.admin;

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
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            {/* トップナビゲーション */}
            <BuilderNav />

            {/* ヘッダー（プロジェクト、スケジュール、マスタ情報など） */}
            <BuilderHeader />

            {/* メインキャンバスエリア */}
            <main className="flex-1 overflow-hidden">{children}</main>

            {/* フッター（ステータス表示） */}
            <BuilderFooter />
        </div>
    );
}
