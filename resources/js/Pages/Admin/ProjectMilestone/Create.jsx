import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FormGroup, TextInput, TextArea, InputError } from "@/Components/Forms";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Create({ project, version }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        target_date: "",
        order: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(
            route("admin.project.versions.milestones.store", {
                project: project.id,
                version: version.id,
            }),
        );
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="マイルストーン新規追加"
                    description={`v${version.version} - ${version.title} にマイルストーンを追加します`}
                    actions={[
                        {
                            label: "戻る",
                            icon: ArrowLeftIcon,
                            variant: "ghost",
                            route: route("admin.project.versions.show", {
                                project: project.id,
                                version: version.id,
                            }),
                        },
                    ]}
                    breadcrumbs={[
                        { label: "ダッシュボード", href: "/admin/dashboard" },
                        {
                            label: "プロジェクト",
                            href: route("admin.project.index"),
                        },
                        {
                            label: project.title,
                            href: route("admin.project.show", project.id),
                        },
                        {
                            label: "バージョン",
                            href: route(
                                "admin.project.versions.index",
                                project.id,
                            ),
                        },
                        {
                            label: `v${version.version}`,
                            href: route("admin.project.versions.show", {
                                project: project.id,
                                version: version.id,
                            }),
                        },
                        { label: "マイルストーン追加", href: null },
                    ]}
                />
            }
        >
            <Head title="マイルストーン新規追加" />

            <FlashMessage />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* コンテキスト情報 */}
                <Card>
                    <CardHeader>
                        <CardTitle>バージョン情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    プロジェクト
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {project.title}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    バージョン
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    v{version.version} - {version.title}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    納期
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {new Date(
                                        version.estimated_end_date,
                                    ).toLocaleDateString("ja-JP")}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* マイルストーン情報入力 */}
                <Card>
                    <CardHeader>
                        <CardTitle>マイルストーン情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            <FormGroup
                                label="タイトル"
                                htmlFor="title"
                                required
                            >
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    placeholder="例：要件定義完了"
                                    error={!!errors.title}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.title}
                                />
                            </FormGroup>

                            <FormGroup label="説明" htmlFor="description">
                                <TextArea
                                    id="description"
                                    rows="3"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    placeholder="このマイルストーンについて説明してください"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.description}
                                />
                            </FormGroup>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup
                                    label="目標日"
                                    htmlFor="target_date"
                                    required
                                >
                                    <TextInput
                                        id="target_date"
                                        type="date"
                                        value={data.target_date}
                                        onChange={(e) =>
                                            setData(
                                                "target_date",
                                                e.target.value,
                                            )
                                        }
                                        error={!!errors.target_date}
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.target_date}
                                    />
                                </FormGroup>

                                <FormGroup label="順序" htmlFor="order">
                                    <TextInput
                                        id="order"
                                        type="number"
                                        value={data.order}
                                        onChange={(e) =>
                                            setData("order", e.target.value)
                                        }
                                        placeholder="マイルストーンの順序を指定"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.order}
                                    />
                                </FormGroup>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 送信ボタン */}
                <div className="flex justify-end gap-3">
                    <SecondaryButton onClick={() => window.history.back()}>
                        キャンセル
                    </SecondaryButton>
                    <PrimaryButton
                        type="submit"
                        disabled={
                            processing || !data.title || !data.target_date
                        }
                    >
                        {processing ? "処理中..." : "マイルストーン追加"}
                    </PrimaryButton>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
