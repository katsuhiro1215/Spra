import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import { ClockIcon, EyeIcon } from "@heroicons/react/24/outline";

const CATEGORY_COLORS = ["blue", "purple", "green", "pink", "orange"];

const categoryColor = (slug) => {
    if (!slug) return "blue";
    let hash = 0;
    for (let i = 0; i < slug.length; i++) hash += slug.charCodeAt(i);
    return CATEGORY_COLORS[hash % CATEGORY_COLORS.length];
};

export default function Blog({
    auth,
    posts,
    featuredPosts = [],
    categories = [],
    heroTitle = "Blog",
    heroSubtitle = "ブログ",
    filters = {},
}) {
    const { props } = usePage();
    const siteName = props.organization?.site_name || props.organization?.name;
    const breadcrumbs = [{ label: heroSubtitle }];
    const [activeCategory, setActiveCategory] = useState(filters.category || "");

    const isNewsPage = heroTitle === "News";
    const baseRoute = isNewsPage ? "news" : "blog";

    const handleCategoryChange = (slug) => {
        setActiveCategory(slug);
        router.get(
            route(baseRoute),
            slug ? { category: slug } : {},
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <PublicLayout auth={auth}>
            <Head title={`${heroSubtitle} | ${siteName || ""}`}>
                <meta
                    name="description"
                    content={`${siteName || ""}の${heroSubtitle}一覧です。`}
                />
            </Head>
            <PageHero
                title={heroTitle}
                subtitle={heroSubtitle}
                breadcrumbs={breadcrumbs}
            />

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    {/* 注目記事セクション */}
                    {featuredPosts.length > 0 && (
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                注目記事
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredPosts.map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/${baseRoute}/${post.slug}`}
                                        className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all"
                                    >
                                        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-500 relative overflow-hidden">
                                            {post.thumbnail && (
                                                <img
                                                    src={post.thumbnail}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                            {post.category && (
                                                <div className="absolute top-4 left-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-${categoryColor(post.category.slug)}-600`}
                                                    >
                                                        {post.category.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <ClockIcon className="w-4 h-4" />
                                                        {post.published_at}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <EyeIcon className="w-4 h-4" />
                                                        {post.views}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* カテゴリータブ */}
                    {categories.length > 0 && (
                        <div className="mb-8">
                            <div className="flex flex-wrap gap-2 border-b border-gray-200">
                                <button
                                    onClick={() => handleCategoryChange("")}
                                    className={`px-6 py-3 font-semibold transition-colors relative ${
                                        activeCategory === ""
                                            ? "text-blue-600"
                                            : "text-gray-600 hover:text-blue-600"
                                    }`}
                                >
                                    すべて
                                    {activeCategory === "" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                    )}
                                </button>
                                {categories
                                    .filter((c) => c.slug !== "news" || isNewsPage)
                                    .map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() =>
                                                handleCategoryChange(
                                                    category.slug,
                                                )
                                            }
                                            className={`px-6 py-3 font-semibold transition-colors relative ${
                                                activeCategory ===
                                                category.slug
                                                    ? "text-blue-600"
                                                    : "text-gray-600 hover:text-blue-600"
                                            }`}
                                        >
                                            {category.name}
                                            {activeCategory ===
                                                category.slug && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                            )}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* 記事一覧 */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.data.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <Link href={`/${baseRoute}/${post.slug}`}>
                                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                                        {post.thumbnail && (
                                            <img
                                                src={post.thumbnail}
                                                alt={post.title}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        {post.category && (
                                            <div className="absolute top-4 left-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-${categoryColor(post.category.slug)}-600`}
                                                >
                                                    {post.category.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        {post.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {post.tags
                                                    .slice(0, 3)
                                                    .map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                {post.author?.avatar_url && (
                                                    <img
                                                        src={
                                                            post.author
                                                                .avatar_url
                                                        }
                                                        alt={post.author.name}
                                                        className="w-5 h-5 rounded-full object-cover"
                                                    />
                                                )}
                                                <span>{post.author?.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1">
                                                    <ClockIcon className="w-3 h-3" />
                                                    {post.published_at}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <EyeIcon className="w-3 h-3" />
                                                    {post.views}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>

                    {/* 記事がない場合 */}
                    {posts.data.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">
                                該当する記事が見つかりませんでした。
                            </p>
                        </div>
                    )}

                    {/* ページネーション */}
                    {posts.data.length > 0 && posts.links?.length > 3 && (
                        <div className="mt-12 flex justify-center gap-2 flex-wrap">
                            {posts.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || "#"}
                                    preserveScroll
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        link.active
                                            ? "bg-blue-600 text-white"
                                            : link.url
                                              ? "bg-white border border-gray-300 hover:bg-gray-50"
                                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
