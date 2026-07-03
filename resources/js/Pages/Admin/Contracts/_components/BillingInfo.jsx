import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";

export default function BillingInfo({ contract }) {
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("ja-JP");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>請求設定</CardTitle>
            </CardHeader>
            <CardBody>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">請求日</p>
                            <p className="text-gray-900 font-medium">
                                毎月 {contract.billing_day} 日
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">支払期限</p>
                            <p className="text-gray-900 font-medium">
                                {contract.payment_due_days} 日以内
                            </p>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm text-gray-500">自動請求書生成</p>
                        <p className="text-gray-900 font-medium">
                            {contract.auto_invoice_generation ? "有効" : "無効"}
                        </p>
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm text-gray-500 mb-3">
                            請求日時情報
                        </p>
                        <div className="space-y-2 text-sm">
                            <div>
                                <p className="text-gray-500">次回請求予定日</p>
                                <p className="text-gray-900 font-medium">
                                    {contract.next_billing_date
                                        ? formatDate(contract.next_billing_date)
                                        : "未設定"}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">最終請求日時</p>
                                <p className="text-gray-900 font-medium">
                                    {contract.last_invoiced_at
                                        ? formatDate(contract.last_invoiced_at)
                                        : "未請求"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
