import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";

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

            <div className="py-6 px-4 sm:px-6 lg:px-8 space-y-4">
                <Card>
                    <Table>
                        <THead>
                            <Tr hover={false}>
                                <Th>ユーザー</Th>
                                <Th>文書</Th>
                                <Th>バージョン</Th>
                                <Th>同意日時</Th>
                                <Th>IPアドレス</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {acceptances.data.length > 0 ? (
                                acceptances.data.map((acceptance) => (
                                    <Tr key={acceptance.id}>
                                        <Td>{acceptance.user?.email}</Td>
                                        <Td>
                                            {
                                                acceptance.document_version
                                                    ?.document?.title
                                            }
                                        </Td>
                                        <Td>
                                            v{acceptance.document_version?.version}
                                        </Td>
                                        <Td>
                                            {formatDateTime(
                                                acceptance.accepted_at,
                                            )}
                                        </Td>
                                        <Td>{acceptance.ip_address || "-"}</Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td
                                        colSpan={5}
                                        className="text-center text-slate-500 dark:text-slate-400 py-8"
                                    >
                                        同意記録がまだありません。
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                </Card>
                <Pagination paginationData={acceptances} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
