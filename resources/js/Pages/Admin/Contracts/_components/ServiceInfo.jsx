import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";

export default function ServiceInfo({ contract }) {
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>サービス情報</CardTitle>
            </CardHeader>
            <CardBody>
                <div className="space-y-4">
                    {contract.service && (
                        <div>
                            <p className="text-sm text-gray-500">サービス</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {contract.service.name}
                            </p>
                            {contract.service.description && (
                                <p className="text-sm text-gray-600 mt-2">
                                    {contract.service.description}
                                </p>
                            )}
                        </div>
                    )}

                    {contract.service_plan && (
                        <div className="border-t pt-4">
                            <p className="text-sm text-gray-500">
                                サービスプラン
                            </p>
                            <p className="text-gray-900 font-medium">
                                {contract.service_plan.name}
                            </p>
                        </div>
                    )}

                    {contract.items && contract.items.length > 0 && (
                        <div className="border-t pt-4">
                            <p className="text-sm text-gray-500 mb-3">
                                サービス明細
                            </p>
                            <div className="overflow-x-auto">
                                <Table className="text-sm">
                                    <THead>
                                        <Tr>
                                            <Th>説明</Th>
                                            <Th className="text-right">数量</Th>
                                            <Th className="text-right">単価</Th>
                                            <Th className="text-right">金額</Th>
                                        </Tr>
                                    </THead>
                                    <TBody>
                                        {contract.items.map((item) => (
                                            <Tr key={item.id}>
                                                <Td>{item.description}</Td>
                                                <Td className="text-right">
                                                    {item.quantity}
                                                </Td>
                                                <Td className="text-right">
                                                    {formatAmount(
                                                        item.unit_price,
                                                    )}
                                                </Td>
                                                <Td className="text-right font-semibold">
                                                    {formatAmount(item.amount)}
                                                </Td>
                                            </Tr>
                                        ))}
                                    </TBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
