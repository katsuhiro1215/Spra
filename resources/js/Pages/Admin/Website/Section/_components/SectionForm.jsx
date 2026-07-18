import React from "react";
import {
    FormGroup,
    TextInput,
    InputError,
    InputLabel,
    SelectInput,
} from "@/Components/Forms";
import { BlockEditor } from "@/Components/BlockUI";
import * as validation from "./validation";

const SectionForm = ({
    data,
    setData,
    errors,
    localErrors,
    setLocalErrors,
    processing,
    pages,
    mediaList,
}) => {
    const handleBlur = (fieldName) => {
        const tempData = { ...data, errors: {} };

        switch (fieldName) {
            case "page_id":
                validation.validatePageId(tempData);
                break;
            case "name":
                validation.validateName(tempData);
                break;
            case "role":
                validation.validateRole(tempData);
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

    const pageOptions = pages.map((page) => ({
        value: page.id,
        label: page.title,
    }));

    return (
        <div className="space-y-6">
            {/* 基本情報 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    基本情報
                </h3>
                <div className="space-y-4">
                    <FormGroup
                        label="ページ"
                        htmlFor="page_id"
                        required
                        helpText="このセクションが属するページを選択してください。"
                        error={localErrors.page_id || errors.page_id}
                    >
                        <SelectInput
                            id="page_id"
                            value={data.page_id}
                            onChange={(e) =>
                                handleChange("page_id", e.target.value)
                            }
                            onBlur={() => handleBlur("page_id")}
                            disabled={processing}
                            options={pageOptions}
                            placeholder="ページを選択..."
                        />
                    </FormGroup>

                    <FormGroup
                        label="セクション名"
                        htmlFor="name"
                        required
                        helpText="セクションの名前を入力してください。"
                        error={localErrors.name || errors.name}
                    >
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) =>
                                handleChange("name", e.target.value)
                            }
                            onBlur={() => handleBlur("name")}
                            disabled={processing}
                            placeholder="ヒーローセクション"
                        />
                    </FormGroup>

                    <FormGroup
                        label="役割"
                        htmlFor="role"
                        helpText="セクションの役割を識別するためのキー（オプション）"
                        error={localErrors.role || errors.role}
                    >
                        <TextInput
                            id="role"
                            value={data.role || ""}
                            onChange={(e) =>
                                handleChange("role", e.target.value)
                            }
                            onBlur={() => handleBlur("role")}
                            disabled={processing}
                            placeholder="hero, content, sidebar など"
                        />
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            セクションの役割を識別するためのキー（オプション）
                        </p>
                    </FormGroup>

                    <FormGroup
                        label="表示順"
                        htmlFor="sort_order"
                        error={localErrors.sort_order || errors.sort_order}
                    >
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
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            ページ内での表示順（小さい順に表示）
                        </p>
                    </FormGroup>
                </div>
            </div>

            {/* コンテンツ（ブロックエディタ） */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    コンテンツ
                </h3>
                <BlockEditor
                    value={data.content}
                    onChange={(value) => handleChange("content", value)}
                    mediaList={mediaList}
                />
                <InputError message={localErrors.content || errors.content} />
            </div>
        </div>
    );
};

export default SectionForm;
