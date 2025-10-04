import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <AdminAuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    ⚙️ システム設定
                </h2>
            }
        >
            <Head title="システム設定" />

            <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">⚙️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        システム設定
                    </h3>
                    <p className="text-gray-500">
                        この機能は現在開発中です。近日公開予定です。
                    </p>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}