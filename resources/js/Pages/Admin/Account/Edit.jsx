import { Head, usePage } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import UpdateEmailForm from "./_components/UpdateEmailForm";
import UpdatePasswordForm from "./_components/UpdatePasswordForm";
import DeleteAccountForm from "./_components/DeleteAccountForm";

export default function Edit() {
    const { auth } = usePage().props;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="アカウント設定"
                    description="ログイン用のメールアドレス・パスワードを管理します"
                />
            }
        >
            <Head title="アカウント設定" />
            <FlashMessage />

            <div className="w-full max-w-2xl space-y-4">
                <UpdateEmailForm email={auth.admin.email} />
                <UpdatePasswordForm />
                <DeleteAccountForm />
            </div>
        </AdminAuthenticatedLayout>
    );
}
