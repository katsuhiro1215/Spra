import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import SortableSectionCard from "./SortableSectionCard";
import SectionInserterMenu from "./SectionInserterMenu";
import { SECTION_TYPE_META } from "../_shared/constants";

export default function SectionList({ projectId, documentId, sections, allowedTypes }) {
    const [order, setOrder] = useState(sections);

    useEffect(() => {
        setOrder(sections);
    }, [sections]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const persistOrder = (nextOrder) => {
        router.post(
            route("admin.project.documents.sections.reorder", [projectId, documentId]),
            { order: nextOrder.map((s) => s.id) },
            { preserveScroll: true, preserveState: true },
        );
    };

    const moveSection = (id, direction) => {
        const index = order.findIndex((s) => s.id === id);
        const targetIndex = index + direction;
        if (index === -1 || targetIndex < 0 || targetIndex >= order.length) return;

        const next = arrayMove(order, index, targetIndex);
        setOrder(next);
        persistOrder(next);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = order.findIndex((s) => s.id === active.id);
        const newIndex = order.findIndex((s) => s.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const next = arrayMove(order, oldIndex, newIndex);
        setOrder(next);
        persistOrder(next);
    };

    const handleInsert = (sectionType) => {
        router.post(
            route("admin.project.documents.sections.store", [projectId, documentId]),
            { section_type: sectionType, title: SECTION_TYPE_META[sectionType]?.label || sectionType },
            { preserveScroll: true },
        );
    };

    return (
        <div className="space-y-3">
            {order.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-400">
                    <Square3Stack3DIcon className="h-10 w-10" />
                    <p className="text-sm">まだセクションがありません</p>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={order.map((s) => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {order.map((section, index) => (
                                <SortableSectionCard
                                    key={section.id}
                                    projectId={projectId}
                                    documentId={documentId}
                                    section={section}
                                    isFirst={index === 0}
                                    isLast={index === order.length - 1}
                                    onMoveUp={() => moveSection(section.id, -1)}
                                    onMoveDown={() => moveSection(section.id, 1)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            <SectionInserterMenu allowedTypes={allowedTypes} onInsert={handleInsert} />
        </div>
    );
}
