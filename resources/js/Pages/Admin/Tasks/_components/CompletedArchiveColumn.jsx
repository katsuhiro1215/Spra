import React from "react";
import { Link } from "@inertiajs/react";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { formatMonthLabel } from "./recurrence";

// 完了列に出なくなった過去分も含め、完了タスクを月ごとの件数で一覧する（クリックで月別一覧へ）
export default function CompletedArchiveColumn({ months = [] }) {
    return (
        <div className="flex w-56 shrink-0 flex-col self-start rounded bg-gray-50 p-2">
            <h3 className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700">
                <ArchiveBoxIcon className="h-4 w-4" />
                完了済みリスト
            </h3>
            {months.length === 0 ? (
                <p className="px-1 text-xs text-gray-500">完了済みタスクはありません</p>
            ) : (
                <ul className="flex flex-col gap-1">
                    {months.map((row) => (
                        <li key={row.month}>
                            <Link
                                href={route("admin.completed-task.index", { month: row.month })}
                                className="flex justify-between rounded border bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-indigo-50"
                            >
                                <span>{formatMonthLabel(row.month)}</span>
                                <span className="font-medium">{row.count}件</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
