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

const MenuItemForm = ({
    data,
    setData,
    errors,
    localErrors,
    setLocalErrors,
    processing,
    pages,
    menuItems,
}) => {
    const handleBlur = (fieldName) => {
        const tempData = { ...data, errors: {} };

        switch (fieldName) {
            case "label":
                validation.validateLabel(tempData);
                break;
            case "url":
                validation.validateUrl(tempData);
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

    const parentOptions = [
        { value: "", label: "なし（トップレベル）" },
        ...(menuItems || []).map((item) => ({
            value: item.id,
            label: item.label,
        })),
    ];

    const pageOptions = [
        { value: "", label: "ページを選択しない" },
        ...(pages || []).map((page) => ({
            value: page.id,
            label: page.title,
        })),
    ];

    const targetOptions = [
        { value: "_self", label: "同じウィンドウ (_self)" },
        { value: "_blank", label: "新しいウィンドウ (_blank)" },
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
                        <InputLabel htmlFor="label" required>
                            ラベル
                        </InputLabel>
                        <TextInput
                            id="label"
                            value={data.label}
                            onChange={(e) =>
                                handleChange("label", e.target.value)
                            }
                            onBlur={() => handleBlur("label")}
                            disabled={processing}
                            placeholder="ホーム"
                        />
                        <InputError
                            message={localErrors.label || errors.label}
                        />
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="parent_id">親アイテム</InputLabel>
                        <SelectInput
                            id="parent_id"
                            value={data.parent_id || ""}
                            onChange={(e) =>
                                handleChange("parent_id", e.target.value)
                            }
                            disabled={processing}
                            options={parentOptions}
                        />
                        <InputError
                            message={localErrors.parent_id || errors.parent_id}
                        />
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            階層構造を作成する場合に選択
                        </p>
                    </FormGroup>
                </div>
            </div>

            {/* リンク設定 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    リンク設定
                </h3>
                <div className="space-y-4">
                    <FormGroup>
                        <InputLabel htmlFor="page_id">ページ</InputLabel>
                        <SelectInput
                            id="page_id"
                            value={data.page_id || ""}
                            onChange={(e) => {
                                handleChange("page_id", e.target.value);
                                if (e.target.value) {
                                    handleChange("url", "");
                                }
                            }}
                            disabled={processing}
                            options={pageOptions}
                        />
                        <InputError
                            message={localErrors.page_id || errors.page_id}
                        />
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            ページを選択すると URL は無視されます
                        </p>
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="url">URL</InputLabel>
                        <TextInput
                            id="url"
                            value={data.url || ""}
                            onChange={(e) => {
                                handleChange("url", e.target.value);
                                if (e.target.value) {
                                    handleChange("page_id", "");
                                }
                            }}
                            onBlur={() => handleBlur("url")}
                            disabled={processing || data.page_id}
                            placeholder="https://example.com"
                        />
                        <InputError message={localErrors.url || errors.url} />
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            外部 URL またはパス（ページ未選択時のみ）
                        </p>
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="target">ターゲット</InputLabel>
                        <SelectInput
                            id="target"
                            value={data.target || "_self"}
                            onChange={(e) =>
                                handleChange("target", e.target.value)
                            }
                            disabled={processing}
                            options={targetOptions}
                        />
                        <InputError
                            message={localErrors.target || errors.target}
                        />
                    </FormGroup>
                </div>
            </div>

            {/* メガメニュー設定 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    メガメニュー設定
                </h3>
                <div className="space-y-4">
                    <FormGroup>
                        <InputLabel htmlFor="description">説明文</InputLabel>
                        <TextArea
                            id="description"
                            value={data.description || ""}
                            onChange={(e) =>
                                handleChange("description", e.target.value)
                            }
                            disabled={processing}
                            rows={3}
                            placeholder="レスポンシブWebサイト・アプリ開発"
                        />
                        <InputError
                            message={
                                localErrors.description || errors.description
                            }
                        />
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            親アイテムではドロップダウン左側の紹介文、子アイテムではリンク下の説明文として表示されます
                        </p>
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="image_path">
                            画像パス
                        </InputLabel>
                        <TextInput
                            id="image_path"
                            value={data.image_path || ""}
                            onChange={(e) =>
                                handleChange("image_path", e.target.value)
                            }
                            disabled={processing}
                            placeholder="/upload/menu-service.jpg"
                        />
                        <InputError
                            message={
                                localErrors.image_path || errors.image_path
                            }
                        />
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            親アイテムのドロップダウン左側に表示される画像のパス（未設定時はアイコン表示）
                        </p>
                    </FormGroup>
                </div>
            </div>

            {/* 表示設定 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    表示設定
                </h3>
                <div className="space-y-4">
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
                            メニュー内での表示順（小さい順に表示）
                        </p>
                    </FormGroup>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                有効化
                            </label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                メニューアイテムを有効にする
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

export default MenuItemForm;
