import { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    Checkbox,
} from "@/Components/Forms";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import DangerButton from "@/Components/Buttons/DangerButton";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const statusLabel = (status) => {
    if (status === "active") return "有効";
    if (status === "draft") return "ドラフト";
    return "廃止";
};

const statusVariant = (status) => {
    if (status === "active") return "success";
    if (status === "draft") return "warning";
    return "secondary";
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
                <Card>
                    <CardHeader>文書情報</CardHeader>
                    <CardBody>
                        <form onSubmit={handleUpdateMeta} className="space-y-4">
                            <FormGroup label="カテゴリ" htmlFor="document_category_id">
                                <SelectInput
                                    id="document_category_id"
                                    value={metaForm.data.document_category_id}
                                    onChange={(e) =>
                                        metaForm.setData(
                                            "document_category_id",
                                            e.target.value,
                                        )
                                    }
                                    options={categories.map((category) => ({
                                        value: category.id,
                                        label: category.name,
                                    }))}
                                />
                            </FormGroup>
                            <FormGroup
                                label="文書名"
                                htmlFor="title"
                                error={metaForm.errors.title}
                            >
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={metaForm.data.title}
                                    onChange={(e) =>
                                        metaForm.setData("title", e.target.value)
                                    }
                                />
                            </FormGroup>
                            <FormGroup
                                label="説明"
                                htmlFor="description"
                                error={metaForm.errors.description}
                            >
                                <TextInput
                                    id="description"
                                    type="text"
                                    value={metaForm.data.description}
                                    onChange={(e) =>
                                        metaForm.setData(
                                            "description",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormGroup>
                            <Checkbox
                                id="requires_acceptance"
                                label="ユーザーの同意を必須にする"
                                checked={metaForm.data.requires_acceptance}
                                onChange={(e) =>
                                    metaForm.setData(
                                        "requires_acceptance",
                                        e.target.checked,
                                    )
                                }
                            />
                            <div className="flex justify-end">
                                <PrimaryButton
                                    type="submit"
                                    disabled={metaForm.processing}
                                >
                                    {metaForm.processing ? "保存中..." : "文書情報を保存"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </CardBody>
                </Card>

                {/* 現在のドラフト内容編集 */}
                <Card>
                    <CardHeader>内容編集</CardHeader>
                    <CardBody>
                        {draftVersion ? (
                            <form
                                onSubmit={handleUpdateContent}
                                className="space-y-4"
                            >
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    v{draftVersion.version}（ドラフト）を編集中
                                </p>
                                <TextArea
                                    value={contentForm.data.content}
                                    onChange={(e) =>
                                        contentForm.setData(
                                            "content",
                                            e.target.value,
                                        )
                                    }
                                    rows={15}
                                />
                                {contentForm.errors.content && (
                                    <p className="text-sm text-red-600 dark:text-red-400">
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
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    新しいバージョン（v
                                    {(versions[0]?.version || 0) + 1}）を作成
                                </p>
                                <TextArea
                                    value={newVersionForm.data.content}
                                    onChange={(e) =>
                                        newVersionForm.setData(
                                            "content",
                                            e.target.value,
                                        )
                                    }
                                    rows={15}
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
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
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
                    </CardBody>
                </Card>

                {/* バージョン履歴 */}
                <Card>
                    <CardHeader>バージョン履歴</CardHeader>
                    <CardBody>
                        <div className="space-y-2">
                            {versions.map((version) => (
                                <div
                                    key={version.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/40 rounded border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center">
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                            v{version.version}
                                        </span>
                                        <span className="ml-2">
                                            <Badge
                                                variant={statusVariant(
                                                    version.status,
                                                )}
                                            >
                                                {statusLabel(version.status)}
                                            </Badge>
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-3">
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
                    </CardBody>
                </Card>

                {/* 削除 */}
                <Card>
                    <CardBody>
                        <DangerButton type="button" onClick={handleDelete}>
                            この文書を削除
                        </DangerButton>
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
