import { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import DangerButton from "@/Components/Buttons/DangerButton";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const statusLabel = (status) => {
    if (status === "active") return "有効";
    if (status === "draft") return "ドラフト";
    return "廃止";
};

const statusClass = (status) => {
    if (status === "active") return "bg-green-100 text-green-800";
    if (status === "draft") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
};

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

export default function Edit({ document, versions, categories }) {
    const [showNewVersionForm, setShowNewVersionForm] = useState(false);

    const draftVersion = versions.find((v) => v.status === "draft");

    const metaForm = useForm({
        document_category_id: document.document_category_id,
        title: document.title,
        description: document.description || "",
        requires_acceptance: document.requires_acceptance,
    });

    const contentForm = useForm({
        content: draftVersion?.content || "",
    });

    const newVersionForm = useForm({
        content: draftVersion?.content || versions[0]?.content || "",
    });

    const handleUpdateMeta = (e) => {
        e.preventDefault();
        metaForm.put(route("admin.documents.update", document.id));
    };

    const handleUpdateContent = (e) => {
        e.preventDefault();
        contentForm.put(
            route("admin.documents.versions.update", [
                document.id,
                draftVersion.id,
            ]),
        );
    };

    const handleCreateVersion = (e) => {
        e.preventDefault();
        newVersionForm.post(
            route("admin.documents.versions.store", document.id),
            {
                onSuccess: () => setShowNewVersionForm(false),
            },
        );
    };

    const handleActivate = (version) => {
        if (
            confirm(
                `v${version.version} を有効化します。他の有効なバージョンは廃止されます。`,
            )
        ) {
            router.post(
                route("admin.documents.versions.activate", [
                    document.id,
                    version.id,
                ]),
            );
        }
    };

    const handleRevertToDraft = (version) => {
        if (confirm(`v${version.version} をドラフト状態に戻します。`)) {
            router.post(
                route("admin.documents.versions.revertToDraft", [
                    document.id,
                    version.id,
                ]),
            );
        }
    };

    const handleDelete = () => {
        if (confirm(`文書「${document.title}」を削除してもよろしいですか？`)) {
            router.delete(route("admin.documents.destroy", document.id));
        }
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
            header={
                <PageHeader
                    title={`文書編集: ${document.title}`}
                    actions={headerActions}
                />
            }
        >
            <Head title={`文書編集: ${document.title}`} />

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
                {/* メタ情報 */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        文書情報
                    </h2>
                    <form onSubmit={handleUpdateMeta} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                カテゴリ
                            </label>
                            <select
                                value={metaForm.data.document_category_id}
                                onChange={(e) =>
                                    metaForm.setData(
                                        "document_category_id",
                                        e.target.value,
                                    )
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                文書名
                            </label>
                            <input
                                type="text"
                                value={metaForm.data.title}
                                onChange={(e) =>
                                    metaForm.setData("title", e.target.value)
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                説明
                            </label>
                            <input
                                type="text"
                                value={metaForm.data.description}
                                onChange={(e) =>
                                    metaForm.setData(
                                        "description",
                                        e.target.value,
                                    )
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="requires_acceptance"
                                checked={metaForm.data.requires_acceptance}
                                onChange={(e) =>
                                    metaForm.setData(
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
                                ユーザーの同意を必須にする
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <PrimaryButton
                                type="submit"
                                disabled={metaForm.processing}
                            >
                                {metaForm.processing ? "保存中..." : "文書情報を保存"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>

                {/* 現在のドラフト内容編集 */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        内容編集
                    </h2>

                    {draftVersion ? (
                        <form
                            onSubmit={handleUpdateContent}
                            className="space-y-4"
                        >
                            <p className="text-sm text-gray-500">
                                v{draftVersion.version}（ドラフト）を編集中
                            </p>
                            <textarea
                                value={contentForm.data.content}
                                onChange={(e) =>
                                    contentForm.setData(
                                        "content",
                                        e.target.value,
                                    )
                                }
                                rows={15}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {contentForm.errors.content && (
                                <p className="text-sm text-red-600">
                                    {contentForm.errors.content}
                                </p>
                            )}
                            <div className="flex justify-end">
                                <PrimaryButton
                                    type="submit"
                                    disabled={contentForm.processing}
                                >
                                    {contentForm.processing
                                        ? "保存中..."
                                        : "内容を保存"}
                                </PrimaryButton>
                            </div>
                        </form>
                    ) : showNewVersionForm ? (
                        <form
                            onSubmit={handleCreateVersion}
                            className="space-y-4"
                        >
                            <p className="text-sm text-gray-500">
                                新しいバージョン（v
                                {(versions[0]?.version || 0) + 1}）を作成
                            </p>
                            <textarea
                                value={newVersionForm.data.content}
                                onChange={(e) =>
                                    newVersionForm.setData(
                                        "content",
                                        e.target.value,
                                    )
                                }
                                rows={15}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div className="flex gap-4 justify-end">
                                <SecondaryButton
                                    type="button"
                                    onClick={() =>
                                        setShowNewVersionForm(false)
                                    }
                                >
                                    キャンセル
                                </SecondaryButton>
                                <PrimaryButton
                                    type="submit"
                                    disabled={newVersionForm.processing}
                                >
                                    {newVersionForm.processing
                                        ? "作成中..."
                                        : "バージョンを作成"}
                                </PrimaryButton>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <p className="text-sm text-gray-500 mb-4">
                                編集可能なドラフトがありません。新しいバージョンを作成してください。
                            </p>
                            <PrimaryButton
                                type="button"
                                onClick={() => setShowNewVersionForm(true)}
                            >
                                + 新しいバージョンを作成
                            </PrimaryButton>
                        </div>
                    )}
                </div>

                {/* バージョン履歴 */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        バージョン履歴
                    </h2>
                    <div className="space-y-2">
                        {versions.map((version) => (
                            <div
                                key={version.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                            >
                                <div>
                                    <span className="font-semibold">
                                        v{version.version}
                                    </span>
                                    <span
                                        className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${statusClass(
                                            version.status,
                                        )}`}
                                    >
                                        {statusLabel(version.status)}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-3">
                                        {version.effective_date
                                            ? `発効日: ${formatDate(
                                                  version.effective_date,
                                              )}`
                                            : `作成: ${formatDate(
                                                  version.created_at,
                                              )}`}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {version.status === "draft" && (
                                        <PrimaryButton
                                            type="button"
                                            className="text-xs py-1 px-3"
                                            onClick={() =>
                                                handleActivate(version)
                                            }
                                        >
                                            有効化
                                        </PrimaryButton>
                                    )}
                                    {version.status === "active" && (
                                        <SecondaryButton
                                            type="button"
                                            className="text-xs py-1 px-3"
                                            onClick={() =>
                                                handleRevertToDraft(version)
                                            }
                                        >
                                            ドラフトに戻す
                                        </SecondaryButton>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 削除 */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <DangerButton type="button" onClick={handleDelete}>
                        この文書を削除
                    </DangerButton>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
