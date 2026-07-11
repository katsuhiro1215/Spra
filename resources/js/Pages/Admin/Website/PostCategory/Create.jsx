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

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        parent_id: "",
        name: "",
        slug: "",
        description: "",
        is_active: true,
        sort_order: 0,
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

        post(route("admin.website.post.category.store"));
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
                    title="カテゴリ作成"
                    description="新しい投稿カテゴリを作成します"
                    actions={headerActions}
                />
            }
        >
            <Head title="カテゴリ作成" />
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
                                作成
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
