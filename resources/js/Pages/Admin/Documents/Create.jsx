import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        document_category_id: categories[0]?.id || "",
        title: "",
        description: "",
        requires_acceptance: false,
        content: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.documents.store"));
    };

    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.documents.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={<PageHeader title="新規文書を作成" actions={headerActions} />}
        >
            <Head title="新規文書を作成" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg p-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* カテゴリ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                カテゴリ <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.document_category_id}
                                onChange={(e) =>
                                    setData(
                                        "document_category_id",
                                        e.target.value,
                                    )
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.document_category_id && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.document_category_id}
                                </p>
                            )}
                        </div>

                        {/* タイトル */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                文書名 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                placeholder="例: 利用規約、プライバシーポリシー、FAQ"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.title && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* 説明 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                説明
                            </label>
                            <input
                                type="text"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="この文書についての簡単な説明（任意）"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* 同意必須 */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="requires_acceptance"
                                checked={data.requires_acceptance}
                                onChange={(e) =>
                                    setData(
                                        "requires_acceptance",
                                        e.target.checked,
                                    )
                                }
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                                htmlFor="requires_acceptance"
                                className="ml-2 text-sm text-gray-700"
                            >
                                ユーザーの同意を必須にする（アカウント作成時に確認・記録されます）
                            </label>
                        </div>

                        {/* 内容 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                内容（v1） <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={data.content}
                                onChange={(e) =>
                                    setData("content", e.target.value)
                                }
                                placeholder="文書の内容をMarkdown形式で入力してください..."
                                rows={15}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.content && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.content}
                                </p>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                                文書は最初「ドラフト」状態のv1として作成されます。一覧・編集画面から有効化できます。
                            </p>
                        </div>

                        <div className="flex gap-4 justify-end pt-4 border-t">
                            <Link href={route("admin.documents.index")}>
                                <SecondaryButton type="button">
                                    キャンセル
                                </SecondaryButton>
                            </Link>
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? "作成中..." : "作成"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
