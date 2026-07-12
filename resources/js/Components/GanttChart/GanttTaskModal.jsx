import Modal from "@/Components/Layout/Modal";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FormGroup, TextInput, TextArea, SelectInput } from "@/Components/Forms";

const statusOptions = [
    { value: "not_started", label: "未着手" },
    { value: "in_progress", label: "進行中" },
    { value: "completed", label: "完了" },
    { value: "on_hold", label: "保留" },
    { value: "cancelled", label: "キャンセル" },
];

const priorityOptions = [
    { value: "low", label: "低" },
    { value: "medium", label: "中" },
    { value: "high", label: "高" },
    { value: "urgent", label: "緊急" },
];

export default function GanttTaskModal({
    show,
    mode = "create",
    data,
    setData,
    errors,
    processing,
    onSubmit,
    onClose,
    milestones = [],
    admins = [],
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={onSubmit}>
                <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        {mode === "create" ? "タスクを追加" : "タスクを編集"}
                    </h3>
                </div>

                <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    <FormGroup label="タスク名" required error={errors.title}>
                        <TextInput
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            placeholder="例：フロントエンド開発"
                        />
                    </FormGroup>

                    <FormGroup label="説明" error={errors.description}>
                        <TextArea
                            rows="3"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />
                    </FormGroup>

                    <div className="grid grid-cols-2 gap-4">
                        <FormGroup
                            label="開始日"
                            required
                            error={errors.start_date}
                        >
                            <TextInput
                                type="date"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData("start_date", e.target.value)
                                }
                            />
                        </FormGroup>

                        <FormGroup
                            label="終了日"
                            required
                            error={errors.end_date}
                        >
                            <TextInput
                                type="date"
                                value={data.end_date}
                                onChange={(e) =>
                                    setData("end_date", e.target.value)
                                }
                            />
                        </FormGroup>
                    </div>

                    <FormGroup label="マイルストーン" error={errors.milestone_id}>
                        <SelectInput
                            value={data.milestone_id}
                            onChange={(e) =>
                                setData("milestone_id", e.target.value)
                            }
                        >
                            <option value="">なし</option>
                            {milestones.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.title}
                                </option>
                            ))}
                        </SelectInput>
                    </FormGroup>

                    <div className="grid grid-cols-2 gap-4">
                        <FormGroup label="ステータス" required error={errors.status}>
                            <SelectInput
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                            >
                                {statusOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </SelectInput>
                        </FormGroup>

                        <FormGroup label="優先度" error={errors.priority}>
                            <SelectInput
                                value={data.priority}
                                onChange={(e) =>
                                    setData("priority", e.target.value)
                                }
                            >
                                {priorityOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </SelectInput>
                        </FormGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormGroup
                            label="担当者"
                            error={errors.assigned_to}
                        >
                            <SelectInput
                                value={data.assigned_to}
                                onChange={(e) =>
                                    setData("assigned_to", e.target.value)
                                }
                            >
                                <option value="">未割当</option>
                                {admins.map((admin) => (
                                    <option key={admin.id} value={admin.id}>
                                        {admin.profile?.full_name ||
                                            admin.email}
                                    </option>
                                ))}
                            </SelectInput>
                        </FormGroup>

                        <FormGroup
                            label="見積もり時間"
                            error={errors.estimated_hours}
                        >
                            <TextInput
                                type="number"
                                min="0"
                                value={data.estimated_hours}
                                onChange={(e) =>
                                    setData(
                                        "estimated_hours",
                                        e.target.value,
                                    )
                                }
                            />
                        </FormGroup>
                    </div>

                    {mode === "edit" && (
                        <FormGroup
                            label={`進捗率 (${data.progress ?? 0}%)`}
                            error={errors.progress}
                        >
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={data.progress ?? 0}
                                onChange={(e) =>
                                    setData(
                                        "progress",
                                        parseInt(e.target.value, 10),
                                    )
                                }
                                className="w-full"
                            />
                        </FormGroup>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
                    <SecondaryButton type="button" onClick={onClose}>
                        キャンセル
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing
                            ? "保存中..."
                            : mode === "create"
                              ? "追加"
                              : "更新"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
