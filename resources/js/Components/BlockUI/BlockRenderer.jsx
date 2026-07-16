import React from "react";

const HEADING_DEFAULT = { text: "", level: "h2", align: "left" };
const TEXT_DEFAULT = { html: "" };
const IMAGE_DEFAULT = { url: "", alt: "", caption: "", width: "full" };
const BUTTON_DEFAULT = {
    label: "",
    url: "",
    style: "primary",
    align: "left",
    openInNewTab: false,
};
const SPACER_DEFAULT = { height: 40 };

const ALIGN_CLASSES = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

const BUTTON_STYLE_CLASSES = {
    primary:
        "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
};

function HeadingBlock({ data }) {
    const value = { ...HEADING_DEFAULT, ...data };
    if (!value.text) return null;
    const Tag = value.level || "h2";

    return (
        <Tag
            className={`font-bold text-gray-900 ${ALIGN_CLASSES[value.align] || ALIGN_CLASSES.left}`}
        >
            {value.text}
        </Tag>
    );
}

function TextBlock({ data }) {
    const value = { ...TEXT_DEFAULT, ...data };
    if (!value.html) return null;

    return (
        <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: value.html }}
        />
    );
}

function ImageBlock({ data }) {
    const value = { ...IMAGE_DEFAULT, ...data };
    if (!value.url) return null;
    const widthClass =
        value.width === "narrow"
            ? "max-w-md"
            : value.width === "wide"
              ? "max-w-3xl"
              : "w-full";

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

function ButtonBlock({ data }) {
    const value = { ...BUTTON_DEFAULT, ...data };
    if (!value.label || !value.url) return null;
    const justifyClass =
        value.align === "center"
            ? "justify-center"
            : value.align === "right"
              ? "justify-end"
              : "justify-start";

    return (
        <div className={`flex ${justifyClass}`}>
            <a
                href={value.url}
                target={value.openInNewTab ? "_blank" : undefined}
                rel={value.openInNewTab ? "noopener noreferrer" : undefined}
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-xl transition-all duration-300 ${
                    BUTTON_STYLE_CLASSES[value.style] ||
                    BUTTON_STYLE_CLASSES.primary
                }`}
            >
                {value.label}
            </a>
        </div>
    );
}

function SpacerBlock({ data }) {
    const value = { ...SPACER_DEFAULT, ...data };
    return <div style={{ height: `${value.height}px` }} />;
}

const BLOCK_COMPONENTS = {
    heading: HeadingBlock,
    text: TextBlock,
    image: ImageBlock,
    button: ButtonBlock,
    spacer: SpacerBlock,
};

/**
 * BlockEditorで作成された { blocks: [{ id, type, data }] } を
 * 公開サイト向けに読み取り専用で描画するコンポーネント。
 */
export default function BlockRenderer({ blocks }) {
    if (!Array.isArray(blocks) || blocks.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            {blocks.map((block) => {
                const Component = BLOCK_COMPONENTS[block.type];
                if (!Component) return null;
                return <Component key={block.id} data={block.data} />;
            })}
        </div>
    );
}
