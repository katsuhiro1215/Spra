import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import { SecondaryButton, CreateButton } from "@/Components/Buttons";
import TabNavigation from "@/Components/TabNavigation";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { IconButton } from "@/Components/Buttons";
import {
    PlusIcon,
    FunnelIcon,
    XMarkIcon,
    ListBulletIcon,
    Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import CampaignsTable from "./_components/CampaignsTable";
import CampaignsGrid from "./_components/CampaignsGrid";
import CampaignCalendar from "./_components/CampaignCalendar";

const VIEW_MODE_STORAGE_KEY = "campaigns-view-mode";

export default function Index({
    campaigns,
    filters = {},
    stats = {},
    calendarCampaigns = [],
}) {
    // ========================================
    // State & Form
    // ========================================
    const [view, setView] = useState("list");
    const [showFilters, setShowFilters] = useState(!!filters?.is_active);
    const [viewMode, setViewMode] = useState(
        () => localStorage.getItem(VIEW_MODE_STORAGE_KEY) || "grid",
    );

    useEffect(() => {
        localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
    }, [viewMode]);

    const { data, setData, get, processing } = useForm({
        search: filters?.search || "",
        is_active: filters?.is_active || "",
    });

    // ========================================
    // Handlers
    // ========================================
    const handleSearch = () => {
        get(route("admin.campaign.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({ search: "", is_active: "" });
        setShowFilters(false);
        get(route("admin.campaign.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (campaign) => {
        const confirmed = confirm(
            `「${campaign.name}」を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.campaign.destroy", campaign.id));
        }
    };

    // ========================================
    // Constants
    // ========================================
    const headerActions = [
        {
            label: "キャンペーン作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.campaign.create"),
        },
    ];

    const activeOptions = [
        { value: "", label: "すべて" },
        { value: "true", label: "有効" },
        { value: "false", label: "停止中" },
    ];

    const hasActiveFilters = data.is_active;
    const activeFilterCount = data.is_active ? 1 : 0;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.campaigns.title}
                    description={PageConfig.campaigns.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.campaigns.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.campaigns.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 統計情報 */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {stats.total || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    総件数
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {stats.running || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    開催中
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {stats.upcoming || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    開催前
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                                    {stats.ended || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    終了
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* 表示切り替え */}
                <TabNavigation
                    tabs={[
                        { key: "list", label: "一覧" },
                        { key: "calendar", label: "カレンダー" },
                    ]}
                    activeTab={view}
                    onChange={setView}
                />

                {view === "list" ? (
                    <>
                        {/* 検索・フィルター */}
                        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                            <div className="flex-1 max-w-md">
                                <SearchBar
                                    value={data.search}
                                    onChange={(value) =>
                                        setData("search", value)
                                    }
                                    onSearch={handleSearch}
                                    placeholder={
                                        PageConfig.campaigns.ui.search
                                            .placeholder
                                    }
                                    disabled={processing}
                                />
                            </div>

                            <div className="flex-shrink-0">
                                <SecondaryButton
                                    onClick={() =>
                                        setShowFilters(!showFilters)
                                    }
                                    size="md"
                                    className="relative"
                                >
                                    <FunnelIcon className="h-4 w-4 mr-2" />
                                    フィルター
                                    {activeFilterCount > 0 && (
                                        <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500 text-white text-xs font-medium">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </SecondaryButton>
                            </div>
                        </div>

                        {showFilters && (
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <FilterSelect
                                        label="有効状態"
                                        value={data.is_active}
                                        onChange={(value) =>
                                            setData("is_active", value)
                                        }
                                        options={activeOptions}
                                    />
                                    <div className="flex items-end">
                                        <SecondaryButton
                                            onClick={handleClearFilters}
                                            disabled={!hasActiveFilters}
                                            size="md"
                                            className="w-full"
                                        >
                                            <XMarkIcon className="h-4 w-4 mr-2" />
                                            クリア
                                        </SecondaryButton>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 一覧ヘッダー（件数 + 表示切替） */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                キャンペーン一覧 ({campaigns.total}件)
                            </h2>
                            <div className="flex gap-1">
                                <IconButton
                                    variant={
                                        viewMode === "table"
                                            ? "secondary"
                                            : "text"
                                    }
                                    icon={ListBulletIcon}
                                    onClick={() => setViewMode("table")}
                                    title="テーブル表示"
                                />
                                <IconButton
                                    variant={
                                        viewMode === "grid"
                                            ? "secondary"
                                            : "text"
                                    }
                                    icon={Squares2X2Icon}
                                    onClick={() => setViewMode("grid")}
                                    title="グリッド表示"
                                />
                            </div>
                        </div>

                        {/* テーブル / グリッド */}
                        {viewMode === "table" ? (
                            <CampaignsTable
                                campaigns={campaigns}
                                onDelete={handleDelete}
                            />
                        ) : (
                            <CampaignsGrid
                                campaigns={campaigns}
                                onDelete={handleDelete}
                            />
                        )}

                        {/* ページネーション */}
                        {campaigns?.last_page > 1 && (
                            <Pagination paginationData={campaigns} />
                        )}

                        {/* データがない場合 */}
                        {campaigns?.data?.length === 0 && (
                            <Card className="text-center py-12">
                                <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                                    🎁
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 mb-4">
                                    {PageConfig.campaigns.ui.empty.noData}
                                </p>
                                <CreateButton
                                    href={route("admin.campaign.create")}
                                    size="md"
                                >
                                    {
                                        PageConfig.campaigns.ui.empty
                                            .createFirst
                                    }
                                </CreateButton>
                            </Card>
                        )}
                    </>
                ) : (
                    <CampaignCalendar campaigns={calendarCampaigns} />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
