import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badge";

export default function ContractBenefits({ contract }) {
    const benefits = contract.benefits || [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>契約特典（チケット）</CardTitle>
            </CardHeader>
            <CardBody>
                {benefits.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
                        この契約には契約特典（チケット）が設定されていません
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        期間
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        付与
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        繰越
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        使用済み
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        残数
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        状態
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {benefits.map((benefit) => {
                                    const remaining =
                                        benefit.granted_quantity +
                                        benefit.carried_over_quantity -
                                        benefit.used_quantity;
                                    return (
                                        <tr
                                            key={benefit.id}
                                            className="border-b border-gray-100 dark:border-gray-800"
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                {benefit.period_label}
                                                {benefit.unit_minutes && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        1枚 ={" "}
                                                        {benefit.unit_minutes}
                                                        分
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                                                {benefit.granted_quantity}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                                                {benefit.carried_over_quantity}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                                                {benefit.used_quantity}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {remaining}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge
                                                    variant={
                                                        benefit.status ===
                                                        "active"
                                                            ? "success"
                                                            : "secondary"
                                                    }
                                                >
                                                    {benefit.status ===
                                                    "active"
                                                        ? "有効"
                                                        : "失効"}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
