import { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import DangerButton from "@/Components/Buttons/DangerButton";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function Index({ categories }) {
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    const categoryForm = useForm({ name: "" });
    const editForm = useForm({ name: "" });

    const handleCreateCategory = (e) => {
        e.preventDefault();
        categoryForm.post(route("admin.documentCategories.store"), {
            onSuccess: () => categoryForm.reset(),
        });
    };

    const startEditCategory = (category) => {
        setEditingCategoryId(category.id);
        editForm.setData({ name: category.name });
    };

    const handleUpdateCategory = (e, categoryId) => {
        e.preventDefault();
        editForm.put(route("admin.documentCategories.update", categoryId), {
            onSuccess: () => setEditingCategoryId(null),
        });
    };

    const handleDeleteCategory = (category) => {
        if (
            confirm(
                `カテゴリ「${category.name}」を削除してもよろしいですか？`,
            )
        ) {
            router.delete(
                route("admin.documentCategories.destroy", category.id),
            );
        }
    };

    const handleDeleteDocument = (document) => {
        if (confirm(`文書「${document.title}」を削除してもよろしいですか？`)) {
            router.delete(route("admin.documents.destroy", document.id));
        }
    };

    const statusBadge = (document) => {
        const active = document.active_version;
        if (!active) {
            return (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    有効バージョンなし
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                有効 v{active.version}
            </span>
        );
    };

    const headerActions = [
        {
            label: "新規文書作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.documents.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={<PageHeader title="文書管理" description="利用規約・ヘルプ・APIドキュメントなどをカテゴリ別に管理します。" actions={headerActions} />}
        >
            <Head title="文書管理" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* カテゴリ管理 */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        カテゴリ
                    </h2>
                    <div className="space-y-2 mb-4">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                            >
                                {editingCategoryId === category.id ? (
                                    <form
                                        onSubmit={(e) =>
                                            handleUpdateCategory(
                                                e,
                                                category.id,
                                            )
                                        }
                                        className="flex items-center gap-2 flex-1"
                                    >
                                        <input
                                            type="text"
                                            value={editForm.data.name}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    "name",
                                                    e.target.value,
                                                )
                                            }
                                            className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                                            autoFocus
                                        />
                                        <PrimaryButton
                                            type="submit"
                                            className="text-xs py-1 px-3"
                                            disabled={editForm.processing}
                                        >
                                            保存
                                        </PrimaryButton>
                                        <SecondaryButton
                                            type="button"
                                            className="text-xs py-1 px-3"
                                            onClick={() =>
                                                setEditingCategoryId(null)
                                            }
                                        >
                                            キャンセル
                                        </SecondaryButton>
                                    </form>
                                ) : (
                                    <>
                                        <span className="font-medium text-gray-900">
                                            {category.name}
                                            <span className="ml-2 text-xs text-gray-400">
                                                {category.documents.length}件の文書
                                            </span>
                                        </span>
                                        <div className="flex gap-2">
                                            <SecondaryButton
                                                type="button"
                                                className="text-xs py-1 px-3"
                                                onClick={() =>
                                                    startEditCategory(category)
                                                }
                                            >
                                                編集
                                            </SecondaryButton>
                                            <DangerButton
                                                type="button"
                                                className="text-xs py-1 px-3"
                                                onClick={() =>
                                                    handleDeleteCategory(
                                                        category,
                                                    )
                                                }
                                            >
                                                削除
                                            </DangerButton>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <form
                        onSubmit={handleCreateCategory}
                        className="flex items-center gap-2"
                    >
                        <input
                            type="text"
                            placeholder="新しいカテゴリ名（例: 法務、ヘルプ、API、社内）"
                            value={categoryForm.data.name}
                            onChange={(e) =>
                                categoryForm.setData("name", e.target.value)
                            }
                            className="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
                        />
                        <PrimaryButton
                            type="submit"
                            disabled={categoryForm.processing}
                        >
                            カテゴリを追加
                        </PrimaryButton>
                    </form>
                    {categoryForm.errors.name && (
                        <p className="text-sm text-red-600 mt-2">
                            {categoryForm.errors.name}
                        </p>
                    )}
                </div>

                {/* カテゴリ別の文書一覧 */}
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="bg-white shadow-sm rounded-lg overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {category.name}
                            </h3>
                        </div>
                        {category.documents.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 text-sm">
                                このカテゴリにはまだ文書がありません。
                            </div>
                        ) : (
                            <div className="divide-y">
                                {category.documents.map((document) => (
                                    <div
                                        key={document.id}
                                        className="flex items-center justify-between px-6 py-4"
                                    >
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-gray-900">
                                                    {document.title}
                                                </span>
                                                {document.requires_acceptance && (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        同意必須
                                                    </span>
                                                )}
                                                {statusBadge(document)}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {document.versions_count}個のバージョン
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={route(
                                                    "admin.documents.edit",
                                                    document.id,
                                                )}
                                            >
                                                <SecondaryButton className="text-xs py-1 px-3">
                                                    編集
                                                </SecondaryButton>
                                            </Link>
                                            <DangerButton
                                                type="button"
                                                className="text-xs py-1 px-3"
                                                onClick={() =>
                                                    handleDeleteDocument(
                                                        document,
                                                    )
                                                }
                                            >
                                                削除
                                            </DangerButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </AdminAuthenticatedLayout>
    );
}
