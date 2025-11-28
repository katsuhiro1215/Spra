import { Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import { services } from "@/Data/services";
import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function Service({ auth }) {
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

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <Link
                                key={service.id}
                                href={`/services/${service.slug}`}
                                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                            >
                                {/* 画像 */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute top-4 left-4">
                                        <span className="text-4xl">
                                            {service.icon}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-2xl font-bold text-white mb-1">
                                            {service.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* コンテンツ */}
                                <div className="p-6">
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {service.shortDescription}
                                    </p>

                                    {/* 価格 */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-500">
                                            料金目安
                                        </span>
                                        <span className="text-lg font-bold text-blue-600">
                                            {service.price}
                                        </span>
                                    </div>

                                    {/* 主な機能 */}
                                    <div className="mb-4">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">
                                            主な機能
                                        </p>
                                        <div className="space-y-1">
                                            {service.features
                                                .slice(0, 3)
                                                .map((feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2 text-sm text-gray-600"
                                                    >
                                                        <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                        {feature}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 詳細リンク */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                                            詳細を見る
                                        </span>
                                        <ArrowRightIcon className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
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
