import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import FlashMessage from "@/Components/Notifications/FlashMessage";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Index() {
    return (
        <AdminAuthenticatedLayout>
            <Head title={PageConfig.systemSettings.documentTitle} />
            {/* フラッシュメッセージ */}
            <FlashMessage />
            {/* ヘッダー */}
            <PageHeader
                title={PageConfig.systemSettings.title}
                description={PageConfig.systemSettings.description}
            />
            {/* メイン */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* ページ一覧 */}
                <div className="text-center py-20 border-4 border-dashed border-gray-200 rounded-lg">
                    <p className="text-gray-500">
                        この機能は現在開発中です。近日公開予定です。
                    </p>
                </div>
            </main>
        </AdminAuthenticatedLayout>
    );
}
