import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import ProjectInquiryForm from "./_components/ProjectInquiryForm";

export default function Edit({ inquiry, users, companies, admins, quotes }) {
    const { data, setData, put, processing, errors } = useForm({
        user_id: inquiry.user_id || "",
        company_id: inquiry.company_id || "",
        title: inquiry.title || "",
        summary: inquiry.summary || "",
        budget_min: inquiry.budget_min || "",
        budget_max: inquiry.budget_max || "",
        desired_delivery_date: inquiry.desired_delivery_date || "",
        status: inquiry.status || "new",
        hearing_notes: inquiry.hearing_notes || "",
        admin_notes: inquiry.admin_notes || "",
        assigned_admin_id: inquiry.assigned_admin_id || "",
        quote_id: inquiry.quote_id || "",
        inquiry_code: inquiry.inquiry_code || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.project-inquiries.update", inquiry.id));
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        {
            label: "プロジェクト問い合わせ",
            href: route("admin.project-inquiries.index"),
        },
        { label: inquiry.inquiry_code, href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="問い合わせ編集"
                    description={`${inquiry.inquiry_code}を編集`}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`${inquiry.inquiry_code} - 編集`} />

            <FlashMessage />

            <form onSubmit={handleSubmit} className="space-y-6">
                <ProjectInquiryForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    users={users}
                    companies={companies}
                    admins={admins}
                    quotes={quotes}
                    isEdit={true}
                />

                <div className="flex items-center justify-end gap-4">
                    <SecondaryButton
                        href={route("admin.project-inquiries.index")}
                    >
                        キャンセル
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? "更新中..." : "更新"}
                    </PrimaryButton>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
