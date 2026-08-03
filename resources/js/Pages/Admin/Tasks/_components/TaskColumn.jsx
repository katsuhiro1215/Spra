import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

export default function TaskColumn({ status, label, tasks, onCardClick }) {
    const { setNodeRef } = useDroppable({ id: status });

    return (
        <div className="flex w-72 flex-col rounded bg-gray-50 p-2">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
                {label}（{tasks.length}）
            </h3>
            <div ref={setNodeRef} className="flex min-h-[100px] flex-col gap-2">
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} onClick={onCardClick} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
