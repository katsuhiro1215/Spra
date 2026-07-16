import { Head, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import {
    RocketLaunchIcon,
    LightBulbIcon,
    UserGroupIcon,
    HeartIcon,
    TrophyIcon,
} from "@heroicons/react/24/outline";

export default function About({ auth }) {
    const { props } = usePage();
    const siteName = props.organization?.site_name || props.organization?.name;
    const breadcrumbs = [{ label: "私たちについて" }];

    const values = [
        {
            icon: LightBulbIcon,
            title: "革新",
            description:
                "常に最新の技術とアイデアで、クライアントのビジネスに新しい価値を提供します。",
            color: "blue",
        },
        {
            icon: HeartIcon,
            title: "情熱",
            description:
                "プロジェクトの成功を自分事として捉え、情熱を持って取り組みます。",
            color: "red",
        },
        {
            icon: UserGroupIcon,
            title: "協働",
            description:
                "クライアントとの密なコミュニケーションで、共に最適な解決策を見つけます。",
            color: "green",
        },
        {
            icon: TrophyIcon,
            title: "品質",
            description:
                "妥協のない品質管理で、期待を超える成果物を提供します。",
            color: "yellow",
        },
    ];

    const team = [
        {
            name: "山田 太郎",
            role: "代表取締役 / CEO",
            image: "/upload/test1.jpg",
            description:
                "15年以上のIT業界経験を持ち、数多くのプロジェクトを成功に導いてきました。",
        },
        {
            name: "佐藤 花子",
            role: "CTO",
            image: "/upload/test2.jpg",
            description:
                "最新技術のスペシャリスト。フルスタック開発からAI実装まで幅広く対応。",
        },
        {
            name: "鈴木 一郎",
            role: "デザインディレクター",
            image: "/upload/test3.jpg",
            description:
                "ユーザー体験を第一に考えたデザインで、多くの賞を受賞。",
        },
    ];

    const milestones = [
        { year: "2020", event: "Smart Sprouts設立" },
        { year: "2021", event: "従業員数10名突破、オフィス移転" },
        { year: "2022", event: "大手企業との協業プロジェクト開始" },
        { year: "2023", event: "AI技術導入サービス開始" },
        { year: "2024", event: "海外展開スタート、従業員数30名突破" },
    ];

    return (
        <PublicLayout auth={auth}>
            <Head title={`私たちについて | ${siteName || ""}`}>
                <meta
                    name="description"
                    content={`${siteName || ""}のミッション・バリュー・チームをご紹介します。`}
                />
            </Head>
            <PageHero
                title="About Us"
                subtitle="Smart Sproutsについて"
                breadcrumbs={breadcrumbs}
            />

            {/* ミッション */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                            <RocketLaunchIcon className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Our Mission
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed mb-8">
                            私たちのミッションは、最新のテクノロジーとクリエイティブな発想で、
                            <br className="hidden md:block" />
                            すべてのビジネスをデジタル時代の成功へと導くことです。
                        </p>
                        <p className="text-lg text-gray-500 leading-relaxed">
                            Smart
                            Sproutsは、「賢く芽吹く」という名前の通り、クライアントのビジネスが持つ可能性を見出し、
                            それを最大限に引き出すためのパートナーでありたいと考えています。
                        </p>
                    </div>
                </div>
            </section>

            {/* 私たちの価値観 */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Values
                        </h2>
                        <p className="text-lg text-gray-600">
                            私たちを支える4つの価値観
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            const colorClasses = {
                                blue: "bg-blue-100 text-blue-600",
                                red: "bg-red-100 text-red-600",
                                green: "bg-green-100 text-green-600",
                                yellow: "bg-yellow-100 text-yellow-600",
                            };
                            return (
                                <div
                                    key={index}
                                    className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                                >
                                    <div
                                        className={`inline-flex p-4 rounded-xl mb-4 ${colorClasses[value.color]}`}
                                    >
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* チーム紹介 */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Team
                        </h2>
                        <p className="text-lg text-gray-600">
                            経験豊富なプロフェッショナルチーム
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="text-xl font-bold mb-1">
                                            {member.name}
                                        </h3>
                                        <p className="text-sm text-white/90">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {member.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 沿革 */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our History
                        </h2>
                        <p className="text-lg text-gray-600">
                            これまでの歩み
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            {/* タイムライン線 */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600"></div>

                            {/* マイルストーン */}
                            {milestones.map((milestone, index) => (
                                <div
                                    key={index}
                                    className="relative pl-20 pb-12 last:pb-0"
                                >
                                    {/* ドット */}
                                    <div className="absolute left-6 top-2 w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white shadow-lg"></div>

                                    {/* コンテンツ */}
                                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                        <div className="flex items-center gap-4 mb-2">
                                            <span className="px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-full">
                                                {milestone.year}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 font-medium">
                                            {milestone.event}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            一緒にプロジェクトを始めませんか？
                        </h2>
                        <p className="text-lg mb-8 opacity-90">
                            お客様のビジネスを次のレベルへ引き上げるお手伝いをさせてください
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/contact"
                                className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                            >
                                お問い合わせ
                            </a>
                            <a
                                href="/service"
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white hover:bg-white/20 transition-all"
                            >
                                サービスを見る
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
