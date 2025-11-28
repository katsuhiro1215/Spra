import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import {
    MapPinIcon,
    ClockIcon,
    CurrencyYenIcon,
    UserGroupIcon,
    HeartIcon,
    LightBulbIcon,
    RocketLaunchIcon,
    AcademicCapIcon,
} from "@heroicons/react/24/outline";

export default function Careers({ auth }) {
    const breadcrumbs = [{ label: "採用情報" }];

    const jobOpenings = [
        {
            title: "フロントエンドエンジニア",
            type: "正社員",
            location: "東京・リモート",
            salary: "400万円〜800万円",
            experience: "実務経験2年以上",
            description: "React/Vue.js を使用したWebアプリケーション開発",
            skills: ["React", "TypeScript", "CSS", "Git"],
            urgent: true,
        },
        {
            title: "バックエンドエンジニア",
            type: "正社員",
            location: "東京・リモート",
            salary: "450万円〜900万円",
            experience: "実務経験3年以上",
            description: "Laravel/Node.js を使用したAPI・サーバーサイド開発",
            skills: ["Laravel", "Node.js", "MySQL", "AWS"],
            urgent: false,
        },
        {
            title: "UI/UXデザイナー",
            type: "正社員",
            location: "東京・リモート",
            salary: "350万円〜700万円",
            experience: "実務経験2年以上",
            description: "Webサイト・アプリのUI/UXデザイン設計",
            skills: ["Figma", "Adobe XD", "Photoshop", "Illustrator"],
            urgent: false,
        },
        {
            title: "プロジェクトマネージャー",
            type: "正社員",
            location: "東京・ハイブリッド",
            salary: "500万円〜1000万円",
            experience: "PM経験3年以上",
            description: "Web制作・システム開発プロジェクトの管理",
            skills: [
                "プロジェクト管理",
                "チームマネジメント",
                "要件定義",
                "顧客折衝",
            ],
            urgent: true,
        },
        {
            title: "営業・ビジネス開発",
            type: "正社員",
            location: "東京",
            salary: "350万円〜600万円（インセンティブ有）",
            experience: "営業経験1年以上",
            description: "新規顧客開拓・既存顧客フォロー・提案営業",
            skills: [
                "営業経験",
                "提案力",
                "コミュニケーション力",
                "ITリテラシー",
            ],
            urgent: false,
        },
        {
            title: "インターン（エンジニア）",
            type: "インターン",
            location: "東京・リモート",
            salary: "時給1,200円〜1,800円",
            experience: "未経験歓迎",
            description:
                "Web開発業務のアシスタント・実務経験を積みたい学生歓迎",
            skills: ["HTML/CSS", "JavaScript", "学習意欲", "基本的なPC操作"],
            urgent: false,
        },
    ];

    const benefits = [
        {
            icon: ClockIcon,
            title: "フレックスタイム制",
            description: "コアタイム10:00-15:00で自由な働き方を実現",
        },
        {
            icon: MapPinIcon,
            title: "リモートワーク",
            description: "週2〜3日のリモート勤務可能（職種による）",
        },
        {
            icon: AcademicCapIcon,
            title: "スキルアップ支援",
            description: "技術書籍・オンライン学習・カンファレンス参加費支給",
        },
        {
            icon: HeartIcon,
            title: "充実した福利厚生",
            description: "社会保険完備・退職金制度・健康診断・社員旅行",
        },
        {
            icon: CurrencyYenIcon,
            title: "昇給・賞与",
            description: "年1回昇給・年2回賞与（業績により）",
        },
        {
            icon: UserGroupIcon,
            title: "チームワーク",
            description: "少数精鋭のチームで一人ひとりの成長を支援",
        },
    ];

    const companyValues = [
        {
            icon: LightBulbIcon,
            title: "Innovation（革新）",
            description: "常に新しい技術にチャレンジし、お客様に価値を提供",
        },
        {
            icon: RocketLaunchIcon,
            title: "Growth（成長）",
            description: "個人とチーム、会社が共に成長できる環境づくり",
        },
        {
            icon: HeartIcon,
            title: "Passion（情熱）",
            description: "仕事への情熱と、お客様への真摯な姿勢を大切にする",
        },
    ];

    return (
        <PublicLayout auth={auth}>
            <Head title="採用情報" />

            <PageHero
                title="Careers"
                subtitle="採用情報"
                breadcrumbs={breadcrumbs}
            />

            {/* Company Culture */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Smart Sproutsで働く
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            私たちは「成長」をテーマに、メンバー一人ひとりが輝ける環境を作っています。
                            最新技術への挑戦と、チームワークを大切にする職場で一緒に働きませんか？
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {companyValues.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div key={index} className="text-center p-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full mb-4">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            働きやすい環境
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            メンバーが最高のパフォーマンスを発揮できるよう、
                            充実した制度と環境を整えています。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <Icon className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2">
                                                {benefit.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Job Openings */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            募集職種
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            現在募集中のポジションです。
                            ご興味のある職種がありましたら、お気軽にお問い合わせください。
                        </p>
                    </div>

                    <div className="space-y-6 max-w-4xl mx-auto">
                        {jobOpenings.map((job, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow relative"
                            >
                                {job.urgent && (
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                            急募
                                        </span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {job.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {job.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {job.skills.map(
                                                (skill, skillIndex) => (
                                                    <span
                                                        key={skillIndex}
                                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                                                    >
                                                        {skill}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <UserGroupIcon className="w-4 h-4" />
                                            <span>{job.type}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPinIcon className="w-4 h-4" />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CurrencyYenIcon className="w-4 h-4" />
                                            <span>{job.salary}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <AcademicCapIcon className="w-4 h-4" />
                                            <span>{job.experience}</span>
                                        </div>

                                        <button className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                            詳細を見る・応募
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Application Process */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            応募から入社まで
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            応募から入社までの流れをご説明します。
                            ご不明な点がありましたら、お気軽にお問い合わせください。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {[
                            {
                                step: "01",
                                title: "書類選考",
                                description:
                                    "履歴書・職務経歴書・ポートフォリオ（該当者）の審査",
                                duration: "1週間",
                            },
                            {
                                step: "02",
                                title: "一次面接",
                                description:
                                    "オンライン面接・技術的な質問・人物面の確認",
                                duration: "1時間",
                            },
                            {
                                step: "03",
                                title: "最終面接",
                                description: "代表面接・条件面談・入社意思確認",
                                duration: "1時間",
                            },
                            {
                                step: "04",
                                title: "内定・入社",
                                description:
                                    "条件通知・入社手続き・オンボーディング",
                                duration: "応相談",
                            },
                        ].map((process, index) => (
                            <div key={index} className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white font-bold rounded-full mb-4">
                                    {process.step}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">
                                    {process.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    {process.description}
                                </p>
                                <p className="text-xs text-blue-600 font-medium">
                                    {process.duration}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        一緒に成長しませんか？
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Smart Sproutsで新しいキャリアをスタートしませんか？
                        まずはカジュアル面談からお気軽にどうぞ。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            エントリー・問い合わせ
                        </a>
                        <a
                            href="mailto:careers@smartsprouts.com"
                            className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            careers@smartsprouts.com
                        </a>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
