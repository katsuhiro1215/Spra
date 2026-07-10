import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";

export default function QuoteBasicInfo({ quote, statuses }) {
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
                                見積番号
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {quote.quote_number}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                ステータス
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {statuses[quote.status] || quote.status}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                タイトル
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {quote.title}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                有効期限
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {quote.current_version?.expires_at
                                    ? new Date(
                                          quote.current_version.expires_at,
                                      ).toLocaleDateString("ja-JP")
                                    : "未設定"}
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* 要件・仕様 */}
            <Card>
                <CardHeader>
                    <CardTitle>要件・仕様</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                要件
                            </p>
                            <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                {quote.requirements || "未設定"}
                            </p>
                        </div>
                        {quote.current_version?.custom_specifications && (
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    カスタム仕様
                                </p>
                                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                    {typeof quote.current_version
                                        .custom_specifications === "string"
                                        ? quote.current_version
                                              .custom_specifications
                                        : JSON.stringify(
                                              quote.current_version
                                                  .custom_specifications,
                                              null,
                                              2,
                                          )}
                                </p>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
        </>
    );
}
