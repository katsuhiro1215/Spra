import React, { useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import UserPagination from "@/Components/Layout/UserPagination";
import Modal from "@/Components/Layout/Modal";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    DocumentTextIcon,
    DocumentDuplicateIcon,
    ArrowDownTrayIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

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

    const [selectedIds, setSelectedIds] = useState([]);
    const [showBulkPreview, setShowBulkPreview] = useState(false);

    const toggleSelected = (receiptId) => {
        setSelectedIds((prev) =>
            prev.includes(receiptId)
                ? prev.filter((id) => id !== receiptId)
                : [...prev, receiptId],
        );
    };

    const bulkPreviewUrl = useMemo(
        () =>
            selectedIds.length > 0
                ? route("user.receipt.bulk.preview", { ids: selectedIds })
                : null,
        [selectedIds],
    );

    const handleBulkDownload = () => {
        if (selectedIds.length === 0) return;
        window.location.href = route("user.receipt.bulk.download", {
            ids: selectedIds,
        });
    };

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

            {/* フラッシュメッセージ */}
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
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    checked={
                                        selectedIds.length ===
                                            receipts.data.length &&
                                        receipts.data.length > 0
                                    }
                                    onChange={(e) =>
                                        setSelectedIds(
                                            e.target.checked
                                                ? receipts.data.map(
                                                      (r) => r.id,
                                                  )
                                                : [],
                                        )
                                    }
                                />
                                このページの全てを選択
                            </label>

                            <PrimaryButton
                                icon={DocumentDuplicateIcon}
                                disabled={selectedIds.length === 0}
                                onClick={() => setShowBulkPreview(true)}
                            >
                                {selectedIds.length > 0
                                    ? `選択した${selectedIds.length}件をまとめて出力`
                                    : "まとめて出力"}
                            </PrimaryButton>
                        </div>

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
                                                    <label
                                                        className="flex items-center"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                            checked={selectedIds.includes(
                                                                receipt.id,
                                                            )}
                                                            onChange={() =>
                                                                toggleSelected(
                                                                    receipt.id,
                                                                )
                                                            }
                                                        />
                                                    </label>
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
                                                                    receipt
                                                                        .invoice
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
                    </>
                )}

                {receipts.links && (
                    <div className="mt-6">
                        <UserPagination links={receipts.links} />
                    </div>
                )}
            </div>

            <Modal
                show={showBulkPreview}
                onClose={() => setShowBulkPreview(false)}
                maxWidth="2xl"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            まとめて出力（{selectedIds.length}件）
                        </h2>
                        <button
                            type="button"
                            onClick={() => setShowBulkPreview(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {bulkPreviewUrl && (
                        <iframe
                            src={bulkPreviewUrl}
                            title="領収書PDFプレビュー"
                            className="w-full h-[70vh] border border-gray-200 dark:border-gray-700 rounded"
                        />
                    )}

                    <div className="flex justify-end gap-3 mt-4">
                        <SecondaryButton
                            onClick={() => setShowBulkPreview(false)}
                        >
                            閉じる
                        </SecondaryButton>
                        <PrimaryButton
                            icon={ArrowDownTrayIcon}
                            onClick={handleBulkDownload}
                        >
                            ダウンロード
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
