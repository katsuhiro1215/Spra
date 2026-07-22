import React from "react";
import { Button } from "@/Components/Buttons";
import TabNavigation from "@/Components/TabNavigation";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

const STATUS_OPTIONS = [
    { value: "", label: "すべて" },
    { value: "published", label: "公開" },
    { value: "draft", label: "下書き" },
];

const PostsFilterBar = ({
    tabs,
    activeTab,
    onTabChange,
    data,
    setData,
    onSearch,
    searchDisabled,
    categories,
    authors,
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
                        placeholder="タイトル、内容で検索..."
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
                            label="ステータス"
                            value={data.status}
                            onChange={(value) => setData("status", value)}
                            options={STATUS_OPTIONS}
                        />

                        <FilterSelect
                            label="カテゴリ"
                            value={data.category_id}
                            onChange={(value) =>
                                setData("category_id", value)
                            }
                            options={[
                                { value: "", label: "すべて" },
                                ...categories.map((cat) => ({
                                    value: cat.id,
                                    label: cat.name,
                                })),
                            ]}
                        />

                        <FilterSelect
                            label="作成者"
                            value={data.author_id}
                            onChange={(value) => setData("author_id", value)}
                            options={[
                                { value: "", label: "すべて" },
                                ...authors.map((author) => ({
                                    value: author.id,
                                    label: author.name,
                                })),
                            ]}
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

export default PostsFilterBar;
