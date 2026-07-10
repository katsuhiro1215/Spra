import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ProjectItemForm from "./_components/Form";

export default function Create({
    project,
    version,
    serviceItems,
    milestones,
    contractItems = [],
}) {
    const { data, setData, post, processing, errors } = useForm({
        items: [],
    });

    const submit = () => {
        post(
            route("admin.project.versions.items.store", {
                project: project.id,
                version: version.id,
            }),
        );
    };

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.project.versions.show", {
                project: project.id,
                version: version.id,
            }),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "プロジェクト", href: route("admin.project.index") },
        {
            label: project.title,
            href: route("admin.project.show", project.id),
        },
        {
            label: "バージョン",
            href: route("admin.project.versions.index", project.id),
        },
        {
            label: `v${version.version}`,
            href: route("admin.project.versions.show", {
                project: project.id,
                version: version.id,
            }),
        },
        { label: "アイテム追加", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="プロジェクトアイテム追加"
                    description={`${project.title} - v${version.version}`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="プロジェクトアイテム追加" />

            <FlashMessage />

            <div className="w-full">
                <ProjectItemForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.project.versions.show", {
                        project: project.id,
                        version: version.id,
                    })}
                    version={version}
                    milestones={milestones}
                    serviceItems={serviceItems}
                    contractItems={contractItems}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
