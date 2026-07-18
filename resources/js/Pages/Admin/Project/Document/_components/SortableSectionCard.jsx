import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Bars2Icon,
    TrashIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import TextInput from "@/Components/Forms/TextInput";
import TextArea from "@/Components/Forms/TextArea";
import ArrayFieldEditor from "@/Components/Forms/ArrayFieldEditor";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import DangerButton from "@/Components/Buttons/DangerButton";
import {
    SECTION_TYPE_META,
    SECTION_DETAIL_RELATIONS,
    SECTION_DETAIL_SCHEMAS,
} from "../_shared/constants";

export default function SortableSectionCard({
    projectId,
    documentId,
    section,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
}) {
    const [collapsed, setCollapsed] = useState(false);
    const [title, setTitle] = useState(section.title);
    const [body, setBody] = useState(section.body || "");
    const relationName = SECTION_DETAIL_RELATIONS[section.section_type];
    const [rows, setRows] = useState(relationName ? section[relationName] || [] : []);
    const [saving, setSaving] = useState(false);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: section.id });

    const meta = SECTION_TYPE_META[section.section_type];
    const Icon = meta?.icon;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleSaveMeta = () => {
        setSaving(true);
        router.put(
            route("admin.project.documents.sections.update", [projectId, documentId, section.id]),
            { title, body: section.section_type === "text" ? body : undefined },
            { preserveScroll: true, onFinish: () => setSaving(false) },
        );
    };

    const handleSaveDetails = () => {
        setSaving(true);
        router.put(
            route("admin.project.documents.sections.updateDetails", [projectId, documentId, section.id]),
            { rows },
            { preserveScroll: true, onFinish: () => setSaving(false) },
        );
    };

    const handleDelete = () => {
        if (!confirm(`「${section.title}」を削除しますか？`)) return;
        router.delete(
            route("admin.project.documents.sections.destroy", [projectId, documentId, section.id]),
            { preserveScroll: true },
        );
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
        >
            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 rounded-t-lg">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 touch-none"
                    aria-label="ドラッグして並び替え"
                >
                    <Bars2Icon className="h-4 w-4" />
                </button>

                {Icon && <Icon className="h-4 w-4 text-slate-400 shrink-0" />}

                <button
                    type="button"
                    onClick={() => setCollapsed((v) => !v)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <ChevronRightIcon
                        className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-90"}`}
                    />
                </button>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleSaveMeta}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 dark:text-slate-200 p-0"
                />

                <span className="text-xs text-slate-400 shrink-0">{meta?.label}</span>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={onMoveUp}
                        disabled={isFirst}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="上に移動"
                    >
                        <ChevronUpIcon className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={onMoveDown}
                        disabled={isLast}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="下に移動"
                    >
                        <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="p-1 rounded text-slate-400 hover:text-red-600"
                        aria-label="削除"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {!collapsed && (
                <div className="p-4 space-y-3">
                    {section.section_type === "text" ? (
                        <>
                            <TextArea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                rows={8}
                                placeholder="Markdownで本文を入力"
                            />
                            <div className="flex justify-end">
                                <SecondaryButton onClick={handleSaveMeta} disabled={saving}>
                                    保存
                                </SecondaryButton>
                            </div>
                        </>
                    ) : (
                        <>
                            <ArrayFieldEditor
                                value={rows}
                                onChange={setRows}
                                itemsSchema={SECTION_DETAIL_SCHEMAS[section.section_type] || {}}
                                label={meta?.label || "行"}
                            />
                            <div className="flex justify-end gap-2">
                                {section.section_type === "db_table" && (
                                    // ファイルダウンロードのためInertiaのLinkではなく素の<a>タグを使う
                                    <a
                                        href={route("admin.project.documents.sections.migration", [projectId, documentId, section.id])}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                        title="このテーブル定義からLaravelのmigrationファイルを生成します（叩き台）"
                                    >
                                        <ArrowDownTrayIcon className="h-4 w-4" />
                                        Migrationを生成
                                    </a>
                                )}
                                <SecondaryButton onClick={handleSaveDetails} disabled={saving}>
                                    保存
                                </SecondaryButton>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
