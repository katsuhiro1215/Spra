import React, { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
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
    const [depositRate, setDepositRate] = useState(50); // デフォルト着手金率

    const { data, setData, post, processing, errors } = useForm({
        contract_id: contract?.id || "",
        issue_date: today,
        user_id: contract?.user_id || "",
        company_id: contract?.company_id || "",
        billing_period_start: contract?.start_date || today,
        billing_period_end: contract?.end_date || "",
        due_date: "",
        status: "draft",
        subtotal: 0,
        tax_rate: 0.1,
        tax_amount: 0,
        total_amount: 0,
        notes: "",
    });

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
            // 契約から着手金を自動計算
            const contractAmount = contract.current_version?.total_amount || 0;
            const depositAmount = Math.round(
                contractAmount * (depositRate / 100),
            );
            const taxRate = 0.1;
            const taxAmount = Math.round(depositAmount * taxRate);
            const totalAmount = depositAmount + taxAmount;

            setData((prev) => ({
                ...prev,
                contract_id: contract.id,
                user_id: contract.user_id || "",
                company_id: contract.company_id || "",
                billing_period_start: contract.start_date || today,
                billing_period_end: contract.end_date || "",
                subtotal: depositAmount,
                tax_amount: taxAmount,
                total_amount: totalAmount,
            }));
        }
    }, [company, user, contract, depositRate]);

    const handleSubmit = () => {
        post(route("admin.invoice.store"));
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "請求書一覧", href: route("admin.invoice.index") },
        { label: "新規作成", href: null },
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
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-blue-700 dark:text-blue-300">
                                        契約金額：
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
                                        着手金率：
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={depositRate}
                                        onChange={(e) =>
                                            setDepositRate(
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        className="w-16 px-2 py-1 border border-blue-300 dark:border-blue-600 rounded ml-1 dark:bg-slate-800 text-sm"
                                    />
                                    <span className="ml-1">%</span>
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                <span>請求予定額：</span>
                                <span className="font-semibold text-lg text-blue-900 dark:text-blue-100 ml-2">
                                    ¥
                                    {Math.round(
                                        (contract.current_version
                                            ?.total_amount || 0) *
                                            (depositRate / 100),
                                    ).toLocaleString()}
                                </span>
                                <span className="text-blue-700 dark:text-blue-300 ml-4">
                                    残金：¥
                                    {Math.round(
                                        (contract.current_version
                                            ?.total_amount || 0) *
                                            ((100 - depositRate) / 100),
                                    ).toLocaleString()}
                                </span>
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
