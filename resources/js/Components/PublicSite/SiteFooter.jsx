import { forwardRef } from "react";
import { Brand, SproutMark } from "./SproutLogo";
import { CtaPair, ROUTES, SiteLink, menuEntries } from "./links";

/**
 * 公開サイトの共通フッター。
 * - 上段の相談CTA（トップでは #footer-scene に3Dのロゴが入る。他のページはSVGのロゴ）
 * - フッターメニュー：管理画面「メニュー」の設置場所 footer。無ければヘッダーメニューを使う
 * - 連絡先：管理画面の組織情報（organization）。コードに直書きしない
 */
const SiteFooter = forwardRef(function SiteFooter({ headerMenu, footerMenu, organization, showContact = true }, ref) {
    const items = menuEntries(footerMenu?.menu_items?.length ? footerMenu : headerMenu);
    const address = organization?.default_address?.[0];
    const place = address ? `${address.prefecture ?? ""}${address.city ?? ""}` : "";
    const year = new Date().getFullYear();

    return (
        <div ref={ref}>
            {showContact && (
                <section className="contact" id="contact" aria-labelledby="contact-title">
                    <div className="contact-bg" aria-hidden="true" />
                    <div className="contact-stage">
                        <div className="scene-slot" id="footer-scene" aria-hidden="true">
                            <SproutMark className="fallback-logo" />
                        </div>
                        <div className="contact-copy">
                            <p className="eyebrow">LET’S GROW TOGETHER.</p>
                            <h2 className="section-heading" id="contact-title">
                                次は、あなたの
                                <br />
                                「やってみたい」を。
                            </h2>
                            <p>
                                小さな相談が、事業の新しい一歩になる。
                                <br />
                                まだまとまっていなくても、大丈夫です。
                                <br />
                                まずは、お話ししてみませんか。
                            </p>
                            <CtaPair />
                            <small>ご相談は無料です。目的やご予算から、一緒に整理します。</small>
                        </div>
                    </div>
                </section>
            )}

            <footer className="footer renewal-footer">
                <div className="footer-top">
                    <div className="footer-brand">
                        <SiteLink className="brand" href="/" aria-label="SmartSprouts ホーム">
                            <Brand />
                        </SiteLink>
                        <p>
                            奈良のWeb制作・システム開発・アプリ開発
                            <br />
                            小さく動き、早く育てる。
                        </p>
                    </div>
                    <nav className="footer-nav" aria-label="フッターメニュー">
                        {items.map((item) => (
                            <SiteLink key={item.id} href={item.href} external={item.external}>
                                {item.label}
                            </SiteLink>
                        ))}
                        <SiteLink href={ROUTES.contact}>お問い合わせ</SiteLink>
                    </nav>
                    <p className="footer-label">
                        {place && (
                            <>
                                {place}
                                <br />
                            </>
                        )}
                        {organization?.business_hours && (
                            <>
                                {organization.business_hours}
                                <br />
                            </>
                        )}
                        {organization?.phone && (
                            <>
                                <a href={`tel:${organization.phone.replace(/[^\d+]/g, "")}`}>{organization.phone}</a>
                                <br />
                            </>
                        )}
                        {organization?.email && <a href={`mailto:${organization.email}`}>{organization.email}</a>}
                    </p>
                </div>
                <div className="footer-word" aria-hidden="true">
                    <span>Smart</span>
                    <b>Sprouts.</b>
                </div>
                <div className="footer-bottom">
                    <p>© {year} SmartSprouts（運営：かつコード）</p>
                    <div>
                        <SiteLink href={ROUTES.privacy}>プライバシーポリシー</SiteLink>
                        <SiteLink href={ROUTES.login}>お客様ログイン</SiteLink>
                        <a href="#top">ページの先頭へ ↑</a>
                    </div>
                </div>
            </footer>
            <a href="#top" className="back-top" aria-label="ページの先頭へ">
                ↑
            </a>
        </div>
    );
});

export default SiteFooter;
