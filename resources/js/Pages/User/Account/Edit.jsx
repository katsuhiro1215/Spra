import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import { FlashMessage } from "@/Components/Notifications";
import UpdateEmailForm from "./_components/UpdateEmailForm";
import UpdatePasswordForm from "./_components/UpdatePasswordForm";
import DeleteAccountForm from "./_components/DeleteAccountForm";

export default function Edit() {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="アカウント設定"
                    description="ログイン用のメールアドレス・パスワードを管理します"
                    breadcrumbs={[
                        {
                            label: "ダッシュボード",
                            href: route("user.dashboard"),
                        },
                        {
                            label: "設定",
                            href: route("user.settings.index"),
                        },
                        { label: "アカウント設定", href: null },
                    ]}
                />
            }
        >
            <Head title="アカウント設定" />
            <FlashMessage />

            <div className="max-w-2xl mx-auto sm:px-6 lg:px-8 py-8 space-y-6">
                <UpdateEmailForm email={auth.user.email} />
                <UpdatePasswordForm />
                <DeleteAccountForm />
            </div>
        </AuthenticatedLayout>
    );
}
