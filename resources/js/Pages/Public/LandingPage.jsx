import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    CheckCircleIcon,
    RocketLaunchIcon,
    SparklesIcon,
    ShieldCheckIcon,
    ClockIcon,
    UserGroupIcon,
    ChartBarIcon,
    LightBulbIcon,
} from "@heroicons/react/24/outline";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage({ auth, config = {} }) {
    const heroRef = useRef(null);
    const featuresRef = useRef(null);

    // デフォルト設定(propsで上書き可能)
    const defaultConfig = {
        hero: {
            title: "ビジネスを加速させる",
            subtitle: "革新的なITソリューション",
            description:
                "最新技術とプロフェッショナルなサポートで、あなたのビジネスを次のステージへ",
            ctaText: "今すぐ始める",
            ctaLink: "/contact",
            secondaryCtaText: "詳しく見る",
            secondaryCtaLink: "#features",
        },
        features: [
            {
                icon: RocketLaunchIcon,
                title: "高速開発",
                description: "最新の開発手法で、短期間での納品を実現",
            },
            {
                icon: SparklesIcon,
                title: "高品質",
                description: "厳格な品質管理で、安心のサービスを提供",
            },
            {
                icon: ShieldCheckIcon,
                title: "安全性",
                description: "セキュリティ対策を徹底し、データを保護",
            },
            {
                icon: ClockIcon,
                title: "24/7サポート",
                description: "いつでもお客様をサポート",
            },
        ],
        benefits: [
            {
                icon: UserGroupIcon,
                title: "専門チーム",
                description:
                    "経験豊富なエンジニアとデザイナーがプロジェクトをサポート",
                stats: "100+",
                statsLabel: "プロジェクト実績",
            },
            {
                icon: ChartBarIcon,
                title: "成果重視",
                description:
                    "ビジネス成果にコミットし、ROIを最大化するソリューション",
                stats: "200%",
                statsLabel: "平均ROI向上",
            },
            {
                icon: LightBulbIcon,
                title: "イノベーション",
                description:
                    "最新技術とトレンドを取り入れた革新的なアプローチ",
                stats: "95%",
                statsLabel: "顧客満足度",
            },
        ],
        pricing: [
            {
                name: "スターター",
                price: "¥50,000",
                period: "/月",
                description: "小規模プロジェクト向け",
                features: [
                    "基本機能",
                    "メールサポート",
                    "月次レポート",
                    "1プロジェクト",
                ],
                highlighted: false,
            },
            {
                name: "プロフェッショナル",
                price: "¥150,000",
                period: "/月",
                description: "中規模ビジネス向け",
                features: [
                    "全機能利用可能",
                    "優先サポート",
                    "週次レポート",
                    "3プロジェクト",
                    "カスタマイズ対応",
                ],
                highlighted: true,
            },
            {
                name: "エンタープライズ",
                price: "要相談",
                period: "",
                description: "大規模プロジェクト向け",
                features: [
                    "無制限プロジェクト",
                    "専任サポート",
                    "日次レポート",
                    "完全カスタマイズ",
                    "SLA保証",
                ],
                highlighted: false,
            },
        ],
        testimonials: [
            {
                name: "田中 太郎",
                company: "株式会社A",
                position: "代表取締役",
                comment:
                    "導入後、業務効率が大幅に向上しました。サポートも迅速で安心して利用できています。",
                avatar: "👨‍💼",
            },
            {
                name: "佐藤 花子",
                company: "B株式会社",
                position: "マーケティング部長",
                comment:
                    "期待以上の成果が出ています。特にUIの使いやすさに感動しました。",
                avatar: "👩‍💼",
            },
            {
                name: "鈴木 次郎",
                company: "株式会社C",
                position: "CTO",
                comment:
                    "技術力の高さに驚きました。難しい要件にも柔軟に対応していただけました。",
                avatar: "👨‍💻",
            },
        ],
        cta: {
            title: "今すぐ始めましょう",
            description:
                "無料相談を受け付けています。お気軽にお問い合わせください。",
            buttonText: "無料相談を申し込む",
            buttonLink: "/contact",
        },
    };

    // configとdefaultConfigをマージ
    const mergedConfig = {
        hero: { ...defaultConfig.hero, ...config.hero },
        features: config.features || defaultConfig.features,
        benefits: config.benefits || defaultConfig.benefits,
        pricing: config.pricing || defaultConfig.pricing,
        testimonials: config.testimonials || defaultConfig.testimonials,
        cta: { ...defaultConfig.cta, ...config.cta },
    };

    useEffect(() => {
        // Hero animation
        gsap.fromTo(
            heroRef.current.children,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
            }
        );

        // Features animation
        if (featuresRef.current) {
            gsap.fromTo(
                featuresRef.current.children,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: featuresRef.current,
                        start: "top 80%",
                    },
                }
            );
        }
    }, []);

    return (
        <PublicLayout auth={auth}>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 overflow-hidden">
                {/* 背景アニメーション */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div
                    ref={heroRef}
                    className="relative z-10 container mx-auto px-6 text-center text-white"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        {mergedConfig.hero.title}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                            {mergedConfig.hero.subtitle}
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-12 text-gray-100 max-w-3xl mx-auto">
                        {mergedConfig.hero.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={mergedConfig.hero.ctaLink}
                            className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all text-lg"
                        >
                            {mergedConfig.hero.ctaText}
                        </a>
                        <a
                            href={mergedConfig.hero.secondaryCtaLink}
                            className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all text-lg"
                        >
                            {mergedConfig.hero.secondaryCtaText}
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            なぜ選ばれるのか
                        </h2>
                        <p className="text-gray-600 text-lg">
                            私たちが選ばれる4つの理由
                        </p>
                    </div>

                    <div
                        ref={featuresRef}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {mergedConfig.features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all"
                                >
                                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            導入するメリット
                        </h2>
                        <p className="text-gray-600 text-lg">
                            ビジネス成果を最大化する3つの強み
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {mergedConfig.benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8"
                                >
                                    <Icon className="w-12 h-12 text-blue-600 mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {benefit.description}
                                    </p>
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="text-4xl font-bold text-blue-600">
                                            {benefit.stats}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {benefit.statsLabel}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            料金プラン
                        </h2>
                        <p className="text-gray-600 text-lg">
                            ビジネスの規模に合わせた柔軟なプラン
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {mergedConfig.pricing.map((plan, index) => (
                            <div
                                key={index}
                                className={`rounded-2xl p-8 ${
                                    plan.highlighted
                                        ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl transform scale-105"
                                        : "bg-white shadow-lg"
                                }`}
                            >
                                <h3
                                    className={`text-2xl font-bold mb-2 ${
                                        plan.highlighted
                                            ? "text-white"
                                            : "text-gray-900"
                                    }`}
                                >
                                    {plan.name}
                                </h3>
                                <p
                                    className={`mb-6 ${
                                        plan.highlighted
                                            ? "text-blue-100"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {plan.description}
                                </p>
                                <div className="mb-6">
                                    <span
                                        className={`text-4xl font-bold ${
                                            plan.highlighted
                                                ? "text-white"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        {plan.price}
                                    </span>
                                    <span
                                        className={`${
                                            plan.highlighted
                                                ? "text-blue-100"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {plan.period}
                                    </span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-2"
                                        >
                                            <CheckCircleIcon
                                                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                                    plan.highlighted
                                                        ? "text-blue-200"
                                                        : "text-blue-600"
                                                }`}
                                            />
                                            <span
                                                className={
                                                    plan.highlighted
                                                        ? "text-blue-50"
                                                        : "text-gray-600"
                                                }
                                            >
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href="/contact"
                                    className={`block text-center px-6 py-3 rounded-xl font-bold transition-all ${
                                        plan.highlighted
                                            ? "bg-white text-blue-600 hover:shadow-xl"
                                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                                    }`}
                                >
                                    お問い合わせ
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            お客様の声
                        </h2>
                        <p className="text-gray-600 text-lg">
                            実際に導入したお客様の評価
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {mergedConfig.testimonials.map(
                            (testimonial, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-3xl">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">
                                                {testimonial.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {testimonial.company}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {testimonial.position}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 italic">
                                        "{testimonial.comment}"
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="container mx-auto px-6 text-center text-white">
                    <h2 className="text-4xl font-bold mb-6">
                        {mergedConfig.cta.title}
                    </h2>
                    <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                        {mergedConfig.cta.description}
                    </p>
                    <a
                        href={mergedConfig.cta.buttonLink}
                        className="inline-block px-12 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all text-lg"
                    >
                        {mergedConfig.cta.buttonText}
                    </a>
                </div>
            </section>
        </PublicLayout>
    );
}
