import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import {
    BuildingOffice2Icon,
    EyeIcon,
} from "@heroicons/react/24/outline";
import { getStatusBadge, getRoleBadge } from "@/Constants/Badges";

const COMPANY_TYPE_LABELS = {
    individual: "個人事業主",
    corporate: "法人",
};

const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

export default function UserCompanies({ companies = [] }) {
    return (
        <Card>
            <CardHeader className="flex items-center gap-2">
                <BuildingOffice2Icon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    所属会社
                </span>
                <Badge variant="secondary" size="sm">
                    {companies.length}件
                </Badge>
            </CardHeader>
            <CardBody>
                {companies.length > 0 ? (
                    <div className="space-y-4">
                        {companies.map((company) => (
                            <div
                                key={company.id}
                                className="border border-gray-200 dark:border-slate-700 rounded-lg p-4"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 min-w-0">
                                        {company.media?.url ? (
                                            <img
                                                src={company.media.url}
                                                alt={company.name}
                                                className="h-10 w-10 rounded object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                <BuildingOffice2Icon className="h-5 w-5 text-slate-400" />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                                    {company.name}
                                                </span>
                                                {company.pivot?.is_primary && (
                                                    <Badge
                                                        variant="success"
                                                        size="sm"
                                                    >
                                                        主所属
                                                    </Badge>
                                                )}
                                                {company.pivot?.role && (
                                                    <Badge
                                                        variant={
                                                            getRoleBadge(
                                                                company.pivot
                                                                    .role,
                                                            ).variant
                                                        }
                                                        size="sm"
                                                    >
                                                        {
                                                            getRoleBadge(
                                                                company.pivot
                                                                    .role,
                                                            ).text
                                                        }
                                                    </Badge>
                                                )}
                                                <Badge
                                                    variant={
                                                        getStatusBadge(
                                                            company.status,
                                                        ).variant
                                                    }
                                                    size="sm"
                                                >
                                                    {
                                                        getStatusBadge(
                                                            company.status,
                                                        ).text
                                                    }
                                                </Badge>
                                            </div>
                                            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400 space-x-3">
                                                <span>
                                                    {COMPANY_TYPE_LABELS[
                                                        company.company_type
                                                    ] || company.company_type}
                                                </span>
                                                {company.pivot?.joined_at && (
                                                    <span>
                                                        加入日:{" "}
                                                        {formatDate(
                                                            company.pivot
                                                                .joined_at,
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <IconButton
                                        icon={EyeIcon}
                                        variant="info-text"
                                        size="lg"
                                        href={route(
                                            "admin.company.show",
                                            company.id,
                                        )}
                                        title="詳細"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                        所属している会社はありません
                    </p>
                )}
            </CardBody>
        </Card>
    );
}
