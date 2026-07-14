import React, { useState } from "react";
import { CommonUIConstants } from "@/Constants/CommonUIConstants";
// Components
import { Card, CardTitle, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    NumberInput,
    InputError,
} from "@/Components/Forms";
import { StoreButton, SecondaryButton } from "@/Components/Buttons";
import * as validation from "./validation";

const ServiceCategoryForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    isEdit = false,
}) => {
    const [autoSlug, setAutoSlug] = useState(!isEdit);
    const [localErrors, setLocalErrors] = useState({});

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim("-");
    };

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
            case "color":
                validation.validateColor(tempData);
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

        if (autoSlug) {
            setData("slug", generateSlug(name));
        }
    };

    const handleSlugChange = (e) => {
        setData("slug", e.target.value);
        setAutoSlug(false);
    };

    const handleAutoGenerateSlug = () => {
        setAutoSlug(true);
        setData("slug", generateSlug(data.name));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (typeof onSubmit === "function") {
            onSubmit();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                </CardHeader>
                <CardBody>
                    {/* フォーム内容 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* カテゴリ名 */}
                        <FormGroup label="カテゴリ名" required>
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={handleNameChange}
                                onBlur={() => handleBlur("name")}
                                placeholder="例: Webサイト制作"
                            />
                            <InputError
                                message={errors.name || localErrors.name}
                            />
                        </FormGroup>
                        {/* スラッグ */}
                        <FormGroup
                            label={
                                <>
                                    スラッグ
                                    <span className="text-xs text-gray-500 ml-2">
                                        (空白の場合は自動生成)
                                    </span>
                                </>
                            }
                        >
                            <div className="flex items-center space-x-2">
                                <TextInput
                                    id="slug"
                                    value={data.slug}
                                    onChange={handleSlugChange}
                                    onBlur={() => handleBlur("slug")}
                                    placeholder="例: web-development"
                                />
                                {isEdit && (
                                    <button
                                        type="button"
                                        onClick={handleAutoGenerateSlug}
                                        className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-md whitespace-nowrap h-10"
                                    >
                                        自動生成
                                    </button>
                                )}
                            </div>
                            <InputError
                                message={errors.slug || localErrors.slug}
                            />
                        </FormGroup>
                        {/* 説明 */}
                        <FormGroup label="説明">
                            <TextArea
                                id="description"
                                rows={4}
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                onBlur={() => handleBlur("description")}
                                placeholder="カテゴリの説明を入力してください"
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

            <Card>
                <CardHeader>
                    <CardTitle>表示設定</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* カラー */}
                        <div>
                            <label
                                htmlFor="color"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                カラー <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2">
                                <div className="grid grid-cols-4 gap-2">
                                    {CommonUIConstants.serviceCategory.colorOptions.map(
                                        (option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        "color",
                                                        option.value,
                                                    )
                                                }
                                                className={`w-full h-10 rounded-md border-2 ${
                                                    data.color === option.value
                                                        ? "border-gray-900"
                                                        : "border-gray-300"
                                                } hover:border-gray-600 transition-colors`}
                                                style={{
                                                    backgroundColor:
                                                        option.color,
                                                }}
                                                title={option.label}
                                            />
                                        ),
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={data.color}
                                    onChange={(e) =>
                                        setData("color", e.target.value)
                                    }
                                    onBlur={() => handleBlur("color")}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    placeholder="#3B82F6"
                                />
                            </div>
                            <InputError
                                message={errors.color || localErrors.color}
                            />
                        </div>
                        {/* アイコン */}
                        <FormGroup label="アイコン">
                            <SelectInput
                                id="icon"
                                value={data.icon}
                                onChange={(e) =>
                                    setData("icon", e.target.value)
                                }
                                onBlur={() => handleBlur("icon")}
                            >
                                <option value="">アイコンを選択</option>
                                {CommonUIConstants.serviceCategory.iconOptions.map(
                                    (option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ),
                                )}
                            </SelectInput>
                            <InputError
                                message={errors.icon || localErrors.icon}
                            />
                        </FormGroup>
                        {/* 表示順 */}
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
                        {/* ステータス */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ステータス{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2">
                                {CommonUIConstants.serviceCategory.statusOptions.map(
                                    (option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center"
                                        >
                                            <input
                                                type="radio"
                                                value={option.value}
                                                checked={
                                                    data.status === option.value
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "status",
                                                        e.target.value,
                                                    )
                                                }
                                                onBlur={() =>
                                                    handleBlur("status")
                                                }
                                                className="border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                {option.label}
                                            </span>
                                        </label>
                                    ),
                                )}
                            </div>
                            <InputError
                                message={errors.status || localErrors.status}
                            />
                        </div>
                        {/* Web公開 */}
                        <div className="md:col-span-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_displayed ?? true}
                                    onChange={(e) =>
                                        setData(
                                            "is_displayed",
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700">
                                    Webサイト・見積もりシミュレーターに表示する
                                </span>
                            </label>
                            <p className="mt-1 text-xs text-gray-500">
                                チェックを外すと、このカテゴリと配下のサービス・プランは公開サイトやシミュレーターに表示されなくなります（管理画面では引き続き操作できます）
                            </p>
                            <InputError
                                message={
                                    errors.is_displayed ||
                                    localErrors.is_displayed
                                }
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* プレビュー */}
            {data.name && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                        プレビュー
                    </h4>
                    <div
                        className="inline-flex items-center px-4 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: data.color }}
                    >
                        {data.icon && (
                            <i
                                className={`heroicon-${data.icon} h-4 w-4 mr-2`}
                            ></i>
                        )}
                        {data.name}
                    </div>
                </div>
            )}

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

export default ServiceCategoryForm;
