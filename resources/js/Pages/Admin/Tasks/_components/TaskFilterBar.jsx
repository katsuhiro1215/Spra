import React, { useEffect, useRef, useState } from "react";
import { SelectInput, TextInput } from "@/Components/Forms";
import Avatar from "@/Components/Avatar";

// AI社員アバターの右下に重ねる小さなバッジ（TaskCardと同じ見た目に揃える）
const AiStaffBadge = () => (
    <span className="flex h-3 w-3 items-center justify-center rounded-full bg-white text-[8px] ring-1 ring-gray-300">
        🤖
    </span>
);

function AssigneeFilterStrip({ admins, selectedId, onSelect }) {
    return (
        <div className="flex flex-wrap items-center gap-1.5">
            <button
                type="button"
                onClick={() => onSelect("")}
                title="すべての担当者"
                className={`flex h-8 items-center rounded-full px-3 text-xs font-medium transition ${
                    !selectedId
                        ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-400"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
            >
                すべて
            </button>
            {admins.map((admin) => (
                <button
                    key={admin.id}
                    type="button"
                    onClick={() => onSelect(admin.id)}
                    title={admin.email}
                    className={`rounded-full transition ${
                        String(selectedId) === String(admin.id) ? "ring-2 ring-indigo-400 ring-offset-1" : ""
                    }`}
                >
                    <Avatar
                        name={admin.email}
                        size="sm"
                        variant={admin.role === "ai_staff" ? "info" : "primary"}
                        badge={admin.role === "ai_staff" ? <AiStaffBadge /> : null}
                    />
                </button>
            ))}
        </div>
    );
}

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
        <div className="mb-4 space-y-3">
            <AssigneeFilterStrip
                admins={admins}
                selectedId={filters.admin_id || ""}
                onSelect={(id) => onChange("admin_id", id)}
            />
            <div className="flex gap-3">
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
        </div>
    );
}
