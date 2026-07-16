import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { BaseAlert } from "@/Components/Alerts";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Button, CrudButton } from "@/Components/Buttons";
import { FormGroup, TextInput, SelectInput } from "@/Components/Forms";
import {
    ArrowLeftIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function Create({ roles }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        role: "admin",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.admin.store"));
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.admins.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.admin.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.admins.breadcrumbs,
        PageConfig.admins.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.admins.pages.create.title}
                    description={PageConfig.admins.pages.create.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.admins.pages.create.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            {/* 警告メッセージ */}
            <BaseAlert
                type="warning"
                icon={ExclamationTriangleIcon}
                title="パスワードについて"
            >
                <p>
                    パスワードは自動生成されます。登録後に表示される初期パスワードを必ず控えてください。
                </p>
                <p className="mt-1">メールでも送信されます。</p>
            </BaseAlert>

            <div className="max-w-3xl">
                <form onSubmit={submit}>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>認証情報</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-6">
                                    <FormGroup
                                        label="メールアドレス"
                                        htmlFor="email"
                                        required
                                        help="ログインIDとして使用されます。パスワードは自動生成され、メールで通知されます。"
                                        error={errors.email}
                                    >
                                        <TextInput
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="example@example.com"
                                        />
                                    </FormGroup>

                                    <FormGroup
                                        label="権限"
                                        htmlFor="role"
                                        required
                                        help="owner: オーナー / super_admin: スーパー管理者 / admin: 管理者 / editor: 編集者"
                                        error={errors.role}
                                    >
                                        <SelectInput
                                            id="role"
                                            name="role"
                                            value={data.role}
                                            onChange={(e) =>
                                                setData("role", e.target.value)
                                            }
                                            options={roles}
                                        />
                                    </FormGroup>
                                </div>
                            </CardBody>
                        </Card>

                        <div className="flex items-center justify-end gap-4">
                            <Button
                                variant="secondary"
                                href={route("admin.admin.index")}
                                size="md"
                            >
                                キャンセル
                            </Button>
                            <CrudButton
                                type="submit"
                                action="store"
                                loading={processing}
                            >
                                {processing ? "作成中..." : "作成"}
                            </CrudButton>
                        </div>
                    </div>
                </form>
            </div>
        </AdminAuthenticatedLayout>
    );
}
