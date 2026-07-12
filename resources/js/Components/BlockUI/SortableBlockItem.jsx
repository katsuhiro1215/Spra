import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Bars2Icon,
    TrashIcon,
    Square2StackIcon,
    ChevronUpIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { BLOCK_REGISTRY } from "./registry";

export default function SortableBlockItem({
    block,
    onChange,
    onDelete,
    onDuplicate,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
}) {
    const [collapsed, setCollapsed] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: block.id });

    const definition = BLOCK_REGISTRY[block.type];

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    if (!definition) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="p-4 rounded-lg border border-red-300 bg-red-50 text-red-600 text-sm"
            >
                不明なブロックタイプです: {block.type}
            </div>
        );
    }

    const Icon = definition.icon;
    const Edit = definition.Edit;

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

                <Icon className="h-4 w-4 text-slate-400" />
                <button
                    type="button"
                    onClick={() => setCollapsed((v) => !v)}
                    className="flex-1 text-left text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                    {definition.label}
                </button>

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
                        onClick={onDuplicate}
                        className="p-1 rounded text-slate-400 hover:text-blue-600"
                        aria-label="複製"
                    >
                        <Square2StackIcon className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={onDelete}
                        className="p-1 rounded text-slate-400 hover:text-red-600"
                        aria-label="削除"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {!collapsed && (
                <div className="p-4">
                    <Edit data={block.data} onChange={(data) => onChange({ ...block, data })} />
                </div>
            )}
        </div>
    );
}
