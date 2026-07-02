import React, { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
// Icons
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
// Contract Components
import ContractForm from "./_components/Form";

export default function Create({
    projects,
    users,
    companies,
    quotes,
    statuses,
    quote = null,
    requirementStatus = null,
}) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        status: "draft",
        type: "one_time",
        description: "",
        user_id: "",
        company_id: "",
        project_id: "",
        quote_id: quote?.id || "",
        amount: "",
        tax_rate: "10",
        start_date: "",
        end_date: "",
        auto_renewal: false,
        renewal_notice_days: "30",
        payment_terms: "",
        terms_and_conditions: "",
        notes: "",
    });

    // Quote情報から自動入力
    useEffect(() => {
        if (quote) {
            setData((prev) => ({
                ...prev,
                quote_id: quote.id,
                title: quote.title || "",
                user_id: quote.user_id || "",
                company_id: quote.company_id || "",
                amount: quote.total_amount || "",
                tax_rate: quote.tax_rate?.toString() || "10",
                description: quote.requirements || "",
                notes: `見積もり: ${quote.quote_number}\n${quote.custom_specifications ? `カスタム仕様: ${typeof quote.custom_specifications === "string" ? quote.custom_specifications : JSON.stringify(quote.custom_specifications)}` : ""}`,
            }));
        }
    }, [quote]);

    const submit = () => {
        post(route("admin.contract.store"));
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contract.index"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "契約一覧", href: route("admin.contract.index") },
        { label: "新規作成", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="契約新規作成"
                    description="新しい契約を作成します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="契約新規作成" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            {/* クライアント情報の詳細チェック */}
            {quote && (
                <div className="max-w-7xl mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>📋 クライアント情報と必要条件</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* ユーザー情報 */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold text-sm mb-3">
                                        👤 ユーザー情報
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            {quote.user ? (
                                                <>
                                                    <span className="text-green-600 font-bold">
                                                        ✓
                                                    </span>
                                                    <div>
                                                        <p className="font-medium">
                                                            {quote.user?.email}
                                                        </p>
                                                        {quote.user
                                                            ?.profile && (
                                                            <p className="text-gray-600">
                                                                {
                                                                    quote.user
                                                                        .profile
                                                                        .first_name
                                                                }{" "}
                                                                {
                                                                    quote.user
                                                                        .profile
                                                                        .last_name
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-red-600 font-bold">
                                                        ✗
                                                    </span>
                                                    <span className="text-red-600">
                                                        ユーザーが選択されていません
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 連絡先情報 */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold text-sm mb-3">
                                        📞 連絡先情報
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            {quote.user?.profile?.phone ||
                                            quote.user?.profile?.mobile ? (
                                                <>
                                                    <span className="text-green-600 font-bold">
                                                        ✓
                                                    </span>
                                                    <div>
                                                        <p className="font-medium">
                                                            {quote.user.profile
                                                                .phone ||
                                                                quote.user
                                                                    .profile
                                                                    .mobile}
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-red-600 font-bold">
                                                        ✗
                                                    </span>
                                                    <span className="text-red-600">
                                                        連絡先が登録されていません
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 会社情報 */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold text-sm mb-3">
                                        🏢 会社情報
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            {quote.company ? (
                                                <>
                                                    <span className="text-green-600 font-bold">
                                                        ✓
                                                    </span>
                                                    <div>
                                                        <p className="font-medium">
                                                            {quote.company.name}
                                                        </p>
                                                        {quote.company
                                                            .legal_name &&
                                                            quote.company
                                                                .legal_name !==
                                                                quote.company
                                                                    .name && (
                                                                <p className="text-gray-600 text-xs">
                                                                    {
                                                                        quote
                                                                            .company
                                                                            .legal_name
                                                                    }
                                                                </p>
                                                            )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-red-600 font-bold">
                                                        ✗
                                                    </span>
                                                    <span className="text-red-600">
                                                        会社が選択されていません
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 会社住所情報 */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold text-sm mb-3">
                                        📍 会社住所
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            {quote.company?.addresses &&
                                            quote.company.addresses.length >
                                                0 ? (
                                                <>
                                                    <span className="text-green-600 font-bold">
                                                        ✓
                                                    </span>
                                                    <div>
                                                        {quote.company.addresses.map(
                                                            (addr, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="text-gray-600"
                                                                >
                                                                    <p className="font-medium">
                                                                        {
                                                                            addr.postal_code
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        {
                                                                            addr.prefecture
                                                                        }
                                                                        {
                                                                            addr.city
                                                                        }
                                                                        {
                                                                            addr.address_line1
                                                                        }
                                                                    </p>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-red-600 font-bold">
                                                        ✗
                                                    </span>
                                                    <span className="text-red-600">
                                                        会社の住所が登録されていません
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* 必要情報チェック結果 */}
            {requirementStatus && !requirementStatus.can_send && (
                <div className="max-w-7xl mb-6">
                    <Card className="border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
                        <CardBody>
                            <div className="flex gap-4">
                                <ExclamationCircleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                                        契約書送信前に確認が必要です
                                    </h3>
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                                        以下の情報が不足しています:
                                    </p>
                                    <ul className="space-y-1">
                                        {requirementStatus.errors.map(
                                            (error, idx) => (
                                                <li
                                                    key={idx}
                                                    className="text-sm text-yellow-700 dark:text-yellow-300 flex items-start gap-2"
                                                >
                                                    <span className="text-yellow-600 dark:text-yellow-400 mt-1">
                                                        •
                                                    </span>
                                                    <span>{error}</span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-3">
                                        ドラフトとして保存はできますが、これらの情報を完成させることで契約書を送信できます。
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* 必要情報が揃っている場合 */}
            {requirementStatus && requirementStatus.can_send && (
                <div className="max-w-7xl mb-6">
                    <Card className="border-l-4 border-green-400 bg-green-50 dark:bg-green-900/20">
                        <CardBody>
                            <div className="flex gap-4">
                                <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-green-900 dark:text-green-100">
                                        ✓ 契約書を送信できる状態です
                                    </h3>
                                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                        すべての必須情報が揃っています。
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}

            <div className="max-w-7xl">
                <ContractForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.contract.index")}
                    isEdit={false}
                    projects={projects}
                    users={users}
                    companies={companies}
                    quotes={quotes}
                    requirementStatus={requirementStatus}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
