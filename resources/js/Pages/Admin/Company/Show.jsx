import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
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
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "企業管理", href: route("admin.company.index") },
        { label: "詳細", href: route("admin.company.show", company.id) },
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
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative group flex-shrink-0">
                            {company.media ? (
                                <div className="relative">
                                    <img
                                        src={company.media.url}
                                        alt={company.name}
                                        className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
                                        <button
                                            onClick={() =>
                                                setShowMediaModal(true)
                                            }
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white rounded-full"
                                        >
                                            <CameraIcon className="h-4 w-4 text-slate-700" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowMediaModal(true)}
                                    className="relative w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 group"
                                >
                                    <BuildingOffice2Icon className="h-7 w-7 text-slate-400" />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
                                        <CameraIcon className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            )}
                            {company.media && (
                                <button
                                    onClick={handleDetachMedia}
                                    className="mt-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 block"
                                >
                                    画像を削除
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {company.name}
                            </h1>
                            <Badge {...getStatusBadge(company.status)} />
                            <Badge
                                text={companyTypeLabels[company.company_type]}
                                variant="info"
                            />
                        </div>
                    </div>

                    <SecondaryButton
                        href={route("admin.company.edit", company.id)}
                        icon={PencilIcon}
                    >
                        編集
                    </SecondaryButton>
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
