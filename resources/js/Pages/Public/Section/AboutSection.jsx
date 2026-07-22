import { Link } from "@inertiajs/react";

const DEFAULT_HEADING = "私たちについて — ビジネスの実践の成長と管理をサポートします。";
const DEFAULT_DESCRIPTION =
    "私たちは企業の実務運用や成長プロセスを支援し、デジタル化・業務最適化・Web戦略などを包括的にサポートします。";
const DEFAULT_BUTTON_LABEL = "私たちについて";
const DEFAULT_BUTTON_URL = "/about";
const DEFAULT_CARDS = [
    {
        title: "デジタル変革",
        text: "最新のテクノロジーを活用し、ビジネスプロセスを効率化。DX推進で競争力を高めます。",
    },
    {
        title: "経営サポート",
        text: "ビジネス全体の戦略設計から日々の業務改善まで、実践的なサポートを提供します。",
    },
    {
        title: "Web・システム構築",
        text: "ホームページ制作からシステム開発まで、効果のあるWeb活用を支援します。",
    },
];

export default function AboutSection({
    heading,
    description,
    buttonLabel,
    buttonUrl,
    cards,
} = {}) {
    heading = heading ?? DEFAULT_HEADING;
    description = description || DEFAULT_DESCRIPTION;
    buttonLabel = buttonLabel ?? DEFAULT_BUTTON_LABEL;
    buttonUrl = buttonUrl ?? DEFAULT_BUTTON_URL;
    cards = cards && cards.length > 0 ? cards : DEFAULT_CARDS;

    return (
        <section className="relative bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
            <div className="container px-6 text-start mx-auto">
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
                    {/* Left - テキストエリア */}
                    <div className="w-full lg:max-w-md space-y-6">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight md:leading-relaxed text-gray-900">
                            {heading}
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            {description}
                        </p>
                        {/* ボタン */}
                        <Link
                            href={buttonUrl}
                            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                            {buttonLabel}
                        </Link>
                    </div>

                    {/* Right - カードグリッド */}
                    <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className={`bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between min-h-[280px] md:min-h-[320px] ${
                                    index === cards.length - 1 &&
                                    cards.length % 3 !== 0
                                        ? "md:col-span-2 lg:col-span-1"
                                        : ""
                                }`}
                            >
                                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 text-left">
                                    {card.title}
                                </h3>
                                <p className="text-sm md:text-base text-gray-600 text-left leading-relaxed mt-auto">
                                    {card.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
