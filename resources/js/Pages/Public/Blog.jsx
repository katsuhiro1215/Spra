import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import RenewedPageHero from "@/Components/PublicSite/RenewedPageHero";
import { Arrow, SiteLink } from "@/Components/PublicSite/links";

/*
 * 読みもの・お知らせ一覧（試作 blog/index.html の移植。/blog と /news の両方で使う）。
 * カテゴリ・検索は、試作のようなクライアント側の絞り込みではなく、既存のサーバー側の
 * ページネーション・検索をそのまま使う（記事数が増えても動作が変わらないよう）
 */
export default function Blog({ posts, categories = [], heroTitle = "Blog", heroSubtitle = "ブログ", filters = {} }) {
    const { props } = usePage();
    const siteName = props.organization?.site_name || props.organization?.name;
    const isNewsPage = heroTitle === "News";
    const baseRoute = isNewsPage ? "news" : "blog";
    const [search, setSearch] = useState(filters.search || "");

    const go = (params) => {
        router.get(`/${baseRoute}`, { ...filters, ...params }, { preserveState: true, preserveScroll: true });
    };

    const submitSearch = (e) => {
        e.preventDefault();
        go({ search });
    };

    return (
        <PublicLayout renewed>
            <Head title={heroSubtitle}>
                <meta name="description" content={`${siteName || ""}の${heroSubtitle}一覧です。`} />
            </Head>
            <RenewedPageHero
                eyebrow={isNewsPage ? "NEWS" : "JOURNAL"}
                title={
                    isNewsPage ? (
                        "SmartSproutsからの、お知らせ。"
                    ) : (
                        <>
                            つくる日々の、
                            <br />
                            考えごと。
                        </>
                    )
                }
                lead={isNewsPage ? "サービスの公開や、活動のご案内をお届けします。" : "技術のこと、試していること。制作の裏側から、少しずつお届けします。"}
                current={heroSubtitle}
            />

            <section className="shell page-section">
                <div className="filter-bar">
                    <button type="button" aria-pressed={!filters.category} onClick={() => go({ category: "" })}>
                        すべて
                    </button>
                    {categories
                        .filter((c) => c.slug !== "news" || isNewsPage)
                        .map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                aria-pressed={filters.category === category.slug}
                                onClick={() => go({ category: category.slug })}
                            >
                                {category.name}
                            </button>
                        ))}
                    <form className="search-field" onSubmit={submitSearch}>
                        <span className="sr-only">記事を検索</span>
                        <input type="search" placeholder="キーワードで探す" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </form>
                    <span aria-live="polite">{posts.total}件の記事</span>
                </div>

                {posts.data.length === 0 ? (
                    <p className="empty-state">該当する記事がありません。別のキーワードでお試しください。</p>
                ) : (
                    <div className="journal-grid">
                        {posts.data.map((post) => {
                            const href = `/${baseRoute}/${post.slug}`;
                            return (
                                <article className="journal-card" key={post.id}>
                                    <SiteLink className="journal-art tool" href={href} tabIndex={-1} aria-hidden="true">
                                        {post.thumbnail ? (
                                            <img src={post.thumbnail} alt="" loading="lazy" />
                                        ) : (
                                            <span>
                                                SMART
                                                <br />
                                                <em>SPROUTS.</em>
                                            </span>
                                        )}
                                    </SiteLink>
                                    <div className="work-meta">
                                        <span>{post.category?.name}</span>
                                        <time dateTime={post.published_at}>{post.published_at}</time>
                                    </div>
                                    <h3>
                                        <SiteLink href={href}>
                                            {post.title} <Arrow />
                                        </SiteLink>
                                    </h3>
                                    {post.excerpt && <p>{post.excerpt}</p>}
                                </article>
                            );
                        })}
                    </div>
                )}

                {posts.links?.length > 3 && (
                    <nav className="pagination" aria-label="ページ送り">
                        {posts.links.map((link, index) =>
                            link.url ? (
                                <SiteLink
                                    key={index}
                                    href={link.url}
                                    preserveScroll
                                    aria-current={link.active ? "page" : undefined}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span key={index} aria-disabled="true" dangerouslySetInnerHTML={{ __html: link.label }} />
                            ),
                        )}
                    </nav>
                )}
            </section>
        </PublicLayout>
    );
}
