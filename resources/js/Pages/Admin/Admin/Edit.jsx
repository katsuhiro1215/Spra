import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    SelectInput,
    InputError,
} from "@/Components/Forms";
import { SecondaryButton, UpdateButton } from "@/Components/Buttons";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// Constants
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
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "管理者一覧", href: route("admin.admin.index") },
        { label: admin.email, href: route("admin.admin.show", admin.id) },
        { label: "編集", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="管理者編集"
                    description="管理者情報を編集します"
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
                                <div className="p-6 space-y-6">
                                    <FormGroup
                                        label="メールアドレス"
                                        htmlFor="email"
                                        required
                                        help="ログインIDとして使用されます"
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
                                            error={errors.email}
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.email}
                                        />
                                    </FormGroup>

                                    <FormGroup
                                        label="権限"
                                        htmlFor="role"
                                        required
                                    >
                                        <SelectInput
                                            id="role"
                                            name="role"
                                            value={data.role}
                                            onChange={(e) =>
                                                setData("role", e.target.value)
                                            }
                                            options={roles}
                                            error={errors.role}
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.role}
                                        />
                                    </FormGroup>

                                    <FormGroup
                                        label="ステータス"
                                        htmlFor="status"
                                        required
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
                                            error={errors.status}
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.status}
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
                                                <InputError
                                                    className="mt-2"
                                                    message={errors.password}
                                                />
                                            </FormGroup>

                                            <FormGroup
                                                label="パスワード確認"
                                                htmlFor="password_confirmation"
                                                required
                                                help="確認のため、もう一度同じパスワードを入力してください"
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
                                                <InputError
                                                    className="mt-2"
                                                    message={
                                                        errors.password_confirmation
                                                    }
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
