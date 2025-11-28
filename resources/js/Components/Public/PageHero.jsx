import { Link } from "@inertiajs/react";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function PageHero({
    title,
    subtitle,
    breadcrumbs = [],
    backgroundImage = null,
}) {
    return (
        <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-20 overflow-hidden">
            {/* 背景画像（オプション） */}
            {backgroundImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                ></div>
            )}

            {/* 装飾要素 */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse animation-delay-2000"></div>
            </div>

            {/* コンテンツ */}
            <div className="container mx-auto px-6 relative z-10">
                {/* パンくずリスト */}
                {breadcrumbs.length > 0 && (
                    <nav className="flex items-center gap-2 text-sm text-white/80 mb-6">
                        <Link
                            href="/"
                            className="flex items-center gap-1 hover:text-white transition-colors"
                        >
                            <HomeIcon className="w-4 h-4" />
                            ホーム
                        </Link>
                        {breadcrumbs.map((crumb, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2"
                            >
                                <ChevronRightIcon className="w-4 h-4" />
                                {crumb.href ? (
                                    <Link
                                        href={crumb.href}
                                        className="hover:text-white transition-colors"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-white">
                                        {crumb.label}
                                    </span>
                                )}
                            </div>
                        ))}
                    </nav>
                )}

                {/* タイトル */}
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    {title}
                </h1>

                {/* サブタイトル */}
                {subtitle && (
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                        {subtitle}
                    </p>
                )}
            </div>

            <style>{`
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </section>
    );
}
