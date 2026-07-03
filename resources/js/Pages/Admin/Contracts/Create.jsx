import React, { useEffect, useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
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
    services,
    quotes,
    statuses,
    quote = null,
    quoteResponse = null,
    fromQuoteResponse = false,
    requirementStatus = null,
}) {
    const [selectedQuoteId, setSelectedQuoteId] = useState(quote?.id || "");

    const handleQuoteSelect = (e) => {
        const quoteId = e.target.value;
        setSelectedQuoteId(quoteId);
        if (quoteId) {
            router.visit(route("admin.contract.create", { quote_id: quoteId }));
        }
    };

    const { data, setData, post, processing, errors } = useForm({
        title: "",
        status: "draft",
        type: "one_time",
        description: "",
        user_id: fromQuoteResponse
            ? quoteResponse?.user_id
            : quote?.user_id || "",
        company_id: fromQuoteResponse
            ? quoteResponse?.company_id
            : quote?.company_id || "",
        project_id: "",
        quote_id: quote?.id || "",
        quote_response_id: quoteResponse?.id || "",
        service_id: quote?.items?.[0]?.service_id || "",
        amount: "",
        tax_rate: "10",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        auto_renewal: false,
        renewal_notice_days: "30",
        payment_terms: "",
        terms_and_conditions: "",
        notes: "",
    });

    // Quote/QuoteResponse情報から自動入力
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];

        if (fromQuoteResponse && quoteResponse?.quote) {
            // QuoteResponse 経由の場合
            const q = quoteResponse.quote;
            setData({
                quote_response_id: quoteResponse.id,
                user_id: quoteResponse.user_id,
                company_id: quoteResponse.company_id,
                title: q.title || "",
                quote_id: q.id || "",
                service_id: q.items?.[0]?.service_id || "",
                amount: q.total_amount || "",
                tax_rate: q.tax_rate?.toString() || "10",
                description: q.requirements || "",
                notes: `見積もり: ${q.quote_number}\n${q.custom_specifications ? `カスタム仕様: ${typeof q.custom_specifications === "string" ? q.custom_specifications : JSON.stringify(q.custom_specifications)}` : ""}`,
                status: "draft",
                type: "one_time",
                project_id: "",
                start_date: today,
                end_date: "",
                auto_renewal: false,
                renewal_notice_days: "30",
                payment_terms: "",
                terms_and_conditions: "",
            });
        } else if (quote) {
            // Quote 経由の場合
            setData({
                quote_id: quote.id,
                title: quote.title || "",
                user_id: quote.user_id || "",
                company_id: quote.company_id || "",
                service_id: quote.items?.[0]?.service_id || "",
                amount: quote.total_amount || "",
                tax_rate: quote.tax_rate?.toString() || "10",
                description: quote.requirements || "",
                notes: `見積もり: ${quote.quote_number}\n${quote.custom_specifications ? `カスタム仕様: ${typeof quote.custom_specifications === "string" ? quote.custom_specifications : JSON.stringify(quote.custom_specifications)}` : ""}`,
                status: "draft",
                type: "one_time",
                project_id: "",
                quote_response_id: "",
                start_date: today,
                end_date: "",
                auto_renewal: false,
                renewal_notice_days: "30",
                payment_terms: "",
                terms_and_conditions: "",
            });
        }
    }, [quote, quoteResponse]);

    const submit = () => {
        // onBefore callback で現在の data を確認
        post(route("admin.contract.store"), {
            onBefore: (visit) => {
                console.log("Form data being submitted:", data);
            },
            onSuccess: (response) => {
                console.log("Submit successful", response);
            },
            onError: (errors) => {
                console.error("Submit errors:", errors);
            },
        });
    };

    const handleDraftSave = () => {
        // ドラフト保存時は status を 'draft' に設定してから submit
        console.log("handleDraftSave called, current data:", data);
        setData("status", "draft");
        // React の batch state update で setData と post() が一緒に処理される
        // ただし、useForm の setData は非同期的に動作するため、
        // 即座に post() を呼び出すと古い data が送信される可能性がある
        // そのため、onBefore callback で data を再度確認する
        setTimeout(() => {
            console.log("After setData, current data:", data);
            submit();
        }, 0);
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

            {/* 見積選択セクション - QuoteResponse 経由の場合は非表示 */}
            {!fromQuoteResponse && (
                <div className="max-w-7xl mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>見積書を選択</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="max-w-md">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    <p className="mt-2 text-sm text-gray-600">
                                        見積書を選択すると、クライアント情報が自動入力されます
                                    </p>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* QuoteResponse 経由の表示 */}
            {fromQuoteResponse && quoteResponse && (
                <div className="max-w-7xl mb-6">
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
                </div>
            )}

            {/* クライアント情報の詳細チェック */}
            {quote && (
                <div className="max-w-7xl mb-6">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            {(
                                                fromQuoteResponse
                                                    ? quoteResponse?.company
                                                    : quote.company
                                            ) ? (
                                                <>
                                                    <span className="text-green-600 dark:text-green-400 font-bold">
                                                        ✓
                                                    </span>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                                            {
                                                                (fromQuoteResponse
                                                                    ? quoteResponse?.company
                                                                    : quote.company
                                                                ).name
                                                            }
                                                        </p>
                                                        {(fromQuoteResponse
                                                            ? quoteResponse?.company
                                                            : quote.company
                                                        ).legal_name &&
                                                            (fromQuoteResponse
                                                                ? quoteResponse?.company
                                                                : quote.company
                                                            ).legal_name !==
                                                                (fromQuoteResponse
                                                                    ? quoteResponse?.company
                                                                    : quote.company
                                                                ).name && (
                                                                <p className="text-gray-600 dark:text-gray-400 text-xs">
                                                                    {
                                                                        (fromQuoteResponse
                                                                            ? quoteResponse?.company
                                                                            : quote.company
                                                                        )
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
                                            {(fromQuoteResponse
                                                ? quoteResponse?.company
                                                : quote.company
                                            )?.addresses &&
                                            (fromQuoteResponse
                                                ? quoteResponse?.company
                                                : quote.company
                                            ).addresses.length > 0 ? (
                                                <>
                                                    <span className="text-green-600 dark:text-green-400 font-bold">
                                                        ✓
                                                    </span>
                                                    <div>
                                                        {(fromQuoteResponse
                                                            ? quoteResponse?.company
                                                            : quote.company
                                                        ).addresses.map(
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
                    onDraftSave={handleDraftSave}
                    cancelRoute={route("admin.contract.index")}
                    isEdit={false}
                    projects={projects}
                    users={users}
                    companies={companies}
                    services={services}
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
