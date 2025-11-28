import { Link } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

export default function ServiceSection({ services = [] }) {
    const [activeService, setActiveService] = useState(0);
    const [activePlan, setActivePlan] = useState(0);
    const contentRefs = useRef([]);
    const sidebarRef = useRef(null);

    // サービスデータ（最終的にはLaravelから受け取る）
    const serviceData = [
        {
            id: 1,
            title: "Web制作",
            description:
                "企業サイトやECサイトなど、お客様のニーズに合わせたWebサイトを制作いたします。",
            color: "blue",
            plans: [
                { id: 1, name: "シンプルプラン", price: "¥300,000〜" },
                { id: 2, name: "スタンダードプラン", price: "¥500,000〜" },
                { id: 3, name: "プレミアムプラン", price: "¥1,000,000〜" },
            ],
        },
        {
            id: 2,
            title: "システム開発",
            description:
                "業務システムや顧客管理システムなど、効率化を実現するシステムを開発します。",
            color: "green",
            plans: [
                { id: 1, name: "ベーシックプラン", price: "¥800,000〜" },
                { id: 2, name: "ビジネスプラン", price: "¥1,500,000〜" },
                {
                    id: 3,
                    name: "エンタープライズプラン",
                    price: "¥3,000,000〜",
                },
            ],
        },
        {
            id: 3,
            title: "アプリ開発",
            description:
                "iOS・Android対応のネイティブアプリ、クロスプラットフォームアプリを開発します。",
            color: "purple",
            plans: [
                { id: 1, name: "スターターパック", price: "¥600,000〜" },
                {
                    id: 2,
                    name: "プロフェッショナルパック",
                    price: "¥1,200,000〜",
                },
                { id: 3, name: "フルカスタムパック", price: "¥2,500,000〜" },
            ],
        },
    ];

    const currentService = serviceData[activeService];
    const colorClasses = {
        blue: {
            border: "border-blue-600",
            text: "text-blue-600",
            bg: "bg-blue-600",
            hover: "hover:bg-blue-700",
        },
        green: {
            border: "border-green-600",
            text: "text-green-600",
            bg: "bg-green-600",
            hover: "hover:bg-green-700",
        },
        purple: {
            border: "border-purple-600",
            text: "text-purple-600",
            bg: "bg-purple-600",
            hover: "hover:bg-purple-700",
        },
    };
    const colors = colorClasses[currentService.color];

    // スクロールによるプラン切り替え
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            contentRefs.current.forEach((ref, index) => {
                if (ref) {
                    const { offsetTop, offsetHeight } = ref;
                    if (
                        scrollPosition >= offsetTop &&
                        scrollPosition < offsetTop + offsetHeight
                    ) {
                        setActivePlan(index);
                    }
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [activeService]);

    // プランクリック時のスムーススクロール
    const scrollToPlan = (index) => {
        contentRefs.current[index]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    return (
        <section className="relative bg-gradient-to-r from-green-50 to-white py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* サービスタブメニュー */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex flex-wrap gap-4 bg-white p-2 rounded-lg shadow-sm">
                        {serviceData.map((service, index) => (
                            <button
                                key={service.id}
                                onClick={() => {
                                    setActiveService(index);
                                    setActivePlan(0);
                                }}
                                className={`px-6 py-3 text-sm sm:text-base font-medium rounded-md transition-all ${
                                    activeService === index
                                        ? `${
                                              colorClasses[service.color].bg
                                          } text-white shadow-md`
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                {service.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* サービス詳細ヘッダー */}
                <div className="flex flex-col lg:flex-row items-center lg:items-end mb-16 gap-8">
                    <div className="w-full lg:w-3/5 text-center lg:text-left">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
                            {currentService.title}
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg mb-6">
                            {currentService.description}
                        </p>
                        <Link
                            href="#"
                            className={`inline-block ${colors.bg} text-white px-8 py-3 rounded-lg shadow-lg ${colors.hover} transition-all transform hover:scale-105`}
                        >
                            詳しく見る
                        </Link>
                    </div>
                </div>

                {/* プランサイドバー + コンテンツ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* サイドバー（デスクトップ：sticky、モバイル：水平スクロール） */}
                    <div className="lg:col-span-3">
                        {/* デスクトップ版サイドバー */}
                        <div
                            ref={sidebarRef}
                            className="hidden lg:block lg:sticky lg:top-24 space-y-3"
                        >
                            {currentService.plans.map((plan, index) => (
                                <button
                                    key={plan.id}
                                    onClick={() => scrollToPlan(index)}
                                    className={`w-full text-left px-6 py-4 rounded-lg transition-all ${
                                        activePlan === index
                                            ? `${colors.bg} text-white shadow-lg transform scale-105`
                                            : "bg-white text-gray-700 hover:bg-gray-50 shadow"
                                    }`}
                                >
                                    <div className="font-semibold text-lg">
                                        {plan.name}
                                    </div>
                                    <div
                                        className={`text-sm mt-1 ${
                                            activePlan === index
                                                ? "text-white/90"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {plan.price}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* モバイル版水平スクロール */}
                        <div className="lg:hidden overflow-x-auto pb-4">
                            <div className="flex gap-3 min-w-max">
                                {currentService.plans.map((plan, index) => (
                                    <button
                                        key={plan.id}
                                        onClick={() => scrollToPlan(index)}
                                        className={`px-6 py-3 rounded-lg whitespace-nowrap transition-all ${
                                            activePlan === index
                                                ? `${colors.bg} text-white shadow-lg`
                                                : "bg-white text-gray-700 shadow"
                                        }`}
                                    >
                                        <div className="font-semibold">
                                            {plan.name}
                                        </div>
                                        <div
                                            className={`text-xs mt-1 ${
                                                activePlan === index
                                                    ? "text-white/90"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {plan.price}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* コンテンツエリア */}
                    <div className="lg:col-span-9 space-y-12">
                        {currentService.plans.map((plan, index) => (
                            <div
                                key={plan.id}
                                ref={(el) => (contentRefs.current[index] = el)}
                                className="bg-white rounded-xl shadow-lg p-6 sm:p-8 transition-all hover:shadow-xl"
                            >
                                <div className="mb-6">
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                                        {plan.name}
                                    </h3>
                                    <p
                                        className={`text-xl font-semibold ${colors.text}`}
                                    >
                                        {plan.price}
                                    </p>
                                </div>

                                {/* 画像グリッド */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    <img
                                        src="/upload/test1.jpg"
                                        alt={`${plan.name} 1`}
                                        className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
                                    />
                                    <img
                                        src="/upload/test2.jpg"
                                        alt={`${plan.name} 2`}
                                        className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
                                    />
                                    <img
                                        src="/upload/test3.jpg"
                                        alt={`${plan.name} 3`}
                                        className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
                                    />
                                </div>

                                <p className="text-gray-600 leading-relaxed">
                                    {plan.name}
                                    の詳細説明がここに入ります。お客様のニーズに合わせて最適なソリューションを提供いたします。
                                    プロフェッショナルなチームが、企画から運用まで一貫してサポートします。
                                </p>

                                <div className="mt-6">
                                    <Link
                                        href="#"
                                        className={`inline-block ${colors.bg} text-white px-6 py-2 rounded-lg ${colors.hover} transition-all`}
                                    >
                                        お問い合わせ
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
