import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    ArrowRightIcon,
    CheckIcon,
    StarIcon,
    PlayCircleIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPageMinimal({ auth }) {
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const testimonialRef = useRef(null);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        // Hero section animation
        gsap.fromTo(
            heroRef.current.children,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out",
            }
        );

        // Stats counter animation
        ScrollTrigger.create({
            trigger: statsRef.current,
            start: "top 80%",
            onEnter: () => {
                const counters =
                    statsRef.current.querySelectorAll("[data-count]");
                counters.forEach((counter) => {
                    const target = parseInt(counter.getAttribute("data-count"));
                    gsap.fromTo(
                        counter,
                        { textContent: 0 },
                        {
                            textContent: target,
                            duration: 2,
                            ease: "power2.out",
                            snap: { textContent: 1 },
                        }
                    );
                });
            },
        });

        // Auto-rotate testimonials
        const testimonialInterval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4000);

        return () => {
            clearInterval(testimonialInterval);
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    const stats = [
        { number: 250, label: "成功プロジェクト", suffix: "+" },
        { number: 98, label: "顧客満足度", suffix: "%" },
        { number: 50, label: "専門エンジニア", suffix: "+" },
        { number: 24, label: "サポート対応", suffix: "h" },
    ];

    const testimonials = [
        {
            name: "田中 太郎",
            position: "株式会社ABC 代表取締役",
            content:
                "Smart Sproutsのおかげで、売上が前年比150%増加しました。技術力の高さに本当に驚いています。",
            rating: 5,
            image: "/upload/testimonial-1.jpg",
        },
        {
            name: "佐藤 花子",
            position: "DEF株式会社 マーケティング部長",
            content:
                "スケジュール通りに高品質なシステムを納品していただき、チーム一同大変満足しています。",
            rating: 5,
            image: "/upload/testimonial-2.jpg",
        },
        {
            name: "山田 次郎",
            position: "GHI合同会社 CTO",
            content:
                "複雑な要件にも柔軟に対応していただき、理想以上のシステムが完成しました。",
            rating: 5,
            image: "/upload/testimonial-3.jpg",
        },
    ];

    const features = [
        "プロジェクト管理の完全可視化",
        "24時間365日の技術サポート",
        "業界最高水準のセキュリティ",
        "アジャイル開発手法の採用",
        "継続的インテグレーション",
        "パフォーマンス最適化保証",
    ];

    return (
        <PublicLayout auth={auth}>
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <div className="container mx-auto px-6">
                    <div
                        ref={heroRef}
                        className="max-w-4xl mx-auto text-center space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                            <StarIcon className="w-4 h-4" />
                            業界No.1の実績と信頼
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
                            デジタル変革で
                            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                未来を創造
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
                            最先端のテクノロジーと革新的なソリューションで、
                            あなたのビジネスを次世代へと導きます。
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                            <button className="group bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all duration-300 flex items-center gap-2 text-lg font-semibold">
                                無料相談を始める
                                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-lg">
                                <PlayCircleIcon className="w-8 h-8" />
                                デモを見る
                            </button>
                        </div>

                        <div className="pt-12">
                            <p className="text-sm text-slate-500 mb-4">
                                信頼される企業様
                            </p>
                            <div className="flex items-center justify-center gap-8 opacity-60">
                                {[
                                    "Company A",
                                    "Company B",
                                    "Company C",
                                    "Company D",
                                ].map((company, index) => (
                                    <div
                                        key={index}
                                        className="bg-slate-200 px-6 py-2 rounded-lg"
                                    >
                                        <span className="text-slate-600 font-medium">
                                            {company}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-6">
                    <div
                        ref={statsRef}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
                                    <span data-count={stat.number}>0</span>
                                    {stat.suffix}
                                </div>
                                <div className="text-slate-300">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                                    なぜSmart Sproutsが 選ばれるのか
                                </h2>
                                <p className="text-xl text-slate-600 mb-8">
                                    私たちは単なる開発会社ではありません。
                                    あなたのビジネスパートナーとして、成功まで伴走します。
                                </p>
                                <div className="space-y-4">
                                    {features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3"
                                        >
                                            <CheckIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                                            <span className="text-slate-700">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                                    <h3 className="text-2xl font-bold mb-4">
                                        今すぐ始められる
                                    </h3>
                                    <p className="mb-6">
                                        無料相談で、あなたのプロジェクトに最適なソリューションを提案します。
                                    </p>
                                    <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-colors">
                                        相談予約をする
                                    </button>
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow-400 rounded-full opacity-20"></div>
                                <div className="absolute -top-4 -left-4 w-20 h-20 bg-green-400 rounded-full opacity-20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            お客様の声
                        </h2>
                        <p className="text-xl text-slate-600">
                            実際にSmart Sproutsを利用されたお客様からの評価
                        </p>
                    </div>

                    <div ref={testimonialRef} className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="w-24 h-24 bg-slate-200 rounded-full flex-shrink-0"></div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                                        {[
                                            ...Array(
                                                testimonials[activeTestimonial]
                                                    .rating
                                            ),
                                        ].map((_, i) => (
                                            <StarIcon
                                                key={i}
                                                className="w-5 h-5 text-yellow-400 fill-current"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xl text-slate-700 mb-6 italic">
                                        "
                                        {
                                            testimonials[activeTestimonial]
                                                .content
                                        }
                                        "
                                    </p>
                                    <div>
                                        <div className="font-bold text-slate-900">
                                            {
                                                testimonials[activeTestimonial]
                                                    .name
                                            }
                                        </div>
                                        <div className="text-slate-600">
                                            {
                                                testimonials[activeTestimonial]
                                                    .position
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Navigation */}
                        <div className="flex justify-center gap-2 mt-8">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        index === activeTestimonial
                                            ? "bg-blue-500"
                                            : "bg-slate-300"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        あなたのプロジェクトを
                        <span className="block text-blue-400">
                            今すぐ始めませんか？
                        </span>
                    </h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                        無料相談で、あなたのアイデアを現実に変える最初の一歩を踏み出しましょう。
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="bg-blue-500 text-white px-8 py-4 rounded-2xl hover:bg-blue-600 transition-colors text-lg font-semibold">
                            無料相談を予約する
                        </button>
                        <button className="border-2 border-slate-400 text-slate-300 px-8 py-4 rounded-2xl hover:border-white hover:text-white transition-colors text-lg font-semibold">
                            資料をダウンロード
                        </button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
