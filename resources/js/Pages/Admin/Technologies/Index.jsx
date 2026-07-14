import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { DeleteAlert } from "@/Components/Alerts";
import { Card } from "@/Components/Card";
import { Link } from "@inertiajs/react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Index({ technologies }) {
    const [deleteTarget, setDeleteTarget] = useState(null);

    const headerActions = [
        {
            label: "新規作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.service.technology.create"),
        },
    ];

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            router.delete(
                route("admin.service.technology.destroy", deleteTarget.id),
                { onFinish: () => setDeleteTarget(null) },
            );
        }
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="使用技術マスタ"
                    description="サービスに紐付ける「使用技術」タグを管理します"
                    actions={headerActions}
                />
            }
        >
            <Head title="使用技術マスタ" />

            <FlashMessage />

            <DeleteAlert
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.name}
            />

            <Card>
                {technologies.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        まだ技術が登録されていません。
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {technologies.map((technology) => (
                            <div
                                key={technology.id}
                                className="flex items-center justify-between px-4 py-3"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor: technology.color,
                                        }}
                                    />
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {technology.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {technology.slug}
                                    </span>
                                    {!technology.is_active && (
                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                            無効
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={route(
                                            "admin.service.technology.edit",
                                            technology.id,
                                        )}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        <PencilIcon className="h-4 w-4 mr-1" />
                                        編集
                                    </Link>
                                    <button
                                        onClick={() =>
                                            setDeleteTarget(technology)
                                        }
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                    >
                                        <TrashIcon className="h-4 w-4 mr-1" />
                                        削除
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </AdminAuthenticatedLayout>
    );
}
