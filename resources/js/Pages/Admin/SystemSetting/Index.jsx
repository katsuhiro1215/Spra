import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// icons
import { PlusIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Index() {
    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.companies.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.company.create"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "設定", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.systemSettings.title}
                    description={PageConfig.systemSettings.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.systemSettings.documentTitle} />
            {/* フラッシュメッセージ */}
            <FlashMessage />
            {/* ヘッダー */}
            {/* メイン */}
            {/* ページ一覧 */}
            <div className="w-full flex flex-col gap-4">
                <p className="text-gray-500">
                    この機能は現在開発中です。近日公開予定です。
                </p>
            </div>
        </AdminAuthenticatedLayout>
    );
}
