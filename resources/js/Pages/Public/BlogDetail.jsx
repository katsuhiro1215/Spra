import { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import { BlogSidebar } from "@/Components/Blog/Widgets";
import BlockRenderer from "@/Components/BlockUI/BlockRenderer";
import {
    ClockIcon,
    EyeIcon,
    ShareIcon,
    HeartIcon,
    ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

export default function BlogDetail({
    auth,
    post,
    relatedPosts = [],
    categories = [],
    archives = [],
    tags = [],
    recentPosts = [],
}) {
    const { props } = usePage();
    const siteName = props.organization?.site_name || props.organization?.name;
    const isNews = post.category?.slug === "news";
    const basePath = isNews ? "news" : "blog";

    const breadcrumbs = [
        {
            label: post.category?.name || "ブログ",
            url: isNews ? "/news" : "/blog",
        },
        { label: post.title },
    ];

    const [liked, setLiked] = useState(false);

    const sidebarWidgets = [
        { type: "search", props: {} },
        { type: "logo", props: {} },
        { type: "category", props: { categories } },
        { type: "recentPosts", props: { posts: recentPosts, limit: 5 } },
        { type: "tagCloud", props: { tags } },
        { type: "archive", props: { archives } },
        { type: "calendar", props: {} },
    ];

    return (
        <PublicLayout auth={auth}>
            <Head title={`${post.title} | ${siteName || ""}`}>
                <meta
                    name="description"
                    content={post.excerpt || post.title}
                />
            </Head>
            <PageHero
                title={post.category?.name || "Blog"}
                subtitle={post.title}
                breadcrumbs={breadcrumbs}
            />

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* メインコンテンツ */}
                        <div className="lg:col-span-2">
                            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                {/* ヘッダー画像 */}
                                <div className="h-96 bg-gradient-to-br from-blue-500 to-purple-500 relative overflow-hidden">
                                    {post.thumbnail && (
                                        <img
                                            src={post.thumbnail}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>

                                <div className="p-8 md:p-12">
                                    {/* メタ情報 */}
                                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            {post.author?.avatar_url ? (
                                                <img
                                                    src={
                                                        post.author.avatar_url
                                                    }
                                                    alt={post.author.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                                    {post.author?.name?.charAt(
                                                        0,
                                                    )}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {post.author?.name}
                                                </div>
                                                {post.author?.bio && (
                                                    <div className="text-xs">
                                                        {post.author.bio}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 ml-auto">
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

                                    {/* カテゴリーとタグ */}
                                    <div className="flex flex-wrap items-center gap-2 mb-8">
                                        {post.category && (
                                            <span className="px-3 py-1 rounded-full text-sm font-semibold text-white bg-blue-600">
                                                {post.category.name}
                                            </span>
                                        )}
                                        {(post.tags || []).map(
                                            (tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                                                >
                                                    #{tag}
                                                </span>
                                            ),
                                        )}
                                    </div>

                                    {/* タイトル */}
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                        {post.title}
                                    </h1>

                                    {/* リード文 */}
                                    {post.excerpt && (
                                        <p className="text-lg text-gray-600 mb-8 leading-relaxed border-l-4 border-blue-600 pl-4 italic">
                                            {post.excerpt}
                                        </p>
                                    )}

                                    {/* 本文 */}
                                    <div className="mb-12">
                                        <BlockRenderer
                                            blocks={post.content?.blocks}
                                        />
                                    </div>

                                    {/* アクションボタン */}
                                    <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 mb-8">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() =>
                                                    setLiked(!liked)
                                                }
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                                                    liked
                                                        ? "bg-pink-100 text-pink-600"
                                                        : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                                                }`}
                                            >
                                                {liked ? (
                                                    <HeartSolidIcon className="w-5 h-5" />
                                                ) : (
                                                    <HeartIcon className="w-5 h-5" />
                                                )}
                                                <span className="font-semibold">
                                                    いいね
                                                </span>
                                            </button>
                                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">
                                                <ChatBubbleLeftIcon className="w-5 h-5" />
                                                <span className="font-semibold">
                                                    コメント
                                                </span>
                                            </button>
                                        </div>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">
                                            <ShareIcon className="w-5 h-5" />
                                            <span className="font-semibold">
                                                シェア
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </article>

                            {/* 関連記事 */}
                            {relatedPosts.length > 0 && (
                                <div className="mt-12">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                        関連記事
                                    </h2>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {relatedPosts.map((related) => (
                                            <Link
                                                key={related.id}
                                                href={`/${basePath}/${related.slug}`}
                                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                            >
                                                <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                                                    {related.thumbnail && (
                                                        <img
                                                            src={
                                                                related.thumbnail
                                                            }
                                                            alt={
                                                                related.title
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                                                        {related.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {related.published_at}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* コメントセクション(後で実装) */}
                            <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    コメント
                                </h2>
                                <p className="text-gray-500">
                                    コメント機能は準備中です。
                                </p>
                            </div>
                        </div>

                        {/* サイドバー */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <BlogSidebar widgets={sidebarWidgets} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
