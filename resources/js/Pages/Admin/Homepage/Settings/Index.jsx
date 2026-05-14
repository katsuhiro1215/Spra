import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
// Layouts
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Index() {
    return (
        <AdminAuthenticatedLayout>
            <Head title={PageConfig.pages.documentTitle} />
            {/* フラッシュメッセージ */}
            <FlashMessage />
            {/* ヘッダー */}
            <PageHeader
                title={PageConfig.siteSettings.title}
                description={PageConfig.siteSettings.description}
            />

            {/* ページ一覧 */}
            <Card>
                <p className="text-gray-500">
                    この機能は現在開発中です。近日公開予定です。
                </p>
            </Card>
        </AdminAuthenticatedLayout>
    );
}
