import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { SecondaryButton } from "@/Components/Buttons";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const STATUS_DOT_COLORS = {
    開催中: "bg-green-500",
    開催前: "bg-blue-500",
    終了: "bg-slate-400",
    停止中: "bg-red-500",
};

const toDateOnly = (value) => {
    const d = new Date(value);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const isSameDate = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

export default function CampaignCalendar({ campaigns = [] }) {
    const [cursor, setCursor] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const today = new Date();

    const days = useMemo(() => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startOffset = firstDay.getDay();
        const totalCells =
            Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;

        return Array.from(
            { length: totalCells },
            (_, i) => new Date(year, month, i - startOffset + 1),
        );
    }, [year, month]);

    const campaignsForDate = (date) =>
        campaigns.filter((campaign) => {
            const start = toDateOnly(campaign.starts_at);
            const end = toDateOnly(campaign.ends_at);
            return date >= start && date <= end;
        });

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <span>
                        {year}年{month + 1}月
                    </span>
                    <div className="flex items-center gap-2">
                        <SecondaryButton
                            type="button"
                            size="sm"
                            onClick={() =>
                                setCursor(new Date(year, month - 1, 1))
                            }
                        >
                            <ChevronLeftIcon className="h-4 w-4" />
                        </SecondaryButton>
                        <SecondaryButton
                            type="button"
                            size="sm"
                            onClick={() => setCursor(new Date())}
                        >
                            今月
                        </SecondaryButton>
                        <SecondaryButton
                            type="button"
                            size="sm"
                            onClick={() =>
                                setCursor(new Date(year, month + 1, 1))
                            }
                        >
                            <ChevronRightIcon className="h-4 w-4" />
                        </SecondaryButton>
                    </div>
                </div>
            </CardHeader>
            <CardBody>
                <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 text-xs rounded overflow-hidden">
                    {WEEKDAYS.map((weekday) => (
                        <div
                            key={weekday}
                            className="bg-slate-50 dark:bg-slate-800 text-center py-2 font-medium text-slate-500 dark:text-slate-400"
                        >
                            {weekday}
                        </div>
                    ))}
                    {days.map((date, index) => {
                        const inMonth = date.getMonth() === month;
                        const dayCampaigns = campaignsForDate(date);

                        return (
                            <div
                                key={index}
                                className={`min-h-[92px] p-1.5 bg-white dark:bg-slate-900 ${
                                    inMonth ? "" : "opacity-40"
                                }`}
                            >
                                <div
                                    className={`mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full ${
                                        isSameDate(date, today)
                                            ? "bg-indigo-600 text-white"
                                            : "text-slate-500 dark:text-slate-400"
                                    }`}
                                >
                                    {date.getDate()}
                                </div>
                                <div className="space-y-1">
                                    {dayCampaigns.map((campaign) => (
                                        <div
                                            key={campaign.id}
                                            className="flex items-center gap-1"
                                            title={`${campaign.name}（${campaign.status_label}）`}
                                        >
                                            <span
                                                className={`inline-block h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                                                    STATUS_DOT_COLORS[
                                                        campaign.status_label
                                                    ] || "bg-slate-400"
                                                }`}
                                            />
                                            <span className="truncate text-slate-700 dark:text-slate-300">
                                                {campaign.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardBody>
        </Card>
    );
}
