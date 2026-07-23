import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { FormGroup, TextInput, TextArea, SelectInput } from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const BRAND_OPTIONS = [
    { value: "concierge", label: "Atlas Concierge" },
    { value: "life", label: "Atlas Life" },
    { value: "japan", label: "Atlas Japan" },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        brand: "concierge",
        expires_at: "",
        note: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.atlas-invite-code.store"));
    };

    const headerActions = [
        {
            label: "一覧へ戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.atlas-invite-code.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="招待コードを発行"
                    description="新しい招待コードを1件発行します"
                    actions={headerActions}
                    breadcrumbs={[
                        {
                            label: "招待コード管理",
                            href: route("admin.atlas-invite-code.index"),
                        },
                        { label: "発行" },
                    ]}
                />
            }
        >
            <Head title="招待コードを発行" />

            <FlashMessage />

            <div className="max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>発行内容</CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <FormGroup
                                    label="ブランド"
                                    htmlFor="brand"
                                    required
                                    error={errors.brand}
                                >
                                    <SelectInput
                                        id="brand"
                                        value={data.brand}
                                        onChange={(e) =>
                                            setData("brand", e.target.value)
                                        }
                                        disabled={processing}
                                        options={BRAND_OPTIONS}
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="有効期限"
                                    htmlFor="expires_at"
                                    error={errors.expires_at}
                                    helpText="空欄の場合は無期限になります"
                                >
                                    <TextInput
                                        id="expires_at"
                                        type="datetime-local"
                                        value={data.expires_at}
                                        onChange={(e) =>
                                            setData(
                                                "expires_at",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="管理者向けメモ"
                                    htmlFor="note"
                                    error={errors.note}
                                >
                                    <TextArea
                                        id="note"
                                        value={data.note}
                                        onChange={(e) =>
                                            setData("note", e.target.value)
                                        }
                                        disabled={processing}
                                        rows={4}
                                        placeholder="発行対象や経緯など"
                                    />
                                </FormGroup>
                            </div>
                        </CardBody>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <SecondaryButton
                            type="button"
                            href={route("admin.atlas-invite-code.index")}
                            disabled={processing}
                        >
                            キャンセル
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            発行
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminAuthenticatedLayout>
    );
}
