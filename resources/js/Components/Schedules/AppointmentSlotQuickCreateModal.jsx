import Modal from "@/Components/Layout/Modal";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FormGroup, TextInput, TextArea, SelectInput } from "@/Components/Forms";

const slotTypeOptions = [
    { value: "meeting", label: "面談" },
    { value: "progress_review", label: "進捗会" },
    { value: "consultation", label: "相談" },
    { value: "other", label: "その他" },
];

const statusOptions = [
    { value: "available", label: "予約可能" },
    { value: "blocked", label: "ブロック中" },
];

export default function AppointmentSlotQuickCreateModal({
    show,
    data,
    setData,
    errors,
    processing,
    onSubmit,
    onClose,
    admins = [],
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <form onSubmit={onSubmit}>
                <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        予約枠を追加
                    </h3>
                    {data.date && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                            {data.date}
                        </p>
                    )}
                </div>

                <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <FormGroup
                            label="開始時刻"
                            required
                            error={errors.start_time}
                        >
                            <TextInput
                                type="time"
                                value={data.start_time}
                                onChange={(e) =>
                                    setData("start_time", e.target.value)
                                }
                            />
                        </FormGroup>
                        <FormGroup
                            label="終了時刻"
                            required
                            error={errors.end_time}
                        >
                            <TextInput
                                type="time"
                                value={data.end_time}
                                onChange={(e) =>
                                    setData("end_time", e.target.value)
                                }
                            />
                        </FormGroup>
                    </div>

                    <FormGroup label="予約タイプ" required error={errors.slot_type}>
                        <SelectInput
                            options={slotTypeOptions}
                            value={data.slot_type}
                            onChange={(e) =>
                                setData("slot_type", e.target.value)
                            }
                        />
                    </FormGroup>

                    <FormGroup label="担当者" error={errors.assigned_admin_id}>
                        <SelectInput
                            options={[
                                { value: "", label: "未割り当て" },
                                ...admins,
                            ]}
                            value={data.assigned_admin_id}
                            onChange={(e) =>
                                setData("assigned_admin_id", e.target.value)
                            }
                        />
                    </FormGroup>

                    <FormGroup
                        label="最大予約数"
                        required
                        error={errors.max_capacity}
                    >
                        <TextInput
                            type="number"
                            min="1"
                            max="100"
                            value={data.max_capacity}
                            onChange={(e) =>
                                setData("max_capacity", e.target.value)
                            }
                        />
                    </FormGroup>

                    <FormGroup label="ステータス" required error={errors.status}>
                        <SelectInput
                            options={statusOptions}
                            value={data.status}
                            onChange={(e) =>
                                setData("status", e.target.value)
                            }
                        />
                    </FormGroup>

                    <FormGroup label="メモ" error={errors.notes}>
                        <TextArea
                            rows="3"
                            value={data.notes}
                            onChange={(e) =>
                                setData("notes", e.target.value)
                            }
                        />
                    </FormGroup>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-end gap-3">
                    <SecondaryButton type="button" onClick={onClose}>
                        キャンセル
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? "作成中..." : "作成する"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
