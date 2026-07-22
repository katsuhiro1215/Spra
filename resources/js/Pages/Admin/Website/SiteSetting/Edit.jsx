import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    InputError,
} from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function Edit({ setting }) {
    const initialValue =
        typeof setting.value === "object" && setting.value !== null
            ? JSON.stringify(setting.value)
            : (setting.value ?? "");

    const { data, setData, put, processing, errors } = useForm({
        key: setting.key || "",
        value: initialValue,
        type: setting.type || "string",
        group: setting.group || "",
        description: setting.description || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.website.siteSetting.update", setting.id));
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.siteSettings.pages.edit.title}
                    description={`「${setting.key}」を編集します`}
                    actions={[
                        {
                            label: "サイト設定一覧",
                            icon: ArrowLeftIcon,
                            variant: "secondary",
                            route: route("admin.website.siteSetting.index"),
                        },
                    ]}
                    breadcrumbs={[
                        ...PageConfig.siteSettings.breadcrumbs,
                        PageConfig.siteSettings.pages.edit.breadcrumb,
                    ]}
                />
            }
        >
            <Head title={PageConfig.siteSettings.documentTitle} />

            <FlashMessage />

            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                <Card>
                    <CardHeader>設定情報</CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            <FormGroup label="キー" htmlFor="key" required>
                                <TextInput
                                    id="key"
                                    value={data.key}
                                    onChange={(e) =>
                                        setData("key", e.target.value)
                                    }
                                    disabled={processing}
                                />
                                <InputError message={errors.key} />
                            </FormGroup>

                            <FormGroup label="値" htmlFor="value">
                                <TextArea
                                    id="value"
                                    value={data.value}
                                    onChange={(e) =>
                                        setData("value", e.target.value)
                                    }
                                    disabled={processing}
                                    rows={3}
                                />
                                <InputError message={errors.value} />
                            </FormGroup>

                            <FormGroup label="型" htmlFor="type" required>
                                <SelectInput
                                    id="type"
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    disabled={processing}
                                >
                                    <option value="string">文字列</option>
                                    <option value="json">JSON</option>
                                    <option value="boolean">真偽値</option>
                                    <option value="integer">数値</option>
                                </SelectInput>
                                <InputError message={errors.type} />
                            </FormGroup>

                            <FormGroup label="グループ" htmlFor="group">
                                <TextInput
                                    id="group"
                                    value={data.group}
                                    onChange={(e) =>
                                        setData("group", e.target.value)
                                    }
                                    disabled={processing}
                                />
                                <InputError message={errors.group} />
                            </FormGroup>

                            <FormGroup label="説明" htmlFor="description">
                                <TextInput
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    disabled={processing}
                                />
                                <InputError message={errors.description} />
                            </FormGroup>
                        </div>
                    </CardBody>
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <SecondaryButton
                        type="button"
                        href={route("admin.website.siteSetting.index")}
                        disabled={processing}
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        キャンセル
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        更新
                    </PrimaryButton>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
