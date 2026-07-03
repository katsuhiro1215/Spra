import React from "react";
import { Card, CardBody } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";

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
                <div className="overflow-x-auto">
                    <Table>
                        <THead>
                            <Tr hover={false}>
                                <Th>品目</Th>
                                <Th>説明</Th>
                                <Th className="text-right">数量</Th>
                                <Th className="text-right">単価</Th>
                                <Th className="text-right">金額</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {invoice.items?.map((item, index) => (
                                <Tr key={index}>
                                    <Td className="font-medium text-gray-900 dark:text-white">
                                        {item.name}
                                    </Td>
                                    <Td className="text-gray-600 dark:text-gray-400 text-sm">
                                        {item.description || "-"}
                                    </Td>
                                    <Td className="text-right text-gray-900 dark:text-white">
                                        {item.quantity}
                                    </Td>
                                    <Td className="text-right text-gray-900 dark:text-white">
                                        {formatAmount(item.unit_price)}
                                    </Td>
                                    <Td className="text-right font-semibold text-gray-900 dark:text-white">
                                        {formatAmount(item.amount)}
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                </div>

                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 max-w-md ml-auto">
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-gray-700 dark:text-gray-300">
                            <span>契約金額</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {formatAmount(invoice.subtotal)}
                            </span>
                        </div>
                        <div className="flex justify-between text-blue-600 dark:text-blue-400 font-semibold">
                            <span>着手金比率</span>
                            <span>{invoice.deposit_rate}%</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 p-3 rounded border border-blue-200 dark:border-blue-800">
                            <span>着手金額</span>
                            <span>{formatAmount(invoice.deposit_amount)}</span>
                        </div>
                        {invoice.discount_amount > 0 && (
                            <div className="flex justify-between text-red-600 dark:text-red-400">
                                <span>値引き</span>
                                <span>
                                    -{formatAmount(invoice.discount_amount)}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between text-gray-700 dark:text-gray-300">
                            <span>
                                消費税 ({(invoice.tax_rate * 100).toFixed(1)}%)
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {formatAmount(invoice.tax_amount)}
                            </span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white py-2 border-t-2 border-gray-300 dark:border-gray-600">
                            <span>今回のご請求額</span>
                            <span className="text-red-600 dark:text-red-400">
                                {formatAmount(invoice.total_amount)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 pt-2">
                            <span>残金</span>
                            <span>
                                {formatAmount(
                                    invoice.subtotal - invoice.deposit_amount,
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
