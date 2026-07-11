import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
// Icons
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
// PostCategory Components
import PostCategoryForm from "./_components/PostCategoryForm";
import * as validation from "./_components/validation";

export default function Edit({ category, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        parent_id: category.parent_id || "",
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        is_active: category.is_active ?? true,
        sort_order: category.sort_order || 0,
    });

    const [localErrors, setLocalErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        // バリデーション
        const tempData = { ...data, errors: {} };
        validation.validatePostCategoryForm(tempData);

        if (validation.hasPostCategoryFormErrors(tempData.errors)) {
            setLocalErrors(tempData.errors);
            return;
        }

        put(route("admin.website.post.category.update", category.id));
    };

    const headerActions = [
        {
            label: "キャンセル",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.post.category.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="カテゴリ編集"
                    description={`「${category.name}」を編集します`}
                    actions={headerActions}
                />
            }
        >
            <Head title={`カテゴリ編集 - ${category.name}`} />
            <FlashMessage />

            <form onSubmit={handleSubmit} className="w-full">
                <div className="space-y-4">
                    <PostCategoryForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        localErrors={localErrors}
                        setLocalErrors={setLocalErrors}
                        processing={processing}
                        categories={categories}
                    />

                    {/* アクションボタン */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-end gap-3">
                            <SecondaryButton
                                type="button"
                                href={route(
                                    "admin.website.post.category.index",
                                )}
                                disabled={processing}
                            >
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                キャンセル
                            </SecondaryButton>
                            <PrimaryButton type="submit" disabled={processing}>
                                <CheckIcon className="h-4 w-4 mr-2" />
                                更新
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
