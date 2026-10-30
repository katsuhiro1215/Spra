import "../css/app.css";
import "./bootstrap";

import { createInertiaApp, router } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { startCsrfTokenAutoRefresh } from "./Utils/CsrfTokenRefresh";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

const pages = import.meta.glob("./Pages/**/*.jsx", { eager: false });
console.log("Available pages:", Object.keys(pages));

// CSRF トークン自動更新を開始（10分ごと）
startCsrfTokenAutoRefresh(10);

// 公開サイトの画面遷移の簡単な演出（CSS: resources/css/public/site.css の .ss-navigating / ss-page-enter）。
// 管理画面には適用しない。クラスは .ss-public 要素自身に付け外しする
// （.ss-public は公開レイアウトの外枠で、このファイルのCSSセレクタが自動で閉じ込められる単位そのもの。postcss.config.js参照）
const togglePublicNavigating = (on) => {
    document.querySelectorAll(".ss-public").forEach((el) => el.classList.toggle("ss-navigating", on));
};
router.on("start", () => {
    if (!location.pathname.startsWith("/admin")) togglePublicNavigating(true);
});
router.on("finish", () => togglePublicNavigating(false));

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        console.log("Resolving page:", name);
        return resolvePageComponent(`./Pages/${name}.jsx`, pages);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        // スタイリッシュなプログレスバー
        color: "#10B981", // Green-500
        size: 3,
        showSpinner: true,
    },
});
