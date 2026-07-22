import { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { TextInput } from "@/Components/Forms";
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
            return <Badge variant="secondary">有効バージョンなし</Badge>;
        }
        return <Badge variant="success">有効 v{active.version}</Badge>;
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
                <Card>
                    <CardHeader>カテゴリ</CardHeader>
                    <CardBody>
                        <div className="space-y-2 mb-4">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/40 rounded border border-gray-200 dark:border-gray-700"
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
                                            <TextInput
                                                type="text"
                                                value={editForm.data.name}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                className="text-sm flex-1"
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
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {category.name}
                                                <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
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
                            <TextInput
                                type="text"
                                placeholder="新しいカテゴリ名（例: 法務、ヘルプ、API、社内）"
                                value={categoryForm.data.name}
                                onChange={(e) =>
                                    categoryForm.setData("name", e.target.value)
                                }
                                className="text-sm flex-1"
                            />
                            <PrimaryButton
                                type="submit"
                                disabled={categoryForm.processing}
                            >
                                カテゴリを追加
                            </PrimaryButton>
                        </form>
                        {categoryForm.errors.name && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                                {categoryForm.errors.name}
                            </p>
                        )}
                    </CardBody>
                </Card>

                {/* カテゴリ別の文書一覧 */}
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {category.name}
                            </h3>
                        </div>
                        {category.documents.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                                このカテゴリにはまだ文書がありません。
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {category.documents.map((document) => (
                                    <div
                                        key={document.id}
                                        className="flex items-center justify-between px-6 py-4"
                                    >
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                    {document.title}
                                                </span>
                                                {document.requires_acceptance && (
                                                    <Badge variant="info">
                                                        同意必須
                                                    </Badge>
                                                )}
                                                {statusBadge(document)}
                                            </div>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
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
