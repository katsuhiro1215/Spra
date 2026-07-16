import React from "react";
import { useForm } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    NumberInput,
    SelectInput,
} from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";

const Form = ({ template = null, isEditing = false }) => {
    const { data, setData, post, put, processing, errors } = useForm({
        name: template?.name || "",
        category: template?.category || "general",
        subject: template?.subject || "",
        body: template?.body || "",
        placeholders: template?.placeholders || "",
        status: template?.status || "active",
        sort_order: template?.sort_order || 0,
    });

    const categories = [
        { value: "general", label: "一般" },
        { value: "estimate", label: "見積もり" },
        { value: "technical", label: "技術" },
        { value: "sales", label: "営業" },
        { value: "support", label: "サポート" },
        { value: "other", label: "その他" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing && template) {
            put(route("admin.response.template.update", template.id), {
                preserveScroll: true,
            });
        } else {
            post(route("admin.response.template.store"), {
                preserveScroll: true,
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                {isEditing ? "テンプレートを編集" : "新しいテンプレートを作成"}
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* テンプレート名 */}
                    <FormGroup
                        label="テンプレート名"
                        htmlFor="name"
                        required
                        error={errors.name}
                    >
                        <TextInput
                            id="name"
                            placeholder="例: 見積もり確認メール"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                    </FormGroup>

                    {/* カテゴリ */}
                    <FormGroup
                        label="カテゴリ"
                        htmlFor="category"
                        required
                        error={errors.category}
                    >
                        <SelectInput
                            id="category"
                            value={data.category}
                            onChange={(e) =>
                                setData("category", e.target.value)
                            }
                            options={categories}
                            required
                        />
                    </FormGroup>

                    {/* 件名 */}
                    <FormGroup
                        label="件名"
                        htmlFor="subject"
                        required
                        error={errors.subject}
                    >
                        <TextInput
                            id="subject"
                            placeholder="例: お見積もり送付のご案内"
                            value={data.subject}
                            onChange={(e) => setData("subject", e.target.value)}
                            required
                        />
                        <div className="text-sm text-gray-500 mt-1">
                            {data.subject.length}/255
                        </div>
                    </FormGroup>

                    {/* テンプレート本文 */}
                    <FormGroup
                        label="テンプレート本文"
                        htmlFor="body"
                        required
                        error={errors.body}
                    >
                        <TextArea
                            id="body"
                            placeholder="メール本文を入力してください。プレースホルダー: {contact_name}, {admin_name}, {app_name} など"
                            value={data.body}
                            onChange={(e) => setData("body", e.target.value)}
                            rows={10}
                            required
                        />
                        <div className="text-sm text-gray-500 mt-1">
                            {data.body.length}/10000
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3 mt-2 text-xs text-blue-800 dark:text-blue-300">
                            <strong>利用可能なプレースホルダー:</strong>
                            <br />
                            {"{contact_name}"} - お問い合わせ者名
                            <br />
                            {"{contact_email}"} - メールアドレス
                            <br />
                            {"{contact_subject}"} - お問い合わせ件名
                            <br />
                            {"{admin_name}"} - 管理者名
                            <br />
                            {"{app_name}"} - アプリケーション名
                        </div>
                    </FormGroup>

                    {/* プレースホルダー */}
                    <FormGroup
                        label="プレースホルダー（カンマ区切り）"
                        htmlFor="placeholders"
                        error={errors.placeholders}
                    >
                        <TextInput
                            id="placeholders"
                            placeholder="contact_name, admin_name, app_name"
                            value={data.placeholders}
                            onChange={(e) =>
                                setData("placeholders", e.target.value)
                            }
                        />
                        <div className="text-sm text-gray-500 mt-1">
                            このテンプレートで使用するプレースホルダーを記録してください
                        </div>
                    </FormGroup>

                    {/* 並び順 */}
                    <FormGroup
                        label="表示順"
                        htmlFor="sort_order"
                        error={errors.sort_order}
                    >
                        <NumberInput
                            id="sort_order"
                            min={0}
                            placeholder="0"
                            value={data.sort_order}
                            onChange={(val) => setData("sort_order", val || 0)}
                        />
                        <div className="text-sm text-gray-500 mt-1">
                            数字が小さいほど上に表示されます
                        </div>
                    </FormGroup>

                    {/* ステータス */}
                    <FormGroup label="ステータス" error={errors.status}>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.status === "active"}
                                onChange={(e) =>
                                    setData(
                                        "status",
                                        e.target.checked
                                            ? "active"
                                            : "inactive",
                                    )
                                }
                                className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-700"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                アクティブ（有効化）
                            </span>
                        </label>
                    </FormGroup>

                    {/* ボタン */}
                    <div className="flex gap-3 pt-6">
                        <PrimaryButton type="submit" disabled={processing}>
                            {isEditing ? "更新" : "作成"}
                        </PrimaryButton>
                        <SecondaryButton
                            type="button"
                            href={route("admin.response.template.index")}
                            disabled={processing}
                        >
                            キャンセル
                        </SecondaryButton>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
};

export default Form;
