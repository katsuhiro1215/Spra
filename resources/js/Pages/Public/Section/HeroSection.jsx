import { useEffect, useRef, useState } from "react";
import { Link } from "@inertiajs/react";
// GSAP
import { gsap } from "gsap";
import {
    RocketLaunchIcon,
    SparklesIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    CalculatorIcon,
} from "@heroicons/react/24/outline";

// スライドショー用のデフォルト画像
const DEFAULT_HERO_IMAGES = [
    "/upload/test1.jpg",
    "/upload/test2.jpg",
    "/upload/test3.jpg",
];

export default function HeroSection({ images }) {
    const particlesRef = useRef([]);
    const imageRefs = useRef([]);
    const imageContainerRef = useRef(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    // タイトル/サブタイトル/ボタンの初期表示はCSSトランジションで行う。
    // GSAPの delay 付き gsap.from() は、途中で何らかの要因（HMR再実行・
    // 裏タブ化によるrAFスロットリング等）に中断されると、要素が
    // opacity:0付近で固まって永久に見えなくなるリスクがあるため避ける。
    const [entered, setEntered] = useState(false);

    const heroImages =
        Array.isArray(images) && images.length > 0 ? images : DEFAULT_HERO_IMAGES;

    useEffect(() => {
        const raf = requestAnimationFrame(() => setEntered(true));

        // gsap.context() で作成したtweenをまとめて管理し、
        // エフェクトの再実行・アンマウント時に確実にkill/リバートする
        const ctx = gsap.context(() => {
            // パーティクルアニメーション
            particlesRef.current.forEach((p, i) => {
                gsap.fromTo(
                    p,
                    { y: 30, opacity: 0, scale: 0.6 },
                    {
                        y: -30,
                        opacity: 1,
                        scale: 1,
                        duration: 3,
                        delay: i * 0.4,
                        repeat: -1,
                        yoyo: true,
                        ease: "power1.inOut",
                    }
                );
            });
        });

        // 画像スライドショー
        const slideInterval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 4000);

        return () => {
            cancelAnimationFrame(raf);
            ctx.revert();
            clearInterval(slideInterval);
        };
    }, []);

    // マウスムーブで3D効果を動的に変更
    const handleMouseMove = (e) => {
        if (!imageContainerRef.current) return;

        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
        setMousePosition({ x: 0.5, y: 0.5 });
    };

    // 画像切り替え時のアニメーション
    useEffect(() => {
        imageRefs.current.forEach((img, index) => {
            if (index === currentImageIndex) {
                gsap.fromTo(
                    img,
                    {
                        opacity: 0,
                        scale: 1.1,
                        filter: "blur(10px)",
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 1.5,
                        ease: "power2.out",
                    }
                );
            } else {
                gsap.to(img, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.8,
                    ease: "power2.in",
                });
            }
        });
    }, [currentImageIndex]);

    return (
        <section className="relative bg-gradient-to-r from-blue-50 via-white to-green-50 py-20">
            {[...Array(6)].map((_, i) => (
                <span
                    key={i}
                    ref={(el) => (particlesRef.current[i] = el)}
                    className="absolute w-3 h-3 bg-green-400 rounded-full opacity-40 blur-sm"
                    style={{
                        top: `${20 + i * 10}%`,
                        left: `${10 + i * 12}%`,
                    }}
                ></span>
            ))}
            {/* Main */}
            <div className="container mx-auto px-6 pt-32 pb-8 flex flex-col md:flex-row md:justify-between items-center gap-12">
                {/* Left */}
                <div className="max-w-xl space-y-6">
                    <h1
                        className={`text-4xl md:text-5xl font-bold leading-tight transform transition-all duration-[1200ms] ease-out ${
                            entered
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                    >
                        Grow Smart.
                        <span className="block text-green-600">
                            Move Forward
                        </span>
                    </h1>
                    <p
                        className={`text-gray-600 text-lg leading-relaxed transform transition-all duration-[1200ms] delay-[200ms] ease-out ${
                            entered
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                        }`}
                    >
                        Smart
                        Sproutsは、あなたのビジネスを次の成長ステージへ導くデジタルパートナーです。
                    </p>
                    <div
                        className={`flex flex-col sm:flex-row gap-4 pt-4 transform transition-all duration-[800ms] delay-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                            entered
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-90"
                        }`}
                    >
                        <Link
                            href="/service"
                            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-green-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                            サービスを見る
                        </Link>
                        <Link
                            href="/estimate-simulator"
                            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-green-600 text-green-600 px-8 py-3 rounded-xl shadow-md hover:bg-green-50 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-semibold"
                        >
                            <CalculatorIcon className="w-5 h-5" />
                            料金シミュレーター
                        </Link>
                        <Link
                            href="/lp"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-semibold"
                        >
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full mr-1">
                                NEW
                            </span>
                            LP確認
                        </Link>
                    </div>
                </div>
                {/* Right - スライドショー画像 */}
                <div
                    className="relative w-full max-w-lg perspective-1000"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* 3D効果用の背景 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200 opacity-30 rounded-3xl blur-3xl transform rotate-3"></div>

                    {/* メイン画像コンテナ - 3D変形 */}
                    <div
                        ref={imageContainerRef}
                        className="relative h-96 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 ease-out"
                        style={{
                            transform: `perspective(1000px) rotateY(${
                                -15 + (mousePosition.x - 0.5) * 10
                            }deg) rotateX(${
                                12 + (mousePosition.y - 0.5) * -10
                            }deg)`,
                            transformStyle: "preserve-3d",
                        }}
                    >
                        {heroImages.map((src, index) => (
                            <img
                                key={index}
                                ref={(el) => (imageRefs.current[index] = el)}
                                src={src}
                                alt={`Hero ${index + 1}`}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{
                                    opacity:
                                        index === currentImageIndex ? 1 : 0,
                                }}
                            />
                        ))}

                        {/* グラデーションオーバーレイで奥行き感を追加 */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 pointer-events-none"></div>

                        {/* スライドインジケーター */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                            {heroImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        index === currentImageIndex
                                            ? "bg-white w-8"
                                            : "bg-white/50 hover:bg-white/75"
                                    }`}
                                    aria-label={`Slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 3D効果を強調するシャドウレイヤー */}
                    <div
                        className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-blue-300/20 to-green-300/20 rounded-2xl blur-xl -z-10"
                        style={{
                            transform:
                                "perspective(1000px) rotateY(-5deg) rotateX(2deg) translateZ(-20px)",
                        }}
                    ></div>
                </div>
            </div>
            {/* ポイント - アイコン付き */}
            <div className="container mx-auto px-6 mt-20">
                <div className="grid md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <RocketLaunchIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                スピード開発
                            </h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            豊富なテンプレートと独自フレームで圧倒的なスピードを実現。
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <SparklesIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                柔軟なカスタマイズ
                            </h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Web制作からシステム開発まで、ビジネスに合わせて自在に調整。
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <ChartBarIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                成長支援プラン
                            </h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            公開後も継続的に改善し、あなたの事業成長をサポート。
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <ShieldCheckIcon className="w-6 h-6 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                安心のサポート
                            </h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            専任チームが運用・保守まで一貫してサポートします。
                        </p>
                    </div>
                </div>
            </div>
            {/* compliant */}
            <div className="container mx-auto p-6 border-t border-gray-200 mt-20">
                <p className="text-center text-gray-500 text-sm">
                    © 2024 Smart Sprouts. All rights reserved.
                </p>
            </div>
        </section>
    );
}
