import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";

const formatDateTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("ja-JP");
};

export default function Acceptances({ acceptances }) {
    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="同意記録"
                    description="ユーザーが同意した文書の履歴です。"
                />
            }
        >
            <Head title="同意記録" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ユーザー
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    文書
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    バージョン
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    同意日時
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    IPアドレス
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {acceptances.data.map((acceptance) => (
                                <tr key={acceptance.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {acceptance.user?.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {
                                            acceptance.document_version
                                                ?.document?.title
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        v{acceptance.document_version?.version}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatDateTime(
                                            acceptance.accepted_at,
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {acceptance.ip_address || "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {acceptances.data.length === 0 && (
                        <div className="p-6 text-center text-gray-500 text-sm">
                            同意記録がまだありません。
                        </div>
                    )}
                    <Pagination paginationData={acceptances} />
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
