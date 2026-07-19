import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { FormGroup, TextInput, InputError } from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function Settings({ groups, values }) {
    const initialData = Object.values(groups).reduce((acc, group) => {
        Object.keys(group.fields).forEach((key) => {
            acc[key] = values?.[key] ?? "";
        });
        return acc;
    }, {});

    const { data, setData, post, processing, errors } = useForm(initialData);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.website.siteSetting.settings"));
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="サイト設定"
                    description={PageConfig.siteSettings.description}
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
                        "設定編集",
                    ]}
                />
            }
        >
            <Head title="サイト設定" />

            <FlashMessage />

            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                {Object.entries(groups).map(([groupKey, group]) => (
                    <Card key={groupKey} id={groupKey}>
                        <CardHeader>{group.label}</CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                {Object.entries(group.fields).map(
                                    ([key, meta]) => (
                                        <FormGroup
                                            key={key}
                                            label={meta.label}
                                            htmlFor={key}
                                        >
                                            <TextInput
                                                id={key}
                                                value={data[key] || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        key,
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={processing}
                                            />
                                            <InputError
                                                message={errors[key]}
                                            />
                                        </FormGroup>
                                    ),
                                )}
                            </div>
                        </CardBody>
                    </Card>
                ))}

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
                        保存
                    </PrimaryButton>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
