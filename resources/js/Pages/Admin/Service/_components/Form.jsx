import React, { useState } from "react";
import { Card, CardTitle, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    NumberInput,
    Checkbox,
    InputError,
} from "@/Components/Forms";
import { StoreButton, SecondaryButton } from "@/Components/Buttons";
import * as validation from "./validation";

const ServiceForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    categories,
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
            case "service_category_id":
                validation.validateServiceCategoryId(tempData);
                break;
            case "description":
                validation.validateDescription(tempData);
                break;
            case "details":
                validation.validateDetails(tempData);
                break;
            case "icon":
                validation.validateIcon(tempData);
                break;
            case "sort_order":
                validation.validateSortOrder(tempData);
                break;
            case "status":
                validation.validateStatus(tempData);
                break;
            case "is_featured":
                validation.validateIsFeatured(tempData);
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

    const statusOptions = [
        { value: "active", label: "稼働中" },
        { value: "inactive", label: "停止中" },
        { value: "suspended", label: "一時停止" },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* サービス名 */}
                        <FormGroup label="サービス名" required>
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={handleNameChange}
                                onBlur={() => handleBlur("name")}
                                placeholder="例: Webサイト構築"
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
                                    placeholder="例: website-construction"
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

                        {/* サービスカテゴリ */}
                        <FormGroup
                            label="サービスカテゴリ"
                            required
                            className="md:col-span-2"
                        >
                            <SelectInput
                                id="service_category_id"
                                value={data.service_category_id}
                                onChange={(e) =>
                                    setData(
                                        "service_category_id",
                                        e.target.value,
                                    )
                                }
                                onBlur={() => handleBlur("service_category_id")}
                            >
                                <option value="">
                                    カテゴリを選択してください
                                </option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError
                                message={
                                    errors.service_category_id ||
                                    localErrors.service_category_id
                                }
                            />
                        </FormGroup>

                        {/* 説明 */}
                        <FormGroup
                            label="説明"
                            required
                            className="md:col-span-2"
                        >
                            <TextArea
                                id="description"
                                rows={3}
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                onBlur={() => handleBlur("description")}
                                placeholder="サービスの簡単な説明を入力してください（1000文字以内）"
                            />
                            <InputError
                                message={
                                    errors.description ||
                                    localErrors.description
                                }
                            />
                        </FormGroup>

                        {/* 詳細説明 */}
                        <FormGroup label="詳細説明" className="md:col-span-2">
                            <TextArea
                                id="details"
                                rows={6}
                                value={data.details || ""}
                                onChange={(e) =>
                                    setData("details", e.target.value)
                                }
                                onBlur={() => handleBlur("details")}
                                placeholder="サービスの詳細な説明を入力してください"
                            />
                            <InputError
                                message={errors.details || localErrors.details}
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
                        {/* アイコン */}
                        <FormGroup label="アイコン">
                            <TextInput
                                id="icon"
                                value={data.icon || ""}
                                onChange={(e) =>
                                    setData("icon", e.target.value)
                                }
                                onBlur={() => handleBlur("icon")}
                                placeholder="例: globe"
                            />
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
                        <FormGroup label="ステータス" required>
                            <div className="space-y-2 mt-2">
                                {statusOptions.map((option) => (
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
                                            onBlur={() => handleBlur("status")}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <InputError
                                message={errors.status || localErrors.status}
                            />
                        </FormGroup>

                        {/* 注目サービス */}
                        <div className="md:col-span-3">
                            <label className="flex items-center">
                                <Checkbox
                                    checked={data.is_featured || false}
                                    onChange={(e) =>
                                        setData("is_featured", e.target.checked)
                                    }
                                    onBlur={() => handleBlur("is_featured")}
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    注目サービスとして表示する
                                </span>
                            </label>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                チェックを入れると、ホームページなどで注目サービスとして表示されます
                            </p>
                            <InputError
                                message={
                                    errors.is_featured ||
                                    localErrors.is_featured
                                }
                            />
                        </div>
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

export default ServiceForm;
