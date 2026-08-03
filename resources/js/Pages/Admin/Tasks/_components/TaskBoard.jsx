import React from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import TaskColumn from "./TaskColumn";

const COLUMNS = [
    { status: "todo", label: "未着手" },
    { status: "in_progress", label: "進行中" },
    { status: "done", label: "完了" },
];

export default function TaskBoard({ tasks, onStatusChange }) {
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        const task = tasks.find((t) => t.id === active.id);
        const newStatus = COLUMNS.some((c) => c.status === over.id)
            ? over.id
            : tasks.find((t) => t.id === over.id)?.status;

        if (task && newStatus && task.status !== newStatus) {
            onStatusChange(task.id, newStatus);
        }
    };

    return (
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto">
                {COLUMNS.map((column) => (
                    <TaskColumn
                        key={column.status}
                        status={column.status}
                        label={column.label}
                        tasks={tasks.filter((t) => t.status === column.status)}
                    />
                ))}
            </div>
        </DndContext>
    );
}
