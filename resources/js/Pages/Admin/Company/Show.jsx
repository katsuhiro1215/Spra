import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { FlashMessage } from "@/Components/Notifications";
import TabNavigation from "@/Components/TabNavigation";
import MediaSelectModal from "@/Components/Media/MediaSelectModal";
import {
    ArrowLeftIcon,
    PencilIcon,
    DocumentTextIcon,
    DocumentCurrencyYenIcon,
    CameraIcon,
    BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import { getStatusBadge } from "@/Constants/Badges";

// タブコンポーネント
import CompanyBasicInfo from "./_components/CompanyBasicInfo";
import CompanyEmployees from "./_components/CompanyEmployees";
import CompanyInvoices from "./_components/CompanyInvoices";
import CompanyReceipts from "./_components/CompanyReceipts";
import CompanyQuotes from "./_components/CompanyQuotes";
import CompanyPayments from "./_components/CompanyPayments";

export default function Show({
    company,
    addressTypes,
    invoices = [],
    receipts = [],
    quotes = [],
    payments = [],
    stats = {},
    mediaList = [],
}) {
    const [activeTab, setActiveTab] = useState("basic");
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaListState, setMediaListState] = useState(mediaList);

    const handleMediaSelect = (mediaId) => {
        router.post(
            route("admin.company.attach-media", company.id),
            { media_id: mediaId },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setShowMediaModal(false),
            },
        );
    };

    const handleMediaUploaded = (newMedia) => {
        setMediaListState((prev) => [newMedia, ...prev]);
    };

    const handleDetachMedia = () => {
        if (confirm("会社画像を削除しますか？")) {
            router.delete(route("admin.company.detach-media", company.id), {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const companyTypeLabels = {
        individual: "個人事業主",
        corporate: "法人",
    };

    const tabs = [
        {
            key: "basic",
            label: "基本情報",
        },
        {
            key: "employees",
            label: "従業員",
            count: company.users?.length || 0,
        },
        {
            key: "quotes",
            label: "見積もり",
            count: quotes.length,
        },
        {
            key: "invoices",
            label: "請求書",
            count: invoices.length,
        },
        {
            key: "receipts",
            label: "領収書",
            count: receipts.length,
        },
        {
            key: "payments",
            label: "決済",
            count: payments.length,
        },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "basic":
                return (
                    <CompanyBasicInfo
                        company={company}
                        addressTypes={addressTypes}
                    />
                );
            case "employees":
                return <CompanyEmployees users={company.users || []} />;
            case "invoices":
                return (
                    <CompanyInvoices
                        invoices={invoices}
                        totalPaid={stats.totalPaid || 0}
                    />
                );
            case "receipts":
                return (
                    <CompanyReceipts
                        receipts={receipts}
                        companyId={company.id}
                    />
                );
            case "quotes":
                return <CompanyQuotes quotes={quotes} />;
            case "payments":
                return <CompanyPayments payments={payments} />;
            default:
                return null;
        }
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "請求書を作成",
            icon: DocumentCurrencyYenIcon,
            variant: "primary",
            route: route("admin.invoice.create", { company_id: company.id }),
        },
        {
            label: "見積もりを作成",
            icon: DocumentTextIcon,
            variant: "secondary",
            route: route("admin.quote.create", { company_id: company.id }),
        },
        {
            label: PageConfig.companies.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.company.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.companies.breadcrumbs,
        company.name,
        PageConfig.companies.pages.show.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.companies.title}
                    description={PageConfig.companies.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`${company.name} - 企業詳細`} />

            <FlashMessage />

            <div className="space-y-6">
                {/* ヘッダー（カバー画像） */}
                <div className="relative w-full h-32 sm:h-44 rounded-lg overflow-hidden group bg-gradient-to-br from-slate-700 to-slate-900">
                    {company.media ? (
                        <img
                            src={company.media.url}
                            alt={company.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <BuildingOffice2Icon className="h-16 w-16 text-white/20" />
                        </div>
                    )}
                    {/* テキストを読みやすくするグラデーション */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* 画像変更・削除ボタン */}
                    <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {company.media && (
                            <button
                                onClick={handleDetachMedia}
                                className="px-2 py-1 text-xs text-white bg-black/40 hover:bg-black/60 rounded transition-colors"
                            >
                                画像を削除
                            </button>
                        )}
                        <button
                            onClick={() => setShowMediaModal(true)}
                            className="p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
                            title="画像を変更"
                        >
                            <CameraIcon className="h-4 w-4 text-white" />
                        </button>
                    </div>

                    {/* 会社名・バッジ・編集ボタン */}
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
                            <h1 className="text-lg sm:text-2xl font-bold text-white drop-shadow truncate">
                                {company.name}
                            </h1>
                            <Badge
                                variant={getStatusBadge(company.status).variant}
                            >
                                {getStatusBadge(company.status).text}
                            </Badge>
                            <Badge variant="info">
                                {companyTypeLabels[company.company_type]}
                            </Badge>
                        </div>

                        <SecondaryButton
                            href={route("admin.company.edit", company.id)}
                            icon={PencilIcon}
                            className="flex-shrink-0"
                        >
                            編集
                        </SecondaryButton>
                    </div>
                </div>

                {/* 統計情報 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {company.users?.length || 0}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                従業員数
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {quotes.length}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                見積もり件数
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {invoices.length}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                請求書件数
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {new Intl.NumberFormat("ja-JP", {
                                    style: "currency",
                                    currency: "JPY",
                                }).format(stats.totalPaid || 0)}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                総支払額
                            </div>
                        </div>
                    </Card>
                </div>

                {/* タブナビゲーション */}
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow">
                    <TabNavigation
                        tabs={tabs}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                    {/* タブコンテンツ */}
                    <div className="p-6">{renderTabContent()}</div>
                </div>
            </div>

            {/* メディア選択モーダル */}
            <MediaSelectModal
                show={showMediaModal}
                mediaList={mediaListState}
                multiple={false}
                uploadRoute={route("admin.media.store")}
                onClose={() => setShowMediaModal(false)}
                onSelect={handleMediaSelect}
                onMediaUploaded={handleMediaUploaded}
            />
        </AdminAuthenticatedLayout>
    );
}
