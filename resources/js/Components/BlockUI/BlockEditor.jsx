import React from "react";
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
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import SortableBlockItem from "./SortableBlockItem";
import BlockInserterMenu from "./BlockInserterMenu";
import { createBlock } from "./registry";

/**
 * ページ/投稿の content(json) カラムを対象にしたブロックエディタ。
 * value / onChange は { blocks: [{ id, type, data }] } 形式で受け渡す。
 */
export default function BlockEditor({ value, onChange, allowedTypes, mediaList }) {
    const blocks = Array.isArray(value?.blocks) ? value.blocks : [];

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const emitChange = (nextBlocks) => {
        onChange({ ...(value || {}), blocks: nextBlocks });
    };

    const handleInsert = (type, atIndex = blocks.length) => {
        const newBlock = createBlock(type);
        const next = [...blocks];
        next.splice(atIndex, 0, newBlock);
        emitChange(next);
    };

    const handleBlockChange = (updatedBlock) => {
        emitChange(blocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)));
    };

    const handleDelete = (id) => {
        emitChange(blocks.filter((b) => b.id !== id));
    };

    const handleDuplicate = (id) => {
        const index = blocks.findIndex((b) => b.id === id);
        if (index === -1) return;
        const duplicated = {
            ...blocks[index],
            id: crypto.randomUUID(),
            data: { ...blocks[index].data },
        };
        const next = [...blocks];
        next.splice(index + 1, 0, duplicated);
        emitChange(next);
    };

    const moveBlock = (id, direction) => {
        const index = blocks.findIndex((b) => b.id === id);
        const targetIndex = index + direction;
        if (index === -1 || targetIndex < 0 || targetIndex >= blocks.length) return;
        emitChange(arrayMove(blocks, index, targetIndex));
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        emitChange(arrayMove(blocks, oldIndex, newIndex));
    };

    return (
        <div className="space-y-3">
            {blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-400">
                    <Squares2X2Icon className="h-10 w-10" />
                    <p className="text-sm">まだブロックがありません</p>
                    <BlockInserterMenu
                        onInsert={(type) => handleInsert(type)}
                        allowedTypes={allowedTypes}
                    />
                </div>
            ) : (
                <>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={blocks.map((b) => b.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {blocks.map((block, index) => (
                                    <SortableBlockItem
                                        key={block.id}
                                        block={block}
                                        onChange={handleBlockChange}
                                        onDelete={() => handleDelete(block.id)}
                                        onDuplicate={() => handleDuplicate(block.id)}
                                        onMoveUp={() => moveBlock(block.id, -1)}
                                        onMoveDown={() => moveBlock(block.id, 1)}
                                        isFirst={index === 0}
                                        isLast={index === blocks.length - 1}
                                        mediaList={mediaList}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    <BlockInserterMenu
                        onInsert={(type) => handleInsert(type)}
                        allowedTypes={allowedTypes}
                    />
                </>
            )}
        </div>
    );
}
