import Modal from "@/Components/Layout/Modal";
import Button from "@/Components/Buttons/Button";
import { FormGroup, TextInput, TextArea, SelectInput, Checkbox } from "@/Components/Forms";

const TYPE_OPTIONS = [
    { value: "progress", label: "進捗報告" },
    { value: "issue", label: "課題・障害" },
    { value: "milestone", label: "マイルストーン" },
    { value: "general", label: "一般報告" },
];

export default function ProjectUpdateModal({
    show,
    mode = "create",
    data,
    setData,
    errors,
    processing,
    onSubmit,
    onClose,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={onSubmit}>
                <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        {mode === "create" ? "更新情報を追加" : "更新情報を編集"}
                    </h3>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <FormGroup label="タイトル" error={errors.title} required>
                        <TextInput
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                        />
                    </FormGroup>

                    <FormGroup label="タイプ" error={errors.type} required>
                        <SelectInput
                            value={data.type}
                            onChange={(e) => setData("type", e.target.value)}
                        >
                            {TYPE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </SelectInput>
                    </FormGroup>

                    <FormGroup label="内容" error={errors.content} required>
                        <TextArea
                            rows={5}
                            value={data.content}
                            onChange={(e) => setData("content", e.target.value)}
                        />
                    </FormGroup>

                    <label className="flex items-center gap-2">
                        <Checkbox
                            checked={data.is_client_visible}
                            onChange={(e) =>
                                setData("is_client_visible", e.target.checked)
                            }
                        />
                        <span className="text-sm text-gray-700 dark:text-slate-300">
                            クライアントに公開する
                        </span>
                    </label>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        キャンセル
                    </Button>
                    <Button type="submit" variant="primary" disabled={processing}>
                        {mode === "create" ? "追加" : "保存"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
