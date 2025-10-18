import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import AddressList from "@/Components/AddressManager/AddressList";
import {
    ArrowLeftIcon,
    PencilIcon,
    BuildingOfficeIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    CalendarIcon,
    CurrencyYenIcon,
    UsersIcon,
    DocumentTextIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";

const Show = ({ company, users = [] }) => {
    const companyTypeLabels = {
        individual: "個人事業主",
        corporate: "法人",
    };

    const statusLabels = {
        active: "アクティブ",
        inactive: "非アクティブ",
        suspended: "停止中",
    };

    const getStatusColor = (status) => {
        const colors = {
            active: "bg-green-100 text-green-800",
            inactive: "bg-gray-100 text-gray-800",
            suspended: "bg-red-100 text-red-800",
        };
        return colors[status] || colors.inactive;
    };

    const formatCurrency = (amount) => {
        if (!amount) return null;
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatAddress = (company) => {
        const parts = [];
        if (company.postal_code) parts.push(`〒${company.postal_code}`);
        if (company.prefecture) parts.push(company.prefecture);
        if (company.city) parts.push(company.city);
        if (company.district) parts.push(company.district);
        if (company.address_other) parts.push(company.address_other);
        return parts.join(" ");
    };

    const isIndividual = company.company_type === "individual";

    return (
        <AdminLayout>
            <Head title={`${company.name} - 企業詳細`} />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.history.back()}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {company.name}
                                </h1>
                                <span
                                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                                        company.status
                                    )}`}
                                >
                                    {statusLabels[company.status]}
                                </span>
                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                                    {companyTypeLabels[company.company_type]}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                企業詳細情報
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route("admin.companies.edit", company.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <PencilIcon className="h-4 w-4" />
                        編集
                    </Link>
                </div>

                {/* 基本情報 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                        <h2 className="text-lg font-medium text-gray-900">
                            基本情報
                        </h2>
                    </div>

                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                企業名
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {company.name}
                            </dd>
                        </div>

                        {company.legal_name && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    法人正式名称
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {company.legal_name}
                                </dd>
                            </div>
                        )}

                        {company.registration_number && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    法人番号
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {company.registration_number}
                                </dd>
                            </div>
                        )}

                        {company.tax_number && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    税務番号
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {company.tax_number}
                                </dd>
                            </div>
                        )}

                        {company.industry && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    業界
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {company.industry}
                                </dd>
                            </div>
                        )}

                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                ステータス
                            </dt>
                            <dd className="mt-1">
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                        company.status
                                    )}`}
                                >
                                    {statusLabels[company.status]}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* 住所情報 */}
                {formatAddress(company) && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <MapPinIcon className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-medium text-gray-900">
                                本社住所
                            </h2>
                        </div>

                        <div className="text-sm text-gray-900">
                            {formatAddress(company)}
                        </div>
                    </div>
                )}

                {/* 連絡先情報 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">
                        連絡先情報
                    </h2>

                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {company.phone && (
                            <div className="flex items-center gap-3">
                                <PhoneIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        電話番号
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {company.phone}
                                    </dd>
                                </div>
                            </div>
                        )}

                        {company.fax && (
                            <div className="flex items-center gap-3">
                                <PhoneIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        FAX番号
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {company.fax}
                                    </dd>
                                </div>
                            </div>
                        )}

                        {company.email && (
                            <div className="flex items-center gap-3">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        メールアドレス
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        <a
                                            href={`mailto:${company.email}`}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {company.email}
                                        </a>
                                    </dd>
                                </div>
                            </div>
                        )}

                        {company.website && (
                            <div className="flex items-center gap-3">
                                <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        ウェブサイト
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        <a
                                            href={company.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {company.website}
                                        </a>
                                    </dd>
                                </div>
                            </div>
                        )}
                    </dl>
                </div>

                {/* 代表者情報 */}
                {(company.representative_name ||
                    company.representative_email ||
                    company.representative_phone) && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-medium text-gray-900">
                                代表者情報
                            </h2>
                        </div>

                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {company.representative_name && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        代表者名
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {company.representative_name}
                                    </dd>
                                </div>
                            )}

                            {company.representative_title && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        役職
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {company.representative_title}
                                    </dd>
                                </div>
                            )}

                            {company.representative_email && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        代表者メール
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        <a
                                            href={`mailto:${company.representative_email}`}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {company.representative_email}
                                        </a>
                                    </dd>
                                </div>
                            )}

                            {company.representative_phone && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        代表者電話
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {company.representative_phone}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                )}

                {/* ビジネス情報 */}
                {!isIndividual && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-6">
                            ビジネス情報
                        </h2>

                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {company.employee_count && (
                                <div className="flex items-center gap-3">
                                    <UsersIcon className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            従業員数
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {company.employee_count.toLocaleString()}
                                            名
                                        </dd>
                                    </div>
                                </div>
                            )}

                            {company.capital && (
                                <div className="flex items-center gap-3">
                                    <CurrencyYenIcon className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            資本金
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {formatCurrency(company.capital)}
                                        </dd>
                                    </div>
                                </div>
                            )}

                            {company.established_date && (
                                <div className="flex items-center gap-3">
                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            設立日
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {formatDate(
                                                company.established_date
                                            )}
                                        </dd>
                                    </div>
                                </div>
                            )}

                            {company.business_description && (
                                <div className="md:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500 mb-2">
                                        事業内容
                                    </dt>
                                    <dd className="text-sm text-gray-900 bg-gray-50 rounded-md p-3">
                                        {company.business_description}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                )}

                {/* 追加住所 */}
                {company.addresses && company.addresses.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-6">
                            追加住所（支店・営業所等）
                        </h2>
                        <AddressList
                            addresses={company.addresses}
                            showActions={false}
                        />
                    </div>
                )}

                {/* 関連ユーザー */}
                {users && users.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-6">
                            関連ユーザー ({users.length}名)
                        </h2>

                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ユーザー名
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            メール
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            部署
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            役職
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ステータス
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {user.department || "-"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {user.position || "-"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        user.status === "active"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {user.status === "active"
                                                        ? "アクティブ"
                                                        : "非アクティブ"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* メモ */}
                {company.notes && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-medium text-gray-900">
                                メモ
                            </h2>
                        </div>
                        <div className="text-sm text-gray-900 bg-gray-50 rounded-md p-4">
                            {company.notes}
                        </div>
                    </div>
                )}

                {/* システム情報 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">
                        システム情報
                    </h2>

                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <dt className="font-medium text-gray-500">
                                登録日
                            </dt>
                            <dd className="mt-1 text-gray-900">
                                {formatDate(company.created_at)}
                            </dd>
                        </div>

                        <div>
                            <dt className="font-medium text-gray-500">
                                最終更新
                            </dt>
                            <dd className="mt-1 text-gray-900">
                                {formatDate(company.updated_at)}
                            </dd>
                        </div>

                        <div>
                            <dt className="font-medium text-gray-500">
                                企業ID
                            </dt>
                            <dd className="mt-1 text-gray-900 font-mono">
                                {company.id}
                            </dd>
                        </div>

                        {company.metadata && (
                            <div className="md:col-span-2">
                                <dt className="font-medium text-gray-500">
                                    メタデータ
                                </dt>
                                <dd className="mt-1 text-gray-900">
                                    <pre className="bg-gray-50 rounded p-2 text-xs overflow-auto">
                                        {JSON.stringify(
                                            company.metadata,
                                            null,
                                            2
                                        )}
                                    </pre>
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Show;
