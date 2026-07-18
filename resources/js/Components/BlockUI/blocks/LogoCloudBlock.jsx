import React from "react";
import { ArrayFieldEditor } from "@/Components/Forms";

export const LOGO_CLOUD_DEFAULT_DATA = {
    items: [],
};

const ITEMS_SCHEMA = {
    imageUrl: { type: "image", label: "ロゴ画像URL", default: "" },
    alt: { type: "text", label: "企業名など（alt）", default: "" },
    url: { type: "text", label: "リンク先URL（任意）", default: "" },
};

export default function LogoCloudBlock({ data, onChange }) {
    const value = { ...LOGO_CLOUD_DEFAULT_DATA, ...data };

    return (
        <ArrayFieldEditor
            value={value.items}
            onChange={(items) => onChange({ ...value, items })}
            itemsSchema={ITEMS_SCHEMA}
            label="ロゴ"
        />
    );
}

function LogoImage({ item }) {
    return (
        <img
            src={item.imageUrl}
            alt={item.alt}
            className="h-10 md:h-12 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
        />
    );
}

export function LogoCloudBlockPreview({ data }) {
    const value = { ...LOGO_CLOUD_DEFAULT_DATA, ...data };
    const items = (value.items || []).filter((item) => item.imageUrl);
    if (items.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {items.map((item, i) =>
                item.url ? (
                    <a key={i} href={item.url}>
                        <LogoImage item={item} />
                    </a>
                ) : (
                    <LogoImage key={i} item={item} />
                ),
            )}
        </div>
    );
}
