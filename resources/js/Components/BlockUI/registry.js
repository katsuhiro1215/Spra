import {
    Bars3BottomLeftIcon,
    DocumentTextIcon,
    PhotoIcon,
    CursorArrowRaysIcon,
    Bars2Icon,
} from "@heroicons/react/24/outline";

import HeadingBlock, {
    HEADING_DEFAULT_DATA,
    HeadingBlockPreview,
} from "./blocks/HeadingBlock";
import TextBlock, { TEXT_DEFAULT_DATA, TextBlockPreview } from "./blocks/TextBlock";
import ImageBlock, { IMAGE_DEFAULT_DATA, ImageBlockPreview } from "./blocks/ImageBlock";
import ButtonBlock, {
    BUTTON_DEFAULT_DATA,
    ButtonBlockPreview,
} from "./blocks/ButtonBlock";
import SpacerBlock, {
    SPACER_DEFAULT_DATA,
    SpacerBlockPreview,
} from "./blocks/SpacerBlock";

// ブロック種別レジストリ
// 新しいブロックを追加する場合はここに登録する
export const BLOCK_REGISTRY = {
    heading: {
        type: "heading",
        label: "見出し",
        icon: Bars3BottomLeftIcon,
        defaultData: HEADING_DEFAULT_DATA,
        Edit: HeadingBlock,
        Preview: HeadingBlockPreview,
    },
    text: {
        type: "text",
        label: "テキスト",
        icon: DocumentTextIcon,
        defaultData: TEXT_DEFAULT_DATA,
        Edit: TextBlock,
        Preview: TextBlockPreview,
    },
    image: {
        type: "image",
        label: "画像",
        icon: PhotoIcon,
        defaultData: IMAGE_DEFAULT_DATA,
        Edit: ImageBlock,
        Preview: ImageBlockPreview,
    },
    button: {
        type: "button",
        label: "ボタン",
        icon: CursorArrowRaysIcon,
        defaultData: BUTTON_DEFAULT_DATA,
        Edit: ButtonBlock,
        Preview: ButtonBlockPreview,
    },
    spacer: {
        type: "spacer",
        label: "スペーサー",
        icon: Bars2Icon,
        defaultData: SPACER_DEFAULT_DATA,
        Edit: SpacerBlock,
        Preview: SpacerBlockPreview,
    },
};

export const BLOCK_TYPES = Object.values(BLOCK_REGISTRY);

export function createBlock(type) {
    const definition = BLOCK_REGISTRY[type];
    if (!definition) {
        throw new Error(`Unknown block type: ${type}`);
    }

    return {
        id:
            typeof crypto !== "undefined" && crypto.randomUUID
                ? crypto.randomUUID()
                : `block-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type,
        data: { ...definition.defaultData },
    };
}
