import React from "react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import Badge from "@/Components/Badge";
import { IconButton } from "@/Components/Buttons";
import { PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

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
                        <Th>{PageConfig.pages.table.headers.sortOrder}</Th>
                        <Th>{PageConfig.pages.table.headers.page}</Th>
                        <Th>{PageConfig.pages.table.headers.template}</Th>
                        <Th>{PageConfig.pages.table.headers.status}</Th>
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
                                <Td>{page.sort_order}</Td>
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
                                <Td>{formatDateTime(page.updated_at)}</Td>
                                <Td className="text-right">
                                    <div className="flex justify-end items-center gap-1">
                                        <IconButton
                                            variant="info-text"
                                            icon={EyeIcon}
                                            size="lg"
                                            href={route(
                                                "admin.website.page.show",
                                                page.id,
                                            )}
                                            title="詳細"
                                        />
                                        <IconButton
                                            variant="warning-text"
                                            icon={PencilIcon}
                                            size="lg"
                                            href={route(
                                                "admin.website.page.edit",
                                                page.id,
                                            )}
                                            title="編集"
                                        />
                                        <IconButton
                                            variant="danger-text"
                                            icon={TrashIcon}
                                            size="lg"
                                            onClick={() => onDelete(page)}
                                            title="削除"
                                        />
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
