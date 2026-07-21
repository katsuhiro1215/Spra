import React from "react";
import { Button } from "@/Components/Buttons";
import TabNavigation from "@/Components/TabNavigation";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

const STATUS_OPTIONS = [
    { value: "", label: "すべて" },
    { value: "1", label: "公開中" },
    { value: "0", label: "非公開" },
];

const FEATURED_OPTIONS = [
    { value: "", label: "すべて" },
    { value: "1", label: "注目表示のみ" },
];

const VoicesFilterBar = ({
    tabs,
    activeTab,
    onTabChange,
    data,
    setData,
    onSearch,
    searchDisabled,
    services,
    showFilters,
    onToggleFilters,
    activeFilterCount,
    hasActiveFilters,
    onClearFilters,
}) => {
    return (
        <>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="flex-shrink-0">
                    <TabNavigation
                        tabs={tabs}
                        activeTab={activeTab}
                        onChange={onTabChange}
                    />
                </div>

                <div className="flex-1 max-w-md">
                    <SearchBar
                        value={data.search}
                        onChange={(value) => setData("search", value)}
                        onSearch={onSearch}
                        placeholder="表示名、会社名、本文で検索..."
                        disabled={searchDisabled}
                    />
                </div>

                <div className="flex-shrink-0">
                    <Button
                        variant="secondary"
                        onClick={onToggleFilters}
                        size="md"
                        icon={FunnelIcon}
                        className="relative"
                        aria-expanded={showFilters}
                    >
                        フィルター
                        {activeFilterCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500 text-white text-xs font-medium">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            {showFilters && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <FilterSelect
                            label="対象サービス"
                            value={data.service_id}
                            onChange={(value) =>
                                setData("service_id", value)
                            }
                            options={[
                                { value: "", label: "すべてのサービス" },
                                ...services.map((service) => ({
                                    value: service.id,
                                    label: service.name,
                                })),
                            ]}
                        />

                        <FilterSelect
                            label="ステータス"
                            value={data.is_published}
                            onChange={(value) =>
                                setData("is_published", value)
                            }
                            options={STATUS_OPTIONS}
                        />

                        <FilterSelect
                            label="注目表示"
                            value={data.is_featured}
                            onChange={(value) =>
                                setData("is_featured", value)
                            }
                            options={FEATURED_OPTIONS}
                        />

                        <div className="flex items-end">
                            <Button
                                variant="secondary"
                                onClick={onClearFilters}
                                disabled={!hasActiveFilters}
                                size="md"
                                icon={XMarkIcon}
                                className="w-full"
                            >
                                クリア
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default VoicesFilterBar;
