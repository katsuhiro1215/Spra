import React from "react";
import { ArrayFieldEditor, SelectInput, FormGroup } from "@/Components/Forms";

export const GALLERY_DEFAULT_DATA = {
    columns: 3,
    images: [],
};

const ITEMS_SCHEMA = {
    url: { type: "image", label: "画像URL", default: "" },
    alt: { type: "text", label: "代替テキスト", default: "" },
    caption: { type: "text", label: "キャプション（任意）", default: "" },
};

const GRID_CLASSES = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
};

export default function GalleryBlock({ data, onChange }) {
    const value = { ...GALLERY_DEFAULT_DATA, ...data };

    return (
        <div className="space-y-3">
            <FormGroup label="列数">
                <SelectInput
                    value={value.columns}
                    onChange={(e) =>
                        onChange({ ...value, columns: Number(e.target.value) })
                    }
                >
                    <option value={2}>2列</option>
                    <option value={3}>3列</option>
                    <option value={4}>4列</option>
                </SelectInput>
            </FormGroup>
            <ArrayFieldEditor
                value={value.images}
                onChange={(images) => onChange({ ...value, images })}
                itemsSchema={ITEMS_SCHEMA}
                label="画像"
            />
        </div>
    );
}

export function GalleryBlockPreview({ data }) {
    const value = { ...GALLERY_DEFAULT_DATA, ...data };
    const images = (value.images || []).filter((img) => img.url);
    if (images.length === 0) return null;
    const gridClass = GRID_CLASSES[value.columns] || GRID_CLASSES[3];

    return (
        <div className={`grid ${gridClass} gap-4`}>
            {images.map((img, i) => (
                <figure key={i}>
                    <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full aspect-square object-cover rounded-lg shadow-sm"
                    />
                    {img.caption && (
                        <figcaption className="mt-1 text-xs text-center text-gray-500">
                            {img.caption}
                        </figcaption>
                    )}
                </figure>
            ))}
        </div>
    );
}
