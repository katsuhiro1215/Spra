import React from "react";
import { Button } from "@/Components/Buttons";
import TabNavigation from "@/Components/TabNavigation";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import ExportMenu from "@/Components/ExportMenu";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import { ADMIN_STATUS_OPTIONS } from "@/Constants/SelectOptions";

// フィルター項目が増減してもJSXを触らずに済むよう、データ駆動で定義する
const FILTER_FIELDS = [
    {
        key: "status",
        label: PageConfig.users.filters.status.label,
        placeholder: PageConfig.users.filters.status.placeholder,
        options: ADMIN_STATUS_OPTIONS,
    },
];

const UsersFilterBar = ({
    tabs,
    activeTab,
    onTabChange,
    data,
    setData,
    onSearch,
    searchDisabled,
    showFilters,
    onToggleFilters,
    activeFilterCount,
    hasActiveFilters,
    onClearFilters,
}) => {
    return (
        <>
            {/* タブ + 検索 + フィルタートグル */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                {/* タブナビゲーション */}
                <div className="flex-shrink-0">
                    <TabNavigation
                        tabs={tabs}
                        activeTab={activeTab}
                        onChange={onTabChange}
                    />
                </div>

                {/* 検索バー */}
                <div className="flex-1 max-w-md">
                    <SearchBar
                        value={data.search}
                        onChange={(value) => setData("search", value)}
                        onSearch={onSearch}
                        placeholder={PageConfig.users.ui.search.placeholder}
                        disabled={searchDisabled}
                    />
                </div>

                {/* フィルタートグルボタン */}
                <div className="flex-shrink-0">
                    <Button
                        variant="secondary"
                        onClick={onToggleFilters}
                        size="md"
                        icon={FunnelIcon}
                        className="relative"
                        aria-expanded={showFilters}
                    >
                        {PageConfig.users.ui.filter.button}
                        {activeFilterCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500 text-white text-xs font-medium">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                </div>

                {/* エクスポート（現在の絞り込み条件を引き継ぐ） */}
                <div className="flex-shrink-0">
                    <ExportMenu routeName="admin.user.export" filters={data} />
                </div>
            </div>

            {/* フィルターセクション（折りたたみ可能）*/}
            {showFilters && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {FILTER_FIELDS.map((field) => (
                            <FilterSelect
                                key={field.key}
                                label={field.label}
                                value={data[field.key]}
                                onChange={(value) =>
                                    setData(field.key, value)
                                }
                                options={field.options}
                                placeholder={field.placeholder}
                            />
                        ))}

                        {/* スペーサー */}
                        <div className="hidden lg:block"></div>
                        <div className="hidden lg:block"></div>

                        {/* フィルタークリアボタン */}
                        <div className="flex items-end">
                            <Button
                                variant="secondary"
                                onClick={onClearFilters}
                                disabled={!hasActiveFilters}
                                size="md"
                                icon={XMarkIcon}
                                className="w-full"
                            >
                                {PageConfig.users.ui.filter.clear}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UsersFilterBar;
