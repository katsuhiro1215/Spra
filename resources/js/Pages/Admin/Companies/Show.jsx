import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { FlashMessage } from "@/Components/Notifications";
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
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import { getStatusBadge } from "@/Constants/Badges";

export default function Show({ company, addressTypes }) {
    const companyTypeLabels = {
        individual: "個人事業主",
        corporate: "法人",
    };

    const addressTypeLabels = addressTypes || {};

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

    const formatFullAddress = (address) => {
        const parts = [];
        if (address.postal_code) parts.push(`〒${address.postal_code}`);
        if (address.prefecture) parts.push(address.prefecture);
        if (address.city) parts.push(address.city);
        if (address.district) parts.push(address.district);
        if (address.address_other) parts.push(address.address_other);
        return parts.join(" ");
    };

    const handleDeleteAddress = (addressId) => {
        if (confirm("この住所を削除してもよろしいですか?")) {
            router.delete(
                route("admin.company.address.destroy", [company.id, addressId]),
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const isIndividual = company.company_type === "individual";

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.companies.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.company.index"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "企業管理", href: route("admin.company.index") },
        { label: "詳細", href: route("admin.company.show", company.id) },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.companies.title}
                    description={PageConfig.companies.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`${company.name} - 企業詳細`} />

            <FlashMessage />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {company.name}
                        </h1>
                        <Badge {...getStatusBadge(company.status)} />
                        <Badge
                            text={companyTypeLabels[company.company_type]}
                            variant="info"
                        />
                    </div>

                    <SecondaryButton
                        href={route("admin.company.edit", company.id)}
                        icon={PencilIcon}
                    >
                        編集
                    </SecondaryButton>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* 基本情報 */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <BuildingOfficeIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                    <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                        基本情報
                                    </h2>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            企業名
                                        </dt>
                                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                            {company.name}
                                        </dd>
                                    </div>

                                    {company.legal_name && (
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                正式名称
                                            </dt>
                                            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                {company.legal_name}
                                            </dd>
                                        </div>
                                    )}

                                    {company.registration_number && (
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                {isIndividual
                                                    ? "個人番号"
                                                    : "法人番号"}
                                            </dt>
                                            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                {company.registration_number}
                                            </dd>
                                        </div>
                                    )}

                                    {company.tax_number && (
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                税番号
                                            </dt>
                                            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                {company.tax_number}
                                            </dd>
                                        </div>
                                    )}

                                    {company.industry && (
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                業界
                                            </dt>
                                            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                {company.industry}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </CardBody>
                        </Card>

                        {/* 連絡先情報 */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                    連絡先情報
                                </h2>
                            </CardHeader>
                            <CardBody>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {company.phone && (
                                        <div className="flex items-start gap-3">
                                            <PhoneIcon className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    電話番号
                                                </dt>
                                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                    {company.phone}
                                                </dd>
                                            </div>
                                        </div>
                                    )}

                                    {company.fax && (
                                        <div className="flex items-start gap-3">
                                            <PhoneIcon className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    FAX番号
                                                </dt>
                                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                    {company.fax}
                                                </dd>
                                            </div>
                                        </div>
                                    )}

                                    {company.email && (
                                        <div className="flex items-start gap-3">
                                            <EnvelopeIcon className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    メールアドレス
                                                </dt>
                                                <dd className="mt-1 text-sm">
                                                    <a
                                                        href={`mailto:${company.email}`}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                    >
                                                        {company.email}
                                                    </a>
                                                </dd>
                                            </div>
                                        </div>
                                    )}

                                    {company.website && (
                                        <div className="flex items-start gap-3">
                                            <GlobeAltIcon className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    ウェブサイト
                                                </dt>
                                                <dd className="mt-1 text-sm">
                                                    <a
                                                        href={company.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                    >
                                                        {company.website}
                                                    </a>
                                                </dd>
                                            </div>
                                        </div>
                                    )}
                                </dl>
                            </CardBody>
                        </Card>

                        {/* 代表者情報 */}
                        {(company.representative_name ||
                            company.representative_email ||
                            company.representative_phone) && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                            代表者情報
                                        </h2>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {company.representative_name && (
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    代表者名
                                                </dt>
                                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                    {
                                                        company.representative_name
                                                    }
                                                    {company.representative_title && (
                                                        <span className="ml-2 text-slate-500 dark:text-slate-400">
                                                            (
                                                            {
                                                                company.representative_title
                                                            }
                                                            )
                                                        </span>
                                                    )}
                                                </dd>
                                            </div>
                                        )}

                                        {company.representative_email && (
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    メールアドレス
                                                </dt>
                                                <dd className="mt-1 text-sm">
                                                    <a
                                                        href={`mailto:${company.representative_email}`}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                    >
                                                        {
                                                            company.representative_email
                                                        }
                                                    </a>
                                                </dd>
                                            </div>
                                        )}

                                        {company.representative_phone && (
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    電話番号
                                                </dt>
                                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                    {
                                                        company.representative_phone
                                                    }
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </CardBody>
                            </Card>
                        )}

                        {/* 住所一覧 */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPinIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                            住所情報
                                        </h2>
                                    </div>
                                    <Link
                                        href={route(
                                            "admin.company.address.create",
                                            company.id,
                                        )}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                        title="住所を追加"
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                        追加
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardBody>
                                {company.addresses &&
                                company.addresses.length > 0 ? (
                                    <div className="space-y-4">
                                        {company.addresses.map((address) => (
                                            <div
                                                key={address.id}
                                                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {address.label && (
                                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                                    {
                                                                        address.label
                                                                    }
                                                                </span>
                                                            )}
                                                            <Badge
                                                                text={
                                                                    addressTypeLabels[
                                                                        address
                                                                            .type
                                                                    ] ||
                                                                    address.type
                                                                }
                                                                variant="neutral"
                                                                size="sm"
                                                            />
                                                            {address.is_default && (
                                                                <Badge
                                                                    text="デフォルト"
                                                                    variant="info"
                                                                    size="sm"
                                                                />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                                            {formatFullAddress(
                                                                address,
                                                            )}
                                                        </p>
                                                        {address.phone && (
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                                TEL:{" "}
                                                                {address.phone}
                                                            </p>
                                                        )}
                                                        {address.contact_person && (
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                                担当:{" "}
                                                                {
                                                                    address.contact_person
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.company.address.edit",
                                                                [
                                                                    company.id,
                                                                    address.id,
                                                                ],
                                                            )}
                                                            className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                                            title="編集"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteAddress(
                                                                    address.id,
                                                                )
                                                            }
                                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            title="削除"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        登録されている住所はありません
                                    </p>
                                )}
                            </CardBody>
                        </Card>

                        {/* 事業情報 */}
                        {(company.business_description ||
                            company.employee_count ||
                            company.capital ||
                            company.established_date) && (
                            <Card>
                                <CardHeader>
                                    <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                        事業情報
                                    </h2>
                                </CardHeader>
                                <CardBody>
                                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {company.employee_count && (
                                            <div className="flex items-start gap-3">
                                                <UsersIcon className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                                                <div>
                                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        従業員数
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                        {company.employee_count}
                                                        人
                                                    </dd>
                                                </div>
                                            </div>
                                        )}

                                        {company.capital && (
                                            <div className="flex items-start gap-3">
                                                <CurrencyYenIcon className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                                                <div>
                                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        資本金
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                        {formatCurrency(
                                                            company.capital,
                                                        )}
                                                    </dd>
                                                </div>
                                            </div>
                                        )}

                                        {company.established_date && (
                                            <div className="flex items-start gap-3">
                                                <CalendarIcon className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                                                <div>
                                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        設立日
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                        {formatDate(
                                                            company.established_date,
                                                        )}
                                                    </dd>
                                                </div>
                                            </div>
                                        )}

                                        {company.business_description && (
                                            <div className="md:col-span-2">
                                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                                    事業内容
                                                </dt>
                                                <dd className="text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                                                    {
                                                        company.business_description
                                                    }
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </CardBody>
                            </Card>
                        )}

                        {/* 備考 */}
                        {company.notes && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <DocumentTextIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                            備考
                                        </h2>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                        {company.notes}
                                    </p>
                                </CardBody>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* アクション */}
                        <Card>
                            <CardBody>
                                <div className="space-y-3">
                                    <SecondaryButton
                                        href={route(
                                            "admin.company.edit",
                                            company.id,
                                        )}
                                        icon={PencilIcon}
                                        className="w-full"
                                    >
                                        編集
                                    </SecondaryButton>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
