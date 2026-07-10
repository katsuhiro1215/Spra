import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FormGroup, TextInput, TextArea, InputError } from "@/Components/Forms";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Edit({ project, version, milestone }) {
    const { data, setData, put, processing, errors } = useForm({
        title: milestone.title || "",
        description: milestone.description || "",
        target_date: milestone.target_date || "",
        order: milestone.order || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(
            route("admin.project.versions.milestones.update", {
                project: project.id,
                version: version.id,
                milestone: milestone.id,
            }),
        );
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="マイルストーン編集"
                    description={`${milestone.title} を編集します`}
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
                        { label: milestone.title, href: null },
                    ]}
                />
            }
        >
            <Head title="マイルストーン編集" />

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
                                    v{version.version}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    編集対象
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {milestone.title}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* マイルストーン情報編集 */}
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
                        {processing ? "更新中..." : "更新"}
                    </PrimaryButton>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
