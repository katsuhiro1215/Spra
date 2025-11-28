import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    BoltIcon,
    CubeTransparentIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
    RocketLaunchIcon,
    SparklesIcon,
    ArrowRightIcon,
    PhoneIcon,
    EnvelopeIcon,
} from "@heroicons/react/24/outline";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPageCreative({ auth }) {
    const heroRef = useRef(null);
    const floatingElementsRef = useRef([]);
    const processRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Hero floating animation
        floatingElementsRef.current.forEach((element, index) => {
            if (element) {
                gsap.to(element, {
                    y: -20,
                    duration: 2 + index * 0.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut",
                    delay: index * 0.3,
                });
            }
        });

        // Mouse tracking for hero elements
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePosition({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Process step animation
        const processSteps =
            processRef.current?.querySelectorAll(".process-step");
        if (processSteps) {
            ScrollTrigger.create({
                trigger: processRef.current,
                start: "top 60%",
                end: "bottom 40%",
                onUpdate: (self) => {
                    const progress = self.progress;
                    const stepIndex = Math.floor(
                        progress * processSteps.length
                    );
                    setCurrentStep(
                        Math.min(stepIndex, processSteps.length - 1)
                    );
                },
            });
        }

        // Text reveal animation
        gsap.fromTo(
            ".text-reveal",
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: ".text-reveal",
                    start: "top 80%",
                },
            }
        );

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    const services = [
        {
            icon: BoltIcon,
            title: "超高速開発",
            description: "AI支援開発ツールで開発期間を50%短縮",
            color: "from-yellow-400 to-orange-500",
            delay: 0,
        },
        {
            icon: CubeTransparentIcon,
            title: "3D体験設計",
            description: "没入型のユーザーエクスペリエンスを実現",
            color: "from-purple-400 to-pink-500",
            delay: 0.2,
        },
        {
            icon: GlobeAltIcon,
            title: "グローバル対応",
            description: "多言語・多地域対応のスケーラブルシステム",
            color: "from-green-400 to-blue-500",
            delay: 0.4,
        },
        {
            icon: ShieldCheckIcon,
            title: "量子暗号化",
            description: "次世代セキュリティで絶対的データ保護",
            color: "from-red-400 to-purple-500",
            delay: 0.6,
        },
    ];

    const processSteps = [
        {
            number: "01",
            title: "アイデア発掘",
            description: "あなたの想像を超えるアイデアを一緒に発見",
            icon: SparklesIcon,
        },
        {
            number: "02",
            title: "戦略立案",
            description: "データドリブンな戦略で成功への道筋を設計",
            icon: CubeTransparentIcon,
        },
        {
            number: "03",
            title: "超速開発",
            description: "最先端技術で驚異的スピードの開発を実現",
            icon: RocketLaunchIcon,
        },
        {
            number: "04",
            title: "成功実現",
            description: "継続サポートでビジネス成功まで完全伴走",
            icon: BoltIcon,
        },
    ];

    return (
        <PublicLayout auth={auth}>
            {/* Hero Section with 3D Elements */}
            <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            ref={(el) => (floatingElementsRef.current[i] = el)}
                            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.1}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Main Content */}
                <div className="relative z-10 container mx-auto px-6 min-h-screen flex items-center">
                    <div
                        ref={heroRef}
                        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                    >
                        {/* Left Content */}
                        <div className="text-white space-y-8">
                            <div
                                className="transform transition-transform duration-300"
                                style={{
                                    transform: `translate(${
                                        mousePosition.x * 0.5
                                    }px, ${mousePosition.y * 0.5}px)`,
                                }}
                            >
                                <h1 className="text-6xl md:text-8xl font-black leading-none">
                                    <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                        FUTURE
                                    </span>
                                    <span className="block text-white">
                                        IS NOW
                                    </span>
                                </h1>
                            </div>

                            <p className="text-2xl text-purple-200 leading-relaxed">
                                テクノロジーの限界を超えて、
                                <span className="text-cyan-300 font-bold">
                                    あなただけの未来
                                </span>
                                を創造します
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <button className="group relative bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300">
                                    <span className="relative z-10 flex items-center gap-2 font-bold text-lg">
                                        未来を始める
                                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>

                                <button className="border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-2xl hover:bg-cyan-400 hover:text-purple-900 transition-all duration-300 font-bold text-lg">
                                    デモ体験
                                </button>
                            </div>
                        </div>

                        {/* Right - Interactive 3D Card */}
                        <div
                            className="relative transform transition-transform duration-300"
                            style={{
                                transform: `translate(${
                                    mousePosition.x * -0.3
                                }px, ${mousePosition.y * -0.3}px) rotateY(${
                                    mousePosition.x * 0.5
                                }deg)`,
                            }}
                        >
                            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full opacity-30 blur-xl"></div>
                                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full opacity-20 blur-2xl"></div>

                                <div className="relative space-y-6">
                                    <h3 className="text-2xl font-bold text-white">
                                        革新的な開発プロセス
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            "AI駆動設計",
                                            "リアルタイム協業",
                                            "自動品質保証",
                                            "即時デプロイ",
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 text-purple-200"
                                            >
                                                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
                    <div className="w-1 h-16 bg-gradient-to-b from-cyan-400 to-transparent rounded-full"></div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20"></div>

                <div className="relative container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-black text-reveal">
                            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                SERVICES
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 mt-6 text-reveal">
                            未来のテクノロジーで今日の課題を解決
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={index}
                                    className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 hover:scale-105 transition-all duration-500 border border-gray-700 hover:border-cyan-400/50"
                                    style={{
                                        animationDelay: `${service.delay}s`,
                                    }}
                                >
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
                                    ></div>

                                    <div className="relative">
                                        <div
                                            className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color} text-white mb-4`}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section
                ref={processRef}
                className="py-20 bg-gradient-to-br from-gray-900 to-black text-white"
            >
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-black text-reveal">
                            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                PROCESS
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 mt-6 text-reveal">
                            4ステップで理想を現実に
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            {/* Progress Line */}
                            <div className="absolute left-8 top-16 bottom-16 w-1 bg-gray-700 rounded-full">
                                <div
                                    className="bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full transition-all duration-500 w-full"
                                    style={{
                                        height: `${
                                            ((currentStep + 1) /
                                                processSteps.length) *
                                            100
                                        }%`,
                                    }}
                                ></div>
                            </div>

                            <div className="space-y-12">
                                {processSteps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isActive = index <= currentStep;

                                    return (
                                        <div
                                            key={index}
                                            className={`process-step flex items-center gap-8 transition-all duration-500 ${
                                                isActive
                                                    ? "opacity-100 transform-none"
                                                    : "opacity-50 transform translate-x-4"
                                            }`}
                                        >
                                            <div
                                                className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                                                    isActive
                                                        ? "bg-gradient-to-br from-cyan-500 to-purple-600 scale-110"
                                                        : "bg-gray-700"
                                                }`}
                                            >
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <span className="text-4xl font-black text-gray-600">
                                                        {step.number}
                                                    </span>
                                                    <h3
                                                        className={`text-2xl font-bold transition-colors ${
                                                            isActive
                                                                ? "text-cyan-400"
                                                                : "text-gray-400"
                                                        }`}
                                                    >
                                                        {step.title}
                                                    </h3>
                                                </div>
                                                <p className="text-gray-300 text-lg">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full opacity-10 -translate-x-36 -translate-y-36"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full opacity-5 translate-x-48 translate-y-48"></div>
                </div>

                <div className="relative container mx-auto px-6 text-center">
                    <h2 className="text-5xl md:text-7xl font-black mb-8">
                        READY TO
                        <span className="block text-yellow-300">LAUNCH?</span>
                    </h2>
                    <p className="text-2xl mb-12 max-w-3xl mx-auto opacity-90">
                        あなたのビジョンを現実にする旅を、今すぐ始めましょう。
                        未来は待ってくれません。
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button className="group bg-white text-purple-900 px-12 py-6 rounded-2xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">
                            <span className="flex items-center gap-3 font-black text-xl">
                                <RocketLaunchIcon className="w-6 h-6" />
                                今すぐ開始
                            </span>
                        </button>

                        <div className="flex items-center gap-4 text-lg">
                            <div className="flex items-center gap-2">
                                <PhoneIcon className="w-5 h-5" />
                                <span>03-1234-5678</span>
                            </div>
                            <div className="w-1 h-6 bg-white/30"></div>
                            <div className="flex items-center gap-2">
                                <EnvelopeIcon className="w-5 h-5" />
                                <span>hello@smartsprouts.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
