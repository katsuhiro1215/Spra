import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import {Badge} from "@/Components/Badges";
import { getStatusBadge } from "@/Constants/Badges";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const CompaniesTable = ({ companies, onDelete }) => {
    const companyTypeLabels = {
        individual: { text: "個人", variant: "info" },
        corporate: { text: "法人", variant: "primary" },
    };

    const getTypeBadge = (type) => {
        return companyTypeLabels[type] || { text: type, variant: "neutral" };
    };

    return (
        <Card>
            <CardHeader>企業一覧 ({companies.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>企業名</Th>
                        <Th>タイプ</Th>
                        <Th>代表者</Th>
                        <Th>連絡先</Th>
                        <Th>ステータス</Th>
                        <Th>登録日</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {companies.data.length === 0 ? (
                        <Tr>
                            <Td
                                colSpan={7}
                                className="text-center text-slate-500 dark:text-slate-400 py-8"
                            >
                                企業が見つかりません
                            </Td>
                        </Tr>
                    ) : (
                        companies.data.map((company) => (
                            <Tr key={company.id}>
                                <Td>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {company.name}
                                        </div>
                                        {company.legal_name &&
                                            company.legal_name !==
                                                company.name && (
                                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                                    {company.legal_name}
                                                </div>
                                            )}
                                    </div>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            getTypeBadge(company.company_type)
                                                .variant
                                        }
                                        size="xs"
                                    >
                                        {
                                            getTypeBadge(company.company_type)
                                                .text
                                        }
                                    </Badge>
                                </Td>
                                <Td>
                                    {company.representative_name ? (
                                        <div>
                                            <div className="text-sm text-slate-900 dark:text-slate-100">
                                                {company.representative_name}
                                            </div>
                                            {company.representative_title && (
                                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                                    {
                                                        company.representative_title
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 dark:text-slate-500">
                                            -
                                        </span>
                                    )}
                                </Td>
                                <Td>
                                    {company.phone || company.email ? (
                                        <div>
                                            {company.phone && (
                                                <div className="text-sm text-slate-900 dark:text-slate-100">
                                                    {company.phone}
                                                </div>
                                            )}
                                            {company.email && (
                                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                                    {company.email}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 dark:text-slate-500">
                                            -
                                        </span>
                                    )}
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            getStatusBadge(company.status)
                                                .variant
                                        }
                                        size="xs"
                                    >
                                        {getStatusBadge(company.status).text}
                                    </Badge>
                                </Td>
                                <Td className="text-slate-500 dark:text-slate-400">
                                    {new Date(
                                        company.created_at,
                                    ).toLocaleDateString("ja-JP")}
                                </Td>
                                <Td>
                                    <div className="flex justify-end items-center gap-2">
                                        <Link
                                            href={route(
                                                "admin.company.show",
                                                company.id,
                                            )}
                                            className="p-1 text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded transition-colors"
                                            title="詳細"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.company.edit",
                                                company.id,
                                            )}
                                            className="p-1 text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
                                            title="編集"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(company)}
                                            className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                            title="削除"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </Td>
                            </Tr>
                        ))
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default CompaniesTable;
