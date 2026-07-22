import { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import VoiceSection from "@/Pages/Public/Section/VoiceSection";
import PlanComparisonTable from "@/Pages/Public/Section/PlanComparisonTable";
import { resolveServiceIcon } from "@/Utils/serviceIcon";
import {
    CheckCircleIcon,
    ArrowRightIcon,
    CpuChipIcon,
    DocumentTextIcon,
    ArrowTopRightOnSquareIcon,
    ChevronDownIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const BILLING_CYCLE_LABELS = {
    one_time: "一回限り",
    monthly: "月額",
    quarterly: "四半期",
    yearly: "年額",
};

const formatPrice = (value) => `¥${Number(value).toLocaleString()}`;

export default function ServiceDetail({ auth, service, relatedServices = [] }) {
    const Icon = resolveServiceIcon(
        service.icon || service.service_category?.icon,
    );
    const color = service.service_category?.color || "#3B82F6";
    const plans = service.service_plans || [];
    const media = service.media || [];
    const technologies = service.technologies || [];
    const portfolios = service.portfolios || [];
    const faqs = service.faqs || [];
    const voices = service.voices || [];
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const activeImage = media[activeImageIndex];
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const { props } = usePage();
    const siteName = props.organization?.site_name || props.organization?.name;

    const breadcrumbs = [
        { label: "サービス", href: "/service" },
        { label: service.name },
    ];

    return (
        <PublicLayout auth={auth}>
            <Head title={`${service.name} | ${siteName || ""}`}>
                <meta
                    name="description"
                    content={service.description || service.name}
                />
            </Head>
            <PageHero
                title={service.name}
                subtitle={service.description}
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
                                    <div
                                        className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: color }}
                                    >
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <span
                                            className="text-sm font-semibold"
                                            style={{ color }}
                                        >
                                            {service.service_category?.name}
                                        </span>
                                        <h2 className="text-3xl font-bold text-gray-900">
                                            {service.name}
                                        </h2>
                                    </div>
                                </div>
                                {service.details && (
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {service.details}
                                    </p>
                                )}
                            </div>

                            {/* 画像ギャラリー */}
                            {media.length > 0 && (
                                <div>
                                    <div className="rounded-2xl overflow-hidden shadow-2xl">
                                        <img
                                            src={activeImage?.url}
                                            alt={
                                                activeImage?.alt_text ||
                                                service.name
                                            }
                                            className="w-full h-auto"
                                        />
                                    </div>
                                    {media.length > 1 && (
                                        <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                                            {media.map((image, index) => (
                                                <button
                                                    key={image.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveImageIndex(
                                                            index,
                                                        )
                                                    }
                                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                        index ===
                                                        activeImageIndex
                                                            ? "border-blue-600"
                                                            : "border-transparent opacity-70 hover:opacity-100"
                                                    }`}
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt={
                                                            image.alt_text ||
                                                            service.name
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* プラン */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                    プラン一覧
                                </h3>
                                {plans.length === 0 ? (
                                    <p className="text-gray-500">
                                        現在ご案内できるプランがありません。まずはお気軽にお問い合わせください。
                                    </p>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {plans.map((plan) => (
                                            <div
                                                key={plan.id}
                                                className="rounded-xl border-2 p-6 hover:shadow-lg transition-shadow"
                                                style={{
                                                    borderColor:
                                                        plan.color || "#E5E7EB",
                                                }}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="text-lg font-bold text-gray-900">
                                                        {plan.name}
                                                    </h4>
                                                    {plan.badge_text && (
                                                        <span
                                                            className="px-2 py-1 text-xs font-medium rounded text-white"
                                                            style={{
                                                                backgroundColor:
                                                                    plan.color ||
                                                                    "#3B82F6",
                                                            }}
                                                        >
                                                            {plan.badge_text}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-2xl font-bold text-gray-900 mb-1">
                                                    {formatPrice(
                                                        plan.base_price,
                                                    )}
                                                    <span className="text-sm font-normal text-gray-500 ml-1">
                                                        /{" "}
                                                        {BILLING_CYCLE_LABELS[
                                                            plan.billing_cycle
                                                        ] || plan.billing_cycle}
                                                    </span>
                                                </p>
                                                {plan.description && (
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        {plan.description}
                                                    </p>
                                                )}
                                                {plan.estimated_delivery_days && (
                                                    <p className="text-xs text-gray-500 mb-4">
                                                        納期目安:{" "}
                                                        {
                                                            plan.estimated_delivery_days
                                                        }
                                                        日
                                                    </p>
                                                )}
                                                {plan.service_items?.length >
                                                    0 && (
                                                    <div className="space-y-2 mb-4">
                                                        {plan.service_items.map(
                                                            (item) => (
                                                                <div
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className="flex items-start gap-2 text-sm text-gray-700"
                                                                >
                                                                    <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                                    {item.name}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                                <Link
                                                    href={route(
                                                        "estimate.simulator",
                                                    )}
                                                    className="inline-flex items-center text-sm font-semibold group"
                                                    style={{ color }}
                                                >
                                                    このプランで見積もる
                                                    <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 使用技術 */}
                            {technologies.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <CpuChipIcon className="w-8 h-8 text-blue-600" />
                                        使用技術
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {technologies.map((technology) => (
                                            <span
                                                key={technology.id}
                                                className="px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all text-white"
                                                style={{
                                                    backgroundColor:
                                                        technology.color ||
                                                        "#3B82F6",
                                                }}
                                            >
                                                {technology.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* よくある質問 */}
                            {faqs.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <QuestionMarkCircleIcon className="w-8 h-8 text-blue-600" />
                                        よくある質問
                                    </h3>
                                    <div className="space-y-4">
                                        {faqs.map((faq, index) => {
                                            const isOpen =
                                                openFaqIndex === index;
                                            return (
                                                <div
                                                    key={faq.id}
                                                    className="bg-gray-50 rounded-xl overflow-hidden"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setOpenFaqIndex(
                                                                isOpen
                                                                    ? null
                                                                    : index,
                                                            )
                                                        }
                                                        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                                                    >
                                                        <span className="font-semibold text-gray-900 pr-4">
                                                            {faq.question}
                                                        </span>
                                                        <ChevronDownIcon
                                                            className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                                                                isOpen
                                                                    ? "transform rotate-180"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </button>
                                                    {isOpen && (
                                                        <div className="px-5 pb-5">
                                                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap border-t border-gray-200 pt-4">
                                                                {faq.answer}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <Link
                                        href={route("faq")}
                                        className="inline-flex items-center mt-4 text-sm font-semibold group"
                                        style={{ color }}
                                    >
                                        FAQ一覧を見る
                                        <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            )}

                            {/* 実績 */}
                            {portfolios.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <DocumentTextIcon className="w-8 h-8 text-purple-600" />
                                        実績
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {portfolios.map((portfolio) => (
                                            <div
                                                key={portfolio.id}
                                                className="flex gap-4 p-4 bg-purple-50 rounded-xl"
                                            >
                                                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-purple-100 flex items-center justify-center">
                                                    {portfolio.media ? (
                                                        <img
                                                            src={
                                                                portfolio.media
                                                                    .url
                                                            }
                                                            alt={
                                                                portfolio.title
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <DocumentTextIcon className="w-8 h-8 text-purple-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-900">
                                                        {portfolio.title}
                                                    </p>
                                                    {portfolio.description && (
                                                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                                            {
                                                                portfolio.description
                                                            }
                                                        </p>
                                                    )}
                                                    {portfolio.url && (
                                                        <a
                                                            href={portfolio.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 mt-2 hover:underline"
                                                        >
                                                            サイトを見る
                                                            <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right - サイドバー */}
                        <div className="space-y-6">
                            {/* CTAカード */}
                            <div
                                className="rounded-2xl p-8 text-white shadow-xl sticky top-24"
                                style={{
                                    background: `linear-gradient(135deg, ${color}, #7C3AED)`,
                                }}
                            >
                                <h4 className="text-sm font-semibold mb-2 opacity-90">
                                    料金目安
                                </h4>
                                <p className="text-3xl font-bold mb-6">
                                    {plans.length > 0
                                        ? formatPrice(
                                              Math.min(
                                                  ...plans.map((p) =>
                                                      Number(p.base_price),
                                                  ),
                                              ),
                                          ) + "〜"
                                        : "お問い合わせください"}
                                </p>
                                <p className="text-sm mb-6 opacity-90">
                                    ※ プロジェクトの規模や要件により変動します。
                                    まずはお気軽にご相談ください。
                                </p>

                                <Link
                                    href={route("estimate.simulator")}
                                    className="block w-full mb-4 px-6 py-4 bg-white text-purple-600 font-bold rounded-xl text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                                >
                                    料金シミュレーター
                                </Link>

                                <Link
                                    href="/contact"
                                    className="block w-full px-6 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl text-center border-2 border-white hover:bg-white/20 transition-all"
                                >
                                    お問い合わせ
                                </Link>
                            </div>

                            {/* 関連サービス */}
                            {relatedServices.length > 0 && (
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h4 className="text-lg font-bold text-gray-900 mb-4">
                                        その他のサービス
                                    </h4>
                                    <div className="space-y-3">
                                        {relatedServices.map(
                                            (relatedService) => {
                                                const RelatedIcon =
                                                    resolveServiceIcon(
                                                        relatedService.icon,
                                                    );
                                                const relatedCover =
                                                    relatedService.media?.find(
                                                        (m) =>
                                                            m.pivot
                                                                ?.is_primary,
                                                    ) ||
                                                    relatedService.media?.[0];
                                                return (
                                                    <Link
                                                        key={
                                                            relatedService.id
                                                        }
                                                        href={route(
                                                            "service.detail",
                                                            relatedService.slug,
                                                        )}
                                                        className="block p-4 bg-white rounded-xl hover:shadow-md transition-shadow group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {relatedCover ? (
                                                                <img
                                                                    src={
                                                                        relatedCover.url
                                                                    }
                                                                    alt={
                                                                        relatedService.name
                                                                    }
                                                                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                                                />
                                                            ) : (
                                                                <RelatedIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                                                            )}
                                                            <div className="flex-1">
                                                                <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                    {
                                                                        relatedService.name
                                                                    }
                                                                </h5>
                                                                <p className="text-sm text-gray-600 line-clamp-1">
                                                                    {
                                                                        relatedService.description
                                                                    }
                                                                </p>
                                                            </div>
                                                            <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                                        </div>
                                                    </Link>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* プラン比較表 */}
            <PlanComparisonTable plans={plans} />

            {/* お客様の声 */}
            <VoiceSection
                voices={voices}
                title="お客様の声"
                subtitle={`${service.name}をご利用いただいたお客様からいただいた声をご紹介します`}
            />

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
