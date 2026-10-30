import logoSvg from "../../../images/public/sprout-logo.svg?raw";

const VIEW_BOX = "0 0 215.73 207.86";

/** ロゴSVGの中身（<svg>タグの内側）。グラデーションの<defs>を含む */
const logoContent = logoSvg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

/** ロゴの元データ（3Dのヒーローで押し出し形状を作るときに使う） */
export const sproutLogoSource = logoSvg;

/**
 * ページ内で <use href="#sprout-logo"> を使えるようにする定義。レイアウトに1回だけ置く。
 */
export function SproutLogoDefs() {
    return (
        <svg className="svg-defs" aria-hidden="true" width="0" height="0">
            <defs>
                <symbol
                    id="sprout-logo"
                    viewBox={VIEW_BOX}
                    dangerouslySetInnerHTML={{ __html: logoContent }}
                />
            </defs>
        </svg>
    );
}

/** Sの芽のロゴマーク */
export function SproutMark({ className }) {
    return (
        <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
            <use href="#sprout-logo" />
        </svg>
    );
}

/** ヘッダー・フッター共通のブランド表記 */
export function Brand() {
    return (
        <>
            <SproutMark />
            <strong>
                Smart<b>Sprouts</b>
                <small>スマートスプラウツ</small>
            </strong>
        </>
    );
}
