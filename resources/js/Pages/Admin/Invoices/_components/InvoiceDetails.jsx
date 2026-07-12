import React from "react";
import { Card, CardBody } from "@/Components/Card";

const formatAmount = (amount) => {
    return new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(amount || 0);
};

export default function InvoiceDetails({ invoice }) {
    return (
        <Card>
            <CardBody>
                <div className="max-w-2xl space-y-6">
                    {/* 契約金額との関係 */}
                    {invoice.contract?.current_version?.total_amount && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-700 dark:text-gray-300">
                                    契約金額（総額）
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {formatAmount(
                                        invoice.contract.current_version
                                            .total_amount,
                                    )}
                                </span>
                            </div>
                            {invoice.invoice_type &&
                                invoice.invoice_type !== "full" && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700 dark:text-gray-300">
                                            今回のご請求（
                                            {invoice.invoice_type_name}）
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {formatAmount(
                                                invoice.total_amount,
                                            )}
                                        </span>
                                    </div>
                                )}
                        </div>
                    )}

                    {/* 明細 */}
                    {invoice.items && invoice.items.length > 0 && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                明細
                            </h3>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-2 text-gray-600 dark:text-gray-400">
                                            項目
                                        </th>
                                        <th className="text-right py-2 text-gray-600 dark:text-gray-400">
                                            数量
                                        </th>
                                        <th className="text-right py-2 text-gray-600 dark:text-gray-400">
                                            単価
                                        </th>
                                        <th className="text-right py-2 text-gray-600 dark:text-gray-400">
                                            金額
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.items.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-gray-100 dark:border-gray-800"
                                        >
                                            <td className="py-2 text-gray-900 dark:text-white">
                                                {item.description}
                                            </td>
                                            <td className="py-2 text-right text-gray-600 dark:text-gray-400">
                                                {item.quantity}
                                            </td>
                                            <td className="py-2 text-right text-gray-600 dark:text-gray-400">
                                                {formatAmount(
                                                    item.unit_price,
                                                )}
                                            </td>
                                            <td className="py-2 text-right font-medium text-gray-900 dark:text-white">
                                                {formatAmount(item.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* 金額情報 */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            ご請求内容
                        </h3>

                        <div className="space-y-3 text-sm">
                            {/* 請求額 */}
                            <div className="flex justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                                <span className="text-gray-700 dark:text-gray-300">
                                    請求額（税抜き）
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {formatAmount(invoice.subtotal)}
                                </span>
                            </div>

                            {/* 消費税 */}
                            <div className="flex justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                                <span className="text-gray-700 dark:text-gray-300">
                                    消費税 ({Number(invoice.tax_rate).toFixed(1)}
                                    %)
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {formatAmount(invoice.tax_amount)}
                                </span>
                            </div>

                            {/* 合計 */}
                            <div className="flex justify-between text-lg font-bold pt-3 bg-blue-50 dark:bg-blue-900/30 -mx-6 -mb-6 px-6 py-4 rounded-b-lg border-t-2 border-blue-200 dark:border-blue-700">
                                <span className="text-blue-900 dark:text-blue-100">
                                    合計
                                </span>
                                <span className="text-blue-700 dark:text-blue-300">
                                    {formatAmount(invoice.total_amount)}
                                </span>
                            </div>

                            {invoice.paid_amount > 0 &&
                                invoice.status !== "paid" && (
                                    <>
                                        <div className="flex justify-between text-green-700 dark:text-green-400">
                                            <span>入金済み</span>
                                            <span>
                                                {formatAmount(
                                                    invoice.paid_amount,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                                            <span>残額</span>
                                            <span>
                                                {formatAmount(
                                                    invoice.balance,
                                                )}
                                            </span>
                                        </div>
                                    </>
                                )}
                        </div>
                    </div>

                    {/* 請求期間 */}
                    {(invoice.billing_period_start ||
                        invoice.billing_period_end) && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                請求期間
                            </h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {invoice.billing_period_start &&
                                    new Date(
                                        invoice.billing_period_start,
                                    ).toLocaleDateString("ja-JP")}
                                {invoice.billing_period_start &&
                                    invoice.billing_period_end && (
                                        <span> 〜 </span>
                                    )}
                                {invoice.billing_period_end &&
                                    new Date(
                                        invoice.billing_period_end,
                                    ).toLocaleDateString("ja-JP")}
                            </div>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
