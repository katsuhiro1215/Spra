import { usePage } from "@inertiajs/react";
import { Brand } from "./SproutLogo";
import { Arrow, ROUTES, SiteLink, menuEntries } from "./links";

const isCurrent = (currentUrl, href) => {
    const path = currentUrl.split(/[?#]/)[0];
    return href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
};

/**
 * 公開サイトの共通ヘッダーと、スマホ・全ページ用のメニューパネル。
 * メニュー項目は管理画面「Webサイト管理 → メニュー」（設置場所 header / footer）のデータ。
 * 開閉・フォーカス制御は PublicLayout が持つ（パネル外の要素を操作できないようにするため）
 */
export default function SiteHeader({ refs, headerMenu, footerMenu, menuOpen, onToggleMenu, onCloseMenu }) {
    const { url } = usePage();
    const items = menuEntries(headerMenu);
    const primaryHrefs = new Set(items.map((item) => item.href));
    const secondary = menuEntries(footerMenu).filter((item) => !primaryHrefs.has(item.href));
    const current = (href) => (isCurrent(url, href) ? { "aria-current": "page" } : {});
    const number = (index) => String(index).padStart(2, "0");

    return (
        <>
            <header className="header" ref={refs.header}>
                <SiteLink className="brand" href="/" aria-label="SmartSprouts ホーム" ref={refs.brand}>
                    <Brand />
                    <span className="brand-sub">
                        Web制作・システム開発・アプリ開発
                        <br />
                        奈良から、事業の「これから」を。
                    </span>
                </SiteLink>
                <nav className="navigation" aria-label="メインメニュー" ref={refs.nav}>
                    {items.map((item) => (
                        <SiteLink key={item.id} href={item.href} external={item.external} {...current(item.href)}>
                            {item.label}
                        </SiteLink>
                    ))}
                    <SiteLink className="header-estimate" href={ROUTES.estimate} {...current(ROUTES.estimate)}>
                        料金の目安 <Arrow />
                    </SiteLink>
                    <SiteLink className="header-contact" href={ROUTES.contact} {...current(ROUTES.contact)}>
                        無料相談 <Arrow />
                    </SiteLink>
                </nav>
                <button
                    type="button"
                    className="menu-toggle"
                    aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
                    aria-controls="menu-panel"
                    aria-expanded={menuOpen}
                    onClick={onToggleMenu}
                    ref={refs.toggle}
                >
                    <span>MENU</span>
                    <span className="menu-lines" aria-hidden="true" />
                </button>
            </header>

            <div
                className="menu-panel"
                id="menu-panel"
                role="dialog"
                aria-modal="true"
                aria-label="サイトメニュー"
                hidden={!menuOpen}
                ref={refs.panel}
            >
                <div className="menu-message">
                    小さく動き、
                    <br />
                    早く育てる。
                    <small>
                        Web制作・システム開発・アプリ開発
                        <br />
                        奈良を拠点に、一緒に考え、つくる。
                    </small>
                    <SiteLink className="button button-light" href={ROUTES.estimate} onClick={onCloseMenu}>
                        約1分で概算費用を見る <Arrow />
                    </SiteLink>
                </div>
                <nav className="menu-list" aria-label="すべてのページ">
                    <SiteLink href="/" onClick={onCloseMenu}>
                        ホーム
                        <small>
                            01 <Arrow />
                        </small>
                    </SiteLink>
                    {items.map((item, index) => (
                        <SiteLink key={item.id} href={item.href} external={item.external} onClick={onCloseMenu}>
                            {item.label}
                            <small>
                                {number(index + 2)} <Arrow />
                            </small>
                        </SiteLink>
                    ))}
                    <SiteLink href={ROUTES.contact} onClick={onCloseMenu}>
                        まずは、無料相談
                        <small>
                            {number(items.length + 2)} <Arrow />
                        </small>
                    </SiteLink>
                    <div className="menu-secondary">
                        {secondary.map((item) => (
                            <SiteLink key={item.id} href={item.href} external={item.external} onClick={onCloseMenu}>
                                {item.label} <Arrow />
                            </SiteLink>
                        ))}
                        <SiteLink href={ROUTES.login} onClick={onCloseMenu}>
                            お客様ログイン <Arrow />
                        </SiteLink>
                    </div>
                </nav>
            </div>
        </>
    );
}
