import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import ProjectCategoryForm from "./_components/ProjectCategoryForm";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        slug: "",
        description: "",
        color: "#3B82F6",
        icon: "",
        is_active: true,
        sort_order: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.project-categories.store"));
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        {
            label: "プロジェクトカテゴリ",
            href: route("admin.project-categories.index"),
        },
        { label: "新規作成", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="プロジェクトカテゴリ作成"
                    description="新しいプロジェクトカテゴリを作成"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="プロジェクトカテゴリ作成" />

            <FlashMessage />

            <form onSubmit={handleSubmit} className="space-y-6">
                <ProjectCategoryForm
                    data={data}
                    setData={setData}
                    errors={errors}
                />

                {/* アクションボタン */}
                <div className="flex items-center justify-end gap-4">
                    <SecondaryButton
                        href={route("admin.project-categories.index")}
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
