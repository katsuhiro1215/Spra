import { Link } from "@inertiajs/react";

export default function AboutSection() {
    return (
        <section className="relative bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
            <div className="container px-6 text-start mx-auto">
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
                    {/* Left - テキストエリア */}
                    <div className="w-full lg:max-w-md space-y-6">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight md:leading-relaxed">
                            私たちについて —
                            <span className="block text-green-600 mt-2">
                                ビジネスの実践の成長と管理
                            </span>
                            をサポートします。
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            私たちは企業の実務運用や成長プロセスを支援し、
                            デジタル化・業務最適化・Web戦略などを包括的にサポートします。
                        </p>
                        {/* ボタン */}
                        <Link
                            href="/about"
                            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                            私たちについて
                        </Link>
                    </div>

                    {/* Right - カードグリッド */}
                    <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Card 1 - Section One スタイル */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between min-h-[280px] md:min-h-[320px]">
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 text-left">
                                デジタル変革
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 text-left leading-relaxed mt-auto">
                                最新のテクノロジーを活用し、ビジネスプロセスを効率化。
                                DX推進で競争力を高めます。
                            </p>
                        </div>

                        {/* Card 2 - Section One スタイル */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between min-h-[280px] md:min-h-[320px]">
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 text-left">
                                経営サポート
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 text-left leading-relaxed mt-auto">
                                ビジネス全体の戦略設計から日々の業務改善まで、
                                実践的なサポートを提供します。
                            </p>
                        </div>

                        {/* Card 3 - Section One スタイル */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between min-h-[280px] md:min-h-[320px] md:col-span-2 lg:col-span-1">
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 text-left">
                                Web・システム構築
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 text-left leading-relaxed mt-auto">
                                ホームページ制作からシステム開発まで、
                                効果のあるWeb活用を支援します。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
