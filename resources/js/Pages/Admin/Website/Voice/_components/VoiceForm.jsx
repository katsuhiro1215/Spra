import React, { useState } from "react";
import {
    FormGroup,
    TextInput,
    TextArea,
    InputError,
    InputLabel,
    SelectInput,
    Toggle,
} from "@/Components/Forms";
import { SecondaryButton } from "@/Components/Buttons";
import MediaSelectModal from "@/Components/Media/MediaSelectModal";
import { PhotoIcon } from "@heroicons/react/24/outline";
import * as validation from "./validation";

const VoiceForm = ({
    data,
    setData,
    errors,
    localErrors,
    setLocalErrors,
    processing,
    services,
    users,
    mediaList,
}) => {
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaListState, setMediaListState] = useState(mediaList || []);

    const selectedMedia = mediaListState.find((m) => m.id === data.avatar_id);

    const handleBlur = (fieldName) => {
        const tempData = { ...data, errors: {} };

        switch (fieldName) {
            case "author_name":
                validation.validateAuthorName(tempData);
                break;
            case "content":
                validation.validateContent(tempData);
                break;
            case "rating":
                validation.validateRating(tempData);
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

    const serviceOptions = [
        { value: "", label: "指定なし（全体向け）" },
        ...(services || []).map((service) => ({
            value: service.id,
            label: service.name,
        })),
    ];

    const userOptions = [
        { value: "", label: "紐付けない（手入力のみ）" },
        ...(users || []).map((user) => ({
            value: user.id,
            label: user.profile?.full_name
                ? `${user.profile.full_name}（${user.email}）`
                : user.email,
        })),
    ];

    const ratingOptions = [
        { value: "", label: "未設定" },
        { value: "5", label: "★★★★★ (5)" },
        { value: "4", label: "★★★★☆ (4)" },
        { value: "3", label: "★★★☆☆ (3)" },
        { value: "2", label: "★★☆☆☆ (2)" },
        { value: "1", label: "★☆☆☆☆ (1)" },
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
                        <InputLabel htmlFor="user_id">
                            紐付けるクライアント
                        </InputLabel>
                        <SelectInput
                            id="user_id"
                            value={data.user_id || ""}
                            onChange={(e) =>
                                handleChange("user_id", e.target.value)
                            }
                            disabled={processing}
                            options={userOptions}
                        />
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            登録済みクライアントに紐付けると、表示名・アバター未設定時のフォールバックに使用されます
                        </p>
                        <InputError message={errors.user_id} />
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="service_id">
                            対象サービス
                        </InputLabel>
                        <SelectInput
                            id="service_id"
                            value={data.service_id || ""}
                            onChange={(e) =>
                                handleChange("service_id", e.target.value)
                            }
                            disabled={processing}
                            options={serviceOptions}
                        />
                        <InputError message={errors.service_id} />
                    </FormGroup>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormGroup>
                            <InputLabel htmlFor="author_name" required>
                                表示名
                            </InputLabel>
                            <TextInput
                                id="author_name"
                                value={data.author_name}
                                onChange={(e) =>
                                    handleChange(
                                        "author_name",
                                        e.target.value,
                                    )
                                }
                                onBlur={() => handleBlur("author_name")}
                                disabled={processing}
                                placeholder="例: 山田 太郎 様"
                            />
                            <InputError
                                message={
                                    localErrors.author_name ||
                                    errors.author_name
                                }
                            />
                        </FormGroup>

                        <FormGroup>
                            <InputLabel htmlFor="author_title">
                                役職
                            </InputLabel>
                            <TextInput
                                id="author_title"
                                value={data.author_title || ""}
                                onChange={(e) =>
                                    handleChange(
                                        "author_title",
                                        e.target.value,
                                    )
                                }
                                disabled={processing}
                                placeholder="例: 代表取締役"
                            />
                            <InputError message={errors.author_title} />
                        </FormGroup>
                    </div>

                    <FormGroup>
                        <InputLabel htmlFor="company_name">
                            会社名
                        </InputLabel>
                        <TextInput
                            id="company_name"
                            value={data.company_name || ""}
                            onChange={(e) =>
                                handleChange("company_name", e.target.value)
                            }
                            disabled={processing}
                            placeholder="例: 株式会社スマートスプラウト"
                        />
                        <InputError message={errors.company_name} />
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="content" required>
                            お客様の声
                        </InputLabel>
                        <TextArea
                            id="content"
                            value={data.content || ""}
                            onChange={(e) =>
                                handleChange("content", e.target.value)
                            }
                            onBlur={() => handleBlur("content")}
                            disabled={processing}
                            rows={6}
                            placeholder="いただいたコメントを入力..."
                        />
                        <InputError
                            message={localErrors.content || errors.content}
                        />
                    </FormGroup>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormGroup>
                            <InputLabel htmlFor="rating">評価</InputLabel>
                            <SelectInput
                                id="rating"
                                value={data.rating || ""}
                                onChange={(e) => {
                                    handleChange("rating", e.target.value);
                                }}
                                onBlur={() => handleBlur("rating")}
                                disabled={processing}
                                options={ratingOptions}
                            />
                            <InputError
                                message={localErrors.rating || errors.rating}
                            />
                        </FormGroup>

                        <FormGroup>
                            <InputLabel htmlFor="sort_order">
                                表示順
                            </InputLabel>
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
                                    localErrors.sort_order ||
                                    errors.sort_order
                                }
                            />
                        </FormGroup>
                    </div>
                </div>
            </div>

            {/* アバター画像 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    アバター画像
                </h3>
                <div className="flex items-center gap-4">
                    {selectedMedia ? (
                        <img
                            src={selectedMedia.url}
                            alt={selectedMedia.alt_text || data.author_name}
                            className="w-20 h-20 object-cover rounded-full border border-slate-200 dark:border-slate-700"
                        />
                    ) : (
                        <div className="w-20 h-20 flex items-center justify-center rounded-full border border-dashed border-slate-300 dark:border-slate-600 text-slate-400">
                            <PhotoIcon className="w-8 h-8" />
                        </div>
                    )}
                    <div className="space-x-2">
                        <SecondaryButton
                            type="button"
                            onClick={() => setShowMediaModal(true)}
                            disabled={processing}
                        >
                            画像を選択
                        </SecondaryButton>
                        {data.avatar_id && (
                            <SecondaryButton
                                type="button"
                                onClick={() => handleChange("avatar_id", "")}
                                disabled={processing}
                            >
                                解除
                            </SecondaryButton>
                        )}
                    </div>
                </div>
                <InputError message={errors.avatar_id} />
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
                                注目のお客様の声として表示
                            </label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                トップページ等での優先表示に使用する
                            </p>
                        </div>
                        <Toggle
                            enabled={data.is_featured ?? false}
                            onChange={(value) =>
                                handleChange("is_featured", value)
                            }
                            disabled={processing}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                公開
                            </label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Webサイトに公開する
                            </p>
                        </div>
                        <Toggle
                            enabled={data.is_published ?? true}
                            onChange={(value) =>
                                handleChange("is_published", value)
                            }
                            disabled={processing}
                        />
                    </div>
                </div>
            </div>

            <MediaSelectModal
                show={showMediaModal}
                mediaList={mediaListState}
                multiple={false}
                uploadRoute={route("admin.media.store")}
                onClose={() => setShowMediaModal(false)}
                onSelect={(mediaId) => {
                    handleChange("avatar_id", mediaId);
                    setShowMediaModal(false);
                }}
                onMediaUploaded={(media) =>
                    setMediaListState((prev) => [media, ...prev])
                }
            />
        </div>
    );
};

export default VoiceForm;
