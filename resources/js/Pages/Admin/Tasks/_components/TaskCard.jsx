import React from "react";
import { Link } from "@inertiajs/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const PRIORITY_LABEL = { high: "高", medium: "中", low: "低" };
const PRIORITY_COLOR = { high: "bg-red-100 text-red-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-gray-100 text-gray-600" };

export default function TaskCard({ task, onClick }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick?.(task)}
            className="cursor-grab rounded border bg-white p-3 shadow-sm"
        >
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{task.title}</span>
                <span className={`rounded px-2 py-0.5 text-xs ${PRIORITY_COLOR[task.priority]}`}>
                    {PRIORITY_LABEL[task.priority]}
                </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
                {task.due_date}
                {task.due_time ? ` ${task.due_time.slice(0, 5)}` : ""}
            </div>
            {task.category && (
                <span
                    className="mt-2 inline-block rounded-full px-2 py-0.5 text-xs text-white"
                    style={{ backgroundColor: task.category.color || "#9CA3AF" }}
                >
                    {task.category.name}
                </span>
            )}
            {task.admin && <div className="mt-1 text-xs text-gray-400">{task.admin.email}</div>}
            <Link
                href={route("admin.task.show", task.id)}
                onClick={(e) => e.stopPropagation()}
                className="mt-2 block text-xs text-indigo-600 hover:underline"
            >
                詳細を見る
            </Link>
        </div>
    );
}
