import { Head, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import RenewedPageHero from "@/Components/PublicSite/RenewedPageHero";
import BlockRenderer from "@/Components/BlockUI/BlockRenderer";
import { Arrow, SiteLink } from "@/Components/PublicSite/links";

/*
 * 記事詳細（/blog/{slug}, /news/{slug} 共通）。
 * 本文はBlockRenderer（既存の管理画面ブロックエディタ用、Tailwindの prose クラスで描画）をそのまま使う。
 * 「いいね」「コメント」ボタンは元から未実装（見た目だけ）だったため、作り直しにあわせて外した
 */
export default function BlogDetail({ post, relatedPosts = [] }) {
    const { props } = usePage();
    const siteName = props.organization?.site_name || props.organization?.name;
    const isNews = post.category?.slug === "news";
    const basePath = isNews ? "news" : "blog";

    return (
        <PublicLayout renewed>
            <Head title={post.title}>
                <meta name="description" content={post.excerpt || post.title} />
            </Head>
            <RenewedPageHero
                eyebrow={post.category?.name || (isNews ? "NEWS" : "JOURNAL")}
                title={post.title}
                lead={post.excerpt}
                current={post.title}
            />

            <section className="narrow page-section">
                {post.thumbnail && <img className="article-image" src={post.thumbnail} alt={post.title} />}
                <div className="work-meta">
                    <span>{post.author?.name}</span>
                    <time dateTime={post.published_at}>{post.published_at}</time>
                </div>
                {post.tags?.length > 0 && (
                    <p className="note">
                        {post.tags.map((tag) => (
                            <span className="faq-tag" key={tag} style={{ marginRight: 8 }}>
                                #{tag}
                            </span>
                        ))}
                    </p>
                )}
                <div className="prose">
                    <BlockRenderer blocks={post.content?.blocks} />
                </div>
            </section>

            {relatedPosts.length > 0 && (
                <section className="shell page-section">
                    <p className="eyebrow">RELATED</p>
                    <div className="section-top">
                        <h2 className="section-heading">関連する記事</h2>
                    </div>
                    <div className="journal-grid">
                        {relatedPosts.map((related) => {
                            const href = `/${basePath}/${related.slug}`;
                            return (
                                <article className="journal-card" key={related.id}>
                                    <SiteLink className="journal-art tool" href={href} tabIndex={-1} aria-hidden="true">
                                        {related.thumbnail ? (
                                            <img src={related.thumbnail} alt="" loading="lazy" />
                                        ) : (
                                            <span>
                                                SMART
                                                <br />
                                                <em>SPROUTS.</em>
                                            </span>
                                        )}
                                    </SiteLink>
                                    <div className="work-meta">
                                        <time dateTime={related.published_at}>{related.published_at}</time>
                                    </div>
                                    <h3>
                                        <SiteLink href={href}>
                                            {related.title} <Arrow />
                                        </SiteLink>
                                    </h3>
                                </article>
                            );
                        })}
                    </div>
                    <SiteLink className="text-link" href={isNews ? "/news" : "/blog"}>
                        一覧へ戻る <Arrow />
                    </SiteLink>
                </section>
            )}
        </PublicLayout>
    );
}
