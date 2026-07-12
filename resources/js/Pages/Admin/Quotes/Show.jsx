import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { TextButton } from "@/Components/Buttons";
// Icons
import {
    ArrowLeftIcon,
    PencilIcon,
    PaperAirplaneIcon,
    DocumentTextIcon,
    PlusIcon,
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
    const hasItems = quote.current_version?.items?.length > 0;
    const currentVersionStatus = quote.current_version?.status;
    const canSend =
        hasItems &&
        ["draft", "revision_requested"].includes(currentVersionStatus);

    const headerActions = [
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

            <div className="w-full space-y-6">
                {/* タブナビゲーション */}
                <Card>
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                        <div className="flex">
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
                        <div className="flex items-center gap-2 pr-4">
                            <TextButton
                                href={route("admin.quote.edit", quote.id)}
                                variant="primary"
                                size="sm"
                                title="編集"
                            >
                                <PencilIcon className="w-4 h-4 mr-1" />
                                編集
                            </TextButton>

                            {hasItems ? (
                                <TextButton
                                    href={route(
                                        "admin.quote.item.edit",
                                        quote.id,
                                    )}
                                    variant="primary"
                                    size="sm"
                                    title="見積明細を編集"
                                >
                                    <PencilIcon className="w-4 h-4 mr-1" />
                                    見積明細編集
                                </TextButton>
                            ) : (
                                <TextButton
                                    href={route(
                                        "admin.quote.item.create",
                                        quote.id,
                                    )}
                                    variant="success"
                                    size="sm"
                                    title="見積明細を作成"
                                >
                                    <PlusIcon className="w-4 h-4 mr-1" />
                                    見積明細を作成
                                </TextButton>
                            )}

                            {canSend ? (
                                <TextButton
                                    href={route(
                                        "admin.quote.preview",
                                        quote.id,
                                    )}
                                    variant="skyblue"
                                    size="sm"
                                    title="送信"
                                >
                                    <PaperAirplaneIcon className="w-4 h-4 mr-1" />
                                    送信
                                </TextButton>
                            ) : (
                                ["draft", "revision_requested"].includes(
                                    currentVersionStatus,
                                ) && (
                                    <span
                                        title="見積明細を作成すると送信できます"
                                        className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-slate-400 dark:text-slate-600 cursor-not-allowed"
                                    >
                                        <PaperAirplaneIcon className="w-4 h-4 mr-1" />
                                        送信
                                    </span>
                                )
                            )}

                            <TextButton
                                href={route("admin.contract.create", {
                                    quote_id: quote.id,
                                })}
                                variant="success"
                                size="sm"
                                title="契約書を作成"
                            >
                                <DocumentTextIcon className="w-4 h-4 mr-1" />
                                契約書を作成
                            </TextButton>
                        </div>
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
