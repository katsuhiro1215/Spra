import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/Components/Badge";
import { SECTION_TYPE_META, SECTION_DETAIL_SCHEMAS } from "../_shared/constants";

const STATUS_META = {
    added: { label: "追加", variant: "success" },
    removed: { label: "削除", variant: "danger" },
    changed: { label: "変更あり", variant: "warning" },
    unchanged: { label: "変更なし", variant: "secondary" },
};

function TextDiff({ parts }) {
    return (
        <pre className="text-sm rounded-md overflow-x-auto bg-slate-50 dark:bg-slate-900 p-3 whitespace-pre-wrap">
            {parts.map((part, i) => (
                <span
                    key={i}
                    className={
                        part.added
                            ? "block bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300"
                            : part.removed
                              ? "block bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 line-through"
                              : "block text-slate-600 dark:text-slate-400"
                    }
                >
                    {part.value}
                </span>
            ))}
        </pre>
    );
}

function RowDiffList({ sectionType, rows }) {
    const [showUnchanged, setShowUnchanged] = useState(false);
    const schema = SECTION_DETAIL_SCHEMAS[sectionType] || {};
    const changedRows = rows.filter((r) => r.status !== "unchanged");
    const unchangedRows = rows.filter((r) => r.status === "unchanged");

    const renderRow = (row) => {
        const data = row.to || row.from;
        const primaryField = Object.keys(schema)[0];
        const label = data?.[primaryField] || "";

        const borderClass =
            row.status === "added"
                ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
                : row.status === "removed"
                  ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
                  : row.status === "changed"
                    ? "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20"
                    : "border-slate-200 dark:border-slate-700";

        return (
            <div key={row.key} className={`rounded-md border px-3 py-2 text-sm ${borderClass}`}>
                <div className="flex items-center gap-2 mb-1">
                    <Badge variant={STATUS_META[row.status].variant} size="sm">
                        {STATUS_META[row.status].label}
                    </Badge>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{label}</span>
                </div>
                {row.status === "changed" && (
                    <ul className="ml-1 space-y-0.5">
                        {row.changedFields.map((field) => (
                            <li key={field} className="text-slate-600 dark:text-slate-400">
                                {schema[field]?.label || field}:{" "}
                                <span className="line-through text-red-600 dark:text-red-400">
                                    {String(row.from[field] ?? "－")}
                                </span>{" "}
                                →{" "}
                                <span className="text-green-700 dark:text-green-400">
                                    {String(row.to[field] ?? "－")}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-2">
            {changedRows.map(renderRow)}

            {unchangedRows.length > 0 && (
                <>
                    <button
                        type="button"
                        onClick={() => setShowUnchanged((v) => !v)}
                        className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                        変更なしの行を{showUnchanged ? "隠す" : `表示（${unchangedRows.length}件）`}
                    </button>
                    {showUnchanged && <div className="space-y-2">{unchangedRows.map(renderRow)}</div>}
                </>
            )}

            {rows.length === 0 && (
                <p className="text-sm text-slate-400">明細はありません</p>
            )}
        </div>
    );
}

export default function SectionDiffCard({ diff }) {
    const [collapsed, setCollapsed] = useState(diff.status === "unchanged");
    const meta = SECTION_TYPE_META[diff.sectionType];
    const Icon = meta?.icon;
    const status = STATUS_META[diff.status];

    return (
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <button
                type="button"
                onClick={() => setCollapsed((v) => !v)}
                className="w-full flex items-center gap-2 px-4 py-3 text-left"
            >
                <ChevronRightIcon className={`h-4 w-4 text-slate-400 transition-transform ${collapsed ? "" : "rotate-90"}`} />
                {Icon && <Icon className="h-4 w-4 text-slate-400" />}
                <span className="flex-1 font-medium text-slate-800 dark:text-slate-100">{diff.title}</span>
                <Badge variant={status.variant}>{status.label}</Badge>
            </button>

            {!collapsed && (
                <div className="px-4 pb-4">
                    {diff.sectionType === "text" ? (
                        diff.status === "added" ? (
                            <pre className="text-sm whitespace-pre-wrap bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-md p-3">
                                {diff.to.body}
                            </pre>
                        ) : diff.status === "removed" ? (
                            <pre className="text-sm whitespace-pre-wrap bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md p-3 line-through">
                                {diff.from.body}
                            </pre>
                        ) : diff.status === "changed" && diff.textDiff ? (
                            <TextDiff parts={diff.textDiff} />
                        ) : (
                            <pre className="text-sm whitespace-pre-wrap text-slate-500 dark:text-slate-400">
                                {diff.to?.body}
                            </pre>
                        )
                    ) : (
                        <RowDiffList sectionType={diff.sectionType} rows={diff.rows} />
                    )}
                </div>
            )}
        </div>
    );
}
