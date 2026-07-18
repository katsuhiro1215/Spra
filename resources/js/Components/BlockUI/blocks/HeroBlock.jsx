import React, { useState } from "react";
import { PhotoIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import MediaSelectModal from "@/Components/Media/MediaSelectModal";
import HeroSection from "@/Pages/Public/Section/HeroSection";

export const HERO_DEFAULT_DATA = {
    images: ["/upload/test1.jpg", "/upload/test2.jpg", "/upload/test3.jpg"],
};

export default function HeroBlock({ data, onChange, mediaList = [] }) {
    const value = { ...HERO_DEFAULT_DATA, ...data };
    const images = Array.isArray(value.images) ? value.images : [];
    const [editingIndex, setEditingIndex] = useState(null);
    const [mediaListState, setMediaListState] = useState(mediaList);

    const updateImage = (index, url) => {
        const next = [...images];
        next[index] = url;
        onChange({ ...value, images: next });
    };

    const removeImage = (index) => {
        onChange({ ...value, images: images.filter((_, i) => i !== index) });
    };

    const addImage = () => {
        onChange({ ...value, images: [...images, ""] });
        setEditingIndex(images.length);
    };

    return (
        <div className="space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                トップページのヒーロースライドショーに使う画像です。文言やアニメーションはコード側で管理しているため、ここでは画像のみ変更できます。
            </p>
            <div className="space-y-2">
                {images.map((url, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="relative group shrink-0">
                            {url ? (
                                <img
                                    src={url}
                                    alt=""
                                    className="h-20 w-32 rounded-lg border border-slate-200 dark:border-slate-700 object-cover bg-slate-50 dark:bg-slate-900"
                                />
                            ) : (
                                <div className="h-20 w-32 flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-400">
                                    <PhotoIcon className="h-6 w-6" />
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => setEditingIndex(index)}
                                className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 rounded-lg text-white text-xs"
                            >
                                画像を変更
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-2 rounded text-slate-400 hover:text-red-600"
                            aria-label="この画像を削除"
                        >
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={addImage}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
                <PlusIcon className="h-4 w-4" />
                画像を追加
            </button>

            <MediaSelectModal
                show={editingIndex !== null}
                mediaList={mediaListState}
                uploadRoute={route("admin.media.store")}
                onClose={() => setEditingIndex(null)}
                onSelect={(mediaId) => {
                    const media = mediaListState.find((m) => m.id === mediaId);
                    if (media && editingIndex !== null) {
                        updateImage(editingIndex, media.url);
                    }
                    setEditingIndex(null);
                }}
                onMediaUploaded={(media) =>
                    setMediaListState((prev) => [media, ...prev])
                }
            />
        </div>
    );
}

export function HeroBlockPreview({ data }) {
    const value = { ...HERO_DEFAULT_DATA, ...data };
    return <HeroSection images={value.images} />;
}
