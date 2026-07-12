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
// Section Components
import SectionForm from "./_components/SectionForm";
import * as validation from "./_components/validation";

export default function Edit({ section, pages }) {
    const { data, setData, put, processing, errors } = useForm({
        page_id: section.page_id || "",
        name: section.name || "",
        role: section.role || "",
        sort_order: section.sort_order || 0,
    });

    const [localErrors, setLocalErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        // バリデーション
        const tempData = { ...data, errors: {} };
        validation.validateSectionForm(tempData);

        if (validation.hasSectionFormErrors(tempData.errors)) {
            setLocalErrors(tempData.errors);
            return;
        }

        put(route("admin.website.section.update", section.id));
    };

    const headerActions = [
        {
            label: "キャンセル",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.section.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="セクション編集"
                    description={`「${section.name}」を編集します`}
                    actions={headerActions}
                />
            }
        >
            <Head title={`セクション編集 - ${section.name}`} />
            <FlashMessage />

            <form onSubmit={handleSubmit} className="w-full">
                <div className="space-y-4">
                    <SectionForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        localErrors={localErrors}
                        setLocalErrors={setLocalErrors}
                        processing={processing}
                        pages={pages}
                    />

                    {/* アクションボタン */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-end gap-3">
                            <SecondaryButton
                                type="button"
                                href={route("admin.website.section.index")}
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
