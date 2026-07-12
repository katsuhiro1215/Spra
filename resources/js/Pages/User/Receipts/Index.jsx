import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import UserPagination from "@/Components/Layout/UserPagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

const formatAmount = (amount) =>
    new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(amount || 0);

export default function Index({ receipts }) {
    const breadcrumbs = [
        { label: "ダッシュボード", href: "/dashboard" },
        { label: "領収書一覧", href: null },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="領収書一覧"
                    description="発行済みの領収書を確認・ダウンロードできます"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="領収書一覧" />
            <FlashMessage />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
                {receipts.data.length === 0 ? (
                    <Card>
                        <CardBody>
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400">
                                    領収書はまだありません
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {receipts.data.map((receipt) => (
                            <Link
                                key={receipt.id}
                                href={route(
                                    "user.receipt.show",
                                    receipt.id,
                                )}
                            >
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardBody>
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <DocumentTextIcon className="h-8 w-8 text-emerald-600" />
                                                <div>
                                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {
                                                            receipt.receipt_number
                                                        }
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        発行日:{" "}
                                                        {receipt.issued_at
                                                            ? new Date(
                                                                  receipt.issued_at,
                                                              ).toLocaleDateString(
                                                                  "ja-JP",
                                                              )
                                                            : "-"}
                                                    </p>
                                                    {receipt.invoice && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            請求書:{" "}
                                                            {
                                                                receipt.invoice
                                                                    .invoice_number
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {formatAmount(
                                                    receipt.total_amount,
                                                )}
                                            </p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {receipts.links && (
                    <div className="mt-6">
                        <UserPagination links={receipts.links} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
