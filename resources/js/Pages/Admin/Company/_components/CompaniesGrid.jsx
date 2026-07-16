import React from "react";
// Components
import { Card } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import Avatar from "@/Components/Avatar";
// Icons
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
// Constants
import { getStatusBadge } from "@/Constants/Badges";

const companyTypeLabels = {
    individual: { text: "個人", variant: "info" },
    corporate: { text: "法人", variant: "primary" },
};

const getTypeBadge = (type) =>
    companyTypeLabels[type] || { text: type, variant: "neutral" };

const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("ja-JP") : "-";

const CompaniesGrid = ({ companies, onDelete }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {companies.data.map((company) => (
                <Card key={company.id} className="h-full">
                    <div className="flex flex-col gap-3 h-full">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex-shrink-0 h-10 w-10">
                                <Avatar
                                    name={company.name
                                        .charAt(0)
                                        .toUpperCase()}
                                    size="md"
                                    rounded="full"
                                    variant="primary"
                                />
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                    {company.name}
                                </div>
                                {company.representative_name && (
                                    <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                        {company.representative_name}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge
                                variant={getTypeBadge(company.company_type).variant}
                                size="xs"
                            >
                                {getTypeBadge(company.company_type).text}
                            </Badge>
                            <Badge
                                variant={getStatusBadge(company.status).variant}
                                size="xs"
                            >
                                {getStatusBadge(company.status).text}
                            </Badge>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                            {(company.phone || company.email) ? (
                                <>
                                    {company.phone && <div>{company.phone}</div>}
                                    {company.email && <div>{company.email}</div>}
                                </>
                            ) : (
                                <div>連絡先未登録</div>
                            )}
                            <div>登録日: {formatDate(company.created_at)}</div>
                        </div>

                        <div className="flex justify-end items-center gap-1 mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                            <IconButton
                                variant="info-text"
                                icon={EyeIcon}
                                size="lg"
                                href={route("admin.company.show", company.id)}
                                title="詳細"
                            />
                            <IconButton
                                variant="warning-text"
                                icon={PencilIcon}
                                size="lg"
                                href={route("admin.company.edit", company.id)}
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
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default CompaniesGrid;
