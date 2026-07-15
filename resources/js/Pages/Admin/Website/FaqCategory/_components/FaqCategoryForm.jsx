import React from "react";
import {
    FormGroup,
    TextInput,
    TextArea,
    InputError,
    InputLabel,
    ColorInput,
    Toggle,
} from "@/Components/Forms";
import * as validation from "./validation";

const FaqCategoryForm = ({
    data,
    setData,
    errors,
    localErrors,
    setLocalErrors,
    processing,
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
                            placeholder="料金・プラン"
                        />
                        <InputError message={localErrors.name || errors.name} />
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="slug">スラッグ</InputLabel>
                        <TextInput
                            id="slug"
                            value={data.slug}
                            onChange={(e) =>
                                handleChange("slug", e.target.value)
                            }
                            onBlur={() => handleBlur("slug")}
                            disabled={processing}
                            placeholder="pricing"
                        />
                        <InputError message={localErrors.slug || errors.slug} />
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            URL で使用されます（未入力の場合は自動生成されます）
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
                        <InputLabel htmlFor="color">カラー</InputLabel>
                        <ColorInput
                            value={data.color || "#3B82F6"}
                            onChange={(value) => handleChange("color", value)}
                            disabled={processing}
                        />
                        <InputError message={localErrors.color || errors.color} />
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="icon">アイコン</InputLabel>
                        <TextInput
                            id="icon"
                            value={data.icon || ""}
                            onChange={(e) =>
                                handleChange("icon", e.target.value)
                            }
                            disabled={processing}
                            placeholder="QuestionMarkCircleIcon"
                        />
                        <InputError message={localErrors.icon || errors.icon} />
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Heroicons のアイコン名を入力
                        </p>
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

export default FaqCategoryForm;
