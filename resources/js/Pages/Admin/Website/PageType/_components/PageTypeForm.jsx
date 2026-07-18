import React from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    InputError,
    Toggle,
    ArrayFieldEditor,
} from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import { BLOCK_TYPES } from "@/Components/BlockUI";
import * as validation from "./validation";

const DEFAULT_LAYOUT_SECTION_SCHEMA = {
    role: {
        type: "text",
        label: "役割（hero / main / sidebar / footer）",
        default: "main",
    },
    name: { type: "text", label: "セクション名", default: "" },
};

const PageTypeForm = ({
    data,
    setData,
    errors,
    localErrors,
    setLocalErrors,
    processing,
    onSubmit,
    cancelRoute,
    isEdit = false,
}) => {
    const handleBlur = (fieldName) => {
        const tempData = { ...data, errors: {} };

        switch (fieldName) {
            case "key":
                validation.validateKey(tempData);
                break;
            case "name":
                validation.validateName(tempData);
                break;
            case "slug":
                validation.validateSlug(tempData);
                break;
            case "description":
                validation.validateDescription(tempData);
                break;
        }

        setLocalErrors((prev) => ({
            ...prev,
            [fieldName]: tempData.errors[fieldName],
        }));
    };

    const handleChange = (field, value) => {
        setData(field, value);
        if (localErrors[field]) {
            setLocalErrors((prev) => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (typeof onSubmit === "function") {
            onSubmit();
        }
    };

    const allowedComponentTypes = data.allowed_component_types || [];

    const toggleComponentType = (type) => {
        const next = allowedComponentTypes.includes(type)
            ? allowedComponentTypes.filter((t) => t !== type)
            : [...allowedComponentTypes, type];
        handleChange("allowed_component_types", next);
    };

    const defaultLayoutSections = data.default_layout?.sections || [];

    const handleDefaultLayoutSectionsChange = (sections) => {
        handleChange("default_layout", { ...data.default_layout, sections });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報 */}
            <Card>
                <CardHeader>基本情報</CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <FormGroup
                            label="キー"
                            htmlFor="key"
                            required
                            helpText="英小文字、数字、アンダースコアのみ使用可能"
                        >
                            <TextInput
                                id="key"
                                value={data.key}
                                onChange={(e) =>
                                    handleChange("key", e.target.value)
                                }
                                onBlur={() => handleBlur("key")}
                                disabled={processing}
                                placeholder="page_type_key"
                            />
                            <InputError
                                message={localErrors.key || errors.key}
                            />
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                英小文字、数字、アンダースコアのみ使用可能
                            </p>
                        </FormGroup>

                        <FormGroup
                            label="ページタイプ名"
                            htmlFor="name"
                            required
                        >
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    handleChange("name", value);
                                    if (!data.slug) {
                                        handleChange(
                                            "slug",
                                            generateSlug(value),
                                        );
                                    }
                                }}
                                onBlur={() => handleBlur("name")}
                                disabled={processing}
                                placeholder="ブログ記事"
                            />
                            <InputError
                                message={localErrors.name || errors.name}
                            />
                        </FormGroup>

                        <FormGroup label="スラッグ" htmlFor="slug" required>
                            <TextInput
                                id="slug"
                                value={data.slug}
                                onChange={(e) =>
                                    handleChange("slug", e.target.value)
                                }
                                onBlur={() => handleBlur("slug")}
                                disabled={processing}
                                placeholder="blog-post"
                            />
                            <InputError
                                message={localErrors.slug || errors.slug}
                            />
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                URL
                                で使用されます（英小文字、数字、ハイフンのみ）
                            </p>
                        </FormGroup>

                        <FormGroup label="説明" htmlFor="description">
                            <TextArea
                                id="description"
                                value={data.description || ""}
                                onChange={(e) =>
                                    handleChange("description", e.target.value)
                                }
                                onBlur={() => handleBlur("description")}
                                disabled={processing}
                                rows={3}
                                placeholder="このページタイプの説明を入力..."
                            />
                            <InputError
                                message={
                                    localErrors.description ||
                                    errors.description
                                }
                            />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* 設定 */}
            <Card>
                <CardHeader>設定</CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    システムページタイプ
                                </label>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    システムで使用するページタイプ（削除不可）
                                </p>
                            </div>
                            <Toggle
                                enabled={data.is_system || false}
                                onChange={(value) =>
                                    handleChange("is_system", value)
                                }
                                disabled={processing}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    動的ページ
                                </label>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    URL パラメータで動的にページを生成
                                </p>
                            </div>
                            <Toggle
                                enabled={data.is_dynamic || false}
                                onChange={(value) =>
                                    handleChange("is_dynamic", value)
                                }
                                disabled={processing}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    詳細ページ
                                </label>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    個別の詳細ページを持つ
                                </p>
                            </div>
                            <Toggle
                                enabled={data.has_detail || false}
                                onChange={(value) =>
                                    handleChange("has_detail", value)
                                }
                                disabled={processing}
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* 初期セクション構成 */}
            <Card>
                <CardHeader>初期セクション構成</CardHeader>
                <CardBody>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        このページタイプでページを新規作成した際に、自動で作成されるセクションです。役割は
                        hero / main / sidebar / footer
                        から選んで入力してください。
                    </p>
                    <ArrayFieldEditor
                        value={defaultLayoutSections}
                        onChange={handleDefaultLayoutSectionsChange}
                        itemsSchema={DEFAULT_LAYOUT_SECTION_SCHEMA}
                        label="セクション"
                    />
                </CardBody>
            </Card>

            {/* 使用可能なブロック */}
            <Card>
                <CardHeader>使用可能なブロック</CardHeader>
                <CardBody>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        このページタイプのセクションでブロックエディタに表示するブロックを選択します。何も選択しない場合は全ブロックが使用可能になります。
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {BLOCK_TYPES.map((block) => (
                            <label
                                key={block.type}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-blue-400"
                            >
                                <input
                                    type="checkbox"
                                    checked={allowedComponentTypes.includes(
                                        block.type,
                                    )}
                                    onChange={() =>
                                        toggleComponentType(block.type)
                                    }
                                    disabled={processing}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <block.icon className="h-4 w-4 text-slate-400 shrink-0" />
                                <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                                    {block.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* アクションボタン */}
            <div className="flex items-center justify-end gap-3">
                <SecondaryButton
                    type="button"
                    href={cancelRoute}
                    disabled={processing}
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    キャンセル
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={processing}>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    {isEdit ? "更新" : "作成"}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default PageTypeForm;
