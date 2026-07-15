import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { FormGroup, TextInput, SelectInput } from "@/Components/Forms";
import { SecondaryButton, UpdateButton } from "@/Components/Buttons";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function Edit({ admin, roles, statuses }) {
    const { data, setData, put, processing, errors } = useForm({
        email: admin.email || "",
        role: admin.role || "admin",
        status: admin.status || "active",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.admin.update", admin.id));
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
        PageConfig.admins.pages.edit.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.admins.pages.edit.title}
                    description={PageConfig.admins.pages.edit.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`管理者編集 - ${admin.email}`} />

            <FlashMessage />

            <div className="max-w-4xl">
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
                                        help="ログインIDとして使用されます"
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

                                    <FormGroup
                                        label="ステータス"
                                        htmlFor="status"
                                        required
                                        error={errors.status}
                                    >
                                        <SelectInput
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value,
                                                )
                                            }
                                            options={statuses}
                                        />
                                    </FormGroup>

                                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                                            パスワード変更
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                            パスワードを変更する場合のみ入力してください。
                                        </p>

                                        <div className="space-y-6">
                                            <FormGroup
                                                label="新しいパスワード"
                                                htmlFor="password"
                                                error={errors.password}
                                                help="8文字以上で入力してください"
                                            >
                                                <TextInput
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) =>
                                                        setData(
                                                            "password",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="••••••••"
                                                    id="password"
                                                    name="password"
                                                />
                                            </FormGroup>

                                            <FormGroup
                                                label="パスワード確認"
                                                htmlFor="password_confirmation"
                                                required
                                                help="確認のため、もう一度同じパスワードを入力してください"
                                                error={
                                                    errors.password_confirmation
                                                }
                                            >
                                                <TextInput
                                                    type="password"
                                                    value={
                                                        data.password_confirmation
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "password_confirmation",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="••••••••"
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <div className="flex items-center justify-end gap-4">
                            <SecondaryButton
                                href={route("admin.admin.show", admin.id)}
                                size="md"
                            >
                                キャンセル
                            </SecondaryButton>
                            <UpdateButton
                                type="submit"
                                disabled={processing}
                                loading={processing}
                                size="md"
                            >
                                {processing ? "更新中..." : "更新"}
                            </UpdateButton>
                        </div>
                    </div>
                </form>
            </div>
        </AdminAuthenticatedLayout>
    );
}
