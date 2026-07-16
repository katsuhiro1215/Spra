import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ProjectForm from "./_components/ProjectForm";

export default function Edit({
    project,
    contracts = [],
    users = [],
    companies = [],
    admins = [],
    technologiesByContract = {},
}) {
    const { data, setData, put, processing, errors } = useForm({
        project_code: project.project_code || "",
        title: project.title || "",
        description: project.description || "",
        status: project.status || "planning",
        priority: project.priority || "medium",
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
        technology_ids: (project.technologies || []).map(
            (technology) => technology.id,
        ),
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.project.update", project.id));
    };

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.project.show", project.id),
        },
    ];

    const breadcrumbs = [
        { label: "プロジェクト", href: route("admin.project.index") },
        {
            label: project.title,
            href: route("admin.project.show", project.id),
        },
        { label: "編集" },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="プロジェクト"
                    description={`${project.title}を編集`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`${project.title} - 編集`} />

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
                                contracts={contracts}
                                users={users}
                                companies={companies}
                                admins={admins}
                                technologiesByContract={
                                    technologiesByContract
                                }
                                isEditMode={true}
                            />
                        </div>
                    </Card>

                    {/* アクションボタン */}
                    <div className="flex items-center justify-end gap-4">
                        <SecondaryButton
                            type="button"
                            href={route("admin.project.show", project.id)}
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
