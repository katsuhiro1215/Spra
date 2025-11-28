import { useState } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Faq({ auth }) {
    const breadcrumbs = [{ label: "よくある質問" }];
    const [openIndex, setOpenIndex] = useState(null);

    const categories = [
        {
            title: "サービスについて",
            questions: [
                {
                    question: "どのようなサービスを提供していますか?",
                    answer: "Webサイト制作、システム開発、アプリ開発、ECサイト構築、ITコンサルティング、AI活用支援など、幅広いITソリューションを提供しています。お客様のビジネス課題に合わせた最適なソリューションをご提案いたします。",
                },
                {
                    question: "小規模なプロジェクトでも依頼できますか?",
                    answer: "はい、可能です。小規模なWebサイト制作から大規模システム開発まで、プロジェクトの規模を問わず対応しております。お気軽にご相談ください。",
                },
                {
                    question: "対応可能な技術スタックを教えてください",
                    answer: "フロントエンドはReact、Vue.js、Next.js、バックエンドはLaravel、Node.js、Python、データベースはMySQL、PostgreSQL、MongoDB、クラウドはAWS、GCP、Azureなど、最新の技術スタックに対応しています。",
                },
            ],
        },
        {
            title: "料金・お支払いについて",
            questions: [
                {
                    question: "料金体系はどうなっていますか?",
                    answer: "プロジェクトの規模や内容により異なります。まずは無料でお見積りをさせていただきますので、お気軽にお問い合わせください。概算については見積もりシミュレーターもご利用いただけます。",
                },
                {
                    question: "支払い方法は何がありますか?",
                    answer: "銀行振込、クレジットカード決済に対応しております。分割払いのご相談も承りますので、お気軽にご相談ください。",
                },
                {
                    question: "追加費用が発生することはありますか?",
                    answer: "契約時にお見積りした金額からの変更は、お客様のご要望による仕様変更があった場合のみです。その際も事前にお見積りをご提示し、ご承認いただいてから作業を進めますのでご安心ください。",
                },
            ],
        },
        {
            title: "開発期間・納期について",
            questions: [
                {
                    question: "開発にはどのくらいの期間がかかりますか?",
                    answer: "プロジェクトの規模により異なります。小規模なWebサイトで1〜2ヶ月、中規模システムで3〜6ヶ月、大規模システムで6ヶ月以上が目安となります。詳細なスケジュールはヒアリング後にご提示いたします。",
                },
                {
                    question: "急ぎの案件にも対応できますか?",
                    answer: "可能な限り対応いたします。ただし、品質を担保するため最低限必要な期間は確保させていただきます。まずはご希望の納期をお伝えください。",
                },
                {
                    question: "納期の延長は可能ですか?",
                    answer: "やむを得ない事情がある場合は、早めにご相談ください。プロジェクトの状況を確認し、可能な範囲で調整させていただきます。",
                },
            ],
        },
        {
            title: "サポート・保守について",
            questions: [
                {
                    question: "納品後のサポートはありますか?",
                    answer: "はい、納品後も保守サポートを提供しております。不具合対応、機能追加、運用サポートなど、お客様のご要望に応じたサポートプランをご用意しております。",
                },
                {
                    question: "運用・保守の料金はいくらですか?",
                    answer: "サイトの規模や必要なサポート内容により異なります。月額1万円〜のプランをご用意しておりますので、詳しくはお問い合わせください。",
                },
                {
                    question: "緊急時の対応は可能ですか?",
                    answer: "保守契約をいただいているお客様には、緊急時の優先対応サービスをご提供しております。24時間365日の緊急対応プランもございます。",
                },
            ],
        },
        {
            title: "ご契約・お打ち合わせについて",
            questions: [
                {
                    question: "契約前に相談することは可能ですか?",
                    answer: "はい、初回のご相談は無料です。お気軽にお問い合わせフォームまたはお電話でご連絡ください。オンライン・対面どちらでも対応可能です。",
                },
                {
                    question: "遠方でも依頼できますか?",
                    answer: "はい、全国対応しております。オンラインでのお打ち合わせにも対応しておりますので、地域を問わずご依頼いただけます。",
                },
                {
                    question: "NDA(秘密保持契約)の締結は可能ですか?",
                    answer: "はい、可能です。お客様の機密情報保護のため、プロジェクト開始前にNDAを締結させていただきます。",
                },
            ],
        },
    ];

    const toggleAccordion = (categoryIndex, questionIndex) => {
        const index = `${categoryIndex}-${questionIndex}`;
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <PublicLayout auth={auth}>
            <PageHero
                title="FAQ"
                subtitle="よくある質問"
                breadcrumbs={breadcrumbs}
            />

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                よくある質問
                            </h2>
                            <p className="text-gray-600">
                                お客様からよくいただくご質問をまとめました。
                                <br />
                                こちらに記載のない質問は、お気軽にお問い合わせください。
                            </p>
                        </div>

                        <div className="space-y-12">
                            {categories.map((category, categoryIndex) => (
                                <div key={categoryIndex}>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gradient-to-r from-blue-600 to-purple-600">
                                        {category.title}
                                    </h3>

                                    <div className="space-y-4">
                                        {category.questions.map(
                                            (item, questionIndex) => {
                                                const index = `${categoryIndex}-${questionIndex}`;
                                                const isOpen =
                                                    openIndex === index;

                                                return (
                                                    <div
                                                        key={questionIndex}
                                                        className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                toggleAccordion(
                                                                    categoryIndex,
                                                                    questionIndex
                                                                )
                                                            }
                                                            className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <div className="flex items-start gap-4 flex-1">
                                                                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                                                    Q
                                                                </span>
                                                                <span className="font-semibold text-gray-900 pr-4">
                                                                    {
                                                                        item.question
                                                                    }
                                                                </span>
                                                            </div>
                                                            <ChevronDownIcon
                                                                className={`w-6 h-6 text-gray-400 transition-transform flex-shrink-0 ${
                                                                    isOpen
                                                                        ? "transform rotate-180"
                                                                        : ""
                                                                }`}
                                                            />
                                                        </button>

                                                        <div
                                                            className={`overflow-hidden transition-all duration-300 ${
                                                                isOpen
                                                                    ? "max-h-96"
                                                                    : "max-h-0"
                                                            }`}
                                                        >
                                                            <div className="px-6 pb-6">
                                                                <div className="flex items-start gap-4 pt-4 border-t border-gray-100">
                                                                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                                                                        A
                                                                    </span>
                                                                    <p className="text-gray-600 leading-relaxed">
                                                                        {
                                                                            item.answer
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* お問い合わせCTA */}
                        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-center text-white">
                            <h3 className="text-2xl font-bold mb-4">
                                解決しない場合は
                            </h3>
                            <p className="mb-6">
                                お気軽にお問い合わせください。専門スタッフが丁寧に対応いたします。
                            </p>
                            <a
                                href="/contact"
                                className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                            >
                                お問い合わせはこちら
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
