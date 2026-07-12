import React, { useEffect, useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { BLOCK_TYPES } from "./registry";

export default function BlockInserterMenu({ onInsert, label = "ブロックを追加" }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const handleSelect = (type) => {
        onInsert(type);
        setOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
                <PlusIcon className="h-4 w-4" />
                {label}
            </button>

            {open && (
                <div className="absolute z-20 mt-2 w-56 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-1">
                    {BLOCK_TYPES.map((block) => {
                        const Icon = block.icon;
                        return (
                            <button
                                key={block.type}
                                type="button"
                                onClick={() => handleSelect(block.type)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <Icon className="h-4 w-4 text-slate-400" />
                                {block.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
