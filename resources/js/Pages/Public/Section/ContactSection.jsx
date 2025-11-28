import { useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    EnvelopeIcon,
    PhoneIcon,
    ChatBubbleLeftRightIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const content = contentRef.current;

        // コンテンツアニメーション
        gsap.fromTo(
            content,
            {
                opacity: 0,
                y: 50,
            },
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

        // 背景のグラデーション動き
        gsap.to(section, {
            backgroundPosition: "100% 50%",
            duration: 15,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-32 overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"
            style={{
                backgroundSize: "200% 200%",
                backgroundPosition: "0% 50%",
            }}
        >
            {/* 背景装飾 */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse animation-delay-2000"></div>
            </div>

            {/* メインコンテンツ */}
            <div className="container mx-auto px-6 relative z-10">
                <div ref={contentRef} className="max-w-4xl mx-auto text-center">
                    {/* アイコン */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-bounce">
                        <ChatBubbleLeftRightIcon className="w-10 h-10 text-white" />
                    </div>

                    {/* タイトル */}
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        まずはお気軽に
                        <br />
                        ご相談ください
                    </h2>

                    {/* 説明文 */}
                    <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
                        プロジェクトのご相談から、技術的なご質問まで
                        <br className="hidden md:block" />
                        専門スタッフが丁寧にお答えいたします
                    </p>

                    {/* CTAボタン */}
                    <Link
                        href="/contact"
                        className="group inline-flex items-center justify-center gap-4 px-12 py-6 bg-white text-purple-600 text-lg font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                    >
                        <EnvelopeIcon className="w-6 h-6" />
                        お問い合わせフォームへ
                        <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </Link>

                    {/* サブ情報 */}
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80">
                        <div className="flex items-center gap-2">
                            <PhoneIcon className="w-5 h-5" />
                            <span className="text-sm">
                                お電話でのお問い合わせ
                            </span>
                        </div>
                        <div className="hidden sm:block w-px h-4 bg-white/40"></div>
                        <div className="text-sm">
                            平日 9:00-18:00 / 土日祝 休業
                        </div>
                    </div>

                    {/* 追加情報カード */}
                    <div className="mt-16 grid md:grid-cols-3 gap-6">
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <div className="text-4xl mb-3">⚡</div>
                            <h3 className="text-white font-bold mb-2">
                                即日対応可
                            </h3>
                            <p className="text-white/80 text-sm">
                                お急ぎのご相談も柔軟に対応いたします
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <div className="text-4xl mb-3">🎯</div>
                            <h3 className="text-white font-bold mb-2">
                                無料相談
                            </h3>
                            <p className="text-white/80 text-sm">
                                初回のご相談は無料でお受けしています
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <div className="text-4xl mb-3">🔒</div>
                            <h3 className="text-white font-bold mb-2">
                                秘密厳守
                            </h3>
                            <p className="text-white/80 text-sm">
                                機密情報も安心してご相談いただけます
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </section>
    );
}
