import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import UserPagination from "@/Components/Layout/UserPagination";
import { Card, CardBody } from "@/Components/Card";

export default function Index({ updates }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="進捗状況"
                    description="プロジェクトの進行状況を確認"
                    breadcrumbs={[
                        {
                            label: "ダッシュボード",
                            href: route("user.dashboard"),
                        },
                        { label: "進捗状況", href: "#" },
                    ]}
                />
            }
        >
            <Head title="進捗状況" />

            <div className="space-y-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-4">
                    {updates.data.length === 0 ? (
                        <Card>
                            <CardBody>
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
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        進捗情報はまだありません
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        プロジェクトが開始されると進捗情報が表示されます
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {updates.data.map((update) => (
                                <Card key={update.id}>
                                    <CardBody>
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div>
                                                <Link
                                                    href={route(
                                                        "user.projects.show",
                                                        update.project.id,
                                                    )}
                                                    className="text-xs font-medium text-indigo-600 hover:underline"
                                                >
                                                    {update.project.title}
                                                </Link>
                                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                                    {update.title}
                                                </h3>
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                                                {formatDate(update.created_at)}
                                            </span>
                                        </div>
                                        {update.content && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                                {update.content}
                                            </p>
                                        )}
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    )}

                    {updates.data.length > 0 && (
                        <UserPagination
                            links={updates.links}
                            meta={updates.meta}
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
