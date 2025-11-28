import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import { BlogSidebar } from "@/Components/Blog/Widgets";
import {
    ClockIcon,
    EyeIcon,
    ShareIcon,
    HeartIcon,
    ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { blogs, categories, tags, archives, galleryImages } from "@/Data/blogs";
import { useState } from "react";

export default function BlogDetail({ auth, slug }) {
    // slugから記事を取得(実際はサーバーから取得)
    const blog = blogs.find((b) => b.slug === slug) || blogs[0];
    const breadcrumbs = [
        { label: "ブログ", url: "/blog" },
        { label: blog.title },
    ];

    const [liked, setLiked] = useState(false);

    // サイドバーのWidget設定
    const sidebarWidgets = [
        {
            type: "search",
            props: {},
        },
        {
            type: "logo",
            props: {},
        },
        {
            type: "category",
            props: { categories },
        },
        {
            type: "recentPosts",
            props: { posts: blogs, limit: 5 },
        },
        {
            type: "tagCloud",
            props: { tags },
        },
        {
            type: "archive",
            props: { archives },
        },
        {
            type: "calendar",
            props: {},
        },
        {
            type: "gallery",
            props: { images: galleryImages },
        },
    ];

    // 関連記事
    const relatedPosts = blogs
        .filter(
            (b) =>
                b.id !== blog.id &&
                b.category.id === blog.category.id
        )
        .slice(0, 3);

    return (
        <PublicLayout auth={auth}>
            <PageHero
                title={blog.category.name}
                subtitle={blog.title}
                breadcrumbs={breadcrumbs}
            />

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* メインコンテンツ */}
                        <div className="lg:col-span-2">
                            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                {/* ヘッダー画像 */}
                                <div className="h-96 bg-gradient-to-br from-blue-500 to-purple-500 relative">
                                    {/* 実際の画像 */}
                                    {/* <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" /> */}
                                </div>

                                <div className="p-8 md:p-12">
                                    {/* メタ情報 */}
                                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">
                                                {blog.author.avatar}
                                            </span>
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {blog.author.name}
                                                </div>
                                                <div className="text-xs">
                                                    {blog.author.bio}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 ml-auto">
                                            <span className="flex items-center gap-1">
                                                <ClockIcon className="w-4 h-4" />
                                                {blog.publishedAt}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <EyeIcon className="w-4 h-4" />
                                                {blog.views}
                                            </span>
                                        </div>
                                    </div>

                                    {/* カテゴリーとタグ */}
                                    <div className="flex flex-wrap items-center gap-2 mb-8">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold text-white bg-${blog.category.color}-600`}
                                        >
                                            {blog.category.name}
                                        </span>
                                        {blog.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* タイトル */}
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                        {blog.title}
                                    </h1>

                                    {/* リード文 */}
                                    <p className="text-lg text-gray-600 mb-8 leading-relaxed border-l-4 border-blue-600 pl-4 italic">
                                        {blog.excerpt}
                                    </p>

                                    {/* 本文 */}
                                    <div className="prose prose-lg max-w-none mb-12">
                                        <div
                                            className="text-gray-700 leading-relaxed whitespace-pre-line"
                                            dangerouslySetInnerHTML={{
                                                __html: blog.content,
                                            }}
                                        />
                                    </div>

                                    {/* アクションボタン */}
                                    <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 mb-8">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setLiked(!liked)}
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

                                    {/* 著者情報 */}
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-3xl">
                                                {blog.author.avatar}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                    {blog.author.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    {blog.author.bio}
                                                </p>
                                                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-shadow">
                                                    フォロー
                                                </button>
                                            </div>
                                        </div>
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
                                        {relatedPosts.map((post) => (
                                            <a
                                                key={post.id}
                                                href={`/blog/${post.slug}`}
                                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                            >
                                                <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {post.publishedAt}
                                                    </p>
                                                </div>
                                            </a>
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
