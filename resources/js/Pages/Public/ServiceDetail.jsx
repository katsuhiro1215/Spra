import { Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import { services } from "@/Data/services";
import {
    CheckCircleIcon,
    ArrowRightIcon,
    EyeIcon,
    CpuChipIcon,
    DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function ServiceDetail({ auth, slug }) {
    // スラッグからサービスを検索
    const service = services.find((s) => s.slug === slug);

    if (!service) {
        return (
            <PublicLayout auth={auth}>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            サービスが見つかりません
                        </h1>
                        <Link
                            href="/service"
                            className="text-blue-600 hover:underline"
                        >
                            サービス一覧に戻る
                        </Link>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    const breadcrumbs = [
        { label: "サービス", href: "/service" },
        { label: service.title },
    ];

    return (
        <PublicLayout auth={auth}>
            <PageHero
                title={service.title}
                subtitle={service.shortDescription}
                breadcrumbs={breadcrumbs}
            />

            {/* メインコンテンツ */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Left - 詳細情報 */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* サービス概要 */}
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-6xl">
                                        {service.icon}
                                    </span>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">
                                            {service.title}
                                        </h2>
                                        <p className="text-lg text-gray-600 mt-2">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 画像 */}
                            <div className="rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-auto"
                                />
                            </div>

                            {/* 主な機能 */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                    主な機能
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {service.features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                        >
                                            <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 使用技術 */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <CpuChipIcon className="w-8 h-8 text-blue-600" />
                                    使用技術
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {service.technologies.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 納品物 */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <DocumentTextIcon className="w-8 h-8 text-purple-600" />
                                    納品物
                                </h3>
                                <div className="space-y-3">
                                    {service.deliverables.map(
                                        (deliverable, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl"
                                            >
                                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {index + 1}
                                                </div>
                                                <span className="text-gray-700 font-medium">
                                                    {deliverable}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right - サイドバー */}
                        <div className="space-y-6">
                            {/* 料金カード */}
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl sticky top-24">
                                <h4 className="text-sm font-semibold mb-2 opacity-90">
                                    料金目安
                                </h4>
                                <p className="text-4xl font-bold mb-6">
                                    {service.price}
                                </p>
                                <p className="text-sm mb-6 opacity-90">
                                    ※ プロジェクトの規模や要件により変動します。
                                    まずはお気軽にご相談ください。
                                </p>

                                {/* デモボタン */}
                                {service.hasDemo && (
                                    <Link
                                        href={service.demoUrl}
                                        className="block w-full mb-4 px-6 py-4 bg-white text-purple-600 font-bold rounded-xl text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <EyeIcon className="w-5 h-5" />
                                            デモを見る
                                        </div>
                                    </Link>
                                )}

                                {/* お問い合わせボタン */}
                                <Link
                                    href="/contact"
                                    className="block w-full px-6 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl text-center border-2 border-white hover:bg-white/20 transition-all"
                                >
                                    お問い合わせ
                                </Link>
                            </div>

                            {/* 関連サービス */}
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h4 className="text-lg font-bold text-gray-900 mb-4">
                                    その他のサービス
                                </h4>
                                <div className="space-y-3">
                                    {services
                                        .filter((s) => s.id !== service.id)
                                        .slice(0, 3)
                                        .map((relatedService) => (
                                            <Link
                                                key={relatedService.id}
                                                href={`/services/${relatedService.slug}`}
                                                className="block p-4 bg-white rounded-xl hover:shadow-md transition-shadow group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">
                                                        {relatedService.icon}
                                                    </span>
                                                    <div className="flex-1">
                                                        <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {
                                                                relatedService.title
                                                            }
                                                        </h5>
                                                        <p className="text-sm text-gray-600 line-clamp-1">
                                                            {
                                                                relatedService.shortDescription
                                                            }
                                                        </p>
                                                    </div>
                                                    <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </Link>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-12 text-center shadow-xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            このサービスについて
                            <br className="md:hidden" />
                            もっと詳しく知りたい方
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            専門スタッフが丁寧にご説明いたします。
                            <br />
                            まずはお気軽にお問い合わせください。
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                            >
                                お問い合わせ
                            </Link>
                            <Link
                                href="/estimate-simulator"
                                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-gray-400 hover:shadow-md transition-all"
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
