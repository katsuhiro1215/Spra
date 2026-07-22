import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    Checkbox,
} from "@/Components/Forms";
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
                <div className="max-w-3xl mx-auto">
                    <Card>
                        <CardBody>
                            <form onSubmit={submit} className="space-y-6">
                                {/* カテゴリ */}
                                <FormGroup
                                    label="カテゴリ"
                                    htmlFor="document_category_id"
                                    required
                                    error={errors.document_category_id}
                                >
                                    <SelectInput
                                        id="document_category_id"
                                        value={data.document_category_id}
                                        onChange={(e) =>
                                            setData(
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

                                {/* タイトル */}
                                <FormGroup
                                    label="文書名"
                                    htmlFor="title"
                                    required
                                    error={errors.title}
                                >
                                    <TextInput
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        placeholder="例: 利用規約、プライバシーポリシー、FAQ"
                                    />
                                </FormGroup>

                                {/* 説明 */}
                                <FormGroup
                                    label="説明"
                                    htmlFor="description"
                                    error={errors.description}
                                >
                                    <TextInput
                                        id="description"
                                        type="text"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData("description", e.target.value)
                                        }
                                        placeholder="この文書についての簡単な説明（任意）"
                                    />
                                </FormGroup>

                                {/* 同意必須 */}
                                <Checkbox
                                    id="requires_acceptance"
                                    label="ユーザーの同意を必須にする（アカウント作成時に確認・記録されます）"
                                    checked={data.requires_acceptance}
                                    onChange={(e) =>
                                        setData(
                                            "requires_acceptance",
                                            e.target.checked,
                                        )
                                    }
                                />

                                {/* 内容 */}
                                <FormGroup
                                    label="内容（v1）"
                                    htmlFor="content"
                                    required
                                    error={errors.content}
                                >
                                    <TextArea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) =>
                                            setData("content", e.target.value)
                                        }
                                        placeholder="文書の内容をMarkdown形式で入力してください..."
                                        rows={15}
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        文書は最初「ドラフト」状態のv1として作成されます。一覧・編集画面から有効化できます。
                                    </p>
                                </FormGroup>

                                <div className="flex gap-4 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
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
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
