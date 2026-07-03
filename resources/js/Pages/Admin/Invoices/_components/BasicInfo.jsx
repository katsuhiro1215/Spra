import React from "react";
import { Card, CardBody } from "@/Components/Card";

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

export default function BasicInfo({ invoice }) {
    return (
        <Card>
            <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                            請求書番号
                        </label>
                        <p className="mt-2 text-base font-mono text-gray-900 dark:text-white">
                            {invoice.invoice_number ||
                                invoice.id.substring(0, 8)}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                            件名
                        </label>
                        <p className="mt-2 text-base text-gray-900 dark:text-white">
                            {invoice.title || "-"}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                            請求日
                        </label>
                        <p className="mt-2 text-base text-gray-900 dark:text-white">
                            {formatDate(
                                invoice.issued_at || invoice.created_at,
                            )}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                            支払期限
                        </label>
                        <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                            {formatDate(invoice.due_date)}
                        </p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                            関連契約
                        </label>
                        <p className="mt-2 text-base">
                            {invoice.contract ? (
                                <a
                                    href={route(
                                        "admin.contract.show",
                                        invoice.contract.id,
                                    )}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                                >
                                    {invoice.contract.contract_number ||
                                        invoice.contract.id.substring(
                                            0,
                                            8,
                                        )}{" "}
                                    - {invoice.contract.title}
                                </a>
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400">
                                    -
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
