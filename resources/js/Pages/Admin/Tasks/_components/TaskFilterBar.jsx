import React, { useEffect, useRef, useState } from "react";
import { SelectInput, TextInput } from "@/Components/Forms";

export default function TaskFilterBar({ filters, categories, admins, onChange }) {
    const [tagInput, setTagInput] = useState(filters.tag || "");
    const debounceRef = useRef(null);

    useEffect(() => {
        setTagInput(filters.tag || "");
    }, [filters.tag]);

    const handleTagChange = (e) => {
        const value = e.target.value;
        setTagInput(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            onChange("tag", value);
        }, 400);
    };

    return (
        <div className="mb-4 flex gap-3">
            <SelectInput
                value={filters.admin_id || ""}
                onChange={(e) => onChange("admin_id", e.target.value)}
                options={[{ value: "", label: "すべての担当者" }, ...admins.map((a) => ({ value: a.id, label: a.email }))]}
            />
            <SelectInput
                value={filters.task_category_id || ""}
                onChange={(e) => onChange("task_category_id", e.target.value)}
                options={[{ value: "", label: "すべてのカテゴリ" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
            />
            <SelectInput
                value={filters.priority || ""}
                onChange={(e) => onChange("priority", e.target.value)}
                options={[
                    { value: "", label: "すべての優先度" },
                    { value: "high", label: "高" },
                    { value: "medium", label: "中" },
                    { value: "low", label: "低" },
                ]}
            />
            <TextInput
                value={tagInput}
                onChange={handleTagChange}
                placeholder="タグで絞り込み（完全一致）"
            />
        </div>
    );
}
