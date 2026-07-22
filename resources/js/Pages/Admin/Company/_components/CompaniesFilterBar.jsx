import React from "react";
import { Button } from "@/Components/Buttons";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import {
    COMPANY_TYPE_OPTIONS,
    ADMIN_STATUS_OPTIONS,
    INDUSTRY_OPTIONS,
} from "@/Constants/SelectOptions";

// フィルター項目が増減してもJSXを触らずに済むよう、データ駆動で定義する
const FILTER_FIELDS = [
    {
        key: "company_type",
        label: PageConfig.companies.filters.companyType.label,
        placeholder: PageConfig.companies.filters.companyType.placeholder,
        options: COMPANY_TYPE_OPTIONS,
    },
    {
        key: "status",
        label: PageConfig.companies.filters.status.label,
        placeholder: PageConfig.companies.filters.status.placeholder,
        options: ADMIN_STATUS_OPTIONS,
    },
    {
        key: "industry",
        label: PageConfig.companies.filters.industry.label,
        placeholder: PageConfig.companies.filters.industry.placeholder,
        options: INDUSTRY_OPTIONS,
    },
];

const CompaniesFilterBar = ({
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
            {/* 検索 + フィルタートグル */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                {/* 検索バー */}
                <div className="flex-1 max-w-md">
                    <SearchBar
                        value={data.search}
                        onChange={(value) => setData("search", value)}
                        onSearch={onSearch}
                        placeholder={
                            PageConfig.companies.ui.search.placeholder
                        }
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
                        {PageConfig.companies.ui.filter.button}
                        {activeFilterCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500 text-white text-xs font-medium">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
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
                                {PageConfig.companies.ui.filter.clear}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CompaniesFilterBar;
