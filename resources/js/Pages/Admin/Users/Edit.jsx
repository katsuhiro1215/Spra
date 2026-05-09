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

export default function Edit({ user, statuses }) {
    const { data, setData, put, processing, errors } = useForm({
        email: user.email || "",
        status: user.status || "active",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.user.update", user.id));
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.users.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.user.index"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "ユーザー一覧", href: route("admin.user.index") },
        { label: user.email, href: route("admin.user.show", user.id) },
        { label: "編集", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="ユーザー編集"
                    description="ユーザー情報を編集します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`ユーザー編集 - ${user.email}`} />

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
                                        error={errors.email}
                                        required
                                        help="ログインIDとして使用されます"
                                    >
                                        <TextInput
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="example@example.com"
                                            error={errors.email}
                                        />
                                        <InputError message={errors.email} />
                                    </FormGroup>

                                    <FormGroup
                                        label="ステータス"
                                        error={errors.status}
                                        required
                                    >
                                        <SelectInput
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
                                        <InputError message={errors.status} />
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
                                                    error={errors.password}
                                                />
                                                <InputError message={errors.password} />
                                            </FormGroup>

                                            <FormGroup
                                                label="パスワード確認"
                                                error={
                                                    errors.password_confirmation
                                                }
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
                                                    error={
                                                        errors.password_confirmation
                                                    }
                                                />
                                                <InputError message={errors.password_confirmation} />
                                            </FormGroup>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <div className="flex items-center justify-end gap-4">
                            <SecondaryButton
                                href={route("admin.user.show", user.id)}
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
