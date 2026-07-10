import React, { useState } from "react";
// Components
import { Card, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    NumberInput,
    InputError,
} from "@/Components/Forms";
import { StoreButton, SecondaryButton } from "@/Components/Buttons";
// Validation
import * as validation from "./validation";

const Form = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    isEdit = false,
}) => {
    const [localErrors, setLocalErrors] = useState({});

    const handleBlur = (fieldName) => {
        const tempData = { ...data, errors: {} };

        switch (fieldName) {
            case "name":
                validation.validateName(tempData);
                break;
            case "description":
                validation.validateDescription(tempData);
                break;
            case "icon":
                validation.validateIcon(tempData);
                break;
            case "sort_order":
                validation.validateSortOrder(tempData);
                break;
            case "is_active":
                validation.validateIsActive(tempData);
                break;
        }

        setLocalErrors((prev) => ({
            ...prev,
            [fieldName]: tempData.errors[fieldName],
        }));
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setData("name", name);
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
                            label="テンプレート名"
                            required
                            error={errors.name}
                        >
                            <TextInput
                                value={data.name || ""}
                                onChange={handleNameChange}
                                onBlur={() => handleBlur("name")}
                                placeholder="例: Webサイト制作テンプレート"
                            />
                            <InputError
                                message={errors.name || localErrors.name}
                            />
                        </FormGroup>

                        <FormGroup label="説明" error={errors.description}>
                            <TextArea
                                value={data.description || ""}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                onBlur={() => handleBlur("description")}
                                placeholder="テンプレートの説明を入力してください"
                                rows={3}
                            />
                            <InputError
                                message={
                                    errors.description ||
                                    localErrors.description
                                }
                            />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* 表示設定 */}
            <Card>
                <CardHeader>表示設定</CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <FormGroup
                            label="アイコン"
                            error={errors.icon}
                            hint="絵文字またはアイコン文字（例: 🌐 📱 💻）"
                        >
                            <TextInput
                                value={data.icon || ""}
                                onChange={(e) =>
                                    setData("icon", e.target.value)
                                }
                                onBlur={() => handleBlur("icon")}
                                placeholder="例: 🌐"
                            />
                            <InputError
                                message={errors.icon || localErrors.icon}
                            />
                        </FormGroup>

                        <FormGroup label="表示順">
                            <NumberInput
                                id="sort_order"
                                min={0}
                                value={data.sort_order}
                                onChange={(val) =>
                                    setData("sort_order", val || 0)
                                }
                                onBlur={() => handleBlur("sort_order")}
                            />
                            <InputError
                                message={
                                    errors.sort_order || localErrors.sort_order
                                }
                            />
                        </FormGroup>

                        <FormGroup label="ステータス" error={errors.is_active}>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active ?? true}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            is_active: e.target.checked,
                                        })
                                    }
                                    className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-700"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                    アクティブ（有効化）
                                </span>
                            </label>
                            <InputError message={errors.is_active} />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* アクションボタン */}
            <div className="flex items-center justify-end gap-4">
                <SecondaryButton href={cancelRoute} size="md">
                    キャンセル
                </SecondaryButton>
                <StoreButton
                    type="submit"
                    disabled={processing}
                    loading={processing}
                    size="md"
                >
                    {processing
                        ? isEdit
                            ? "更新中..."
                            : "作成中..."
                        : isEdit
                          ? "更新"
                          : "作成"}
                </StoreButton>
            </div>
        </form>
    );
};

export default Form;
