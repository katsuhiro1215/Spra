import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { DeleteAlert } from "@/Components/Alerts";
import { Card } from "@/Components/Card";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    PhotoIcon,
} from "@heroicons/react/24/outline";

export default function Index({ portfolios }) {
    const [deleteTarget, setDeleteTarget] = useState(null);

    const headerActions = [
        {
            label: "新規作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.portfolio.create"),
        },
    ];

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            router.delete(route("admin.portfolio.destroy", deleteTarget.id), {
                onFinish: () => setDeleteTarget(null),
            });
        }
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="実績・ポートフォリオ管理"
                    description="過去の制作物をサービス詳細ページに表示するために管理します"
                    actions={headerActions}
                />
            }
        >
            <Head title="実績・ポートフォリオ管理" />

            <FlashMessage />

            <DeleteAlert
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.title}
            />

            {portfolios.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-gray-500">
                        まだ実績が登録されていません。
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolios.map((portfolio) => (
                        <Card key={portfolio.id}>
                            <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg">
                                {portfolio.media ? (
                                    <img
                                        src={portfolio.media.url}
                                        alt={portfolio.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <PhotoIcon className="w-10 h-10 text-gray-300" />
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {portfolio.title}
                                    </h3>
                                    {!portfolio.is_displayed && (
                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 flex-shrink-0">
                                            非公開
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                    {portfolio.description || "説明がありません"}
                                </p>
                                {portfolio.services?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {portfolio.services.map((service) => (
                                            <span
                                                key={service.id}
                                                className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
                                            >
                                                {service.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center justify-end gap-2">
                                    <Link
                                        href={route(
                                            "admin.portfolio.edit",
                                            portfolio.id,
                                        )}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        <PencilIcon className="h-4 w-4 mr-1" />
                                        編集
                                    </Link>
                                    <button
                                        onClick={() =>
                                            setDeleteTarget(portfolio)
                                        }
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                    >
                                        <TrashIcon className="h-4 w-4 mr-1" />
                                        削除
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </AdminAuthenticatedLayout>
    );
}
