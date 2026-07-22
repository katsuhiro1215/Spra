import React, { useEffect, useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PageConfig } from "@/Constants/PageConfig";
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import ContractForm from "./_components/Form";

export default function Create({
    users,
    companies,
    statuses,
    types,
    quotes = [],
    quote = null,
    fromQuote = false,
    fromQuoteResponse = false,
    quoteResponse = null,
    requirementStatus = null,
}) {
    const [selectedQuoteId, setSelectedQuoteId] = useState(quote?.id || "");

    // Helper functions to get company information from quote or user
    const getCompanyFromQuoteOrUser = () => {
        if (fromQuoteResponse) {
            return (
                quoteResponse?.company || quoteResponse?.user?.companies?.[0]
            );
        }
        return quote?.company || quote?.user?.companies?.[0];
    };

    const getUserCompany = () => {
        return fromQuoteResponse
            ? quoteResponse?.user?.companies?.[0]
            : quote?.user?.companies?.[0];
    };

    const handleQuoteSelect = (e) => {
        const quoteId = e.target.value;
        setSelectedQuoteId(quoteId);
        if (quoteId) {
            router.visit(route("admin.contract.create", { quote_id: quoteId }));
        }
    };

    const { data, setData, post, processing, errors, transform } = useForm({
        title: "",
        status: "draft",
        type: "one_time",
        description: "",
        user_id: quote?.user_id || "",
        company_id: quote?.company_id || quote?.user?.companies?.[0]?.id || "",
        quote_id: quote?.id || "",
        base_amount: "",
        discount_amount: "",
        tax_rate: "10",
        tax_amount: "",
        total_amount: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        auto_renewal: false,
        billing_day: 10,
        payment_due_days: 15,
        auto_invoice_generation: true,
        terms_and_conditions: "",
        special_provisions: "",
        notes: "",
        items: [],
    });

    // Quote情報から自動入力
    useEffect(() => {
        let sourceQuote = quote;
        let sourceUser = quote?.user;

        // QuoteResponseから遷移した場合
        if (fromQuoteResponse && quoteResponse?.quote) {
            sourceQuote = quoteResponse.quote;
            sourceUser = quoteResponse.user;
        }

        if (sourceQuote && sourceQuote.current_version) {
            const cv = sourceQuote.current_version;

            // クライアント情報の詳細チェックと同じロジックで会社を取得
            const company = sourceQuote.company ?? sourceUser?.companies?.[0];

            const newData = {
                ...data,
                quote_id: sourceQuote.id,
                title: cv.title || "",
                user_id: sourceUser?.id || "",
                company_id: company?.id || "",
                description: cv.requirements || "",
                base_amount: cv.base_amount?.toString() || "",
                discount_amount: cv.discount_amount?.toString() || "",
                tax_rate: cv.tax_rate?.toString() || "10",
                tax_amount: cv.tax_amount?.toString() || "",
                total_amount: cv.total_amount?.toString() || "",
                items:
                    cv.items?.map((item) => ({
                        service_id: item.service_id,
                        service_item_id: item.service_item_id,
                        name: item.name,
                        description: item.description,
                        item_type: item.item_type,
                        billing_type: item.billing_type,
                        quantity: parseFloat(item.quantity),
                        unit_price: parseFloat(item.unit_price),
                        estimated_days: item.estimated_days,
                        sort_order: item.sort_order,
                    })) || [],
            };
            setData(newData);
        }
    }, [quote, quoteResponse]);

    const submit = () => {
        post(route("admin.contract.store"));
    };

    const handleDraftSave = () => {
        // setData の直後に post すると React の state 更新が非同期のため
        // 古い data が送信されてしまう。transform で送信直前に status を
        // 上書きすることで確実に 'draft' として送信する。
        transform((currentData) => ({ ...currentData, status: "draft" }));
        submit();
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.contracts.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contract.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.contracts.breadcrumbs,
        PageConfig.contracts.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.contracts.pages.create.title}
                    description={PageConfig.contracts.pages.create.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.contracts.pages.create.title} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full space-y-6">
                {/* 見積選択セクション - QuoteResponse 経由の場合は非表示 */}
                {!fromQuoteResponse && (
                    <Card>
                        <CardHeader>
                            <CardTitle>見積書を選択</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="max-w-md">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    見積書
                                    {!quote && (
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    )}
                                </label>
                                <select
                                    value={selectedQuoteId}
                                    onChange={handleQuoteSelect}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">選択してください</option>
                                    {quotes.map((q) => (
                                        <option key={q.id} value={q.id}>
                                            {q.quote_number} - {q.title} (
                                            {q.status})
                                        </option>
                                    ))}
                                </select>
                                {!quote && (
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        見積書を選択すると、クライアント情報が自動入力されます
                                    </p>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                )}
                {/* QuoteResponse 経由の表示 */}
                {fromQuoteResponse && quoteResponse && (
                    <Card>
                        <CardHeader>
                            <CardTitle>📌 見積返信から遷移しました</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                見積番号: {quoteResponse.quote?.quote_number} -{" "}
                                {quoteResponse.quote?.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                ユーザー情報は自動取得されています。下記のクライアント情報が揃っていることを確認してください。
                            </p>
                        </CardBody>
                    </Card>
                )}
                {/* クライアント情報の詳細チェック */}
                {quote && (
                    <Card
                        className={
                            fromQuoteResponse
                                ? "border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                : ""
                        }
                    >
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-100">
                                📋 クライアント情報と必要条件
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* ユーザー情報 */}
                                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                                    <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">
                                        👤 ユーザー情報
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            {(
                                                fromQuoteResponse
                                                    ? quoteResponse?.user
                                                    : quote.user
                                            ) ? (
                                                <>
                                                    <span className="text-green-600 dark:text-green-400 font-bold">
                                                        ✓
                                                    </span>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                                            {
                                                                (fromQuoteResponse
                                                                    ? quoteResponse?.user
                                                                    : quote.user
                                                                )?.email
                                                            }
                                                        </p>
                                                        {(fromQuoteResponse
                                                            ? quoteResponse?.user
                                                            : quote.user
                                                        )?.profile && (
                                                            <p className="text-gray-600 dark:text-gray-400">
                                                                {
                                                                    (fromQuoteResponse
                                                                        ? quoteResponse?.user
                                                                        : quote.user
                                                                    ).profile
                                                                        .first_name
                                                                }{" "}
                                                                {
                                                                    (fromQuoteResponse
                                                                        ? quoteResponse?.user
                                                                        : quote.user
                                                                    ).profile
                                                                        .last_name
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-red-600 dark:text-red-400 font-bold">
                                                        ✗
                                                    </span>
                                                    <span className="text-red-600 dark:text-red-400">
                                                        ユーザーが選択されていません
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 連絡先情報 */}
                                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                                    <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">
                                        📞 連絡先情報
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            {(fromQuoteResponse
                                                ? quoteResponse?.user
                                                : quote.user
                                            )?.profile?.phone ||
                                            (fromQuoteResponse
                                                ? quoteResponse?.user
                                                : quote.user
                                            )?.profile?.mobile ? (
                                                <>
                                                    <span className="text-green-600 dark:text-green-400 font-bold">
                                                        ✓
                                                    </span>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                                            {(fromQuoteResponse
                                                                ? quoteResponse?.user
                                                                : quote.user
                                                            ).profile.phone ||
                                                                (fromQuoteResponse
                                                                    ? quoteResponse?.user
                                                                    : quote.user
                                                                ).profile
                                                                    .mobile}
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-red-600 dark:text-red-400 font-bold">
                                                        ✗
                                                    </span>
                                                    <span className="text-red-600 dark:text-red-400">
                                                        連絡先が登録されていません
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 会社情報 */}
                                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                                    <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">
                                        🏢 会社情報
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            {getCompanyFromQuoteOrUser() ? (
                                                <>
                                                    <span className="text-green-600 dark:text-green-400 font-bold">
                                                        ✓
                                                    </span>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                                            {
                                                                getCompanyFromQuoteOrUser()
                                                                    .name
                                                            }
                                                        </p>
                                                        {getCompanyFromQuoteOrUser()
                                                            .legal_name &&
                                                            getCompanyFromQuoteOrUser()
                                                                .legal_name !==
                                                                getCompanyFromQuoteOrUser()
                                                                    .name && (
                                                                <p className="text-gray-600 dark:text-gray-400 text-xs">
                                                                    {
                                                                        getCompanyFromQuoteOrUser()
                                                                            .legal_name
                                                                    }
                                                                </p>
                                                            )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-red-600 dark:text-red-400 font-bold">
                                                        ✗
                                                    </span>
                                                    <span className="text-red-600 dark:text-red-400">
                                                        会社が選択されていません
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 会社住所情報 */}
                                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                                    <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">
                                        📍 会社住所
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            {getCompanyFromQuoteOrUser()
                                                ?.addresses &&
                                            getCompanyFromQuoteOrUser()
                                                .addresses.length > 0 ? (
                                                <>
                                                    <span className="text-green-600 dark:text-green-400 font-bold">
                                                        ✓
                                                    </span>
                                                    <div>
                                                        {getCompanyFromQuoteOrUser().addresses.map(
                                                            (addr, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="text-gray-600 dark:text-gray-400"
                                                                >
                                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
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
                                                                        {addr.district &&
                                                                            ` ${addr.district}`}
                                                                        {addr.address_other &&
                                                                            ` ${addr.address_other}`}
                                                                    </p>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-red-600 dark:text-red-400 font-bold">
                                                        ✗
                                                    </span>
                                                    <span className="text-red-600 dark:text-red-400">
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
                )}
                {/* 必要情報チェック結果 */}
                {quote && requirementStatus && !requirementStatus.can_send && (
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
                )}
                {/* 必要情報が揃っている場合 */}
                {quote && requirementStatus && requirementStatus.can_send && (
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
                )}
                <ContractForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    onDraftSave={handleDraftSave}
                    cancelRoute={route("admin.contract.index")}
                    isEdit={false}
                    users={users}
                    companies={companies}
                    quotes={quotes}
                    requirementStatus={requirementStatus}
                    fromQuoteResponse={fromQuoteResponse}
                    quote={quote}
                    quoteResponse={quoteResponse}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
