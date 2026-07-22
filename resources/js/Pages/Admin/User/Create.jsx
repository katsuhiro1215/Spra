import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { BaseAlert } from "@/Components/Alerts";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { StoreButton, SecondaryButton } from "@/Components/Buttons";
import {
    FormGroup,
    TextInput,
    SelectInput,
    InputError,
} from "@/Components/Forms";
// Icons
import {
    ArrowLeftIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Create({ roles }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        name: "",
        phone: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.user.store"));
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
        { label: "新規作成", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="ユーザー新規登録"
                    description="新しいユーザーアカウントを作成します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="ユーザー新規登録" />

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
                                        error={errors.email}
                                        required
                                        help="ログインIDとして使用されます。パスワードは自動生成され、メールで通知されます。"
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
                                    </FormGroup>
                                </div>
                            </CardBody>
                        </Card>
                        <div className="flex items-center justify-end gap-4">
                            <SecondaryButton
                                href={route("admin.user.index")}
                                size="md"
                            >
                                キャンセル
                            </SecondaryButton>
                            <StoreButton
                                type="submit"
                                disabled={processing}
                                loading={processing}
                                size="md"
                            >
                                {processing ? "作成中..." : "作成"}
                            </StoreButton>
                        </div>
                    </div>
                </form>
            </div>
        </AdminAuthenticatedLayout>
    );
}
