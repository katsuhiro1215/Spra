import { Link } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

const BILLING_CYCLE_LABELS = {
    one_time: "一回限り",
    monthly: "月額",
    quarterly: "四半期",
    yearly: "年額",
};

const formatPrice = (plan) => {
    const price = `¥${Number(plan.base_price).toLocaleString()}`;
    const cycle = BILLING_CYCLE_LABELS[plan.billing_cycle];
    return cycle && plan.billing_cycle !== "one_time"
        ? `${price} / ${cycle}`
        : `${price}〜`;
};

export default function ServiceSection({ services = [] }) {
    const [activeService, setActiveService] = useState(0);
    const [activePlan, setActivePlan] = useState(0);
    const contentRefs = useRef([]);
    const sidebarRef = useRef(null);

    const currentService = services[activeService];
    const plans = currentService?.service_plans || [];
    const color = currentService?.service_category?.color || "#3B82F6";

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

    if (services.length === 0) {
        return null;
    }

    return (
        <section className="relative bg-gradient-to-r from-green-50 to-white py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* サービスタブメニュー */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex flex-wrap gap-4 bg-white p-2 rounded-lg shadow-sm">
                        {services.map((service, index) => (
                            <button
                                key={service.id}
                                onClick={() => {
                                    setActiveService(index);
                                    setActivePlan(0);
                                }}
                                className="px-6 py-3 text-sm sm:text-base font-medium rounded-md transition-all"
                                style={
                                    activeService === index
                                        ? {
                                              backgroundColor:
                                                  service.service_category
                                                      ?.color || "#3B82F6",
                                              color: "#fff",
                                          }
                                        : { color: "#4B5563" }
                                }
                            >
                                {service.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* サービス詳細ヘッダー */}
                <div className="flex flex-col lg:flex-row items-center lg:items-end mb-16 gap-8">
                    <div className="w-full lg:w-3/5 text-center lg:text-left">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
                            {currentService.name}
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg mb-6">
                            {currentService.description}
                        </p>
                        <Link
                            href={route("service.detail", currentService.slug)}
                            className="inline-block text-white px-8 py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
                            style={{ backgroundColor: color }}
                        >
                            詳しく見る
                        </Link>
                    </div>
                </div>

                {plans.length === 0 ? (
                    <p className="text-center text-gray-500">
                        現在ご案内できるプランがありません。まずはお気軽にお問い合わせください。
                    </p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* サイドバー（デスクトップ：sticky、モバイル：水平スクロール） */}
                        <div className="lg:col-span-3">
                            {/* デスクトップ版サイドバー */}
                            <div
                                ref={sidebarRef}
                                className="hidden lg:block lg:sticky lg:top-24 space-y-3"
                            >
                                {plans.map((plan, index) => (
                                    <button
                                        key={plan.id}
                                        onClick={() => scrollToPlan(index)}
                                        className="w-full text-left px-6 py-4 rounded-lg transition-all"
                                        style={
                                            activePlan === index
                                                ? {
                                                      backgroundColor: color,
                                                      color: "#fff",
                                                      transform: "scale(1.05)",
                                                  }
                                                : {
                                                      backgroundColor: "#fff",
                                                      color: "#374151",
                                                  }
                                        }
                                    >
                                        <div className="font-semibold text-lg">
                                            {plan.name}
                                        </div>
                                        <div
                                            className="text-sm mt-1"
                                            style={{
                                                opacity:
                                                    activePlan === index
                                                        ? 0.9
                                                        : 0.7,
                                            }}
                                        >
                                            {formatPrice(plan)}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* モバイル版水平スクロール */}
                            <div className="lg:hidden overflow-x-auto pb-4">
                                <div className="flex gap-3 min-w-max">
                                    {plans.map((plan, index) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => scrollToPlan(index)}
                                            className="px-6 py-3 rounded-lg whitespace-nowrap transition-all"
                                            style={
                                                activePlan === index
                                                    ? {
                                                          backgroundColor:
                                                              color,
                                                          color: "#fff",
                                                      }
                                                    : {
                                                          backgroundColor:
                                                              "#fff",
                                                          color: "#374151",
                                                      }
                                            }
                                        >
                                            <div className="font-semibold">
                                                {plan.name}
                                            </div>
                                            <div className="text-xs mt-1 opacity-80">
                                                {formatPrice(plan)}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* コンテンツエリア */}
                        <div className="lg:col-span-9 space-y-12">
                            {plans.map((plan, index) => (
                                <div
                                    key={plan.id}
                                    ref={(el) =>
                                        (contentRefs.current[index] = el)
                                    }
                                    className="bg-white rounded-xl shadow-lg p-6 sm:p-8 transition-all hover:shadow-xl"
                                >
                                    <div className="mb-6">
                                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                                            {plan.name}
                                        </h3>
                                        <p
                                            className="text-xl font-semibold"
                                            style={{ color }}
                                        >
                                            {formatPrice(plan)}
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
                                        {plan.description ||
                                            `${plan.name}の詳細については、お気軽にお問い合わせください。`}
                                    </p>
                                    
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <Link
                                            href={route(
                                                "service.detail",
                                                currentService.slug,
                                            )}
                                            className="inline-block text-white px-6 py-2 rounded-lg transition-all"
                                            style={{ backgroundColor: color }}
                                        >
                                            詳しく見る
                                        </Link>
                                        <Link
                                            href="/contact"
                                            className="inline-block border-2 px-6 py-2 rounded-lg transition-all"
                                            style={{
                                                borderColor: color,
                                                color,
                                            }}
                                        >
                                            お問い合わせ
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
