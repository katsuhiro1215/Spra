import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// Project Components
import ProjectForm from "./_components/ProjectForm";

export default function Edit({
    project,
    inquiries = [],
    contracts = [],
    users = [],
    companies = [],
    admins = [],
    categories = [],
}) {
    const { data, setData, put, processing, errors } = useForm({
        project_code: project.project_code || "",
        title: project.title || "",
        description: project.description || "",
        status: project.status || "planning",
        priority: project.priority || "medium",
        inquiry_id: project.inquiry_id || "",
        contract_id: project.contract_id || "",
        user_id: project.user_id || "",
        company_id: project.company_id || "",
        admin_id: project.admin_id || "",
        start_date: project.start_date ? project.start_date.split(" ")[0] : "",
        estimated_end_date: project.estimated_end_date
            ? project.estimated_end_date.split(" ")[0]
            : "",
        actual_end_date: project.actual_end_date
            ? project.actual_end_date.split(" ")[0]
            : "",
        is_client_visible: project.is_client_visible || false,
        client_visible_notes: project.client_visible_notes || "",
        internal_notes: project.internal_notes || "",
        category_ids: project.categories
            ? project.categories.map((cat) => cat.id)
            : [],
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.projects.update", project.id));
    };

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.projects.show", project.id),
        },
    ];

    const breadcrumbs = [
        { label: "プロジェクト", href: route("admin.projects.index") },
        {
            label: project.title,
            href: route("admin.projects.show", project.id),
        },
        { label: "編集" },
    ];

    return (
        <AdminAuthenticatedLayout breadcrumbs={breadcrumbs}>
            <Head title={`${project.title} - 編集`} />

            <PageHeader
                title="プロジェクト"
                description={`${project.title}を編集`}
                actions={headerActions}
            />

            <FlashMessage />

            <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <form onSubmit={submit} className="space-y-6">
                    {/* プロジェクト情報 */}
                    <Card>
                        <div className="p-6">
                            <ProjectForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                inquiries={inquiries}
                                contracts={contracts}
                                users={users}
                                companies={companies}
                                admins={admins}
                                categories={categories}
                                isEditMode={true}
                            />
                        </div>
                    </Card>

                    {/* アクションボタン */}
                    <div className="flex items-center justify-end gap-4">
                        <SecondaryButton
                            type="button"
                            href={route("admin.projects.show", project.id)}
                        >
                            キャンセル
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            更新
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminAuthenticatedLayout>
    );
}
