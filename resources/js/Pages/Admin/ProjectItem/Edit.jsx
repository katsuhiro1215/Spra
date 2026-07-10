import React, { useMemo } from "react";
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
    { value: "not_started", label: "未着手" },
    { value: "in_progress", label: "進行中" },
    { value: "completed", label: "完了" },
    { value: "on_hold", label: "保留" },
    { value: "cancelled", label: "キャンセル" },
];

const priorityOptions = [
    { value: "low", label: "低" },
    { value: "medium", label: "中" },
    { value: "high", label: "高" },
    { value: "urgent", label: "緊急" },
];

export default function Edit({
    project,
    version,
    item,
    serviceItems,
    milestones,
}) {
    const { data, setData, put, processing, errors } = useForm({
        title: item.name || "",
        description: item.description || "",
        service_item_id: item.service_item_id || "",
        milestone_id: item.milestone_id || "",
        start_date: item.start_date ? item.start_date.split("T")[0] : "",
        end_date: item.end_date ? item.end_date.split("T")[0] : "",
        estimated_hours: item.estimated_hours || "",
        status: item.status || "not_started",
        priority: item.priority || "medium",
        assigned_to: item.assigned_to || "",
    });

    const serviceItemsOptions = useMemo(() => {
        if (!serviceItems) return [];
        return serviceItems.map((s) => ({
            value: s.id,
            label: `${s.name} (¥${(s.standard_price || 0).toLocaleString()})`,
        }));
    }, [serviceItems]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(
            route("admin.project.versions.items.update", {
                project: project.id,
                version: version.id,
                item: item.id,
            }),
        );
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="プロジェクトアイテム編集"
                    description={`${item.name} を編集します`}
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
                        { label: item.name, href: null },
                    ]}
                />
            }
        >
            <Head title="プロジェクトアイテム編集" />

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
                                    {item.name}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* アイテム情報編集 */}
                <Card>
                    <CardHeader>
                        <CardTitle>アイテム情報</CardTitle>
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

                            <FormGroup
                                label="サービスアイテム"
                                htmlFor="service_item_id"
                            >
                                <SelectInput
                                    id="service_item_id"
                                    value={data.service_item_id}
                                    onChange={(e) =>
                                        setData(
                                            "service_item_id",
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="">
                                        サービスアイテムを選択
                                    </option>
                                    {serviceItemsOptions.map((option) => (
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
                                    message={errors.service_item_id}
                                />
                            </FormGroup>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormGroup
                                    label="マイルストーン"
                                    htmlFor="milestone_id"
                                >
                                    <SelectInput
                                        id="milestone_id"
                                        value={data.milestone_id}
                                        onChange={(e) =>
                                            setData(
                                                "milestone_id",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value="">
                                            マイルストーンを選択
                                        </option>
                                        {milestones &&
                                            milestones.map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.title}
                                                </option>
                                            ))}
                                    </SelectInput>
                                    <InputError
                                        className="mt-2"
                                        message={errors.milestone_id}
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="開始日"
                                    htmlFor="start_date"
                                    required
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
                                    label="終了日"
                                    htmlFor="end_date"
                                    required
                                >
                                    <TextInput
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) =>
                                            setData("end_date", e.target.value)
                                        }
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.end_date}
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormGroup
                                    label="見積もり時間"
                                    htmlFor="estimated_hours"
                                >
                                    <TextInput
                                        id="estimated_hours"
                                        type="number"
                                        value={data.estimated_hours}
                                        onChange={(e) =>
                                            setData(
                                                "estimated_hours",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.estimated_hours}
                                    />
                                </FormGroup>

                                <FormGroup label="優先度" htmlFor="priority">
                                    <SelectInput
                                        id="priority"
                                        value={data.priority}
                                        onChange={(e) =>
                                            setData("priority", e.target.value)
                                        }
                                    >
                                        {priorityOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </SelectInput>
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
                        disabled={processing || !data.title}
                    >
                        {processing ? "更新中..." : "更新"}
                    </PrimaryButton>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
