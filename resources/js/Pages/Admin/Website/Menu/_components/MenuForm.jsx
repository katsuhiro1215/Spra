import React from "react";
import {
    FormGroup,
    TextInput,
    TextArea,
    InputError,
    InputLabel,
    SelectInput,
} from "@/Components/Forms";
import * as validation from "./validation";

const MenuForm = ({
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
            case "location":
                validation.validateLocation(tempData);
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

    const locationOptions = [
        { value: "", label: "選択してください" },
        { value: "header", label: "ヘッダー" },
        { value: "footer", label: "フッター" },
        { value: "sidebar", label: "サイドバー" },
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
                            メニュー名
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
                            placeholder="メインメニュー"
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
                            placeholder="main-menu"
                        />
                        <InputError message={localErrors.slug || errors.slug} />
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            識別用のスラッグ（英小文字、数字、ハイフンのみ）
                        </p>
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="location" required>
                            配置場所
                        </InputLabel>
                        <SelectInput
                            id="location"
                            value={data.location}
                            onChange={(e) =>
                                handleChange("location", e.target.value)
                            }
                            onBlur={() => handleBlur("location")}
                            disabled={processing}
                            options={locationOptions}
                        />
                        <InputError
                            message={localErrors.location || errors.location}
                        />
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            メニューを表示する場所
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
                            placeholder="このメニューの説明を入力..."
                        />
                        <InputError
                            message={
                                localErrors.description || errors.description
                            }
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
};

export default MenuForm;
