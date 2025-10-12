import React, { useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

const SearchFilter = ({
    data,
    setData,
    onSearch,
    processing,
    searchPlaceholder = "検索...",
    filters = [],
    showAdvancedFilters = true,
    className = "",
}) => {
    const [showFilters, setShowFilters] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <div className={`bg-white shadow rounded-lg ${className}`}>
            <div className="p-4 border-b border-gray-200">
                <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-64">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={data.search || ""}
                                onChange={(e) =>
                                    setData("search", e.target.value)
                                }
                                placeholder={searchPlaceholder}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    {showAdvancedFilters && filters.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <FunnelIcon className="w-4 h-4 mr-2" />
                            フィルター
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                        検索
                    </button>
                </form>

                {showFilters && filters.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {filters.map((filter, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {filter.label}
                                    </label>
                                    <select
                                        value={data[filter.key] || ""}
                                        onChange={(e) =>
                                            setData(filter.key, e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">
                                            {filter.placeholder}
                                        </option>
                                        {filter.options.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchFilter;
