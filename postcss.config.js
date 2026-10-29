import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

/**
 * 公開サイトのリニューアル用CSS（resources/css/public/ 配下）だけを `.ss-public` の中に閉じ込める。
 * 試作（showcases/katsucoderenewal）のCSSをそのまま移植しているため、`.header` や `h2` などの
 * 汎用的なセレクタが管理画面に効かないようにする。
 * - `html` / `body` / `:root` → `.ss-public`（公開レイアウトのいちばん外側の要素）
 * - 試作でbodyに付けていた状態クラス（.no-motion など）→ `.ss-public.no-motion ...`
 * - それ以外 → `.ss-public ...`
 */
const SCOPE = ".ss-public";
const ROOT_STATE_CLASSES = ["no-motion", "js-reveal", "reduced-motion", "locked", "home-page", "inner-page"];

function scopeSelector(selector) {
    const s = selector.trim();
    if (s.startsWith(SCOPE)) return s;

    const root = s.match(/^(?:html|body|:root)(?![\w-])(.*)$/);
    if (root) return `${SCOPE}${root[1]}`;

    const state = ROOT_STATE_CLASSES.find((name) => new RegExp(`^\\.${name}(?![\\w-])`).test(s));
    if (state) {
        // 試作の「.no-motion html」は、スコープの要素そのものを指していた
        return `${SCOPE}${s.replace(/\s+(?:html|body)$/, "")}`;
    }

    return `${SCOPE} ${s}`;
}

const scopePublicCss = () => ({
    postcssPlugin: "scope-public-css",
    Rule(rule) {
        const file = (rule.source?.input?.file ?? "").replace(/\\/g, "/");
        if (!file.includes("/resources/css/public/")) return;
        if (rule.parent?.type === "atrule" && /keyframes$/i.test(rule.parent.name)) return;
        if (rule.selectors.every((s) => s.trim().startsWith(SCOPE))) return;
        rule.selectors = rule.selectors.map(scopeSelector);
    },
});
scopePublicCss.postcss = true;

export default {
    plugins: [tailwindcss, scopePublicCss, autoprefixer],
};
