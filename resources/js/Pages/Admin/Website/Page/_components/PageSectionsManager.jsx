import React, { useState } from "react";
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
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { SecondaryButton } from "@/Components/Buttons";
import { PlusIcon } from "@heroicons/react/24/outline";
import SortableSectionItem from "./SortableSectionItem";

export default function PageSectionsManager({ page, mediaList = [] }) {
    const sections = Array.isArray(page.sections) ? page.sections : [];
    const allowedTypes = page.pageType?.allowed_component_types || [];
    const [savingId, setSavingId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleSave = (sectionId, data) => {
        setSavingId(sectionId);
        router.put(
            route("admin.website.section.update", sectionId),
            {
                page_id: page.id,
                name: data.name,
                role: data.role,
                content: data.content,
            },
            {
                preserveScroll: true,
                preserveState: true,
                only: ["page", "flash"],
                onFinish: () => setSavingId(null),
            },
        );
    };

    const handleDelete = (sectionId) => {
        if (!confirm("このセクションを削除しますか？")) return;
        router.delete(route("admin.website.section.destroy", sectionId), {
            preserveScroll: true,
            only: ["page", "flash"],
        });
    };

    const handleAdd = () => {
        router.post(
            route("admin.website.section.store"),
            {
                page_id: page.id,
                name: "新しいセクション",
                role: "main",
                sort_order: sections.length,
                content: { blocks: [] },
            },
            {
                preserveScroll: true,
                only: ["page", "flash"],
            },
        );
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(sections, oldIndex, newIndex);
        router.post(
            route("admin.website.section.reorder"),
            { section_ids: reordered.map((s) => s.id) },
            {
                preserveScroll: true,
                preserveState: true,
                only: ["page", "flash"],
            },
        );
    };

    return (
        <Card>
            <CardHeader>セクション構成</CardHeader>
            <CardBody>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    ページ内のセクションを追加・並び替えし、各セクションの中にブロックを組み立てます。変更はセクションごとに保存されます。
                </p>

                {sections.length === 0 ? (
                    <p className="text-sm text-slate-400 py-8 text-center">
                        まだセクションがありません
                    </p>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={sections.map((s) => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {sections.map((section) => (
                                    <SortableSectionItem
                                        key={section.id}
                                        section={section}
                                        onSave={handleSave}
                                        onDelete={handleDelete}
                                        saving={savingId === section.id}
                                        allowedTypes={allowedTypes}
                                        mediaList={mediaList}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}

                <div className="mt-4">
                    <SecondaryButton type="button" onClick={handleAdd}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        セクションを追加
                    </SecondaryButton>
                </div>
            </CardBody>
        </Card>
    );
}
