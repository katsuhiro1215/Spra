import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import UserPagination from "@/Components/Layout/UserPagination";
import Badge from "@/Components/Badge";

export default function Index({ quotes }) {
    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="見積書"
                    description="受け取った見積書の一覧"
                    breadcrumbs={[
                        {
                            label: "ダッシュボード",
                            href: route("user.dashboard"),
                        },
                        { label: "見積書", href: "#" },
                    ]}
                />
            }
        >
            <Head title="見積書" />

            <div className="space-y-6">
                {/* 見積書がある場合 */}
                {quotes.data.length > 0 ? (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                        見積書番号
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                        タイトル
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                        金額
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                        ステータス
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {quotes.data.map((quote) => (
                                    <tr
                                        key={quote.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-indigo-600">
                                            {quote.quote_number}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {quote.title}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            ¥
                                            {quote.current_version?.total_amount?.toLocaleString() ||
                                                "0"}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Badge
                                                variant={
                                                    quote.status ===
                                                    "negotiating"
                                                        ? "info"
                                                        : quote.status ===
                                                            "approved"
                                                          ? "success"
                                                          : quote.status ===
                                                              "rejected"
                                                            ? "danger"
                                                            : "default"
                                                }
                                            >
                                                {quote.status === "negotiating"
                                                    ? "交渉中"
                                                    : quote.status ===
                                                        "approved"
                                                      ? "承認済み"
                                                      : quote.status ===
                                                          "rejected"
                                                        ? "却下"
                                                        : quote.status ===
                                                            "draft"
                                                          ? "下書き"
                                                          : quote.status ===
                                                              "contracted"
                                                            ? "契約済み"
                                                            : "キャンセル"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Link
                                                href={route(
                                                    "user.quote.show",
                                                    quote.id,
                                                )}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                表示
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* ページネーション */}
                        <UserPagination links={quotes.links} meta={quotes} />
                    </div>
                ) : (
                    /* データなしのメッセージ */
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-12 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                見積書はまだありません
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                見積書が送付されるとここに表示されます
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
