import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
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
        <Card>
            <CardHeader>ページ一覧 ({pages.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr>
                        <Th>{PageConfig.pages.table.headers.page}</Th>
                        <Th>{PageConfig.pages.table.headers.template}</Th>
                        <Th>{PageConfig.pages.table.headers.status}</Th>
                        <Th>{PageConfig.pages.table.headers.sortOrder}</Th>
                        <Th>{PageConfig.pages.table.headers.updatedAt}</Th>
                        <Th className="text-right">
                            {PageConfig.pages.table.headers.actions}
                        </Th>
                    </Tr>
                </THead>
                <TBody>
                    {pages.data && pages.data.length > 0 ? (
                        pages.data.map((page) => (
                            <Tr key={page.id} className="hover:bg-gray-50">
                                <Td>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {page.title}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            /{page.slug}
                                        </div>
                                    </div>
                                </Td>
                                <Td>{getTemplateBadge(page.template)}</Td>
                                <Td>{getStatusBadge(page.is_published)}</Td>
                                <Td>{page.sort_order}</Td>
                                <Td>{page.updated_at}</Td>
                                <Td className="text-right">
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
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td
                                colSpan={6}
                                className="text-center text-slate-500 dark:text-slate-400 py-8"
                            >
                                ページが見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default PagesTable;
