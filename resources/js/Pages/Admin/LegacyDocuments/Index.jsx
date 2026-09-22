import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";

const documentTypeLabels = {
    invoice: "請求書",
    receipt: "領収書",
};

export default function Index({ documents = {} }) {
    const items = documents.data || [];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="過去書類アーカイブ"
                    description="現行システム導入以前の請求書・領収書の記録一覧です"
                />
            }
        >
            <Head title="過去書類アーカイブ" />
            <FlashMessage />
            <Card>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                書類種別
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                クライアント名
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                発行日
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                合計金額
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-6 text-center text-sm text-gray-400"
                                >
                                    登録された書類はありません
                                </td>
                            </tr>
                        )}
                        {items.map((document) => (
                            <tr key={document.id}>
                                <td className="px-4 py-2 text-sm">
                                    {documentTypeLabels[document.document_type] ||
                                        document.document_type}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                    {document.client_name}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                    {document.issued_at}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                    {document.total_amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
            {documents.links && <Pagination paginationData={documents} />}
        </AdminAuthenticatedLayout>
    );
}
