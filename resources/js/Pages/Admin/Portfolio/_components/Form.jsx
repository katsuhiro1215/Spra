import { useState } from "react";
import { Card, CardTitle, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    NumberInput,
    Checkbox,
    InputError,
} from "@/Components/Forms";
import { StoreButton, SecondaryButton } from "@/Components/Buttons";
import MediaSelectModal from "@/Components/Media/MediaSelectModal";
import { PhotoIcon } from "@heroicons/react/24/outline";

export default function PortfolioForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    services = [],
    mediaList = [],
    isEdit = false,
}) {
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaListState, setMediaListState] = useState(mediaList);

    const selectedMedia = mediaListState.find((m) => m.id === data.media_id);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    const toggleService = (serviceId) => {
        const current = data.service_ids || [];
        setData(
            "service_ids",
            current.includes(serviceId)
                ? current.filter((id) => id !== serviceId)
                : [...current, serviceId],
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup
                            label="タイトル"
                            htmlFor="title"
                            help="ポートフォリオのタイトルを入力してください"
                            required
                            error={errors.title}
                            className="md:col-span-2"
                        >
                            <TextInput
                                id="title"
                                name="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                placeholder="例: ○○株式会社様 コーポレートサイト"
                                required
                            />
                        </FormGroup>

                        <FormGroup
                            label="説明"
                            htmlFor="description"
                            help="ポートフォリオの説明を入力してください"
                            error={errors.description}
                            className="md:col-span-2"
                        >
                            <TextArea
                                id="description"
                                name="description"
                                rows={4}
                                value={data.description || ""}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="制作の概要や工夫した点などを入力してください"
                            />
                        </FormGroup>

                        <FormGroup
                            label="公開URL"
                            htmlFor="url"
                            help="ポートフォリオの公開URLを入力してください"
                            error={errors.url}
                            className="md:col-span-2"
                        >
                            <TextInput
                                id="url"
                                name="url"
                                value={data.url || ""}
                                onChange={(e) => setData("url", e.target.value)}
                                placeholder="https://example.com"
                            />
                        </FormGroup>

                        <FormGroup
                            label="制作完了日"
                            htmlFor="completed_at"
                            help="制作が完了した日付を入力してください"
                            error={errors.completed_at}
                        >
                            <TextInput
                                id="completed_at"
                                name="completed_at"
                                type="date"
                                value={data.completed_at || ""}
                                onChange={(e) =>
                                    setData("completed_at", e.target.value)
                                }
                            />
                            <InputError message={errors.completed_at} />
                        </FormGroup>

                        <FormGroup
                            label="表示順"
                            htmlFor="sort_order"
                            help="表示順を指定します。数値が小さいほど上位に表示されます。"
                            error={errors.sort_order}
                        >
                            <NumberInput
                                id="sort_order"
                                name="sort_order"
                                min={0}
                                value={data.sort_order}
                                onChange={(val) =>
                                    setData("sort_order", val || 0)
                                }
                            />
                        </FormGroup>

                        <div className="flex items-center mt-6">
                            <label className="flex items-center">
                                <Checkbox
                                    checked={data.is_displayed ?? true}
                                    onChange={(e) =>
                                        setData(
                                            "is_displayed",
                                            e.target.checked,
                                        )
                                    }
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Webサイトに表示する
                                </span>
                            </label>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>カバー画像</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="flex items-center gap-4">
                        {selectedMedia ? (
                            <img
                                src={selectedMedia.url}
                                alt={selectedMedia.alt_text || data.title}
                                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                            />
                        ) : (
                            <div className="w-32 h-32 flex items-center justify-center rounded-lg border border-dashed border-gray-300 text-gray-400">
                                <PhotoIcon className="w-10 h-10" />
                            </div>
                        )}
                        <div className="space-x-2">
                            <SecondaryButton
                                type="button"
                                onClick={() => setShowMediaModal(true)}
                                size="md"
                            >
                                画像を選択
                            </SecondaryButton>
                            {data.media_id && (
                                <SecondaryButton
                                    type="button"
                                    onClick={() => setData("media_id", "")}
                                    size="md"
                                >
                                    解除
                                </SecondaryButton>
                            )}
                        </div>
                    </div>
                    <InputError message={errors.media_id} />
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>関連サービス</CardTitle>
                </CardHeader>
                <CardBody>
                    {services.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            サービスが登録されていません。
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {services.map((service) => (
                                <label
                                    key={service.id}
                                    className="flex items-center"
                                >
                                    <Checkbox
                                        checked={(
                                            data.service_ids || []
                                        ).includes(service.id)}
                                        onChange={() =>
                                            toggleService(service.id)
                                        }
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        {service.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                    <InputError message={errors.service_ids} />
                </CardBody>
            </Card>

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
                multiple={false}
                uploadRoute={route("admin.media.store")}
                onClose={() => setShowMediaModal(false)}
                onSelect={(mediaId) => {
                    setData("media_id", mediaId);
                    setShowMediaModal(false);
                }}
                onMediaUploaded={(media) =>
                    setMediaListState((prev) => [media, ...prev])
                }
            />
        </form>
    );
}
