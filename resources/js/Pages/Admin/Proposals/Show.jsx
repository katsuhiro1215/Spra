import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";

const statusLabels = {
    draft: "下書き",
    reviewing: "レビュー中",
    sent: "送付済み",
};

export default function Show({ proposal }) {
    const quotes = proposal.quotes || [];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={proposal.title}
                    description="提案書の詳細"
                />
            }
        >
            <Head title={`提案書詳細 - ${proposal.title}`} />
            <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                <Card>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                ステータス
                            </dt>
                            <dd className="text-sm text-gray-900">
                                {statusLabels[proposal.status] || proposal.status}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                ヒアリング
                            </dt>
                            <dd className="text-sm text-gray-900">
                                {proposal.hearing
                                    ? proposal.hearing.title
                                    : "未紐付け"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                問い合わせ元
                            </dt>
                            <dd className="text-sm text-gray-900">
                                {proposal.contact ? proposal.contact.name : "未紐付け"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                作成者
                            </dt>
                            <dd className="text-sm text-gray-900">
                                {proposal.creator ? proposal.creator.name : "-"}
                            </dd>
                        </div>
                    </dl>
                </Card>

                <Card header={<h3 className="text-lg font-medium">内容</h3>}>
                    <div className="whitespace-pre-wrap text-sm text-gray-800">
                        {proposal.content || "内容は登録されていません。"}
                    </div>
                </Card>

                <Card header={<h3 className="text-lg font-medium">紐づく見積</h3>}>
                    {quotes.length === 0 ? (
                        <p className="text-sm text-gray-400">
                            紐づく見積はありません。
                        </p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {quotes.map((quote) => (
                                <li key={quote.id} className="py-2">
                                    <Link
                                        href={route("admin.quote.show", quote.id)}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        {quote.quote_number} - {quote.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </main>
        </AdminAuthenticatedLayout>
    );
}
