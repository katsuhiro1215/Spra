import React from "react";
import { router } from "@inertiajs/react";
// Components
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    InputError,
} from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
// Icons
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function ResponseForm({
    data,
    setData,
    errors,
    processing,
    templates = [],
    placeholders = [],
    contact,
    onSubmit,
    isEdit = false,
    selectedTemplate,
    setSelectedTemplate,
}) {
    const handleTemplateChange = (templateId) => {
        if (templateId) {
            const template = templates.find((t) => t.id === templateId);
            if (template) {
                setSelectedTemplate(template);
                if (
                    !isEdit ||
                    confirm("テンプレートの内容で上書きしますか？")
                ) {
                    setData({
                        ...data,
                        ...(isEdit ? {} : { response_template_id: templateId }),
                        subject: template.subject || data.subject,
                        body: template.body || data.body,
                    });
                }
            }
        } else {
            setSelectedTemplate(null);
            if (!isEdit) {
                setData("response_template_id", "");
            }
        }
    };

    const insertPlaceholder = (placeholder) => {
        const textarea = document.getElementById("response-body");
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = data.body;
        const before = text.substring(0, start);
        const after = text.substring(end);
        setData("body", before + placeholder + after);

        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd =
                start + placeholder.length;
            textarea.focus();
        }, 0);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* メインコンテンツ */}
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>返信内容</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={(e) => onSubmit(e, false)}>
                            <div className="space-y-6">
                                {/* テンプレート選択 */}
                                {templates.length > 0 && (
                                    <FormGroup
                                        label="テンプレートを使用"
                                        htmlFor="response_template_id"
                                        help="返信内容のテンプレートを選択できます。選択すると件名と本文がテンプレートの内容で上書きされます。"
                                    >
                                        <SelectInput
                                            id="response_template_id"
                                            value={
                                                isEdit
                                                    ? ""
                                                    : data.response_template_id
                                            }
                                            onChange={(e) =>
                                                handleTemplateChange(
                                                    e.target.value,
                                                )
                                            }
                                            error={errors.response_template_id}
                                        >
                                            <option value="">
                                                テンプレートなし
                                            </option>
                                            {templates.map((template) => (
                                                <option
                                                    key={template.id}
                                                    value={template.id}
                                                >
                                                    {template.name}
                                                </option>
                                            ))}
                                        </SelectInput>
                                        <InputError
                                            className="mt-2"
                                            message={
                                                errors.response_template_id
                                            }
                                        />
                                    </FormGroup>
                                )}

                                {/* 件名 */}
                                <FormGroup
                                    label="件名"
                                    htmlFor="subject"
                                    required
                                    help={`返信の件名を入力してください。通常は "Re: ${contact.subject}" の形式になります。`}
                                >
                                    <TextInput
                                        id="subject"
                                        value={data.subject}
                                        onChange={(e) =>
                                            setData("subject", e.target.value)
                                        }
                                        error={errors.subject}
                                        required
                                        placeholder={
                                            !isEdit
                                                ? `Re: ${contact.subject}`
                                                : undefined
                                        }
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.subject}
                                    />
                                </FormGroup>

                                {/* 本文 */}
                                <FormGroup
                                    label="本文"
                                    htmlFor="body"
                                    required
                                    help="返信内容を入力してください。プレースホルダーを使用して、受信者の名前やお問い合わせの内容などを動的に挿入できます。"
                                >
                                    <TextArea
                                        id="response-body"
                                        value={data.body}
                                        onChange={(e) =>
                                            setData("body", e.target.value)
                                        }
                                        error={errors.body}
                                        required
                                        rows={12}
                                        placeholder="返信内容を入力してください..."
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.body}
                                    />

                                    {/* プレースホルダー挿入ボタン */}
                                    {placeholders.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                プレースホルダーを挿入:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {placeholders.map((ph) => (
                                                    <button
                                                        key={ph.value}
                                                        type="button"
                                                        onClick={() =>
                                                            insertPlaceholder(
                                                                ph.value,
                                                            )
                                                        }
                                                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded border border-gray-300 dark:border-slate-600 dark:text-gray-300 transition-colors"
                                                    >
                                                        {ph.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </FormGroup>

                                {/* アクションボタン */}
                                <div className="flex gap-3">
                                    <PrimaryButton
                                        type="button"
                                        onClick={(e) => onSubmit(e, true)}
                                        disabled={processing}
                                        icon={PaperAirplaneIcon}
                                    >
                                        送信する
                                    </PrimaryButton>
                                    <SecondaryButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        下書き保存
                                    </SecondaryButton>
                                    <SecondaryButton
                                        type="button"
                                        onClick={() =>
                                            router.visit(
                                                route(
                                                    "admin.contact.show",
                                                    contact.id,
                                                ),
                                            )
                                        }
                                        disabled={processing}
                                    >
                                        キャンセル
                                    </SecondaryButton>
                                </div>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>

            {/* サイドバー */}
            <div className="space-y-6">
                {/* お問い合わせ情報 */}
                <Card>
                    <CardHeader>
                        <CardTitle>お問い合わせ情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4 text-sm">
                            <div className="space-y-1">
                                <span className="text-gray-600 dark:text-gray-400">
                                    送信先:
                                </span>
                                <p className="font-medium dark:text-gray-100">
                                    {contact.name}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {contact.email}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-gray-600 dark:text-gray-400">
                                    元の件名:
                                </span>
                                <p className="font-medium dark:text-gray-100">
                                    {contact.subject}
                                </p>
                            </div>
                            {contact.category_label && (
                                <div className="space-y-1">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        カテゴリ:
                                    </span>
                                    <p className="font-medium dark:text-gray-100">
                                        {contact.category_label ||
                                            contact.category}
                                    </p>
                                </div>
                            )}
                            {!isEdit && (
                                <div className="space-y-1">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        受信日時:
                                    </span>
                                    <p className="font-medium dark:text-gray-100">
                                        {new Date(
                                            contact.created_at,
                                        ).toLocaleString("ja-JP")}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>

                {/* 元のメッセージ */}
                <Card>
                    <CardHeader>
                        <CardTitle>元のメッセージ</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-slate-800 rounded p-3 max-h-60 overflow-y-auto">
                            {contact.message}
                        </div>
                    </CardBody>
                </Card>

                {/* 選択中のテンプレート情報 */}
                {selectedTemplate && (
                    <Card>
                        <CardHeader>
                            <CardTitle>テンプレート情報</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-2 text-sm">
                                <div className="space-y-1">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        名前:
                                    </span>
                                    <p className="font-medium dark:text-gray-100">
                                        {selectedTemplate.name}
                                    </p>
                                </div>
                                {selectedTemplate.category && (
                                    <div className="space-y-1">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            カテゴリ:
                                        </span>
                                        <p className="font-medium dark:text-gray-100">
                                            {selectedTemplate.category}
                                        </p>
                                    </div>
                                )}
                                {selectedTemplate.description && (
                                    <div className="space-y-1">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            説明:
                                        </span>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {selectedTemplate.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                )}
            </div>
        </div>
    );
}
