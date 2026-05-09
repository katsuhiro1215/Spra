import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import ProjectInquiryForm from "./_components/ProjectInquiryForm";

export default function Create({ users, companies, admins }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: "",
        company_id: "",
        title: "",
        summary: "",
        budget_min: "",
        budget_max: "",
        desired_delivery_date: "",
        status: "new",
        hearing_notes: "",
        admin_notes: "",
        assigned_admin_id: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.project-inquiries.store"));
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        {
            label: "プロジェクト問い合わせ",
            href: route("admin.project-inquiries.index"),
        },
        { label: "新規作成", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="問い合わせ作成"
                    description="新しいプロジェクト問い合わせを作成"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="問い合わせ作成" />

            <FlashMessage />

            <form onSubmit={handleSubmit} className="space-y-6">
                <ProjectInquiryForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    users={users}
                    companies={companies}
                    admins={admins}
                />

                <div className="flex items-center justify-end gap-4">
                    <SecondaryButton
                        href={route("admin.project-inquiries.index")}
                    >
                        キャンセル
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? "作成中..." : "作成"}
                    </PrimaryButton>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
