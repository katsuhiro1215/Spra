import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";

export default function ContractItems({ contract }) {
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>契約明細</CardTitle>
            </CardHeader>
            <CardBody>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    項目名
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    数量
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    単価
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    金額
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {contract.current_version?.items &&
                            contract.current_version.items.length > 0 ? (
                                contract.current_version.items.map(
                                    (item, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-100 dark:border-gray-800"
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                <div className="font-medium">
                                                    {item.name}
                                                </div>
                                                {item.description && (
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                        {item.description}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">
                                                {parseFloat(
                                                    item.quantity,
                                                ).toLocaleString("ja-JP")}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">
                                                {formatAmount(item.unit_price)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900 dark:text-gray-100">
                                                {formatAmount(item.amount)}
                                            </td>
                                        </tr>
                                    ),
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400"
                                    >
                                        明細がありません
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardBody>
        </Card>
    );
}
