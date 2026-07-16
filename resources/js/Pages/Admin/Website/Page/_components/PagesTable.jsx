import React from "react";
import { Link } from "@inertiajs/react";
import BasicTable from "@/Components/Tables/BasicTable";
import Badge from "@/Components/Badge";
import { PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const PagesTable = ({ pages, onDelete }) => {
    const getStatusBadge = (isPublished) => {
        return isPublished ? (
            <Badge variant="success" size="sm">
                公開中
            </Badge>
        ) : (
            <Badge variant="secondary" size="sm">
                下書き
            </Badge>
        );
    };

    const getTemplateBadge = (template) => {
        const templates = {
            home: { label: "ホーム", color: "bg-blue-100 text-blue-800" },
            about: {
                label: "会社概要",
                color: "bg-purple-100 text-purple-800",
            },
            contact: {
                label: "お問い合わせ",
                color: "bg-orange-100 text-orange-800",
            },
            service: {
                label: "サービス",
                color: "bg-teal-100 text-teal-800",
            },
            blog: { label: "ブログ", color: "bg-pink-100 text-pink-800" },
            page: {
                label: "標準ページ",
                color: "bg-gray-100 text-gray-800",
            },
        };

        const templateInfo = templates[template] || templates["page"];

        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${templateInfo.color}`}
            >
                {templateInfo.label}
            </span>
        );
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                    ページ一覧 ({pages.total}件)
                </h3>
            </div>
            <BasicTable>
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {PageConfig.pages.table.headers.page}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {PageConfig.pages.table.headers.template}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {PageConfig.pages.table.headers.status}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {PageConfig.pages.table.headers.sortOrder}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {PageConfig.pages.table.headers.updatedAt}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {PageConfig.pages.table.headers.actions}
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {pages.data && pages.data.length > 0 ? (
                        pages.data.map((page) => (
                            <tr key={page.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {page.title}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            /{page.slug}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {getTemplateBadge(page.template)}
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(page.is_published)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {page.sort_order}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {page.updated_at}
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.website.page.show",
                                                page.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-900 p-1"
                                            title="詳細"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.website.page.edit",
                                                page.id,
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900 p-1"
                                            title="編集"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(page)}
                                            className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                                            title="削除"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={6}
                                className="text-center text-slate-500 dark:text-slate-400 py-8"
                            >
                                ページが見つかりません
                            </td>
                        </tr>
                    )}
                </tbody>
            </BasicTable>
        </div>
    );
};

export default PagesTable;
