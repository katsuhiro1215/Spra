import React from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Layout/Modal";
import { FormGroup, TextInput, TextArea, SelectInput } from "@/Components/Forms";
import { Button, CrudButton } from "@/Components/Buttons";

export default function TaskFormModal({ show, onClose, task, categories, admins }) {
    const isEdit = Boolean(task);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: task?.title || "",
        description: task?.description || "",
        priority: task?.priority || "medium",
        task_category_id: task?.category?.id || "",
        admin_id: task?.admin?.id || "",
        due_date: task?.due_date || "",
        due_time: task?.due_time?.slice(0, 5) || "",
    });

    const submit = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                reset();
                onClose();
            },
        };

        if (isEdit) {
            put(route("admin.task.update", task.id), options);
        } else {
            post(route("admin.task.store"), options);
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={submit} className="space-y-6 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {isEdit ? "タスク編集" : "タスク作成"}
                </h2>
                <FormGroup label="タイトル" htmlFor="title" required error={errors.title}>
                    <TextInput id="title" value={data.title} onChange={(e) => setData("title", e.target.value)} />
                </FormGroup>
                <FormGroup label="説明" htmlFor="description" error={errors.description}>
                    <TextArea id="description" value={data.description} onChange={(e) => setData("description", e.target.value)} />
                </FormGroup>
                <div className="grid grid-cols-2 gap-4">
                    <FormGroup label="期限日" htmlFor="due_date" required error={errors.due_date}>
                        <TextInput id="due_date" type="date" value={data.due_date} onChange={(e) => setData("due_date", e.target.value)} />
                    </FormGroup>
                    <FormGroup label="期限時刻" htmlFor="due_time" error={errors.due_time}>
                        <TextInput id="due_time" type="time" value={data.due_time} onChange={(e) => setData("due_time", e.target.value)} />
                    </FormGroup>
                </div>
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
                <FormGroup label="担当者" htmlFor="admin_id" error={errors.admin_id}>
                    <SelectInput
                        id="admin_id"
                        value={data.admin_id}
                        onChange={(e) => setData("admin_id", e.target.value)}
                        options={[{ value: "", label: "未割当" }, ...admins.map((a) => ({ value: a.id, label: a.email }))]}
                    />
                </FormGroup>
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>キャンセル</Button>
                    <CrudButton type="submit" action={isEdit ? "update" : "store"} loading={processing}>
                        {isEdit ? "更新" : "作成"}
                    </CrudButton>
                </div>
            </form>
        </Modal>
    );
}
