import React from "react";
import {
    FormGroup,
    TextInput,
    TextArea,
    InputError,
    InputLabel,
    SelectInput,
    Toggle,
} from "@/Components/Forms";
import * as validation from "./validation";

const PostCategoryForm = ({
    data,
    setData,
    errors,
    localErrors,
    setLocalErrors,
    processing,
    categories,
}) => {
    const handleBlur = (fieldName) => {
        const tempData = { ...data, errors: {} };

        switch (fieldName) {
            case "name":
                validation.validateName(tempData);
                break;
            case "slug":
                validation.validateSlug(tempData);
                break;
            case "description":
                validation.validateDescription(tempData);
                break;
            case "sort_order":
                validation.validateSortOrder(tempData);
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

    const categoryOptions = [
        { value: "", label: "なし（親カテゴリ）" },
        ...(categories || []).map((cat) => ({
            value: cat.id,
            label: cat.name,
        })),
    ];

    return (
        <div className="space-y-6">
            {/* 基本情報 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    基本情報
                </h3>
                <div className="space-y-4">
                    <FormGroup>
                        <InputLabel htmlFor="name" required>
                            カテゴリ名
                        </InputLabel>
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => {
                                const value = e.target.value;
                                handleChange("name", value);
                                if (!data.slug) {
                                    handleChange("slug", generateSlug(value));
                                }
                            }}
                            onBlur={() => handleBlur("name")}
                            disabled={processing}
                            placeholder="テクノロジー"
                        />
                        <InputError message={localErrors.name || errors.name} />
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="slug" required>
                            スラッグ
                        </InputLabel>
                        <TextInput
                            id="slug"
                            value={data.slug}
                            onChange={(e) =>
                                handleChange("slug", e.target.value)
                            }
                            onBlur={() => handleBlur("slug")}
                            disabled={processing}
                            placeholder="technology"
                        />
                        <InputError message={localErrors.slug || errors.slug} />
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            URL で使用されます（英小文字、数字、ハイフンのみ）
                        </p>
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="parent_id">親カテゴリ</InputLabel>
                        <SelectInput
                            id="parent_id"
                            value={data.parent_id || ""}
                            onChange={(e) =>
                                handleChange("parent_id", e.target.value)
                            }
                            disabled={processing}
                            options={categoryOptions}
                        />
                        <InputError
                            message={localErrors.parent_id || errors.parent_id}
                        />
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            階層構造を作成する場合に選択
                        </p>
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="description">説明</InputLabel>
                        <TextArea
                            id="description"
                            value={data.description || ""}
                            onChange={(e) =>
                                handleChange("description", e.target.value)
                            }
                            onBlur={() => handleBlur("description")}
                            disabled={processing}
                            rows={3}
                            placeholder="このカテゴリの説明を入力..."
                        />
                        <InputError
                            message={
                                localErrors.description || errors.description
                            }
                        />
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="sort_order">表示順</InputLabel>
                        <TextInput
                            id="sort_order"
                            type="number"
                            value={data.sort_order || ""}
                            onChange={(e) =>
                                handleChange("sort_order", e.target.value)
                            }
                            onBlur={() => handleBlur("sort_order")}
                            disabled={processing}
                            placeholder="0"
                            min="0"
                        />
                        <InputError
                            message={
                                localErrors.sort_order || errors.sort_order
                            }
                        />
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            カテゴリの表示順（小さい順に表示）
                        </p>
                    </FormGroup>
                </div>
            </div>

            {/* 設定 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    設定
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                有効化
                            </label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                カテゴリを有効にする
                            </p>
                        </div>
                        <Toggle
                            enabled={data.is_active ?? true}
                            onChange={(value) =>
                                handleChange("is_active", value)
                            }
                            disabled={processing}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCategoryForm;
