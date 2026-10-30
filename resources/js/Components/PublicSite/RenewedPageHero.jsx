import { SproutMark } from "./SproutLogo";
import { SiteLink } from "./links";

/**
 * 下層ページ共通のヒーロー（試作 page-hero の移植）。
 * パンくず・見出し・リード文・右側のエンブレム（またはカスタムの絵）を表示する。
 */
export default function RenewedPageHero({ eyebrow, title, lead, current, kind = "default", visual }) {
    return (
        <header className={`page-hero ${kind}`}>
            <nav className="breadcrumb" aria-label="パンくず">
                <SiteLink href="/">ホーム</SiteLink>
                <span aria-hidden="true">/</span>
                <span>{current}</span>
            </nav>
            <div className="page-hero-grid">
                <div>
                    <p className="eyebrow">{eyebrow}</p>
                    <h1>{title}</h1>
                    {lead && <p className="page-lead">{lead}</p>}
                </div>
                {visual ?? (
                    <div className="page-emblem" aria-hidden="true">
                        <SproutMark />
                        <span>
                            SMALL IDEAS.
                            <br />
                            GROWING POSSIBILITIES.
                        </span>
                    </div>
                )}
            </div>
        </header>
    );
}
