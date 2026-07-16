import { Head, Link, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import { formatAddress, formatPostalCode } from "@/Utils/address";

const formatHistoryYear = (dateString) => {
    if (!dateString) return "";
    return `${new Date(dateString).getFullYear()}年`;
};

const formatEstablishedDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

export default function Company({ auth, histories = [] }) {
    const { props } = usePage();
    const organization = props.organization;
    const address = organization?.default_address?.[0];

    const breadcrumbs = [{ label: "会社情報" }];

    const companyInfo = {
        name: organization?.name,
        nameEn: organization?.name_en,
        established: formatEstablishedDate(organization?.established_date),
        capital: organization?.capital,
        ceo: organization?.representative_name,
        employees: organization?.employee_count
            ? `${organization.employee_count}名`
            : null,
        business: (organization?.business_description || "")
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        postalCode: formatPostalCode(address?.postal_code),
        address: formatAddress(address),
        phone: organization?.phone,
        email: organization?.email,
        hours: organization?.business_hours,
    };

    const siteName = organization?.site_name || organization?.name;

    return (
        <PublicLayout auth={auth}>
            <Head title={`会社情報 | ${siteName || ""}`}>
                <meta
                    name="description"
                    content={`${siteName || ""}の会社概要・沿革をご紹介します。`}
                />
            </Head>
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
                                    {companyInfo.name && (
                                        <tr>
                                            <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700 w-1/3">
                                                会社名
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">
                                                {companyInfo.name}
                                                {companyInfo.nameEn && (
                                                    <>
                                                        <br />
                                                        <span className="text-sm text-gray-600">
                                                            {
                                                                companyInfo.nameEn
                                                            }
                                                        </span>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {companyInfo.established && (
                                        <tr>
                                            <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                                設立
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">
                                                {companyInfo.established}
                                            </td>
                                        </tr>
                                    )}
                                    {companyInfo.capital && (
                                        <tr>
                                            <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                                資本金
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">
                                                {companyInfo.capital}
                                            </td>
                                        </tr>
                                    )}
                                    {companyInfo.ceo && (
                                        <tr>
                                            <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                                代表取締役
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">
                                                {companyInfo.ceo}
                                            </td>
                                        </tr>
                                    )}
                                    {companyInfo.employees && (
                                        <tr>
                                            <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                                従業員数
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">
                                                {companyInfo.employees}
                                            </td>
                                        </tr>
                                    )}
                                    {companyInfo.business.length > 0 && (
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
                                                        ),
                                                    )}
                                                </ul>
                                            </td>
                                        </tr>
                                    )}
                                    {companyInfo.address && (
                                        <tr>
                                            <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                                本社所在地
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">
                                                {companyInfo.postalCode &&
                                                    `〒${companyInfo.postalCode} `}
                                                {companyInfo.address}
                                            </td>
                                        </tr>
                                    )}
                                    {companyInfo.phone && (
                                        <tr>
                                            <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                                電話
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">
                                                {companyInfo.phone}
                                            </td>
                                        </tr>
                                    )}
                                    {companyInfo.email && (
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
                                    )}
                                    {companyInfo.hours && (
                                        <tr>
                                            <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                                                営業時間
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">
                                                {companyInfo.hours}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* 沿革 */}
            {histories.length > 0 && (
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

                                {histories.map((item) => (
                                    <div
                                        key={item.id}
                                        className="relative pl-20 pb-12 last:pb-0"
                                    >
                                        <div className="absolute left-6 top-2 w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white shadow-lg"></div>

                                        <div className="bg-white p-6 rounded-xl shadow-md">
                                            <span className="inline-block px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-full mb-3">
                                                {formatHistoryYear(
                                                    item.event_date,
                                                )}
                                            </span>
                                            <p className="text-gray-700 font-medium">
                                                {item.title}
                                            </p>
                                            {item.description && (
                                                <p className="text-gray-500 text-sm mt-2">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
