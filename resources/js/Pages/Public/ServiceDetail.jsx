import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import RenewedPageHero from "@/Components/PublicSite/RenewedPageHero";
import { Arrow, ROUTES, SiteLink } from "@/Components/PublicSite/links";

/*
 * サービス詳細（単一テンプレート）。設計書 §5「試作の『サービス5種』と管理画面の『サービス21件』」のとおり、
 * 試作は5種類に書き分けていたが、本番は21件すべてをこのテンプレートで表示する。
 * 「できることの一覧」のような作り込みは、個別サービスごとの原稿が無いため、
 * サービスの description / details（管理画面の既存データ）から組み立てる。
 */
const HERO_COLORS = ["green", "blue", "peach", "lavender"];

const BILLING_CYCLE_LABELS = {
    one_time: "一回限り",
    monthly: "月額",
    quarterly: "四半期",
    yearly: "年額",
};

const formatPrice = (value) => `¥${Number(value).toLocaleString()}`;

export default function ServiceDetail({ service, relatedServices = [] }) {
    const plans = service.service_plans || [];
    const technologies = service.technologies || [];
    const portfolios = service.portfolios || [];
    const faqs = service.faqs || [];
    const colorIndex = Math.abs(String(service.service_category?.id ?? "").split("").reduce((sum, c) => sum + c.charCodeAt(0), 0)) % HERO_COLORS.length;
    const heroColor = HERO_COLORS[colorIndex];
    const detailParagraphs = (service.details || "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

    return (
        <PublicLayout renewed>
            <Head title={service.name}>
                <meta name="description" content={service.description || service.name} />
            </Head>
            <RenewedPageHero
                eyebrow={service.service_category?.name || "SERVICE"}
                title={service.name}
                lead={service.description}
                current={service.name}
                kind={`service-detail-hero ${heroColor}`}
            />

            <section className="shell page-section editorial-split">
                <div>
                    <p className="eyebrow">ABOUT THIS SERVICE</p>
                    <h2 className="section-heading">{service.name}について</h2>
                    <SiteLink className="text-link" href={ROUTES.contact}>
                        このサービスについて相談する <Arrow />
                    </SiteLink>
                </div>
                <div>
                    {detailParagraphs.length > 0 ? (
                        detailParagraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)
                    ) : (
                        <p>{service.description}</p>
                    )}
                    {technologies.length > 0 && <p className="note">使用技術：{technologies.map((t) => t.name).join(" / ")}</p>}
                </div>
            </section>

            {plans.length > 0 && (
                <section className="shell page-section tint-green" id="pricing">
                    <p className="eyebrow">PRICING</p>
                    <div className="section-top">
                        <h2 className="section-heading">料金の目安</h2>
                        <p>具体的な費用は、ご要望に応じてお見積もり時に確定します。</p>
                    </div>
                    <div className="plan-grid">
                        {plans.map((plan) => (
                            <div className="price-entry" key={plan.id}>
                                {plan.badge_text && <span className="faq-tag">{plan.badge_text}</span>}
                                <h3>{plan.name}</h3>
                                <p>
                                    {formatPrice(plan.base_price)}
                                    <small> {BILLING_CYCLE_LABELS[plan.billing_cycle] || plan.billing_cycle}</small>
                                </p>
                                {plan.description && <p>{plan.description}</p>}
                                {plan.estimated_delivery_days && <small>制作期間の目安：{plan.estimated_delivery_days}日</small>}
                                {plan.service_items?.length > 0 && (
                                    <ul className="check-list">
                                        {plan.service_items.map((item) => (
                                            <li key={item.id}>{item.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                    <SiteLink className="button" href={ROUTES.estimate}>
                        見積もりシミュレーターで概算を見る <Arrow />
                    </SiteLink>
                </section>
            )}

            {portfolios.length > 0 && (
                <section className="shell page-section" id="related-work">
                    <p className="eyebrow">SELECTED WORKS</p>
                    <div className="section-top">
                        <h2 className="section-heading">手がけてきた仕事。</h2>
                    </div>
                    <div className="project-grid">
                        {portfolios.map((portfolio) => {
                            const art = (
                                <>
                                    {portfolio.media?.url && <img src={portfolio.media.url} alt={portfolio.title} loading="lazy" width="1024" height="576" />}
                                    {portfolio.url && (
                                        <span className="round" aria-hidden="true">
                                            ↗
                                        </span>
                                    )}
                                </>
                            );
                            return (
                                <article className="project-card" key={portfolio.id}>
                                    {portfolio.url ? (
                                        <a className="project-image" href={portfolio.url} target="_blank" rel="noopener noreferrer">
                                            {art}
                                        </a>
                                    ) : (
                                        <div className="project-image">{art}</div>
                                    )}
                                    <h3>{portfolio.title}</h3>
                                    {portfolio.description && <p>{portfolio.description}</p>}
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}

            {faqs.length > 0 && (
                <section className="faq shell" aria-label="このサービスについてのよくある質問">
                    <div>
                        <p className="eyebrow">QUESTIONS</p>
                        <h2 className="section-heading">このサービスについて。</h2>
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
            )}

            {relatedServices.length > 0 && (
                <section className="shell page-section related-services">
                    <h2>ほかの{service.service_category?.name}</h2>
                    <div>
                        {relatedServices.map((related) => (
                            <SiteLink key={related.id} className="text-link" href={`/services/${related.slug}`}>
                                {related.name} <Arrow />
                            </SiteLink>
                        ))}
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
