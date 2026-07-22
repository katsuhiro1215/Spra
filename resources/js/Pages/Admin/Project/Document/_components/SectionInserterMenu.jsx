import React, { useEffect, useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { SECTION_TYPE_META } from "../_shared/constants";

export default function SectionInserterMenu({ allowedTypes, onInsert }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    const types = (allowedTypes && allowedTypes.length > 0
        ? allowedTypes
        : Object.keys(SECTION_TYPE_META)
    ).filter((type) => SECTION_TYPE_META[type]);

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
                className="w-full px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2 font-medium"
            >
                <PlusIcon className="h-5 w-5" />
                セクションを追加
            </button>

            {open && (
                <div className="absolute z-20 mt-2 w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-1">
                    {types.map((type) => {
                        const meta = SECTION_TYPE_META[type];
                        const Icon = meta.icon;
                        return (
                            <button
                                key={type}
                                type="button"
                                onClick={() => handleSelect(type)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <Icon className="h-4 w-4 text-slate-400" />
                                {meta.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
