import React from "react";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    Checkbox,
    InputError,
} from "@/Components/Forms";
import { XMarkIcon } from "@heroicons/react/24/outline";

const statusOptions = [
    { value: "planning", label: "計画中" },
    { value: "design", label: "デザイン中" },
    { value: "development", label: "開発中" },
    { value: "testing", label: "テスト中" },
    { value: "review", label: "レビュー中" },
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

const roleOptions = [
    { value: "leader", label: "リーダー" },
    { value: "designer", label: "デザイン担当" },
    { value: "developer", label: "開発担当" },
    { value: "manager", label: "マネージャー" },
    { value: "other", label: "その他" },
];

export default function ProjectForm({
    data,
    setData,
    errors,
    contracts = [],
    users = [],
    companies = [],
    admins = [],
    technologiesByContract = {},
    isEditMode = false,
}) {
    const handleChange = (field, value) => {
        setData(field, value);
    };

    const availableTechnologies = data.contract_id
        ? technologiesByContract[data.contract_id] || []
        : [];

    const handleContractChange = (contractId) => {
        handleChange("contract_id", contractId);

        // 契約変更に伴い、新しい契約先サービスの候補に含まれない技術は選択解除する
        const nextAvailableIds = (
            technologiesByContract[contractId] || []
        ).map((technology) => technology.id);
        handleChange(
            "technology_ids",
            (data.technology_ids || []).filter((id) =>
                nextAvailableIds.includes(id),
            ),
        );
    };

    const handleAdminEntryChange = (index, field, value) => {
        const next = [...(data.admins || [])];
        next[index] = { ...next[index], [field]: value };
        handleChange("admins", next);
    };

    const addAdminEntry = () => {
        handleChange("admins", [
            ...(data.admins || []),
            { admin_id: "", role: "other" },
        ]);
    };

    const removeAdminEntry = (index) => {
        handleChange(
            "admins",
            (data.admins || []).filter((_, i) => i !== index),
        );
    };

    const toggleTechnology = (technologyId) => {
        const current = data.technology_ids || [];
        handleChange(
            "technology_ids",
            current.includes(technologyId)
                ? current.filter((id) => id !== technologyId)
                : [...current, technologyId],
        );
    };

    // オプションに変換
    const contractOptions = [
        { value: "", label: "なし" },
        ...contracts.map((contract) => ({
            value: contract.id,
            label: contract.contract_number || `契約 #${contract.id}`,
        })),
    ];

    const userOptions = [
        { value: "", label: "選択してください" },
        ...users.map((user) => ({
            value: user.id,
            label: user.profile?.full_name || user.email,
        })),
    ];

    const companyOptions = [
        { value: "", label: "なし" },
        ...companies.map((company) => ({
            value: company.id,
            label: company.name,
        })),
    ];

    const adminOptions = [
        { value: "", label: "選択してください" },
        ...admins.map((admin) => ({
            value: admin.id,
            label: admin.profile?.full_name || admin.email,
        })),
    ];

    return (
        <div className="space-y-6">
            {/* 基本情報 */}
            <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    基本情報
                </h3>
                <div className="space-y-6">
                    {isEditMode && data.project_code && (
                        <FormGroup label="プロジェクトコード">
                            <TextInput
                                value={data.project_code}
                                disabled
                                className="bg-slate-50 dark:bg-slate-900"
                            />
                        </FormGroup>
                    )}

                    <FormGroup label="タイトル" error={errors.title} required>
                        <TextInput
                            value={data.title}
                            onChange={(e) =>
                                handleChange("title", e.target.value)
                            }
                            placeholder="プロジェクトのタイトルを入力"
                            error={errors.title}
                        />
                    </FormGroup>

                    <FormGroup label="説明" error={errors.description}>
                        <TextArea
                            value={data.description}
                            onChange={(e) =>
                                handleChange("description", e.target.value)
                            }
                            placeholder="プロジェクトの説明を入力"
                            rows={4}
                            error={errors.description}
                        />
                    </FormGroup>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup
                            label="ステータス"
                            error={errors.status}
                            required
                        >
                            <SelectInput
                                value={data.status}
                                onChange={(e) =>
                                    handleChange("status", e.target.value)
                                }
                                options={statusOptions}
                                error={errors.status}
                            />
                        </FormGroup>

                        <FormGroup
                            label="優先度"
                            error={errors.priority}
                            required
                        >
                            <SelectInput
                                value={data.priority}
                                onChange={(e) =>
                                    handleChange("priority", e.target.value)
                                }
                                options={priorityOptions}
                                error={errors.priority}
                            />
                        </FormGroup>
                    </div>
                </div>
            </div>

            {/* 関連情報 */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    関連情報
                </h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup label="契約" error={errors.contract_id}>
                            <SelectInput
                                value={data.contract_id || ""}
                                onChange={(e) =>
                                    handleContractChange(e.target.value)
                                }
                                options={contractOptions}
                                error={errors.contract_id}
                            />
                        </FormGroup>
                    </div>
                </div>
            </div>

            {/* 関連リンク */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    関連リンク
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormGroup
                        label="リポジトリURL"
                        error={errors.repository_url}
                    >
                        <TextInput
                            value={data.repository_url || ""}
                            onChange={(e) =>
                                handleChange(
                                    "repository_url",
                                    e.target.value,
                                )
                            }
                            placeholder="https://github.com/org/repo"
                            error={errors.repository_url}
                        />
                    </FormGroup>

                    <FormGroup
                        label="公開URL"
                        error={errors.production_url}
                    >
                        <TextInput
                            value={data.production_url || ""}
                            onChange={(e) =>
                                handleChange(
                                    "production_url",
                                    e.target.value,
                                )
                            }
                            placeholder="https://example.com"
                            error={errors.production_url}
                        />
                    </FormGroup>
                </div>
            </div>

            {/* 使用技術 */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    使用技術
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    契約先のサービスに登録されている技術の中から、このプロジェクトで実際に使用しているものを選択してください。クライアントにも表示されます。
                </p>
                {!data.contract_id ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        契約を選択すると、使用技術を選べるようになります。
                    </p>
                ) : availableTechnologies.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        この契約のサービスには使用技術が登録されていません。サービス側の「使用技術」設定を確認してください。
                    </p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {availableTechnologies.map((technology) => (
                            <label
                                key={technology.id}
                                className="flex items-center"
                            >
                                <Checkbox
                                    checked={(
                                        data.technology_ids || []
                                    ).includes(technology.id)}
                                    onChange={() =>
                                        toggleTechnology(technology.id)
                                    }
                                />
                                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                                    {technology.name}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
                <InputError message={errors.technology_ids} />
            </div>

            {/* クライアント情報 */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    クライアント情報
                </h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup
                            label="クライアント"
                            error={errors.user_id}
                            required
                        >
                            <SelectInput
                                value={data.user_id || ""}
                                onChange={(e) =>
                                    handleChange("user_id", e.target.value)
                                }
                                options={userOptions}
                                error={errors.user_id}
                            />
                        </FormGroup>

                        <FormGroup label="企業" error={errors.company_id}>
                            <SelectInput
                                value={data.company_id || ""}
                                onChange={(e) =>
                                    handleChange("company_id", e.target.value)
                                }
                                options={companyOptions}
                                error={errors.company_id}
                            />
                        </FormGroup>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                担当管理者{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={addAdminEntry}
                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                            >
                                + 担当者を追加
                            </button>
                        </div>
                        <div className="space-y-3">
                            {(data.admins || []).map((entry, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-2"
                                >
                                    <div className="flex-1">
                                        <SelectInput
                                            value={entry.admin_id}
                                            onChange={(e) =>
                                                handleAdminEntryChange(
                                                    index,
                                                    "admin_id",
                                                    e.target.value,
                                                )
                                            }
                                            options={adminOptions}
                                            error={
                                                errors[
                                                    `admins.${index}.admin_id`
                                                ]
                                            }
                                        />
                                    </div>
                                    <div className="w-40">
                                        <SelectInput
                                            value={entry.role}
                                            onChange={(e) =>
                                                handleAdminEntryChange(
                                                    index,
                                                    "role",
                                                    e.target.value,
                                                )
                                            }
                                            options={roleOptions}
                                            error={
                                                errors[`admins.${index}.role`]
                                            }
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeAdminEntry(index)
                                        }
                                        disabled={
                                            (data.admins || []).length <= 1
                                        }
                                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="削除"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.admins} />
                    </div>
                </div>
            </div>

            {/* 日程 */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    日程
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormGroup label="開始日" error={errors.start_date}>
                        <TextInput
                            type="date"
                            value={data.start_date || ""}
                            onChange={(e) =>
                                handleChange("start_date", e.target.value)
                            }
                            error={errors.start_date}
                        />
                    </FormGroup>

                    <FormGroup
                        label="予定終了日"
                        error={errors.estimated_end_date}
                    >
                        <TextInput
                            type="date"
                            value={data.estimated_end_date || ""}
                            onChange={(e) =>
                                handleChange(
                                    "estimated_end_date",
                                    e.target.value,
                                )
                            }
                            error={errors.estimated_end_date}
                        />
                    </FormGroup>

                    <FormGroup
                        label="実際の終了日"
                        error={errors.actual_end_date}
                    >
                        <TextInput
                            type="date"
                            value={data.actual_end_date || ""}
                            onChange={(e) =>
                                handleChange("actual_end_date", e.target.value)
                            }
                            error={errors.actual_end_date}
                        />
                    </FormGroup>
                </div>
            </div>

            {/* ノート */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    ノート
                </h3>
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={data.is_client_visible || false}
                            onChange={(e) =>
                                handleChange(
                                    "is_client_visible",
                                    e.target.checked,
                                )
                            }
                        />
                        <label className="text-sm text-slate-700 dark:text-slate-300">
                            クライアントに表示する
                        </label>
                    </div>

                    <FormGroup
                        label="クライアント向けノート"
                        error={errors.client_visible_notes}
                    >
                        <TextArea
                            value={data.client_visible_notes || ""}
                            onChange={(e) =>
                                handleChange(
                                    "client_visible_notes",
                                    e.target.value,
                                )
                            }
                            placeholder="クライアントに表示されるノート"
                            rows={4}
                            error={errors.client_visible_notes}
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
}
