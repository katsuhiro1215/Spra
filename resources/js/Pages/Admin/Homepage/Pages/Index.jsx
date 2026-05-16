import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
// Layouts
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import BasicButton from "@/Components/Buttons/BasicButton";
import DeleteAlert from "@/Components/Alerts/DeleteAlert";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import { PlusIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// Pages Components
import PagesTable from "./Components/PagesTable";

export default function Index({ pages }) {
    const [deletingItem, setDeletingItem] = useState(null);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const handleDelete = (page) => {
        setDeletingItem(page);
        setShowDeleteAlert(true);
    };

    const confirmDelete = () => {
        if (deletingItem) {
            router.delete(
                route("admin.homepage.pages.destroy", {
                    page: deletingItem.id,
                }),
            );
            setShowDeleteAlert(false);
            setDeletingItem(null);
        }
    };

    const headerActions = [
        {
            label: PageConfig.pages.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.homepage.pages.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout>
            <Head title={PageConfig.pages.documentTitle} />
            {/* フラッシュメッセージ */}
            <FlashMessage />
            {/* ヘッダー */}
            <PageHeader
                title={PageConfig.pages.title}
                description={PageConfig.pages.description}
                actions={headerActions}
            />
            {/* メイン */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* ページ一覧 */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {pages.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
                                <svg
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                ページがありません
                            </h3>
                            <p className="text-gray-500 mb-6">
                                最初のページを作成しましょう
                            </p>
                            <Link href={route("admin.homepage.pages.create")}>
                                <BasicButton variant="primary">
                                    最初のページを作成
                                </BasicButton>
                            </Link>
                        </div>
                    ) : (
                        <PagesTable pages={pages} onDelete={handleDelete} />
                    )}
                </div>
                {/* フッター情報 */}
                {pages.length > 0 && (
                    <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                        <div>合計 {pages.length} ページ</div>
                        <div>
                            公開中: {pages.filter((p) => p.is_published).length}{" "}
                            ページ / 下書き:{" "}
                            {pages.filter((p) => !p.is_published).length} ページ
                        </div>
                    </div>
                )}
                {/* ページネーション */}
                <Pagination paginationData={pages} />
            </main>
            {/* 削除確認モーダル */}
            <DeleteAlert
                show={showDeleteAlert}
                onClose={() => setShowDeleteAlert(false)}
                onConfirm={confirmDelete}
                title="ページの削除"
                message={`「${deletingItem?.name}」を削除してもよろしいですか？この操作は取り消すことができません。`}
            />
        </AdminAuthenticatedLayout>
    );
}
