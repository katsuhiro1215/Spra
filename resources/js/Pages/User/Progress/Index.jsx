import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";

export default function Index() {
    return (
        <AuthenticatedLayout>
            <Head title="進捗状況" />

            <div className="space-y-6">
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

                {/* データなしのメッセージ */}
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
