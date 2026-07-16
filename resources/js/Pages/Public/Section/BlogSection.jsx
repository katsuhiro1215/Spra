import { useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    NewspaperIcon,
    ChatBubbleBottomCenterTextIcon,
    CalendarIcon,
    ArrowRightIcon,
    TagIcon,
} from "@heroicons/react/24/outline";

gsap.registerPlugin(ScrollTrigger);

export default function BlogSection({ newsItems = [], blogPosts = [] }) {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const newsRef = useRef(null);
    const blogRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const title = titleRef.current;
        const news = newsRef.current;
        const blog = blogRef.current;

        // タイトルアニメーション
        gsap.fromTo(
            title,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            }
        );

        // ニュース・ブログのアニメーション
        gsap.fromTo(
            [news, blog],
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 70%",
                    toggleActions: "play none none reverse",
                },
            }
        );
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-20 bg-gradient-to-b from-white to-gray-50"
        >
            <div className="container mx-auto px-6">
                {/* セクションタイトル */}
                <div ref={titleRef} className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        News & Blog
                    </h2>
                    <p className="text-lg text-gray-600">
                        最新のお知らせと技術ブログをお届けします
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left - ニュース・お知らせ */}
                    <div ref={newsRef}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <NewspaperIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                ニュース・お知らせ
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {newsItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/news/${item.slug}`}
                                    className="block group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                                {item.category}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                <CalendarIcon className="w-4 h-4" />
                                                {item.date}
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {item.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <Link
                                href="/news"
                                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
                            >
                                すべてのお知らせを見る
                                <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Right - ブログ */}
                    <div ref={blogRef}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                技術ブログ
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {blogPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="block group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-32 h-32 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                                            {post.image && (
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <TagIcon className="w-4 h-4 text-purple-600" />
                                                <span className="text-xs font-semibold text-purple-700">
                                                    {post.category}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    •
                                                </span>
                                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                                                <span className="text-xs text-gray-500">
                                                    {post.date}
                                                </span>
                                            </div>
                                            <h4 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                                {post.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all"
                            >
                                すべてのブログを見る
                                <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
