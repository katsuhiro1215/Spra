import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

export default function Index({ serviceCategories }) {
    const [isDeleting, setIsDeleting] = useState(null);

    const handleDelete = (category) => {
        if (
            confirm(
                `「${category.name}」を削除しますか？この操作は取り消せません。`
            )
        ) {
            setIsDeleting(category.id);
            router.delete(
                route("admin.homepage.serviceCategories.destroy", category),
                {
                    onFinish: () => setIsDeleting(null),
                }
            );
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        サービスカテゴリ管理
                    </h2>
                    <Link
                        href={route("admin.homepage.serviceCategories.create")}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        新規作成
                    </Link>
                </div>
            }
        >
            <Head title="サービスカテゴリ管理" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {serviceCategories.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 mb-4">
                                        サービスカテゴリが登録されていません
                                    </div>
                                    <Link
                                        href={route(
                                            "admin.homepage.serviceCategories.create"
                                        )}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        最初のカテゴリを作成
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {serviceCategories.map((category) => (
                                        <div
                                            key={category.id}
                                            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                        >
                                            {/* カテゴリヘッダー */}
                                            <div
                                                className="p-4 border-b border-gray-100"
                                                style={{
                                                    borderLeftColor:
                                                        category.color,
                                                    borderLeftWidth: "4px",
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        {category.icon && (
                                                            <div
                                                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                                                                style={{
                                                                    backgroundColor:
                                                                        category.color,
                                                                }}
                                                            >
                                                                <i
                                                                    className={`heroicon-${category.icon} h-5 w-5`}
                                                                ></i>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {category.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                {category.slug}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {category.is_active ? (
                                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                        ) : (
                                                            <XCircleIcon className="h-5 w-5 text-red-500" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* カテゴリ詳細 */}
                                            <div className="p-4">
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                                    {category.description ||
                                                        "説明がありません"}
                                                </p>

                                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                                    <span>
                                                        表示順:{" "}
                                                        {category.sort_order}
                                                    </span>
                                                    <span>
                                                        作成日:{" "}
                                                        {formatDate(
                                                            category.created_at
                                                        )}
                                                    </span>
                                                </div>

                                                {/* アクションボタン */}
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={route(
                                                            "admin.homepage.serviceCategories.show",
                                                            category
                                                        )}
                                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <EyeIcon className="h-4 w-4 mr-1" />
                                                        詳細
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "admin.homepage.serviceCategories.edit",
                                                            category
                                                        )}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <PencilIcon className="h-4 w-4 mr-1" />
                                                        編集
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                category
                                                            )
                                                        }
                                                        disabled={
                                                            isDeleting ===
                                                            category.id
                                                        }
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                    >
                                                        <TrashIcon className="h-4 w-4 mr-1" />
                                                        {isDeleting ===
                                                        category.id
                                                            ? "削除中..."
                                                            : "削除"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
