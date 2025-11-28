import { useState } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import { ClockIcon, EyeIcon, UserIcon } from "@heroicons/react/24/outline";
import { blogs, categories } from "@/Data/blogs";

export default function Blog({ auth }) {
    const breadcrumbs = [{ label: "ブログ" }];
    const [activeTab, setActiveTab] = useState("all");

    // カテゴリーでフィルタリング
    const filteredBlogs =
        activeTab === "all"
            ? blogs
            : blogs.filter((blog) => blog.category.slug === activeTab);

    // 注目記事
    const featuredBlogs = blogs.filter((blog) => blog.featured);

    return (
        <PublicLayout auth={auth}>
            <PageHero
                title="Blog"
                subtitle="ブログ"
                breadcrumbs={breadcrumbs}
            />

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    {/* 注目記事セクション */}
                    {featuredBlogs.length > 0 && (
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                注目記事
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredBlogs.map((blog) => (
                                    <a
                                        key={blog.id}
                                        href={`/blog/${blog.slug}`}
                                        className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all"
                                    >
                                        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-500 relative">
                                            {/* サムネイル画像がある場合 */}
                                            {/* <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" /> */}
                                            <div className="absolute top-4 left-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-${blog.category.color}-600`}
                                                >
                                                    {blog.category.name}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {blog.title}
                                            </h3>
                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {blog.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center gap-4">
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
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* カテゴリータブ */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-2 border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab("all")}
                                className={`px-6 py-3 font-semibold transition-colors relative ${
                                    activeTab === "all"
                                        ? "text-blue-600"
                                        : "text-gray-600 hover:text-blue-600"
                                }`}
                            >
                                すべて
                                {activeTab === "all" && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                )}
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveTab(category.slug)}
                                    className={`px-6 py-3 font-semibold transition-colors relative ${
                                        activeTab === category.slug
                                            ? "text-blue-600"
                                            : "text-gray-600 hover:text-blue-600"
                                    }`}
                                >
                                    {category.name}
                                    {activeTab === category.slug && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 記事一覧 */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map((blog) => (
                            <article
                                key={blog.id}
                                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <a href={`/blog/${blog.slug}`}>
                                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative">
                                        {/* サムネイル画像 */}
                                        {/* <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" /> */}
                                        <div className="absolute top-4 left-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-${blog.category.color}-600`}
                                            >
                                                {blog.category.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {blog.excerpt}
                                        </p>

                                        {/* タグ */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {blog.tags.slice(0, 3).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">
                                                    {blog.author.avatar}
                                                </span>
                                                <span>{blog.author.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1">
                                                    <ClockIcon className="w-3 h-3" />
                                                    {blog.publishedAt}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <EyeIcon className="w-3 h-3" />
                                                    {blog.views}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </article>
                        ))}
                    </div>

                    {/* 記事がない場合 */}
                    {filteredBlogs.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">
                                該当する記事が見つかりませんでした。
                            </p>
                        </div>
                    )}

                    {/* ページネーション(後で実装) */}
                    {filteredBlogs.length > 0 && (
                        <div className="mt-12 flex justify-center gap-2">
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                前へ
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                                1
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                2
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                3
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                次へ
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
