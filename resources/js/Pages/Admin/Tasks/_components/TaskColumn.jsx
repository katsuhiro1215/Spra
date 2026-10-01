import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

export default function TaskColumn({ status, label, tasks, onCardClick, selection }) {
    const { setNodeRef } = useDroppable({ id: status });
    const ids = tasks.map((t) => t.id);
    const allSelected = selection?.active && ids.length > 0 && ids.every((id) => selection.selectedIds.includes(id));

    return (
        <div className="flex w-72 shrink-0 flex-col rounded bg-gray-50 p-2">
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">
                    {label}（{tasks.length}）
                </h3>
                {selection?.active && status !== "done" && ids.length > 0 && (
                    <button
                        type="button"
                        onClick={() => selection.setMany(ids, !allSelected)}
                        className="text-xs text-indigo-600 hover:underline"
                    >
                        {allSelected ? "選択解除" : "すべて選択"}
                    </button>
                )}
            </div>
            <div ref={setNodeRef} className="flex min-h-[100px] flex-col gap-2">
                <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onClick={selection?.active ? () => selection.toggle(task.id) : onCardClick}
                            selectable={selection?.active}
                            selected={selection?.selectedIds.includes(task.id)}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
