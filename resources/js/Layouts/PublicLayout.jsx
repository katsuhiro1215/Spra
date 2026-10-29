import { useCallback, useEffect, useRef, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import "../../css/public/site.css";
import { SproutLogoDefs } from "@/Components/PublicSite/SproutLogo";
import SiteHeader from "@/Components/PublicSite/SiteHeader";
import SiteFooter from "@/Components/PublicSite/SiteFooter";
import { ROUTES } from "@/Components/PublicSite/links";
import { trackPageview } from "@/Utils/analytics";

const setInert = (element, value) => {
    if (!element) return;
    if (value) element.setAttribute("inert", "");
    else element.removeAttribute("inert");
};

/**
 * 公開サイトの共通レイアウト（設計: docs/superpowers/specs/2026-10-30-public-site-renewal-design.md）
 *
 * - renewed: 新しいデザインに作り直したページ。本文も .ss-public の中に入れ、デザインのCSSを効かせる
 * - それ以外: まだ作り直していないページ。ヘッダー・フッターだけ新しくし、本文は .ss-public の外
 *   （今のTailwindの見た目のまま）に置く
 */
export default function PublicLayout({ children, renewed = false }) {
    const { url, props } = usePage();
    const { headerMenu, footerMenu, organization } = props;
    const [menuOpen, setMenuOpen] = useState(false);

    const roots = useRef([]);
    const headerRefs = { header: useRef(null), brand: useRef(null), nav: useRef(null), toggle: useRef(null), panel: useRef(null) };
    const progressRef = useRef(null);
    const mainRef = useRef(null);
    const footerRef = useRef(null);
    const lastFocus = useRef(null);

    const path = url.split(/[?#]/)[0];
    const showContact = ![ROUTES.contact, ROUTES.estimate].some((route) => path.startsWith(route));
    const pageClass = path === "/" ? "home-page" : "inner-page";
    const addRoot = (index) => (element) => {
        roots.current[index] = element;
    };
    const eachRoot = (fn) => roots.current.filter(Boolean).forEach(fn);

    useEffect(() => {
        // ページ表示をアクセス解析に送信（匿名・非同期、失敗しても表示に影響しない）
        trackPageview();
    }, []);

    const closeMenu = useCallback(() => setMenuOpen(false), []);
    const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

    // メニューを開いている間は、パネル以外を操作できないようにする（試作 main.js と同じ）
    useEffect(() => {
        const outside = [mainRef.current, footerRef.current, headerRefs.nav.current, headerRefs.brand.current];
        outside.forEach((element) => setInert(element, menuOpen));
        eachRoot((root) => root.classList.toggle("locked", menuOpen));

        if (menuOpen) {
            lastFocus.current = document.activeElement;
            headerRefs.panel.current?.querySelector("a")?.focus();
        } else if (lastFocus.current) {
            lastFocus.current.focus?.();
            lastFocus.current = null;
        }
        if (!menuOpen) return undefined;

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
                return;
            }
            if (event.key !== "Tab") return;
            const items = [headerRefs.toggle.current, ...headerRefs.panel.current.querySelectorAll("a,button")];
            const index = items.indexOf(document.activeElement);
            event.preventDefault();
            items[(index + (event.shiftKey ? -1 : 1) + items.length) % items.length].focus();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [menuOpen]);

    // スクロールに合わせて、ヘッダーの縮小・読み進み具合のバー・「先頭へ」ボタンを切り替える
    useEffect(() => {
        let queued = false;
        const update = () => {
            queued = false;
            const total = document.documentElement.scrollHeight - innerHeight;
            headerRefs.header.current?.classList.toggle("scrolled", scrollY > 25);
            if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${total > 0 ? Math.min(1, scrollY / total) : 0})`;
            }
            const backTop = footerRef.current?.querySelector(".back-top");
            if (backTop) {
                backTop.classList.toggle("visible", scrollY > innerHeight);
                setInert(backTop, scrollY <= innerHeight);
            }
        };
        const onScroll = () => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(update);
        };
        addEventListener("scroll", onScroll, { passive: true });
        update();
        return () => removeEventListener("scroll", onScroll);
    }, []);

    // 作り直したページだけ、画面に入ったときに要素をふわっと出す（動きを減らす設定のときは出さない）
    useEffect(() => {
        if (!renewed) return undefined;
        const reduced = matchMedia("(prefers-reduced-motion: reduce)");
        let observer;
        const reveal = () => {
            observer?.disconnect();
            eachRoot((root) => root.classList.toggle("reduced-motion", reduced.matches));
            const targets = [...(mainRef.current?.querySelectorAll(".reveal") ?? [])];
            if (reduced.matches || !("IntersectionObserver" in window)) {
                targets.forEach((element) => element.classList.remove("waiting"));
                return;
            }
            eachRoot((root) => root.classList.add("js-reveal"));
            observer = new IntersectionObserver(
                (entries) =>
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        entry.target.classList.remove("waiting");
                        observer.unobserve(entry.target);
                    }),
                { threshold: 0.04 },
            );
            targets.forEach((element) => {
                if (element.getBoundingClientRect().top <= innerHeight) return;
                element.classList.add("waiting");
                observer.observe(element);
            });
        };
        reveal();
        reduced.addEventListener("change", reveal);
        return () => {
            observer?.disconnect();
            reduced.removeEventListener("change", reveal);
        };
    }, [renewed]);

    const head = (
        <Head>
            <link head-key="font-preconnect-api" rel="preconnect" href="https://fonts.googleapis.com" />
            <link head-key="font-preconnect-static" rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                head-key="font-noto-sans-jp"
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;900&display=swap"
            />
        </Head>
    );

    const chrome = (
        <>
            <SproutLogoDefs />
            <a className="skip" href="#main">
                本文へスキップ
            </a>
            <div className="page-progress" aria-hidden="true" ref={progressRef} />
            <SiteHeader
                refs={headerRefs}
                headerMenu={headerMenu}
                footerMenu={footerMenu}
                menuOpen={menuOpen}
                onToggleMenu={toggleMenu}
                onCloseMenu={closeMenu}
            />
        </>
    );

    const footer = (
        <SiteFooter
            ref={footerRef}
            headerMenu={headerMenu}
            footerMenu={footerMenu}
            organization={organization}
            showContact={showContact}
        />
    );

    if (renewed) {
        return (
            <div className={`ss-public ${pageClass}`} id="top" ref={addRoot(0)}>
                {head}
                {chrome}
                <main id="main" ref={mainRef}>
                    {children}
                </main>
                {footer}
            </div>
        );
    }

    return (
        <>
            {head}
            <div className={`ss-public ${pageClass}`} id="top" ref={addRoot(0)}>
                {chrome}
            </div>
            <main id="main" ref={mainRef} className="min-h-[60vh] bg-white pt-24">
                {children}
            </main>
            <div className={`ss-public ${pageClass}`} ref={addRoot(1)}>
                {footer}
            </div>
        </>
    );
}
