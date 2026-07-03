import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";

export default function Index() {
    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="プロジェクト"
                    description="契約に基づくプロジェクト"
                    breadcrumbs={[
                        {
                            label: "ダッシュボード",
                            href: route("user.dashboard"),
                        },
                        { label: "プロジェクト", href: "#" },
                    ]}
                />
            }
        >
            <Head title="プロジェクト" />

            <div className="space-y-6">
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            プロジェクトはまだありません
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            契約が成立するとプロジェクトが表示されます
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
