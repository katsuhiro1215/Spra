import * as OutlineIcons from "@heroicons/react/24/outline";
import { Squares2X2Icon } from "@heroicons/react/24/outline";

/**
 * DBの icon 列（例: "globe-alt", "shopping-cart"）から対応する
 * Heroicon (outline) コンポーネントを解決する。該当がない場合はフォールバックを返す。
 */
export function resolveServiceIcon(slug) {
    if (!slug) return Squares2X2Icon;

    const pascalCase = slug
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");

    return OutlineIcons[`${pascalCase}Icon`] || Squares2X2Icon;
}
