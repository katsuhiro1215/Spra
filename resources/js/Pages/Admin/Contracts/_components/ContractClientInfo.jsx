import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";

export default function ContractClientInfo({ contract }) {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>クライアント情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                氏名
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {contract.user?.profile?.full_name || "未設定"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                メールアドレス
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {contract.user?.email || "未設定"}
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {contract.company && (
                <Card>
                    <CardHeader>
                        <CardTitle>会社情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    会社名
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {contract.company.name}
                                </p>
                            </div>
                            {contract.company.addresses &&
                                contract.company.addresses.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            住所
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            〒
                                            {
                                                contract.company.addresses[0]
                                                    .postal_code
                                            }
                                            <br />
                                            {
                                                contract.company.addresses[0]
                                                    .address1
                                            }
                                            {contract.company.addresses[0]
                                                .address2 &&
                                                ` ${contract.company.addresses[0].address2}`}
                                        </p>
                                    </div>
                                )}
                        </div>
                    </CardBody>
                </Card>
            )}
        </>
    );
}
