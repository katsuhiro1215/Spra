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
import MediaSelectModal from "@/Components/Media/MediaSelectModal";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import * as validation from "./validation";

const ServiceForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    categories,
    technologies = [],
    mediaList = [],
    isEdit = false,
}) => {
    const [autoSlug, setAutoSlug] = useState(!isEdit);
    const [localErrors, setLocalErrors] = useState({});
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaListState, setMediaListState] = useState(mediaList);

    const selectedMedia = (data.media_ids || [])
        .map((id) => mediaListState.find((m) => m.id === id))
        .filter(Boolean);

    const toggleTechnology = (technologyId) => {
        const current = data.technology_ids || [];
        setData(
            "technology_ids",
            current.includes(technologyId)
                ? current.filter((id) => id !== technologyId)
                : [...current, technologyId],
        );
    };

    const removeMedia = (mediaId) => {
        setData(
            "media_ids",
            (data.media_ids || []).filter((id) => id !== mediaId),
        );
    };

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
                        <FormGroup
                            label="サービス名"
                            htmlFor="name"
                            required
                            help="サービスの名前を入力してください"
                        >
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
                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                        (空白の場合は自動生成)
                                    </span>
                                </>
                            }
                            htmlFor="slug"
                            help="URLに使用される識別子です。英小文字、数字、ハイフンのみ使用できます。空白の場合はサービス名から自動生成されます。"
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
                                        className="px-3 py-2 text-xs text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md whitespace-nowrap h-10"
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
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
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

                        {/* Web公開 */}
                        <div className="md:col-span-3">
                            <label className="flex items-center">
                                <Checkbox
                                    checked={data.is_displayed ?? true}
                                    onChange={(e) =>
                                        setData(
                                            "is_displayed",
                                            e.target.checked,
                                        )
                                    }
                                    onBlur={() => handleBlur("is_displayed")}
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Webサイト・見積もりシミュレーターに表示する
                                </span>
                            </label>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                チェックを外すと、このサービスと配下のプランは公開サイトやシミュレーターに表示されなくなります（管理画面では引き続き操作できます）
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

            {/* ギャラリー画像 */}
            <Card>
                <CardHeader>
                    <CardTitle>ギャラリー画像</CardTitle>
                </CardHeader>
                <CardBody>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        公開サイトのサービス一覧・詳細ページに表示する画像です。先頭の画像が代表画像として使われます。
                    </p>
                    <div className="flex flex-wrap gap-3 mb-4">
                        {selectedMedia.map((media, index) => (
                            <div key={media.id} className="relative">
                                <img
                                    src={media.url}
                                    alt={media.alt_text || media.title}
                                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                />
                                {index === 0 && (
                                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] font-medium bg-blue-600 text-white rounded">
                                        代表画像
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeMedia(media.id)}
                                    className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-600 text-white rounded-full"
                                >
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setShowMediaModal(true)}
                            className="w-24 h-24 flex items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                        >
                            <PhotoIcon className="w-8 h-8" />
                        </button>
                    </div>
                    <InputError message={errors.media_ids} />
                </CardBody>
            </Card>

            {/* 使用技術 */}
            <Card>
                <CardHeader>
                    <CardTitle>使用技術</CardTitle>
                </CardHeader>
                <CardBody>
                    {technologies.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            使用技術が登録されていません。先に「使用技術マスタ」から登録してください。
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {technologies.map((technology) => (
                                <label
                                    key={technology.id}
                                    className="flex items-center"
                                >
                                    <Checkbox
                                        checked={(
                                            data.technology_ids || []
                                        ).includes(technology.id)}
                                        onChange={() =>
                                            toggleTechnology(technology.id)
                                        }
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        {technology.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                    <InputError message={errors.technology_ids} />
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

            <MediaSelectModal
                show={showMediaModal}
                mediaList={mediaListState}
                multiple={true}
                uploadRoute={route("admin.media.store")}
                onClose={() => setShowMediaModal(false)}
                onSelect={(mediaIds) => {
                    const merged = [
                        ...(data.media_ids || []),
                        ...mediaIds.filter(
                            (id) => !(data.media_ids || []).includes(id),
                        ),
                    ];
                    setData("media_ids", merged);
                    setShowMediaModal(false);
                }}
                onMediaUploaded={(media) =>
                    setMediaListState((prev) => [media, ...prev])
                }
            />
        </form>
    );
};

export default ServiceForm;
