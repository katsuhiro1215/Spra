import { Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import {
    MapPinIcon,
    PhoneIcon,
} from "@heroicons/react/24/outline";

export default function Company({ auth }) {
    const breadcrumbs = [{ label: "会社情報" }];

    const companyInfo = {
        name: "株式会社Smart Sprouts",
        nameEn: "Smart Sprouts Inc.",
        established: "2020年4月1日",
        capital: "1,000万円",
        ceo: "山田 太郎",
        employees: "30名",
        business: [
            "Webサイト・アプリケーション開発",
            "システム開発・保守運用",
            "ITコンサルティング",
            "AI技術導入支援",
        ],
        address: "〒100-0001 東京都千代田区千代田1-1-1",
        phone: "03-1234-5678",
        email: "info@smartsprouts.com",
        hours: "平日 9:00-18:00（土日祝休業）",
    };

    const history = [
        { year: "2020年", event: "株式会社Smart Sprouts設立" },
        { year: "2021年", event: "従業員数10名突破、大阪支社設立" },
        { year: "2022年", event: "大手企業との協業プロジェクト開始" },
        { year: "2023年", event: "AI技術導入サービス開始、従業員数20名突破" },
        { year: "2024年", event: "海外展開スタート、従業員数30名突破、資本金増資" },
    ];

    return (
        <PublicLayout auth={auth}>
            <PageHero
                title="Company"
                subtitle="会社情報"
                breadcrumbs={breadcrumbs}
            />

            {/* 会社概要 */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                会社概要
                            </h2>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <table className="w-full">
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700 w-1/3">
                                            会社名
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            {companyInfo.name}
                                            <br />
                                            <span className="text-sm text-gray-600">
                                                {companyInfo.nameEn}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                            設立
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            {companyInfo.established}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                            資本金
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            {companyInfo.capital}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                            代表取締役
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            {companyInfo.ceo}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                            従業員数
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            {companyInfo.employees}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                            事業内容
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            <ul className="space-y-1">
                                                {companyInfo.business.map(
                                                    (item, index) => (
                                                        <li key={index}>
                                                            ・{item}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                            本社所在地
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            {companyInfo.address}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                            電話
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            {companyInfo.phone}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                            メール
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            <a
                                                href={`mailto:${companyInfo.email}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {companyInfo.email}
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                            営業時間
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            {companyInfo.hours}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* 沿革 */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            沿革
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600"></div>

                            {history.map((item, index) => (
                                <div
                                    key={index}
                                    className="relative pl-20 pb-12 last:pb-0"
                                >
                                    <div className="absolute left-6 top-2 w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white shadow-lg"></div>

                                    <div className="bg-white p-6 rounded-xl shadow-md">
                                        <span className="inline-block px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-full mb-3">
                                            {item.year}
                                        </span>
                                        <p className="text-gray-700 font-medium">
                                            {item.event}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
