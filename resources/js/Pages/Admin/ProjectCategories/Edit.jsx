import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import ProjectCategoryForm from "./_components/ProjectCategoryForm";

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        color: category.color || "#3B82F6",
        icon: category.icon || "",
        is_active: category.is_active ?? true,
        sort_order: category.sort_order || 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.project-categories.update", category.id));
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        {
            label: "プロジェクトカテゴリ",
            href: route("admin.project-categories.index"),
        },
        { label: category.name, href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="プロジェクトカテゴリ編集"
                    description={`${category.name}を編集`}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`${category.name} - 編集`} />

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
                        {processing ? "更新中..." : "更新"}
                    </PrimaryButton>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
