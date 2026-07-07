import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
// Icons
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// Quote Components
import QuoteBasicInfo from "./_components/QuoteBasicInfo";
import QuoteItems from "./_components/QuoteItems";
import QuoteAmount from "./_components/QuoteAmount";
import QuoteVersionHistory from "./_components/QuoteVersionHistory";
import QuoteClientInfo from "./_components/QuoteClientInfo";

export default function Show({ quote, statuses }) {
    const [activeTab, setActiveTab] = useState("basic");

    const tabs = [
        { id: "basic", label: "基本情報", icon: "📋" },
        { id: "items", label: "見積明細", icon: "📝" },
        { id: "amount", label: "金額情報", icon: "💰" },
        { id: "versions", label: "バージョン履歴", icon: "📜" },
        { id: "client", label: "クライアント情報", icon: "👤" },
    ];

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.quote.edit", quote.id),
        },
        ...(["draft", "reviewed"].includes(quote.status)
            ? [
                  {
                      label: "送信",
                      icon: PaperAirplaneIcon,
                      variant: "secondary",
                      route: route("admin.quote.preview", quote.id),
                  },
              ]
            : []),
        {
            label: "契約書を作成",
            icon: PencilIcon,
            variant: "success",
            route: route("admin.contract.create", {
                quote_id: quote.id,
            }),
        },
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.quote.index"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "見積もり一覧", href: route("admin.quote.index") },
        { label: quote.quote_number, href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`見積もり詳細: ${quote.quote_number}`}
                    description="見積もり情報の詳細を表示しています"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`見積もり: ${quote.quote_number}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl space-y-6">
                {/* タブナビゲーション */}
                <Card>
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* タブコンテンツ */}
                {activeTab === "basic" && (
                    <QuoteBasicInfo quote={quote} statuses={statuses} />
                )}
                {activeTab === "items" && <QuoteItems quote={quote} />}
                {activeTab === "amount" && <QuoteAmount quote={quote} />}
                {activeTab === "versions" && (
                    <QuoteVersionHistory quote={quote} />
                )}
                {activeTab === "client" && <QuoteClientInfo quote={quote} />}
            </div>
        </AdminAuthenticatedLayout>
    );
}
