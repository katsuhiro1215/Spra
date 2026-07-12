import React from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    InputError,
    Toggle,
} from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import * as validation from "./validation";

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
