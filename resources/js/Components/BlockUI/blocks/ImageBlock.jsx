import React, { useRef, useState } from "react";
import { TextInput, SelectInput, FormGroup } from "@/Components/Forms";
import { PhotoIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export const IMAGE_DEFAULT_DATA = {
    url: "",
    alt: "",
    caption: "",
    width: "full",
};

async function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");
    if (csrfToken) {
        formData.append("_token", csrfToken);
    }

    const response = await fetch(route("admin.media.store"), {
        method: "POST",
        body: formData,
        headers: { "X-Requested-With": "XMLHttpRequest" },
    });

    const result = await response.json();
    if (!response.ok || !result?.success) {
        throw new Error(result?.message || "画像のアップロードに失敗しました。");
    }
    return result.media;
}

export default function ImageBlock({ data, onChange }) {
    const value = { ...IMAGE_DEFAULT_DATA, ...data };
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFile = async (file) => {
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            const media = await uploadImage(file);
            onChange({ ...value, url: media.url, alt: value.alt || media.alt_text || "" });
        } catch (e) {
            setError(e.message);
        } finally {
            setUploading(false);
        }
    };

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
                            onClick={() => inputRef.current?.click()}
                            className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 rounded-lg text-white text-sm"
                        >
                            画像を変更
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="w-full h-40 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <ArrowUpTrayIcon className="h-8 w-8 animate-pulse" />
                                <span className="text-sm">アップロード中...</span>
                            </>
                        ) : (
                            <>
                                <PhotoIcon className="h-8 w-8" />
                                <span className="text-sm">クリックして画像を選択</span>
                            </>
                        )}
                    </button>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
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

    if (!value.url) {
        return (
            <div className="flex items-center justify-center h-32 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400">
                <PhotoIcon className="h-8 w-8" />
            </div>
        );
    }

    return (
        <figure className={`${widthClass} mx-auto`}>
            <img src={value.url} alt={value.alt} className="w-full rounded-lg" />
            {value.caption && (
                <figcaption className="mt-2 text-sm text-center text-slate-500">
                    {value.caption}
                </figcaption>
            )}
        </figure>
    );
}
