import React from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Layout/Modal";
import { FormGroup, TextInput, TextArea, SelectInput, Checkbox } from "@/Components/Forms";
import { Button, CrudButton } from "@/Components/Buttons";
import { WEEKDAYS } from "./recurrence";

export default function RecurringTaskFormModal({ show, onClose, template, categories, admins }) {
    const rule = template?.recurrence_rule || {};
    const { data, setData, put, processing, errors, transform } = useForm({
        title: template?.title || "",
        description: template?.description || "",
        priority: template?.priority || "medium",
        task_category_id: template?.category?.id || "",
        admin_id: template?.admin?.id || "",
        due_time: template?.due_time?.slice(0, 5) || "",
        tagsInput: (template?.tags || []).join(", "),
        freq: rule.freq || "daily",
        byweekday: rule.byweekday || [],
    });

    transform(({ freq, byweekday, tagsInput, ...rest }) => ({
        ...rest,
        tags: tagsInput
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        recurrence_rule: { freq, ...(freq === "weekly" ? { byweekday } : {}) },
    }));

    const missingWeekday = data.freq === "weekly" && data.byweekday.length === 0;

    const toggleWeekday = (value) => {
        setData(
            "byweekday",
            data.byweekday.includes(value) ? data.byweekday.filter((d) => d !== value) : [...data.byweekday, value],
        );
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.recurring-task.update", template.id), { onSuccess: onClose, preserveScroll: true });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={submit} className="space-y-6 p-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">繰り返し設定の編集</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        変更内容は、今日以降の未着手のタスクにも反映されます。着手済み・完了済みのタスクは変わりません。
                    </p>
                </div>
                <FormGroup label="タイトル" htmlFor="title" required error={errors.title}>
                    <TextInput id="title" value={data.title} onChange={(e) => setData("title", e.target.value)} />
                </FormGroup>
                <FormGroup label="説明" htmlFor="description" error={errors.description}>
                    <TextArea id="description" value={data.description} onChange={(e) => setData("description", e.target.value)} />
                </FormGroup>
                <div className="grid grid-cols-2 gap-4">
                    <FormGroup label="頻度" htmlFor="freq" error={errors["recurrence_rule.freq"]}>
                        <SelectInput
                            id="freq"
                            value={data.freq}
                            onChange={(e) => setData("freq", e.target.value)}
                            options={[{ value: "daily", label: "毎日" }, { value: "weekly", label: "毎週" }]}
                        />
                    </FormGroup>
                    <FormGroup label="時刻" htmlFor="due_time" error={errors.due_time}>
                        <TextInput id="due_time" type="time" value={data.due_time} onChange={(e) => setData("due_time", e.target.value)} />
                    </FormGroup>
                </div>
                {data.freq === "weekly" && (
                    <FormGroup
                        label="曜日"
                        htmlFor="byweekday"
                        error={missingWeekday ? "少なくとも1つの曜日を選択してください" : errors["recurrence_rule.byweekday"]}
                    >
                        <div className="flex flex-wrap gap-3">
                            {WEEKDAYS.map((day) => (
                                <Checkbox
                                    key={day.value}
                                    id={`recurring-byweekday-${day.value}`}
                                    checked={data.byweekday.includes(day.value)}
                                    onChange={() => toggleWeekday(day.value)}
                                    label={day.label}
                                />
                            ))}
                        </div>
                    </FormGroup>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <FormGroup label="優先度" htmlFor="priority" error={errors.priority}>
                        <SelectInput
                            id="priority"
                            value={data.priority}
                            onChange={(e) => setData("priority", e.target.value)}
                            options={[{ value: "high", label: "高" }, { value: "medium", label: "中" }, { value: "low", label: "低" }]}
                        />
                    </FormGroup>
                    <FormGroup label="カテゴリ" htmlFor="task_category_id" error={errors.task_category_id}>
                        <SelectInput
                            id="task_category_id"
                            value={data.task_category_id}
                            onChange={(e) => setData("task_category_id", e.target.value)}
                            options={[{ value: "", label: "未分類" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
                        />
                    </FormGroup>
                </div>
                <FormGroup label="担当者" htmlFor="admin_id" error={errors.admin_id}>
                    <SelectInput
                        id="admin_id"
                        value={data.admin_id}
                        onChange={(e) => setData("admin_id", e.target.value)}
                        options={[{ value: "", label: "未割当" }, ...admins.map((a) => ({ value: a.id, label: a.email }))]}
                    />
                </FormGroup>
                <FormGroup label="タグ" htmlFor="tagsInput" error={errors.tags || errors["tags.0"]}>
                    <TextInput
                        id="tagsInput"
                        value={data.tagsInput}
                        onChange={(e) => setData("tagsInput", e.target.value)}
                        placeholder="カンマ区切りで入力（例: SNS, 投稿）"
                    />
                </FormGroup>
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>キャンセル</Button>
                    <CrudButton type="submit" action="update" loading={processing} disabled={missingWeekday}>
                        更新
                    </CrudButton>
                </div>
            </form>
        </Modal>
    );
}
