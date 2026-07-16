import React from "react";
import { Card } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
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
                                    <div className="flex justify-end items-center gap-1">
                                        <IconButton
                                            variant="info-text"
                                            icon={EyeIcon}
                                            size="lg"
                                            href={route(
                                                "admin.company.show",
                                                company.id,
                                            )}
                                            title="詳細"
                                        />
                                        <IconButton
                                            variant="warning-text"
                                            icon={PencilIcon}
                                            size="lg"
                                            href={route(
                                                "admin.company.edit",
                                                company.id,
                                            )}
                                            title="編集"
                                        />
                                        <IconButton
                                            variant="danger-text"
                                            icon={TrashIcon}
                                            size="lg"
                                            onClick={() => onDelete(company)}
                                            title="削除"
                                        />
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
