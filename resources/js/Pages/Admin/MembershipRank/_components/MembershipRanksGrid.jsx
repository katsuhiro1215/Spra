import React from "react";
import { Card } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(amount || 0);

const MembershipRanksGrid = ({ membershipRanks, onDelete }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {membershipRanks.data.map((rank) => (
                <Card key={rank.id} className="h-full">
                    <div className="flex flex-col gap-3 h-full">
                        <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                {rank.name}
                            </div>
                            <code className="text-xs text-slate-500 dark:text-slate-400">
                                {rank.key}
                            </code>
                        </div>

                        {rank.description && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-line line-clamp-3">
                                {rank.description}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            <Badge
                                variant={rank.is_active ? "success" : "secondary"}
                                size="xs"
                            >
                                {rank.is_active ? "有効" : "無効"}
                            </Badge>
                            <Badge variant="neutral" size="xs">
                                表示順: {rank.sort_order}
                            </Badge>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            しきい値: {formatCurrency(rank.min_annual_amount)}
                            〜
                        </div>

                        <div className="flex justify-end items-center gap-1 mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                            <IconButton
                                variant="warning-text"
                                icon={PencilIcon}
                                size="lg"
                                href={route(
                                    "admin.membership-rank.edit",
                                    rank.id,
                                )}
                                title="編集"
                            />
                            <IconButton
                                variant="danger-text"
                                icon={TrashIcon}
                                size="lg"
                                onClick={() => onDelete(rank)}
                                title="削除"
                            />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default MembershipRanksGrid;
