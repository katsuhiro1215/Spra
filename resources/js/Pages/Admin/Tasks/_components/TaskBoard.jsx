import React from "react";
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import TaskColumn from "./TaskColumn";

const COLUMNS = [
    { status: "todo", label: "未着手" },
    { status: "in_progress", label: "進行中" },
    { status: "done", label: "完了" },
];

export default function TaskBoard({ tasks, onStatusChange, onCardClick }) {
    // ポインタが一定距離動くまではドラッグと判定しない（クリックでの編集モーダル起動と競合しないように）
    // resources/js/Components/BlockUI/BlockEditor.jsx の実装に合わせて distance: 4 を使用
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

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
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto">
                {COLUMNS.map((column) => (
                    <TaskColumn
                        key={column.status}
                        status={column.status}
                        label={column.label}
                        tasks={tasks.filter((t) => t.status === column.status)}
                        onCardClick={onCardClick}
                    />
                ))}
            </div>
        </DndContext>
    );
}
