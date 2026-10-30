import { Fragment, useEffect, useRef, useState } from "react";
import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { SproutMark, sproutLogoSource } from "@/Components/PublicSite/SproutLogo";
import { Arrow, CtaPair, ROUTES, SiteLink } from "@/Components/PublicSite/links";

/*
 * トップページ（試作 showcases/katsucoderenewal の index.html を移植）
 * ヒーロー・イントロ・サービス・サポート・進め方の文章は段階1ではコードに置く（設計書 §6-3、§11-1）。
 * 記事・FAQ・制作実績は管理画面のデータで、0件のときはセクションごと出さない。
 */

const SERVICE_LINKS = {
    web: "/services/website-production",
    system: "/services/web-system-development",
    app: "/services/app-development",
};

const CHAPTERS = [
    { key: "web", kicker: "01 / Webサイト制作", title: ["魅力が伝わる、", "相談につながる。"], body: ["言葉、デザイン、使いやすさ。", "事業の魅力を整理して、", "新しい出会いにつながるサイトへ。"], link: "Webサイト制作について", tags: "コーポレートサイト / LP / ECサイト", side: "copy-right" },
    { key: "system", kicker: "02 / システム開発", title: ["いつもの仕事が、", "少し軽くなる。"], body: ["紙や表計算に分かれた情報を、ひとつに。", "現場の「こうだったら」を聞きながら、", "無理なく使える仕組みをつくります。"], link: "システム開発について", tags: "予約管理 / 顧客管理 / 業務の効率化", side: "" },
    { key: "app", kicker: "03 / アプリ開発", title: ["アイデアから、", "日常の体験へ。"], body: ["新しいサービスも、毎日使う道具も。", "まずは小さく、使えるカタチに。", "使う人の声とともに育てていきます。"], link: "アプリ開発について", tags: "Webアプリ / iOS・Android / 新規サービス", side: "copy-right" },
];

/** 試作と同じく、行を <br> でつなぐ（spanで包むと見出しのCSSが変わるため Fragment にする） */
const lines = (list) =>
    list.map((line, i) => (
        <Fragment key={i}>
            {i > 0 && <br />}
            {line}
        </Fragment>
    ));

function Hero() {
    return (
        <section className="journey" id="hero" aria-label="SmartSproutsの3つの制作領域">
            <div className="hero-stage">
                <div className="scene-slot" id="hero-scene" aria-hidden="true">
                    <SproutMark className="fallback-logo" />
                </div>
                <div className="hero-ghost" aria-hidden="true">
                    Grow together.
                </div>
                <div className="journey-copy active" data-chapter="0">
                    <p className="hero-kicker">奈良のWeb制作・システム開発・アプリ開発</p>
                    <h1 className="hero-title">
                        <span>小さく動き、</span>
                        <span className="accent">早く育てる。</span>
                    </h1>
                    <p className="hero-lead">
                        伝わるホームページも、仕事がはかどる仕組みも。
                        <br />
                        あなたの事業を知るところから、
                        <br />
                        つくる、その先まで。一緒に育てていきます。
                    </p>
                    <CtaPair />
                    <a className="hero-skip" href="#intro">
                        できることを見る ↓
                    </a>
                </div>
                {CHAPTERS.map((chapter, i) => (
                    <div key={chapter.key} className={`journey-copy ${chapter.side}`.trim()} data-chapter={i + 1}>
                        <p className="hero-kicker">{chapter.kicker}</p>
                        <h2>{lines(chapter.title)}</h2>
                        <p>{lines(chapter.body)}</p>
                        <SiteLink className="button" href={SERVICE_LINKS[chapter.key]}>
                            {chapter.link} <Arrow />
                        </SiteLink>
                        <small>{chapter.tags}</small>
                    </div>
                ))}
                <div className="hero-foot">
                    <div className="chapter-nav" aria-label="Heroの表示切り替え">
                        {["はじめに", "Web制作", "システム", "アプリ"].map((label, i) => (
                            <button key={label} type="button" data-chapter-go={i} aria-current={i === 0 ? "true" : "false"}>
                                <small>0{i + 1}</small>
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                    <button type="button" className="motion-toggle" aria-pressed="false">
                        <span className="motion-icon" aria-hidden="true">
                            Ⅱ
                        </span>
                        <span className="motion-label">動きを止める</span>
                    </button>
                </div>
            </div>
        </section>
    );
}

function Intro() {
    return (
        <section className="intro" id="intro" aria-labelledby="intro-title">
            <div className="intro-top reveal">
                <p className="eyebrow">HELLO, WE ARE SMARTSPROUTS.</p>
            </div>
            <h2 className="intro-heading" id="intro-title">
                <span>「こんなこと、できたらいいな。」</span>
                <br />
                <span>
                    その想いに、<span className="highlight">デザインと技術</span>で応える。
                </span>
            </h2>
            <p className="intro-body reveal">
                お店や会社の魅力を、もっと届けたい。
                <br />
                毎日の仕事を、もう少しラクにしたい。
                <br />
                新しいサービスを、自分たちの手で始めたい。
                <br />
                <br />
                私たちは、Webサイト・システム・アプリの制作を通して、
                <br />
                そんな事業の一歩を支える、奈良の開発パートナーです。
            </p>
            <div className="intro-gallery" aria-hidden="true">
                <div className="floating-tile t1" data-parallax="-45">
                    <img src="/images/site/effort.webp" alt="" width="1024" height="515" />
                </div>
                <div className="floating-tile t2" data-parallax="55">
                    <div className="tile-message">
                        <small>DESIGN × ENGINEERING</small>
                        <strong>
                            小さく動き、
                            <br />
                            早く育てる。
                        </strong>
                    </div>
                </div>
                <div className="floating-tile t3" data-parallax="-60">
                    <img src="/images/site/shuplay.webp" alt="" width="1024" height="515" />
                </div>
                <div className="floating-tile t4" data-parallax="35">
                    <img src="/images/site/katsuooool.webp" alt="" width="1024" height="576" />
                </div>
            </div>
            <span className="orbit-dot a" />
            <span className="orbit-dot b" />
            <span className="orbit-dot c" />
        </section>
    );
}

function ServicePanel({ type, index, en, title, label, text, scopes, children }) {
    return (
        <article className={`service-panel ${type}`}>
            <div className="service-copy">
                <div className="service-index">
                    {index} <span>{en}</span>
                </div>
                <h3>{lines(title)}</h3>
                <span className="service-type">{label}</span>
                <p>{text}</p>
                <ul className="service-scopes">
                    {scopes.map((scope) => (
                        <li key={scope}>{scope}</li>
                    ))}
                </ul>
                <SiteLink className="text-link" href={SERVICE_LINKS[type]}>
                    対応内容を詳しく見る{" "}
                    <span className="round" aria-hidden="true">
                        ↗
                    </span>
                </SiteLink>
            </div>
            <div className="service-visual">
                {children}
                <span className="visual-label">{type === "web" ? "制作内容を伝えるイメージ画面" : "開発内容を伝えるイメージ画面"}</span>
            </div>
        </article>
    );
}

function Services() {
    return (
        <section className="services shell" id="services" aria-labelledby="services-title">
            <p className="eyebrow reveal">01 / SERVICES</p>
            <div className="section-top reveal">
                <h2 className="section-heading" id="services-title">
                    つくるのは、
                    <br />
                    事業が動くきっかけ。
                </h2>
                <p>
                    目的も、課題も、事業によってさまざま。
                    <br />
                    見た目の表現から、裏側の仕組みまで。
                    <br />
                    必要なものを一緒に考え、形にします。
                </p>
            </div>
            <div className="service-stack">
                <ServicePanel
                    type="web"
                    index="01"
                    en="WEB DESIGN"
                    title={["魅力が伝わる。", "相談につながる。"]}
                    label="Webサイト制作・リニューアル"
                    text="事業の魅力を整理し、必要な人へ届けるサイトに。会社案内から商品販売まで、目的に合うデザインと導線を設計します。"
                    scopes={["コーポレートサイト", "LP", "ECサイト", "保守・更新"]}
                >
                    <div className="tilt-surface">
                        <div className="ui-browser">
                            <div className="browser-bar">
                                <i />
                                <i />
                                <i />
                                <span>YOUR BRAND, YOUR STORY.</span>
                            </div>
                            <div className="ui-web">
                                <div className="ui-nav">
                                    <b>日々と、</b>
                                    <small>私たちについて　 暮らし　 お問い合わせ</small>
                                </div>
                                <div className="ui-web-content">
                                    <div>
                                        <h4>
                                            この街で、
                                            <br />
                                            育てる暮らし。
                                        </h4>
                                        <p>
                                            毎日の小さな選択から、
                                            <br />
                                            心地よい未来をつくっていく。
                                        </p>
                                        <span className="ui-action">私たちについて　↗</span>
                                    </div>
                                    <div className="ui-landscape">
                                        <svg viewBox="0 0 180 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                                            <rect width="180" height="200" fill="#dce6d2" />
                                            <circle cx="134" cy="42" r="21" fill="#faf1d2" />
                                            <path d="M-20 140Q45 42 117 135L200 200H-20Z" fill="#b1c09c" />
                                            <path d="M-20 200Q70 74 205 120V200Z" fill="#7b966d" />
                                            <path d="M80 200q58-45 30-77" stroke="#e3d6b6" strokeWidth="18" fill="none" />
                                            <path d="M36 123v45m-19-35 19-29 20 29Z" fill="#4f744f" stroke="#4f744f" strokeWidth="4" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="floating-badge">
                            <b>↗</b> らしさと、使いやすさ。
                        </div>
                    </div>
                </ServicePanel>
                <ServicePanel
                    type="system"
                    index="02"
                    en="SYSTEM DEVELOPMENT"
                    title={["いつもの仕事を、", "もっとスムーズに。"]}
                    label="業務システム開発"
                    text="予約、会員情報、顧客管理、日々の集計。現場の流れに合わせて、手作業や二重入力を減らす仕組みをつくります。"
                    scopes={["予約管理", "会員・顧客管理", "業務効率化", "社内ツール"]}
                >
                    <div className="tilt-surface">
                        <div className="ui-browser">
                            <div className="browser-bar">
                                <i />
                                <i />
                                <i />
                                <span>YOUR BUSINESS, CONNECTED.</span>
                            </div>
                            <div className="ui-system">
                                <aside className="ui-sidebar">
                                    <b>CLUB MANAGER</b>
                                    <span className="selected">ダッシュボード</span>
                                    <span>会員情報</span>
                                    <span>レッスン予約</span>
                                    <span>お知らせ</span>
                                </aside>
                                <div className="ui-dashboard">
                                    <h4>今日の教室</h4>
                                    <div className="ui-metrics">
                                        <div>
                                            会員情報<b>まとめて管理</b>
                                        </div>
                                        <div>
                                            予約状況<b>ひと目で確認</b>
                                        </div>
                                    </div>
                                    {[
                                        ["キッズクラス", "15:00"],
                                        ["ジュニアクラス", "16:00"],
                                        ["選手クラス", "17:00"],
                                    ].map(([name, time]) => (
                                        <div className="ui-row" key={name}>
                                            <span>{name}</span>
                                            <span>{time}</span>
                                            <small>受付中</small>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="floating-badge">
                            <b>✓</b> 現場に合う、続けられる仕組み。
                        </div>
                    </div>
                </ServicePanel>
                <ServicePanel
                    type="app"
                    index="03"
                    en="APPLICATION DEVELOPMENT"
                    title={["アイデアを、", "手のひらの体験へ。"]}
                    label="Webアプリ・モバイルアプリ開発"
                    text="「こんなサービスがあったら」を、使える形に。利用する場面から考え、迷わず使えて、日常に馴染むアプリを開発します。"
                    scopes={["Webアプリ", "iOS・Android", "新規サービス", "運用・改善"]}
                >
                    <div className="tilt-surface phones">
                        <div className="phone">
                            <small>いつもの教室を、もっと身近に。</small>
                            <h4>レッスンを予約</h4>
                            <div className="calendar" aria-hidden="true">
                                {["月", "火", "水", "木", "金", "土", "日"].map((d) => (
                                    <span key={d}>{d}</span>
                                ))}
                                {Array.from({ length: 21 }, (_, i) => (
                                    <span key={i} className={i === 9 ? "selected" : undefined}>
                                        {i + 1}
                                    </span>
                                ))}
                            </div>
                            <div className="phone-row">
                                キッズクラス
                                <br />
                                15:00 — 16:00
                            </div>
                            <div className="phone-row">
                                ジュニアクラス
                                <br />
                                16:00 — 17:00
                            </div>
                            <div className="phone-action">このクラスを予約する</div>
                        </div>
                        <div className="phone second">
                            <SproutMark className="phone-logo" />
                            <h4>
                                小さな一歩を、
                                <br />
                                ここから。
                            </h4>
                            <p>
                                あなたの日常に、
                                <br />
                                ちょうどいい仕組みを。
                            </p>
                            <div className="phone-action">はじめてみる →</div>
                        </div>
                    </div>
                </ServicePanel>
            </div>
        </section>
    );
}

function Works({ works }) {
    if (!works?.length) return null;
    return (
        <section className="works" id="works" aria-labelledby="works-title">
            <div className="works-pin">
                <div className="shell">
                    <p className="eyebrow">02 / SELECTED WORKS</p>
                    <div className="section-top">
                        <h2 className="section-heading" id="works-title">
                            ひとつずつ、
                            <br />
                            育ててきた仕事。
                        </h2>
                        <p>
                            教室の運営を支えるシステム。
                            <br />
                            地域のお客様とつながるWebサイト。
                            <br />
                            これまでに積み重ねてきた仕事です。
                        </p>
                    </div>
                </div>
                <div className="works-track">
                    {works.map((work, i) => {
                        const art = (
                            <>
                                {work.image && <img src={work.image} alt={work.title} width="1024" height="576" loading="lazy" />}
                                {work.url && (
                                    <span className="round" aria-hidden="true">
                                        ↗
                                    </span>
                                )}
                            </>
                        );
                        return (
                            <article className="work" key={work.id}>
                                {work.url ? (
                                    <a className="work-art" href={work.url} target="_blank" rel="noopener noreferrer" aria-label={`${work.title}を開く`}>
                                        {art}
                                    </a>
                                ) : (
                                    <div className="work-art">{art}</div>
                                )}
                                <div className="work-meta">
                                    <span>{String(i + 1).padStart(2, "0")}</span>
                                    {work.date && <span>{work.date}</span>}
                                </div>
                                <h3>{work.title}</h3>
                                {work.description && <p className="work-note">{work.description}</p>}
                            </article>
                        );
                    })}
                </div>
                <div className="works-bottom">
                    <p>
                        事業の課題に合わせて、一つひとつ。
                        <br />
                        これまでにお手伝いしてきた仕事です。
                    </p>
                    <div className="work-meter" aria-hidden="true">
                        <span />
                    </div>
                    <div className="works-controls" aria-label="制作実績の切り替え">
                        <button type="button" id="work-prev" aria-label="前の実績へ">
                            ←
                        </button>
                        <button type="button" id="work-next" aria-label="次の実績へ">
                            →
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Support() {
    const points = [
        ["進捗を、いつでも確認。", "専用アカウントから制作の状況を確認できます。"],
        ["見積もりから請求まで、Webで完結。", "契約・請求書・領収書などのやり取りをまとめて管理。"],
        ["公開後の対応も、作業報告書で共有。", "保守・運用で対応した内容を履歴として確認できます。"],
    ];
    return (
        <section className="support shell" id="support" aria-labelledby="support-title">
            <div className="support-grid">
                <div className="support-copy reveal">
                    <p className="eyebrow">03 / OUR SUPPORT</p>
                    <h2 className="section-heading" id="support-title">
                        つくる過程も、
                        <br />
                        見えるから安心。
                    </h2>
                    <p>
                        「今、どこまで進んでいるのだろう？」
                        <br />
                        「保守では、何をしてもらえたのだろう？」
                        <br />
                        そんな不安を、専用の管理システムで減らします。
                    </p>
                    <div className="support-points">
                        {points.map(([title, text]) => (
                            <div className="support-point" key={title}>
                                <span aria-hidden="true">✓</span>
                                <div>
                                    <h3>{title}</h3>
                                    <p>{text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <SiteLink className="text-link" href={ROUTES.login}>
                        お客様専用ページにログイン{" "}
                        <span className="round" aria-hidden="true">
                            ↗
                        </span>
                    </SiteLink>
                </div>
                <div className="support-visual">
                    <div className="project-dashboard">
                        <div className="dash-brand">
                            <SproutMark />
                            <b>SmartSprouts</b>
                            <small>お客様専用ページ</small>
                        </div>
                        <div className="dash-title">
                            <strong>Webサイト制作プロジェクト</strong>
                            <span>進行中</span>
                        </div>
                        <div className="dash-steps" aria-hidden="true">
                            {["ご相談", "設計", "デザイン", "実装", "公開"].map((step, i) => (
                                <span key={step} className={i === 0 ? "active" : undefined}>
                                    <b>{i + 1}</b>
                                    {step}
                                </span>
                            ))}
                        </div>
                        <div className="dash-report">
                            <small>担当者からのお知らせ</small>
                            <p>デザイン案をご用意しました。</p>
                            <footer>確認事項と、次の進め方を共有します。</footer>
                        </div>
                    </div>
                    <div className="report-float">
                        <small>公開後の作業報告</small>
                        <h4>対応したことを、ひとつずつ記録。</h4>
                        <p>更新内容・対応日・作業の履歴を、いつでも確認できます。</p>
                    </div>
                    <p>サービスの特徴を表すイメージ画面です。</p>
                </div>
            </div>
        </section>
    );
}

function EstimateBanner() {
    return (
        <section className="estimate-banner shell">
            <div>
                <p className="eyebrow">A LITTLE FIRST STEP</p>
                <h2>まずは、費用の目安から。</h2>
                <p>
                    つくりたいものを選ぶだけ。約1分の概算シミュレーション。
                    <br />
                    まだ決まっていないことは、そのままご相談できます。
                </p>
            </div>
            <SiteLink className="button" href={ROUTES.estimate}>
                概算費用を見てみる <Arrow />
            </SiteLink>
            <span className="estimate-numeral" aria-hidden="true">
                1<small>min.</small>
            </span>
        </section>
    );
}

function Flow() {
    const promises = [
        ["約1", "分", "費用の目安を知る", "登録不要のシミュレーターで、はじめの予算感を。"],
        ["最短3", "営業日", "方向性を確かめる", "ヒアリング後、構成とデザインの方向性をご提案。"],
        ["いつでも", "", "進み具合を見る", "SmartSproutsの専用画面で制作状況を確認。"],
    ];
    return (
        <section className="flow shell">
            <p className="eyebrow">04 / HOW WE WORK</p>
            <div className="section-top">
                <h2 className="section-heading">
                    費用も、方向性も。
                    <br />
                    進み具合も、見える。
                </h2>
                <p>
                    まずは目安を知り、話して、確かめる。
                    <br />
                    つくる前も、つくっている間も、
                    <br />
                    安心して進められる関係を大切にします。
                </p>
            </div>
            <div className="promise-grid">
                {promises.map(([number, unit, title, text]) => (
                    <article className="promise reveal" key={title}>
                        <div>
                            <strong>{number}</strong>
                            <span>{unit}</span>
                        </div>
                        <h3>{title}</h3>
                        <p>{text}</p>
                    </article>
                ))}
            </div>
            <div className="flow-end">
                <p>提案時期は、必要資料の確認・案件規模・稼働状況に応じてご相談します。</p>
            </div>
        </section>
    );
}

function JournalCard({ post }) {
    const [imageFailed, setImageFailed] = useState(false);
    const hasImage = post.image && !imageFailed;
    return (
        <article className="journal-card">
            <SiteLink className={`journal-art ${hasImage ? "tool" : "nara"}`} href={post.href} tabIndex={-1} aria-hidden="true">
                {hasImage ? (
                    <img src={post.image} alt="" loading="lazy" onError={() => setImageFailed(true)} />
                ) : (
                    <span>
                        SMART
                        <br />
                        <em>SPROUTS.</em>
                    </span>
                )}
            </SiteLink>
            <div className="work-meta">
                <span>{post.category}</span>
                {post.date && <time dateTime={post.datetime}>{post.date}</time>}
            </div>
            <h3>
                <SiteLink href={post.href}>
                    {post.title} <Arrow />
                </SiteLink>
            </h3>
            {post.excerpt && <p>{post.excerpt}</p>}
        </article>
    );
}

function Journal({ posts }) {
    if (!posts?.length) return null;
    return (
        <section className="journal shell">
            <p className="eyebrow">05 / JOURNAL</p>
            <div className="section-top">
                <h2 className="section-heading">
                    つくる日々の、
                    <br />
                    考えごと。
                </h2>
                <p>
                    技術のこと、地域のこと、試していること。
                    <br />
                    制作の裏側から、少しずつお届けします。
                </p>
            </div>
            <div className="journal-grid">
                {posts.map((post) => (
                    <JournalCard key={post.id} post={post} />
                ))}
            </div>
            <SiteLink className="text-link" href={ROUTES.blog}>
                読みもの一覧へ <Arrow />
            </SiteLink>
        </section>
    );
}

function Faq({ faqs }) {
    if (!faqs?.length) return null;
    return (
        <section className="faq shell" aria-label="よくある質問">
            <div>
                <p className="eyebrow">QUESTIONS</p>
                <h2 className="section-heading">相談の、その前に。</h2>
                <SiteLink className="text-link" href={ROUTES.faq}>
                    ほかの質問も見る <Arrow />
                </SiteLink>
            </div>
            <div>
                {faqs.map((faq) => (
                    <details key={faq.id}>
                        <summary>{faq.question}</summary>
                        <p>{faq.answer}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}

export default function Home({ journal, faqs, works }) {
    const pageRef = useRef(null);

    // 3Dとスクロール演出はトップだけで使うので、別ファイルとして後から読み込む
    useEffect(() => {
        let cleanup;
        let cancelled = false;
        const root = pageRef.current?.closest(".ss-public");
        if (!root) return undefined;
        import("./Home/homeScene").then(({ mountHome }) => {
            if (!cancelled) cleanup = mountHome(root, sproutLogoSource);
        });
        return () => {
            cancelled = true;
            cleanup?.();
        };
    }, []);

    return (
        <PublicLayout renewed>
            <Head title="奈良のWeb制作・システム開発・アプリ開発" />
            <div ref={pageRef}>
                <Hero />
                <Intro />
                <Services />
                <Works works={works} />
                <Support />
                <EstimateBanner />
                <Flow />
                <Journal posts={journal} />
                <Faq faqs={faqs} />
            </div>
        </PublicLayout>
    );
}
