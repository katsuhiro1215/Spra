import { Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import { resolveServiceIcon } from "@/Utils/serviceIcon";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const formatPriceRange = (plans) => {
    if (!plans || plans.length === 0) return "お問い合わせください";

    const prices = plans.map((plan) => Number(plan.base_price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    if (min === max) {
        return `¥${min.toLocaleString()}〜`;
    }

    return `¥${min.toLocaleString()} 〜 ¥${max.toLocaleString()}`;
};

export default function Service({ auth, services = [] }) {
    const breadcrumbs = [{ label: "サービス" }];

    return (
        <PublicLayout auth={auth}>
            <PageHero
                title="Our Services"
                subtitle="提供サービス一覧"
                breadcrumbs={breadcrumbs}
            />

            {/* サービス一覧 */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            幅広いサービスラインナップ
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            お客様のビジネスニーズに合わせて、
                            最適なソリューションをご提供いたします
                        </p>
                    </div>

                    {services.length === 0 ? (
                        <p className="text-center text-gray-500">
                            現在ご案内できるサービスがありません。
                        </p>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service) => {
                                const Icon = resolveServiceIcon(
                                    service.icon ||
                                        service.service_category?.icon,
                                );
                                const color =
                                    service.service_category?.color ||
                                    "#3B82F6";
                                const coverImage =
                                    service.media?.find(
                                        (media) => media.pivot?.is_primary,
                                    ) || service.media?.[0];

                                return (
                                    <Link
                                        key={service.id}
                                        href={route(
                                            "service.detail",
                                            service.slug,
                                        )}
                                        className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                                    >
                                        {/* 画像 */}
                                        <div className="relative h-48 overflow-hidden">
                                            {coverImage ? (
                                                <img
                                                    src={coverImage.url}
                                                    alt={
                                                        coverImage.alt_text ||
                                                        service.name
                                                    }
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div
                                                    className="w-full h-full flex items-center justify-center"
                                                    style={{
                                                        backgroundColor: color,
                                                    }}
                                                >
                                                    <Icon className="w-16 h-16 text-white/90" />
                                                </div>
                                            )}
                                            {service.is_featured && (
                                                <span
                                                    className="absolute top-4 right-4 px-3 py-1 bg-white/90 text-xs font-bold rounded-full"
                                                    style={{ color }}
                                                >
                                                    注目サービス
                                                </span>
                                            )}
                                        </div>

                                        {/* コンテンツ */}
                                        <div className="p-6">
                                            <span
                                                className="text-xs font-semibold"
                                                style={{ color }}
                                            >
                                                {service.service_category
                                                    ?.name}
                                            </span>
                                            <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">
                                                {service.name}
                                            </h3>
                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {service.description}
                                            </p>

                                            {/* 価格 */}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-sm text-gray-500">
                                                    料金目安
                                                </span>
                                                <span
                                                    className="text-lg font-bold"
                                                    style={{ color }}
                                                >
                                                    {formatPriceRange(
                                                        service.service_plans,
                                                    )}
                                                </span>
                                            </div>

                                            {/* プラン */}
                                            {service.service_plans?.length >
                                                0 && (
                                                <div className="mb-4">
                                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                                        プラン
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {service.service_plans
                                                            .slice(0, 3)
                                                            .map((plan) => (
                                                                <span
                                                                    key={
                                                                        plan.id
                                                                    }
                                                                    className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                                                                >
                                                                    {plan.name}
                                                                </span>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* 詳細リンク */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                                <span
                                                    className="text-sm font-semibold group-hover:underline"
                                                    style={{ color }}
                                                >
                                                    詳細を見る
                                                </span>
                                                <ArrowRightIcon
                                                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                                    style={{ color }}
                                                />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            まずはお気軽にご相談ください
                        </h2>
                        <p className="text-lg mb-8 opacity-90">
                            プロジェクトの規模や予算に合わせて、
                            最適なプランをご提案いたします
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                            >
                                お問い合わせ
                            </Link>
                            <Link
                                href="/estimate-simulator"
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white hover:bg-white/20 transition-all"
                            >
                                料金シミュレーター
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
