import React, { useEffect } from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import FormGroup from "@/Components/FormGroup";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { Link } from "@inertiajs/react";

export default function ReceiptForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    invoices = [],
    users = [],
    companies = [],
    statuses = {},
    isEdit = false,
}) {
    // 請求書が選択されたときに自動入力
    useEffect(() => {
        if (data.invoice_id && invoices.length > 0) {
            const selectedInvoice = invoices.find(
                (inv) => inv.id === data.invoice_id,
            );
            if (selectedInvoice) {
                setData((prev) => ({
                    ...prev,
                    user_id: selectedInvoice.user_id || prev.user_id,
                    company_id: selectedInvoice.company_id || prev.company_id,
                    amount: selectedInvoice.subtotal || prev.amount,
                    tax_amount: selectedInvoice.tax_amount || prev.tax_amount,
                    total_amount:
                        selectedInvoice.total_amount || prev.total_amount,
                }));
            }
        }
    }, [data.invoice_id]);

    // 小計と税額から合計を計算
    useEffect(() => {
        const amount = parseFloat(data.amount) || 0;
        const taxAmount = parseFloat(data.tax_amount) || 0;
        const total = amount + taxAmount;

        if (data.total_amount !== total) {
            setData((prev) => ({
                ...prev,
                total_amount: total,
            }));
        }
    }, [data.amount, data.tax_amount]);

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* 基本情報 */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        基本情報
                    </h3>
                </div>
                <div className="px-6 py-4 space-y-4">
                    <FormGroup
                        label="請求書"
                        error={errors.invoice_id}
                        required
                    >
                        <select
                            value={data.invoice_id}
                            onChange={(e) =>
                                setData("invoice_id", e.target.value)
                            }
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            disabled={isEdit}
                        >
                            <option value="">請求書を選択</option>
                            {invoices.map((invoice) => (
                                <option key={invoice.id} value={invoice.id}>
                                    {invoice.invoice_number} - ¥
                                    {invoice.total_amount?.toLocaleString()}
                                </option>
                            ))}
                        </select>
                    </FormGroup>

                    <div className="grid grid-cols-2 gap-4">
                        <FormGroup
                            label="ユーザー"
                            error={errors.user_id}
                            required
                        >
                            <select
                                value={data.user_id}
                                onChange={(e) =>
                                    setData("user_id", e.target.value)
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="">ユーザーを選択</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.email}
                                    </option>
                                ))}
                            </select>
                        </FormGroup>

                        <FormGroup label="会社" error={errors.company_id}>
                            <select
                                value={data.company_id || ""}
                                onChange={(e) =>
                                    setData(
                                        "company_id",
                                        e.target.value || null,
                                    )
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="">会社を選択（任意）</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </FormGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormGroup
                            label="ステータス"
                            error={errors.status}
                            required
                        >
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                {Object.entries(statuses).map(
                                    ([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ),
                                )}
                            </select>
                        </FormGroup>

                        <FormGroup label="発行日" error={errors.issued_at}>
                            <input
                                type="date"
                                value={data.issued_at || ""}
                                onChange={(e) =>
                                    setData("issued_at", e.target.value)
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </FormGroup>
                    </div>
                </div>
            </Card>

            {/* 金額情報 */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        金額情報
                    </h3>
                </div>
                <div className="px-6 py-4 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <FormGroup
                            label="小計（税抜）"
                            error={errors.amount}
                            required
                        >
                            <input
                                type="number"
                                step="0.01"
                                value={data.amount}
                                onChange={(e) =>
                                    setData("amount", e.target.value)
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                placeholder="0.00"
                            />
                        </FormGroup>

                        <FormGroup
                            label="消費税"
                            error={errors.tax_amount}
                            required
                        >
                            <input
                                type="number"
                                step="0.01"
                                value={data.tax_amount}
                                onChange={(e) =>
                                    setData("tax_amount", e.target.value)
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                placeholder="0.00"
                            />
                        </FormGroup>

                        <FormGroup
                            label="合計（税込）"
                            error={errors.total_amount}
                            required
                        >
                            <input
                                type="number"
                                step="0.01"
                                value={data.total_amount}
                                onChange={(e) =>
                                    setData("total_amount", e.target.value)
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                placeholder="0.00"
                                disabled
                            />
                        </FormGroup>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-emerald-600 mb-1">
                            領収金額
                        </p>
                        <p className="text-2xl font-bold text-emerald-600">
                            ¥
                            {parseFloat(
                                data.total_amount || 0,
                            ).toLocaleString()}
                        </p>
                    </div>
                </div>
            </Card>

            {/* 備考 */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">備考</h3>
                </div>
                <div className="px-6 py-4">
                    <FormGroup error={errors.notes}>
                        <textarea
                            value={data.notes || ""}
                            onChange={(e) => setData("notes", e.target.value)}
                            rows={4}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            placeholder="備考を入力してください"
                        />
                    </FormGroup>
                </div>
            </Card>

            {/* アクションボタン */}
            <Card>
                <div className="px-6 py-4 flex justify-end space-x-3">
                    <Link
                        href={route("admin.receipts.index")}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        キャンセル
                    </Link>
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing
                            ? "保存中..."
                            : isEdit
                              ? "更新する"
                              : "作成する"}
                    </PrimaryButton>
                </div>
            </Card>
        </form>
    );
}
