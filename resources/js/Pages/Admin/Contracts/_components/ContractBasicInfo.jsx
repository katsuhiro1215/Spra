import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

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

            {/* 署名情報 */}
            {(contract.user_signed_at || contract.admin_signed_at) && (
                <Card>
                    <CardHeader>
                        <CardTitle>署名情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ユーザー署名 */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    {contract.user_signed_at ? (
                                        <>
                                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            <p className="text-sm font-semibold text-green-600">
                                                ユーザー署名済み
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <XCircleIcon className="h-5 w-5 text-yellow-600" />
                                            <p className="text-sm font-semibold text-yellow-600">
                                                ユーザー署名待ち
                                            </p>
                                        </>
                                    )}
                                </div>
                                {contract.user_signed_at && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        署名日時:{" "}
                                        {new Date(
                                            contract.user_signed_at,
                                        ).toLocaleDateString("ja-JP")}
                                    </p>
                                )}
                            </div>

                            {/* Admin 署名 */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    {contract.admin_signed_at ? (
                                        <>
                                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                            <p className="text-sm font-semibold text-green-600">
                                                Admin 署名済み
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <XCircleIcon className="h-5 w-5 text-yellow-600" />
                                            <p className="text-sm font-semibold text-yellow-600">
                                                Admin 署名待ち
                                            </p>
                                        </>
                                    )}
                                </div>
                                {contract.admin_signed_at && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        署名日時:{" "}
                                        {new Date(
                                            contract.admin_signed_at,
                                        ).toLocaleDateString("ja-JP")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}

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
