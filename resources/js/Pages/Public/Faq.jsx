import { useState } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Faq({ auth, page, categories = [] }) {
    const breadcrumbs = [{ label: "よくある質問" }];
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (categoryIndex, questionIndex) => {
        const index = `${categoryIndex}-${questionIndex}`;
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <PublicLayout auth={auth}>
            <PageHero
                title={page?.title || "FAQ"}
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

                        {categories.length === 0 ? (
                            <p className="text-center text-gray-500">
                                現在公開中のFAQはありません。
                            </p>
                        ) : (
                            <div className="space-y-12">
                                {categories.map(
                                    (category, categoryIndex) => (
                                        <div key={category.id}>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gradient-to-r from-blue-600 to-purple-600">
                                                {category.name}
                                            </h3>

                                            <div className="space-y-4">
                                                {(
                                                    category.published_faqs ||
                                                    []
                                                ).map(
                                                    (item, questionIndex) => {
                                                        const index = `${categoryIndex}-${questionIndex}`;
                                                        const isOpen =
                                                            openIndex ===
                                                            index;

                                                        return (
                                                            <div
                                                                key={item.id}
                                                                className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                                                            >
                                                                <button
                                                                    onClick={() =>
                                                                        toggleAccordion(
                                                                            categoryIndex,
                                                                            questionIndex,
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
                                                                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                                                                {
                                                                                    item.answer
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}

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
