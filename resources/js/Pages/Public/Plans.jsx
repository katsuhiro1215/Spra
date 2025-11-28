import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import { CheckIcon, XMarkIcon, StarIcon } from "@heroicons/react/24/outline";

export default function Plans({ auth }) {
    const breadcrumbs = [{ label: "料金プラン" }];

    const plans = [
        {
            name: "スターター",
            price: "50,000",
            period: "〜",
            popular: false,
            description: "小規模サイトや個人事業主に最適",
            color: "from-gray-500 to-gray-600",
            features: [
                { name: "ページ数: 5ページまで", included: true },
                { name: "レスポンシブデザイン", included: true },
                { name: "基本SEO対策", included: true },
                { name: "お問い合わせフォーム", included: true },
                { name: "SSL証明書", included: true },
                { name: "CMS機能", included: false },
                { name: "EC機能", included: false },
                { name: "保守サポート（月額）", included: false },
            ],
            deliveryTime: "2-3週間",
        },
        {
            name: "ビジネス",
            price: "150,000",
            period: "〜",
            popular: true,
            description: "中小企業のコーポレートサイトに最適",
            color: "from-blue-500 to-blue-600",
            features: [
                { name: "ページ数: 15ページまで", included: true },
                { name: "レスポンシブデザイン", included: true },
                { name: "SEO対策（詳細）", included: true },
                { name: "お問い合わせフォーム", included: true },
                { name: "SSL証明書", included: true },
                { name: "CMS機能（WordPress等）", included: true },
                { name: "アクセス解析設定", included: true },
                { name: "保守サポート（月額10,000円〜）", included: true },
            ],
            deliveryTime: "4-6週間",
        },
        {
            name: "エンタープライズ",
            price: "300,000",
            period: "〜",
            popular: false,
            description: "大規模サイトや特殊要件に対応",
            color: "from-purple-500 to-purple-600",
            features: [
                { name: "ページ数: 無制限", included: true },
                { name: "フルカスタムデザイン", included: true },
                { name: "高度なSEO対策", included: true },
                { name: "複数フォーム対応", included: true },
                { name: "SSL証明書", included: true },
                { name: "CMS機能（カスタム）", included: true },
                { name: "EC機能", included: true },
                { name: "保守サポート（月額20,000円〜）", included: true },
            ],
            deliveryTime: "8-12週間",
        },
    ];

    const additionalServices = [
        {
            name: "ドメイン・サーバー設定",
            price: "10,000円〜",
            description: "ドメイン取得・DNS設定・サーバー初期設定",
        },
        {
            name: "SEO対策（継続）",
            price: "月額30,000円〜",
            description: "キーワード分析・コンテンツ最適化・順位監視",
        },
        {
            name: "広告運用代行",
            price: "月額50,000円〜",
            description: "Google広告・SNS広告の運用・分析・改善",
        },
        {
            name: "システム開発",
            price: "要相談",
            description: "業務システム・API開発・データベース構築",
        },
    ];

    return (
        <PublicLayout auth={auth}>
            <Head title="料金プラン" />

            <PageHero
                title="Pricing Plans"
                subtitle="料金プラン"
                breadcrumbs={breadcrumbs}
            />

            {/* Plans Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            明確で分かりやすい料金体系
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            お客様のニーズに合わせて3つのプランをご用意。
                            追加料金なしの安心価格で、高品質なWebサイトを提供します。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                                    plan.popular
                                        ? "ring-4 ring-blue-500 ring-opacity-50 transform scale-105"
                                        : ""
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-0 right-0">
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-2 px-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <StarIcon className="w-4 h-4" />
                                                <span className="text-sm font-bold">
                                                    人気プラン
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="p-8">
                                    <div
                                        className={`inline-block px-4 py-2 rounded-full text-white bg-gradient-to-r ${plan.color} mb-4`}
                                    >
                                        {plan.name}
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold text-gray-900">
                                                ¥{plan.price.toLocaleString()}
                                            </span>
                                            <span className="text-lg text-gray-500">
                                                {plan.period}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {plan.description}
                                        </p>
                                        <p className="text-sm text-blue-600 font-medium mt-1">
                                            納期: {plan.deliveryTime}
                                        </p>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-3"
                                            >
                                                {feature.included ? (
                                                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                ) : (
                                                    <XMarkIcon className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                                                )}
                                                <span
                                                    className={`text-sm ${
                                                        feature.included
                                                            ? "text-gray-700"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    {feature.name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all hover:transform hover:scale-105 ${
                                            plan.popular
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        お問い合わせ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Services */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            追加サービス
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Webサイト制作に加えて、運用・マーケティングまでトータルサポート。
                            ビジネス成長を継続的に支援します。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {additionalServices.map((service, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {service.name}
                                    </h3>
                                    <span className="text-lg font-bold text-blue-600">
                                        {service.price}
                                    </span>
                                </div>
                                <p className="text-gray-600">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            料金に関するよくある質問
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {[
                            {
                                question: "見積もりは無料ですか？",
                                answer: "はい、お見積もりは無料です。お気軽にお問い合わせください。ヒアリング後、詳細な見積書を作成いたします。",
                            },
                            {
                                question: "支払い方法を教えてください",
                                answer: "銀行振込、クレジットカード決済に対応しています。分割払いについてもご相談可能です。",
                            },
                            {
                                question:
                                    "追加料金が発生する場合はありますか？",
                                answer: "基本的に追加料金は発生しません。ただし、制作途中での大幅な仕様変更がある場合は事前にご相談させていただきます。",
                            },
                            {
                                question: "保守サポートの内容を教えてください",
                                answer: "サーバー監視、セキュリティ更新、バックアップ、軽微な修正・更新作業が含まれます。緊急時の対応も行います。",
                            },
                        ].map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-sm"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        プロジェクトを始めませんか？
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        お客様のご予算・ご要望に合わせて最適なプランをご提案します。
                        まずはお気軽にご相談ください。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            無料相談・見積もり依頼
                        </a>
                        <a
                            href="tel:03-1234-5678"
                            className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            電話で相談: 03-1234-5678
                        </a>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
