import React from "react";
import { router } from "@inertiajs/react";

const Pagination = ({ paginationData, className = "" }) => {
    // より安全な配列チェック
    if (
        !paginationData?.links ||
        !Array.isArray(paginationData.links) ||
        paginationData.links.length <= 3
    ) {
        return null;
    }

    // 完全な URL から相対パスを抽出
    const getRelativePath = (fullUrl) => {
        if (!fullUrl) return null;
        try {
            const url = new URL(fullUrl);
            return url.pathname + url.search;
        } catch (e) {
            return fullUrl;
        }
    };

    return (
        <div className={`px-4 py-3 sm:px-6 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                    {/* モバイル用の前/次ボタン */}
                    <button
                        onClick={() => {
                            const path = getRelativePath(
                                paginationData.prev_page_url,
                            );
                            if (path)
                                router.get(
                                    path,
                                    {},
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                    },
                                );
                        }}
                        disabled={!paginationData.prev_page_url}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        前へ
                    </button>
                    <button
                        onClick={() => {
                            const path = getRelativePath(
                                paginationData.next_page_url,
                            );
                            if (path)
                                router.get(
                                    path,
                                    {},
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                    },
                                );
                        }}
                        disabled={!paginationData.next_page_url}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        次へ
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            <span className="font-medium">
                                {paginationData.from || 0}
                            </span>{" "}
                            から{" "}
                            <span className="font-medium">
                                {paginationData.to || 0}
                            </span>{" "}
                            件を表示（全{" "}
                            <span className="font-medium">
                                {paginationData.total || 0}
                            </span>{" "}
                            件中）
                        </p>
                    </div>
                    <div>
                        <nav
                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                            aria-label="Pagination"
                        >
                            <div className="flex space-x-1">
                                {Array.isArray(paginationData.links) &&
                                    paginationData.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                const path = getRelativePath(
                                                    link.url,
                                                );
                                                if (path)
                                                    router.get(
                                                        path,
                                                        {},
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        },
                                                    );
                                            }}
                                            disabled={!link.url}
                                            className={`px-3 py-1 text-sm rounded ${
                                                link.active
                                                    ? "bg-blue-600 text-white"
                                                    : link.url
                                                      ? "text-gray-700 hover:bg-gray-100"
                                                      : "text-gray-400 cursor-not-allowed"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
