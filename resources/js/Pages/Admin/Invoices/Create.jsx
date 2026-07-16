import React, { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { PageConfig } from "@/Constants/PageConfig";
import InvoiceForm from "./_components/Form";

export default function Create({
    contracts,
    users,
    companies,
    statuses,
    company = null,
    user = null,
    contract = null,
}) {
    const today = new Date().toISOString().split("T")[0];
    const [billingRate, setBillingRate] = useState(50); // 契約金額に対する請求割合(%)

    const invoiceTypeOptions = [
        { value: "deposit", label: "着手金" },
        { value: "interim", label: "中間金" },
        { value: "final", label: "完了金" },
        { value: "full", label: "一括" },
        { value: "monthly", label: "月額" },
        { value: "other", label: "その他" },
    ];

    const { data, setData, post, processing, errors } = useForm({
        contract_id: contract?.id || "",
        invoice_type: "full",
        issue_date: today,
        user_id: contract?.user_id || "",
        company_id: contract?.company_id || "",
        billing_period_start: contract?.start_date || today,
        billing_period_end: contract?.end_date || "",
        due_date: "",
        status: "draft",
        subtotal: 0,
        tax_rate: 10,
        tax_amount: 0,
        total_amount: 0,
        notes: "",
    });

    // 請求区分が「一括」以外の場合のみ、契約金額に対する割合で自動計算する
    const isPartialBilling = !["full", "monthly"].includes(data.invoice_type);

    // コンテキストベースの初期化
    useEffect(() => {
        if (company) {
            setData((prev) => ({
                ...prev,
                company_id: company.id,
                user_id:
                    company.users && company.users.length > 0
                        ? company.users[0].id
                        : "",
            }));
        }

        if (user) {
            setData((prev) => ({
                ...prev,
                user_id: user.id,
                company_id:
                    user.companies && user.companies.length > 0
                        ? user.companies[0].id
                        : "",
            }));
        }

        if (contract) {
            const currentVersion = contract.current_version;
            // 消費税は課税対象額（小計 - 割引）に対してかかるため、税込の総額ではなく
            // 課税対象額を按分の基準にする（税込総額を基準にすると二重課税になる）
            const taxableBase =
                (currentVersion?.base_amount || 0) -
                (currentVersion?.discount_amount || 0);
            const rate = isPartialBilling ? billingRate : 100;
            const billedSubtotal = Math.round(taxableBase * (rate / 100));

            setData((prev) => ({
                ...prev,
                contract_id: contract.id,
                user_id: contract.user_id || "",
                company_id: contract.company_id || "",
                billing_period_start: contract.start_date || today,
                billing_period_end: contract.end_date || "",
                subtotal: billedSubtotal,
                tax_rate: currentVersion?.tax_rate ?? 10,
            }));
        }
    }, [company, user, contract, billingRate, isPartialBilling]);

    const handleSubmit = () => {
        post(route("admin.invoice.store"));
    };

    const breadcrumbs = [
        ...PageConfig.invoices.breadcrumbs,
        PageConfig.invoices.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="請求書作成"
                    description="新しい請求書を作成します"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="請求書作成" />

            <FlashMessage />

            {contract && (
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                📋 契約情報から作成
                            </h3>
                            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                                契約: {contract.contract_number} -{" "}
                                {contract.title}
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                                <div>
                                    <span className="text-blue-700 dark:text-blue-300">
                                        契約金額（総額）：
                                    </span>
                                    <span className="font-semibold text-blue-900 dark:text-blue-100">
                                        ¥
                                        {(
                                            contract.current_version
                                                ?.total_amount || 0
                                        ).toLocaleString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-blue-700 dark:text-blue-300">
                                        請求区分：
                                    </span>
                                    <select
                                        value={data.invoice_type}
                                        onChange={(e) =>
                                            setData(
                                                "invoice_type",
                                                e.target.value,
                                            )
                                        }
                                        className="px-2 py-1 border border-blue-300 dark:border-blue-600 rounded ml-1 dark:bg-slate-800 text-sm"
                                    >
                                        {invoiceTypeOptions.map((opt) => (
                                            <option
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {isPartialBilling && (
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-blue-700 dark:text-blue-300">
                                            契約金額に対する割合：
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={billingRate}
                                            onChange={(e) =>
                                                setBillingRate(
                                                    parseInt(
                                                        e.target.value,
                                                    ) || 0,
                                                )
                                            }
                                            className="w-16 px-2 py-1 border border-blue-300 dark:border-blue-600 rounded ml-1 dark:bg-slate-800 text-sm"
                                        />
                                        <span className="ml-1">%</span>
                                    </div>
                                </div>
                            )}
                            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                <span>
                                    今回のご請求（
                                    {
                                        invoiceTypeOptions.find(
                                            (o) =>
                                                o.value === data.invoice_type,
                                        )?.label
                                    }
                                    ）：
                                </span>
                                <span className="font-semibold text-lg text-blue-900 dark:text-blue-100 ml-2">
                                    ¥
                                    {Math.round(
                                        data.total_amount || 0,
                                    ).toLocaleString()}
                                    <span className="text-xs font-normal ml-1">
                                        （税込）
                                    </span>
                                </span>
                                {isPartialBilling && (
                                    <span className="text-blue-700 dark:text-blue-300 ml-4">
                                        残金：¥
                                        {Math.round(
                                            (contract.current_version
                                                ?.total_amount || 0) -
                                                (data.total_amount || 0),
                                        ).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6">
                <InvoiceForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.invoice.index")}
                    isEdit={false}
                    contract={contract}
                    contracts={contracts}
                    users={users}
                    companies={companies}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
