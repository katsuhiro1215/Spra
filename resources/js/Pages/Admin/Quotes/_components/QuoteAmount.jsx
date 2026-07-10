import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";

export default function QuoteAmount({ quote }) {
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>金額情報</CardTitle>
            </CardHeader>
            <CardBody>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                            小計
                        </span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {formatAmount(quote.current_version?.base_amount)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                            割引
                        </span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            -
                            {formatAmount(
                                quote.current_version?.discount_amount,
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                            消費税 ({quote.current_version?.tax_rate}%)
                        </span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {formatAmount(quote.current_version?.tax_amount)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            合計
                        </span>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {formatAmount(quote.current_version?.total_amount)}
                        </span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
