import { forwardRef } from "react";
import { Link } from "@inertiajs/react";

/** 機能に結び付いた固定の導線（メニューのデータではなくコードに置く） */
export const ROUTES = {
    contact: "/contact",
    estimate: "/estimate-simulator",
    faq: "/faq",
    blog: "/blog",
    login: "/login",
    privacy: "/privacy-policy",
};

/** 管理画面「メニュー」の項目からリンク先を決める（URL優先、無ければ紐付けた固定ページ） */
export const resolveMenuHref = (item) => {
    if (item.url) return item.url;
    if (item.page?.slug) return `/${item.page.slug}`;
    return null;
};

/** 管理画面「メニュー」のデータを、表示用の配列にする。リンク先が無い項目は出さない */
export const menuEntries = (menu) =>
    (menu?.menu_items ?? [])
        .map((item) => ({
            id: item.id,
            label: item.label,
            href: resolveMenuHref(item),
            external: item.target === "_blank",
            children: (item.children ?? [])
                .map((child) => ({
                    id: child.id,
                    label: child.label,
                    href: resolveMenuHref(child),
                    external: child.target === "_blank",
                }))
                .filter((child) => child.href),
        }))
        .filter((item) => item.href);

export function Arrow() {
    return (
        <span aria-hidden="true" className="btn-arrow">
            →
        </span>
    );
}

/**
 * サイト内はInertiaの<Link>、外部・新しいタブは<a>で開く。
 * 試作のマークアップ（class名）をそのまま使えるよう、余計な要素は足さない
 */
export const SiteLink = forwardRef(function SiteLink({ href, external = false, children, ...props }, ref) {
    const isExternal = external || /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
    if (isExternal) {
        return (
            <a ref={ref} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props}>
                {children}
            </a>
        );
    }
    return (
        <Link ref={ref} href={href} {...props}>
            {children}
        </Link>
    );
});

/** 「まずは、相談する」「概算費用を見る」の2つのボタン */
export function CtaPair() {
    return (
        <div className="cta-pair">
            <SiteLink className="button" href={ROUTES.contact}>
                まずは、相談する <Arrow />
            </SiteLink>
            <SiteLink className="button button-light" href={ROUTES.estimate}>
                概算費用を見る <small>約1分 / 登録不要</small> <Arrow />
            </SiteLink>
        </div>
    );
}
