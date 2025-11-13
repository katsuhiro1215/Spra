import { Head } from '@inertiajs/react';
// Layouts
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Card from "@/Components/Card";
import BasicButton from "@/Components/Buttons/BasicButton";
import FlashMessage from "@/Components/Notifications/FlashMessage";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Index() {
    return (
        <AdminAuthenticatedLayout>
            <Head title={PageConfig.contents.documentTitle} />
            {/* フラッシュメッセージ */}
            <FlashMessage />
            {/* ヘッダー */}
            <PageHeader
                title={PageConfig.contents.title}
                description={PageConfig.contents.description}
            />
            {/* メイン */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🚧</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        コンテンツ管理機能
                    </h3>
                    <p className="text-gray-500">
                        この機能は現在開発中です。近日公開予定です。
                    </p>
                </div>
            </main>
        </AdminAuthenticatedLayout>
    );
}