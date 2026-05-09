import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import ProjectForm from "./_components/ProjectForm";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Create({
    inquiries = [],
    contracts = [],
    users = [],
    companies = [],
    admins = [],
    categories = [],
}) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        status: "planning",
        priority: "medium",
        inquiry_id: "",
        contract_id: "",
        user_id: "",
        company_id: "",
        admin_id: "",
        start_date: "",
        estimated_end_date: "",
        actual_end_date: "",
        is_client_visible: false,
        client_visible_notes: "",
        internal_notes: "",
        category_ids: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.projects.store"));
    };

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.projects.index"),
        },
    ];

    const breadcrumbs = [
        { label: "プロジェクト", href: route("admin.projects.index") },
        { label: "新規作成" },
    ];

    return (
        <AdminAuthenticatedLayout breadcrumbs={breadcrumbs}>
            <Head title="プロジェクト - 新規作成" />

            <PageHeader
                title="プロジェクト"
                description="新しいプロジェクトを作成"
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
                                isEditMode={false}
                            />
                        </div>
                    </Card>

                    {/* アクションボタン */}
                    <div className="flex items-center justify-end gap-4">
                        <SecondaryButton
                            type="button"
                            href={route("admin.projects.index")}
                        >
                            キャンセル
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            作成
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminAuthenticatedLayout>
    );
}
