import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";

gsap.registerPlugin(ScrollTrigger);

export default function BannerSection() {
    const bannerRef = useRef(null);
    const contentRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        const banner = bannerRef.current;
        const content = contentRef.current;
        const image = imageRef.current;

        // コンテンツのフェードイン
        gsap.fromTo(
            content,
            {
                opacity: 0,
                x: -50,
            },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: banner,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            }
        );

        // 画像のフェードイン
        gsap.fromTo(
            image,
            {
                opacity: 0,
                scale: 0.9,
            },
            {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: banner,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            }
        );
    }, []);

    return (
        <section
            ref={bannerRef}
            className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
        >
            {/* 背景装飾 */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Left - コンテンツ */}
                    <div ref={contentRef} className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
                            <SparklesIcon className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-700">
                                あなたのビジネスを加速させる
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            今すぐ始めよう
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                デジタル変革
                            </span>
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Smart
                            Sproutsは、最新のテクノロジーとクリエイティブな発想で、
                            あなたのビジネスを次のステージへと導きます。
                            今すぐ無料相談で、可能性を広げましょう。
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <a
                                href="/reservation"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                無料相談を予約
                                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="#service"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                            >
                                サービスを見る
                            </a>
                        </div>
                    </div>

                    {/* Right - 画像 */}
                    <div ref={imageRef} className="flex-1 relative">
                        <div className="relative w-full max-w-lg mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 opacity-20 rounded-3xl blur-2xl"></div>
                            <img
                                src="/upload/test2.jpg"
                                alt="Digital Transformation"
                                className="relative w-full h-auto rounded-2xl shadow-2xl"
                            />
                            {/* 装飾アイコン */}
                            <div className="absolute -top-4 -right-4 bg-white p-3 rounded-full shadow-lg animate-bounce">
                                <SparklesIcon className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </section>
    );
}
