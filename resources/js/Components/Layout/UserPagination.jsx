import { Link } from "@inertiajs/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function UserPagination({ links, meta }) {
    if (!links || links.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
            {/* 情報表示 */}
            {meta && (
                <div className="flex flex-1 justify-between sm:hidden">
                    <div className="text-sm text-gray-600">
                        {meta.from} - {meta.to} / {meta.total}
                    </div>
                </div>
            )}

            {/* デスクトップ用詳細表示 */}
            {meta && (
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            <span className="font-medium">{meta.from}</span>{" "}
                            から <span className="font-medium">{meta.to}</span>{" "}
                            まで表示 (
                            <span className="font-medium">{meta.total}</span>{" "}
                            件中)
                        </p>
                    </div>
                </div>
            )}

            {/* ページネーションボタン */}
            <div className="flex gap-2">
                {links.map((link, index) => {
                    if (link.label.includes("&laquo;")) {
                        return (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium border ${
                                    link.active || !link.url
                                        ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                                disabled={!link.url}
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </Link>
                        );
                    }

                    if (link.label.includes("&raquo;")) {
                        return (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium border ${
                                    link.active || !link.url
                                        ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                                disabled={!link.url}
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url || "#"}
                            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium border ${
                                link.active
                                    ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
