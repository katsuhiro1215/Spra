import React, { useState } from "react";
import { TextInput, SelectInput, FormGroup } from "@/Components/Forms";
import { PhotoIcon } from "@heroicons/react/24/outline";
import MediaSelectModal from "@/Components/Media/MediaSelectModal";

export const IMAGE_DEFAULT_DATA = {
    url: "",
    alt: "",
    caption: "",
    width: "full",
};

export default function ImageBlock({ data, onChange, mediaList = [] }) {
    const value = { ...IMAGE_DEFAULT_DATA, ...data };
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaListState, setMediaListState] = useState(mediaList);

    return (
        <div className="space-y-3">
            <div>
                {value.url ? (
                    <div className="relative group">
                        <img
                            src={value.url}
                            alt={value.alt}
                            className="max-h-64 rounded-lg border border-slate-200 dark:border-slate-700 object-contain bg-slate-50 dark:bg-slate-900"
                        />
                        <button
                            type="button"
                            onClick={() => setShowMediaModal(true)}
                            className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 rounded-lg text-white text-sm"
                        >
                            画像を変更
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setShowMediaModal(true)}
                        className="w-full h-40 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                        <PhotoIcon className="h-8 w-8" />
                        <span className="text-sm">メディアライブラリから選択</span>
                    </button>
                )}
            </div>

            <FormGroup label="代替テキスト（alt）">
                <TextInput
                    value={value.alt}
                    onChange={(e) => onChange({ ...value, alt: e.target.value })}
                    placeholder="画像の説明"
                />
            </FormGroup>
            <FormGroup label="キャプション">
                <TextInput
                    value={value.caption}
                    onChange={(e) => onChange({ ...value, caption: e.target.value })}
                    placeholder="画像下部に表示する説明文（任意）"
                />
            </FormGroup>
            <FormGroup label="表示幅">
                <SelectInput
                    value={value.width}
                    onChange={(e) => onChange({ ...value, width: e.target.value })}
                >
                    <option value="full">全幅</option>
                    <option value="wide">ワイド</option>
                    <option value="narrow">標準</option>
                </SelectInput>
            </FormGroup>

            <MediaSelectModal
                show={showMediaModal}
                mediaList={mediaListState}
                uploadRoute={route("admin.media.store")}
                onClose={() => setShowMediaModal(false)}
                onSelect={(mediaId) => {
                    const media = mediaListState.find((m) => m.id === mediaId);
                    if (media) {
                        onChange({
                            ...value,
                            url: media.url,
                            alt: value.alt || media.alt_text || "",
                        });
                    }
                    setShowMediaModal(false);
                }}
                onMediaUploaded={(media) =>
                    setMediaListState((prev) => [media, ...prev])
                }
            />
        </div>
    );
}

export function ImageBlockPreview({ data }) {
    const value = { ...IMAGE_DEFAULT_DATA, ...data };
    const widthClass =
        value.width === "narrow"
            ? "max-w-md"
            : value.width === "wide"
              ? "max-w-3xl"
              : "w-full";

    if (!value.url) return null;

    return (
        <figure className={`${widthClass} mx-auto`}>
            <img
                src={value.url}
                alt={value.alt}
                className="w-full rounded-xl shadow-md"
            />
            {value.caption && (
                <figcaption className="mt-2 text-sm text-center text-gray-500">
                    {value.caption}
                </figcaption>
            )}
        </figure>
    );
}
