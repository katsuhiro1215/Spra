import { useState, useEffect } from "react";
import { gsap } from "gsap";

export default function LoadingAnimation({ onComplete }) {
    const [currentStage, setCurrentStage] = useState("seed"); // seed -> sprout -> grow -> bloom -> complete
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timeline = gsap.timeline({
            onComplete: () => {
                // フェードアウト後にonCompleteを呼び出し
                gsap.to(".loading-container", {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        setIsVisible(false);
                        onComplete?.();
                    },
                });
            },
        });

        // Stage 1: 種から芽が出る (0-2秒)
        timeline
            .set(".seed", { scale: 1, opacity: 1 })
            .set(".sprout", { scale: 0, opacity: 0, y: 20 })
            .set(".leaves", { scale: 0, opacity: 0, rotation: -20 })
            .set(".flower", { scale: 0, opacity: 0 })
            .set(".particles", { scale: 0, opacity: 0 })
            .set(".light-rays", { opacity: 0, rotation: 0 })

            // 種が震える
            .to(".seed", {
                scale: 1.1,
                duration: 0.3,
                repeat: 3,
                yoyo: true,
                ease: "power2.inOut",
            })

            // 芽が出現
            .to(
                ".sprout",
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "back.out(1.7)",
                    onStart: () => setCurrentStage("sprout"),
                },
                1.5
            )

            // 種が小さくなって消える
            .to(
                ".seed",
                {
                    scale: 0.3,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.in",
                },
                2
            )

            // Stage 2: 葉が成長 (2-4秒)
            .to(
                ".leaves",
                {
                    scale: 1,
                    opacity: 1,
                    rotation: 0,
                    duration: 1.2,
                    ease: "elastic.out(1, 0.8)",
                    onStart: () => setCurrentStage("grow"),
                },
                2.5
            )

            // Stage 3: 花が咲く (4-5.5秒)
            .to(
                ".flower",
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    ease: "back.out(2)",
                    onStart: () => setCurrentStage("bloom"),
                },
                4
            )

            // Stage 4: 光の効果とパーティクル (5.5-7秒)
            .to(
                ".light-rays",
                {
                    opacity: 0.6,
                    rotation: 360,
                    duration: 1.5,
                    ease: "none",
                },
                5.5
            )

            .to(
                ".particles",
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    onStart: () => setCurrentStage("complete"),
                },
                5.8
            )

            // パーティクルアニメーション
            .to(
                ".particle-1",
                {
                    x: -30,
                    y: -40,
                    rotation: 180,
                    duration: 1.2,
                    ease: "power2.out",
                },
                6
            )
            .to(
                ".particle-2",
                {
                    x: 25,
                    y: -50,
                    rotation: -120,
                    duration: 1.2,
                    ease: "power2.out",
                },
                6.1
            )
            .to(
                ".particle-3",
                {
                    x: -20,
                    y: -35,
                    rotation: 90,
                    duration: 1.2,
                    ease: "power2.out",
                },
                6.2
            )
            .to(
                ".particle-4",
                {
                    x: 35,
                    y: -30,
                    rotation: -60,
                    duration: 1.2,
                    ease: "power2.out",
                },
                6.3
            )

            // 最終的に全体をスケールアップして消える準備
            .to(
                ".plant-container",
                {
                    scale: 1.2,
                    duration: 0.5,
                    ease: "power2.out",
                },
                7
            );

        return () => {
            timeline.kill();
        };
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div className="loading-container fixed inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center z-[9999]">
            {/* Background animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 via-blue-100/30 to-purple-100/30 animate-pulse"></div>

            {/* Light rays */}
            <div className="light-rays absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-96 h-96 bg-gradient-conic from-yellow-200/20 via-green-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
            </div>

            {/* Main plant animation container */}
            <div className="plant-container relative flex flex-col items-center">
                {/* Particles */}
                <div className="particles absolute inset-0 pointer-events-none">
                    <div className="particle-1 absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full shadow-lg"></div>
                    <div className="particle-2 absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-green-300 rounded-full shadow-lg"></div>
                    <div className="particle-3 absolute top-1/2 left-1/2 w-2 h-2 bg-blue-300 rounded-full shadow-lg"></div>
                    <div className="particle-4 absolute top-1/2 left-1/2 w-1 h-1 bg-purple-300 rounded-full shadow-lg"></div>
                </div>

                {/* Flower */}
                <div className="flower mb-2">
                    <div className="relative">
                        {/* Flower petals */}
                        <div className="relative w-8 h-8">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full transform rotate-0"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-pink-300 rounded-full transform rotate-45 scale-75"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-blue-400 rounded-full transform rotate-90 scale-50"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-green-400 rounded-full transform rotate-135 scale-75"></div>
                        </div>
                        {/* Center */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full shadow-inner"></div>
                    </div>
                </div>

                {/* Leaves */}
                <div className="leaves flex space-x-1 mb-1">
                    <div className="w-6 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full transform -rotate-45 shadow-md"></div>
                    <div className="w-6 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full transform rotate-45 shadow-md"></div>
                </div>

                {/* Sprout/Stem */}
                <div className="sprout w-2 h-12 bg-gradient-to-t from-green-600 to-green-400 rounded-t-full shadow-inner"></div>

                {/* Seed */}
                <div className="seed w-4 h-3 bg-gradient-to-br from-amber-700 to-yellow-800 rounded-full shadow-lg -mt-1"></div>

                {/* Ground line */}
                <div className="w-16 h-1 bg-gradient-to-r from-amber-600 via-yellow-700 to-amber-600 rounded-full mt-1 shadow-inner"></div>
            </div>

            {/* Loading text */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                <div className="flex flex-col items-center space-y-4">
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        Smart Sprouts
                    </div>
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                        <div
                            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                        ></div>
                    </div>
                    <div className="text-sm text-gray-600 animate-pulse">
                        {currentStage === "seed" && "成長の準備中..."}
                        {currentStage === "sprout" && "芽が出始めています..."}
                        {currentStage === "grow" && "順調に成長中..."}
                        {currentStage === "bloom" && "花が咲きました..."}
                        {currentStage === "complete" && "明るい未来へ..."}
                    </div>
                </div>
            </div>
        </div>
    );
}
