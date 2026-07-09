import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";

export default function ContractBasicInfo({ contract, statuses }) {
    const formatDate = (date) => {
        if (!date) return "未設定";
        return new Date(date).toLocaleDateString("ja-JP");
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                契約番号
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {contract.contract_number}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                ステータス
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {statuses[contract.status] || contract.status}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                タイトル
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {contract.title}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                契約タイプ
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {contract.type === "one_time"
                                    ? "一括払い"
                                    : contract.type === "monthly"
                                      ? "月額"
                                      : "年額"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                契約開始日
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {formatDate(contract.start_date)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                契約終了日
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {formatDate(contract.end_date)}
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {contract.description && (
                <Card>
                    <CardHeader>
                        <CardTitle>契約概要</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {contract.description}
                        </p>
                    </CardBody>
                </Card>
            )}

            {contract.currentVersion?.terms_and_conditions && (
                <Card>
                    <CardHeader>
                        <CardTitle>契約条項</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {contract.currentVersion.terms_and_conditions}
                        </p>
                    </CardBody>
                </Card>
            )}
        </>
    );
}
