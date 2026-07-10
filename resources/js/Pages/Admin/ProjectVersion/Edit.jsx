import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    InputError,
} from "@/Components/Forms";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const statusOptions = [
    { value: "draft", label: "下書き" },
    { value: "approved", label: "承認済み" },
    { value: "active", label: "有効" },
    { value: "superseded", label: "置き換え済み" },
    { value: "cancelled", label: "キャンセル" },
];

export default function Edit({ project, version }) {
    const { data, setData, put, processing, errors } = useForm({
        title: version.title || "",
        description: version.description || "",
        start_date: version.start_date || "",
        estimated_end_date: version.estimated_end_date || "",
        total_estimated_hours: version.total_estimated_hours || "",
        status: version.status || "draft",
        revision_reason: version.revision_reason || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(
            route("admin.project.versions.update", {
                project: project.id,
                version: version.id,
            }),
        );
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="バージョン編集"
                    description={`v${version.version} - ${version.title} を編集します`}
                    actions={[
                        {
                            label: "戻る",
                            icon: ArrowLeftIcon,
                            variant: "ghost",
                            route: route(
                                "admin.project.versions.index",
                                project.id,
                            ),
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
                        { label: `v${version.version}`, href: null },
                    ]}
                />
            }
        >
            <Head title="バージョン編集" />

            <FlashMessage />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* プロジェクト情報 */}
                <Card>
                    <CardHeader>
                        <CardTitle>プロジェクト情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    プロジェクト名
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {project.title}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    編集対象バージョン
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    v{version.version}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* バージョン情報編集 */}
                <Card>
                    <CardHeader>
                        <CardTitle>バージョン情報</CardTitle>
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

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormGroup
                                    label="開始予定日"
                                    htmlFor="start_date"
                                >
                                    <TextInput
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) =>
                                            setData(
                                                "start_date",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.start_date}
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="納期"
                                    htmlFor="estimated_end_date"
                                >
                                    <TextInput
                                        id="estimated_end_date"
                                        type="date"
                                        value={data.estimated_end_date}
                                        onChange={(e) =>
                                            setData(
                                                "estimated_end_date",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.estimated_end_date}
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="見積もり時間"
                                    htmlFor="total_estimated_hours"
                                >
                                    <TextInput
                                        id="total_estimated_hours"
                                        type="number"
                                        value={data.total_estimated_hours}
                                        onChange={(e) =>
                                            setData(
                                                "total_estimated_hours",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.total_estimated_hours}
                                    />
                                </FormGroup>
                            </div>

                            <FormGroup
                                label="ステータス"
                                htmlFor="status"
                                required
                            >
                                <SelectInput
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                >
                                    <option value="">ステータスを選択</option>
                                    {statusOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </SelectInput>
                                <InputError
                                    className="mt-2"
                                    message={errors.status}
                                />
                            </FormGroup>

                            <FormGroup
                                label="修正理由"
                                htmlFor="revision_reason"
                            >
                                <TextArea
                                    id="revision_reason"
                                    rows="2"
                                    value={data.revision_reason}
                                    onChange={(e) =>
                                        setData(
                                            "revision_reason",
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.revision_reason}
                                />
                            </FormGroup>
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
                        disabled={processing || !data.title}
                    >
                        {processing ? "更新中..." : "更新"}
                    </PrimaryButton>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
