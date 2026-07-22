import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Bars2Icon,
    TrashIcon,
    ChevronUpIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { TextInput, SelectInput, FormGroup } from "@/Components/Forms";
import { PrimaryButton } from "@/Components/Buttons";
import { BlockEditor } from "@/Components/BlockUI";

const ROLE_OPTIONS = [
    { value: "hero", label: "hero（ページ上部の見出し領域）" },
    { value: "main", label: "main（メインコンテンツ）" },
    { value: "sidebar", label: "sidebar（サイドバー）" },
    { value: "footer", label: "footer（ページ下部）" },
];

export default function SortableSectionItem({
    section,
    onSave,
    onDelete,
    saving,
    allowedTypes,
    mediaList,
}) {
    const [collapsed, setCollapsed] = useState(false);
    const [name, setName] = useState(section.name || "");
    const [role, setRole] = useState(section.role || "main");
    const [content, setContent] = useState(
        section.content && Array.isArray(section.content.blocks)
            ? section.content
            : { blocks: [] },
    );
    const [dirty, setDirty] = useState(false);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleSave = () => {
        onSave(section.id, { name, role, content });
        setDirty(false);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
        >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 rounded-t-lg">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 touch-none"
                    aria-label="ドラッグして並び替え"
                >
                    <Bars2Icon className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => setCollapsed((v) => !v)}
                    className="flex-1 flex items-center gap-2 text-left"
                >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {name || "（無題のセクション）"}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {role}
                    </span>
                    {dirty && (
                        <span className="text-xs text-amber-600">未保存の変更</span>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => setCollapsed((v) => !v)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                    {collapsed ? (
                        <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                        <ChevronUpIcon className="h-4 w-4" />
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(section.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-600"
                    aria-label="セクションを削除"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>

            {!collapsed && (
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormGroup label="セクション名">
                            <TextInput
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setDirty(true);
                                }}
                            />
                        </FormGroup>
                        <FormGroup label="役割">
                            <SelectInput
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    setDirty(true);
                                }}
                            >
                                {ROLE_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </SelectInput>
                        </FormGroup>
                    </div>

                    <BlockEditor
                        value={content}
                        onChange={(value) => {
                            setContent(value);
                            setDirty(true);
                        }}
                        allowedTypes={allowedTypes}
                        mediaList={mediaList}
                    />

                    <div className="flex justify-end">
                        <PrimaryButton
                            type="button"
                            onClick={handleSave}
                            disabled={saving || !dirty}
                        >
                            {saving ? "保存中..." : "このセクションを保存"}
                        </PrimaryButton>
                    </div>
                </div>
            )}
        </div>
    );
}
