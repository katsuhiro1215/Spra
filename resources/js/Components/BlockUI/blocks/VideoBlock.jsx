import React from "react";
import { TextInput, FormGroup } from "@/Components/Forms";

export const VIDEO_DEFAULT_DATA = {
    url: "",
    caption: "",
};

function getEmbedUrl(url) {
    if (!url) return null;

    const youtubeMatch = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
    );
    if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return null;
}

export default function VideoBlock({ data, onChange }) {
    const value = { ...VIDEO_DEFAULT_DATA, ...data };

    return (
        <div className="space-y-3">
            <FormGroup label="動画URL（YouTube / Vimeo）">
                <TextInput
                    value={value.url}
                    onChange={(e) => onChange({ ...value, url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                />
            </FormGroup>
            <FormGroup label="キャプション（任意）">
                <TextInput
                    value={value.caption}
                    onChange={(e) => onChange({ ...value, caption: e.target.value })}
                    placeholder="動画の説明"
                />
            </FormGroup>
        </div>
    );
}

export function VideoBlockPreview({ data }) {
    const value = { ...VIDEO_DEFAULT_DATA, ...data };
    const embedUrl = getEmbedUrl(value.url);
    if (!embedUrl) return null;

    return (
        <figure className="max-w-3xl mx-auto">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
                <iframe
                    src={embedUrl}
                    title={value.caption || "動画"}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
            {value.caption && (
                <figcaption className="mt-2 text-sm text-center text-gray-500">
                    {value.caption}
                </figcaption>
            )}
        </figure>
    );
}
