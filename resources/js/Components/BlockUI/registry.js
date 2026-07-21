import {
    Bars3BottomLeftIcon,
    DocumentTextIcon,
    PhotoIcon,
    CursorArrowRaysIcon,
    Bars2Icon,
    MinusIcon,
    ChatBubbleBottomCenterTextIcon,
    MegaphoneIcon,
    ChartBarIcon,
    CheckBadgeIcon,
    RectangleGroupIcon,
    Squares2X2Icon,
    Square3Stack3DIcon,
    PlayCircleIcon,
    BuildingOffice2Icon,
    QuestionMarkCircleIcon,
    ViewColumnsIcon,
    FlagIcon,
    ArrowRightCircleIcon,
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
import DividerBlock, {
    DIVIDER_DEFAULT_DATA,
    DividerBlockPreview,
} from "./blocks/DividerBlock";
import QuoteBlock, { QUOTE_DEFAULT_DATA, QuoteBlockPreview } from "./blocks/QuoteBlock";
import CTABlock, { CTA_DEFAULT_DATA, CTABlockPreview } from "./blocks/CTABlock";
import StatsBlock, { STATS_DEFAULT_DATA, StatsBlockPreview } from "./blocks/StatsBlock";
import IconTextBlock, {
    ICON_TEXT_DEFAULT_DATA,
    IconTextBlockPreview,
} from "./blocks/IconTextBlock";
import CardBlock, { CARD_DEFAULT_DATA, CardBlockPreview } from "./blocks/CardBlock";
import CardGroupBlock, {
    CARD_GROUP_DEFAULT_DATA,
    CardGroupBlockPreview,
} from "./blocks/CardGroupBlock";
import GalleryBlock, {
    GALLERY_DEFAULT_DATA,
    GalleryBlockPreview,
} from "./blocks/GalleryBlock";
import VideoBlock, { VIDEO_DEFAULT_DATA, VideoBlockPreview } from "./blocks/VideoBlock";
import LogoCloudBlock, {
    LOGO_CLOUD_DEFAULT_DATA,
    LogoCloudBlockPreview,
} from "./blocks/LogoCloudBlock";
import AccordionBlock, {
    ACCORDION_DEFAULT_DATA,
    AccordionBlockPreview,
} from "./blocks/AccordionBlock";
import TabsBlock, { TABS_DEFAULT_DATA, TabsBlockPreview } from "./blocks/TabsBlock";
import HeroBlock, { HERO_DEFAULT_DATA, HeroBlockPreview } from "./blocks/HeroBlock";
import StepsBlock, { STEPS_DEFAULT_DATA, StepsBlockPreview } from "./blocks/StepsBlock";

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
    divider: {
        type: "divider",
        label: "区切り線",
        icon: MinusIcon,
        defaultData: DIVIDER_DEFAULT_DATA,
        Edit: DividerBlock,
        Preview: DividerBlockPreview,
    },
    quote: {
        type: "quote",
        label: "引用",
        icon: ChatBubbleBottomCenterTextIcon,
        defaultData: QUOTE_DEFAULT_DATA,
        Edit: QuoteBlock,
        Preview: QuoteBlockPreview,
    },
    cta: {
        type: "cta",
        label: "CTA（行動喚起）",
        icon: MegaphoneIcon,
        defaultData: CTA_DEFAULT_DATA,
        Edit: CTABlock,
        Preview: CTABlockPreview,
    },
    stats: {
        type: "stats",
        label: "数値実績",
        icon: ChartBarIcon,
        defaultData: STATS_DEFAULT_DATA,
        Edit: StatsBlock,
        Preview: StatsBlockPreview,
    },
    iconText: {
        type: "iconText",
        label: "アイコン+テキスト",
        icon: CheckBadgeIcon,
        defaultData: ICON_TEXT_DEFAULT_DATA,
        Edit: IconTextBlock,
        Preview: IconTextBlockPreview,
    },
    card: {
        type: "card",
        label: "カード",
        icon: RectangleGroupIcon,
        defaultData: CARD_DEFAULT_DATA,
        Edit: CardBlock,
        Preview: CardBlockPreview,
    },
    cardGroup: {
        type: "cardGroup",
        label: "カードグループ",
        icon: Squares2X2Icon,
        defaultData: CARD_GROUP_DEFAULT_DATA,
        Edit: CardGroupBlock,
        Preview: CardGroupBlockPreview,
    },
    gallery: {
        type: "gallery",
        label: "ギャラリー",
        icon: Square3Stack3DIcon,
        defaultData: GALLERY_DEFAULT_DATA,
        Edit: GalleryBlock,
        Preview: GalleryBlockPreview,
    },
    video: {
        type: "video",
        label: "動画",
        icon: PlayCircleIcon,
        defaultData: VIDEO_DEFAULT_DATA,
        Edit: VideoBlock,
        Preview: VideoBlockPreview,
    },
    logoCloud: {
        type: "logoCloud",
        label: "ロゴ一覧",
        icon: BuildingOffice2Icon,
        defaultData: LOGO_CLOUD_DEFAULT_DATA,
        Edit: LogoCloudBlock,
        Preview: LogoCloudBlockPreview,
    },
    accordion: {
        type: "accordion",
        label: "アコーディオン（FAQ）",
        icon: QuestionMarkCircleIcon,
        defaultData: ACCORDION_DEFAULT_DATA,
        Edit: AccordionBlock,
        Preview: AccordionBlockPreview,
    },
    tabs: {
        type: "tabs",
        label: "タブ",
        icon: ViewColumnsIcon,
        defaultData: TABS_DEFAULT_DATA,
        Edit: TabsBlock,
        Preview: TabsBlockPreview,
    },
    hero: {
        type: "hero",
        label: "ヒーロー（トップページ）",
        icon: FlagIcon,
        defaultData: HERO_DEFAULT_DATA,
        Edit: HeroBlock,
        Preview: HeroBlockPreview,
    },
    steps: {
        type: "steps",
        label: "ステップ（流れ）",
        icon: ArrowRightCircleIcon,
        defaultData: STEPS_DEFAULT_DATA,
        Edit: StepsBlock,
        Preview: StepsBlockPreview,
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
