import React from "react";
import { Card } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import { EyeIcon, PencilIcon, TrashIcon, MegaphoneIcon } from "@heroicons/react/24/outline";

const STATUS_BADGE_VARIANTS = {
    開催中: "success",
    開催前: "info",
    終了: "secondary",
    停止中: "danger",
};

const formatDiscount = (campaign) => {
    if (campaign.discount_type === "percentage") {
        return `${campaign.discount_value}% OFF`;
    }
    return `${new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(campaign.discount_value)} OFF`;
};

const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
          })
        : "-";

const CampaignsGrid = ({ campaigns, onDelete }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {campaigns.data.map((campaign) => (
                <Card key={campaign.id} className="h-full">
                    <div className="flex flex-col gap-3 h-full">
                        <div className="relative w-full h-28 rounded-lg overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900">
                            {campaign.media ? (
                                <img
                                    src={campaign.media.url}
                                    alt={campaign.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <MegaphoneIcon className="h-10 w-10 text-white/20" />
                                </div>
                            )}
                        </div>

                        <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                {campaign.name}
                            </div>
                            <code className="text-xs text-slate-500 dark:text-slate-400">
                                {campaign.code}
                            </code>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge
                                variant={
                                    STATUS_BADGE_VARIANTS[
                                        campaign.status_label
                                    ] || "secondary"
                                }
                                size="xs"
                            >
                                {campaign.status_label}
                            </Badge>
                            <Badge variant="neutral" size="xs">
                                {formatDiscount(campaign)}
                            </Badge>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(campaign.starts_at)}
                            {" 〜 "}
                            {formatDate(campaign.ends_at)}
                        </div>

                        <div className="flex justify-end items-center gap-1 mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                            <IconButton
                                variant="info-text"
                                icon={EyeIcon}
                                size="lg"
                                href={route("admin.campaign.show", campaign.id)}
                                title="詳細"
                            />
                            <IconButton
                                variant="warning-text"
                                icon={PencilIcon}
                                size="lg"
                                href={route("admin.campaign.edit", campaign.id)}
                                title="編集"
                            />
                            <IconButton
                                variant="danger-text"
                                icon={TrashIcon}
                                size="lg"
                                onClick={() => onDelete(campaign)}
                                title="削除"
                            />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default CampaignsGrid;
