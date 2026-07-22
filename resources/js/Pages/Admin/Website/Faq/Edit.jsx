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
// Faq Components
import FaqForm from "./_components/FaqForm";
import * as validation from "./_components/validation";

export default function Edit({ faq, categories, services }) {
    const { data, setData, put, processing, errors } = useForm({
        faq_category_id: faq.faq_category_id || "",
        question: faq.question || "",
        answer: faq.answer || "",
        sort_order: faq.sort_order || 0,
        is_featured: faq.is_featured ?? false,
        is_published: faq.is_published ?? true,
        service_ids: (faq.services || []).map((service) => service.id),
    });

    const [localErrors, setLocalErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        const tempData = { ...data, errors: {} };
        validation.validateFaqForm(tempData);

        if (validation.hasFaqFormErrors(tempData.errors)) {
            setLocalErrors(tempData.errors);
            return;
        }

        put(route("admin.website.faq.update", faq.id));
    };

    const headerActions = [
        {
            label: "キャンセル",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.faq.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="FAQ編集"
                    description={`「${faq.question}」を編集します`}
                    actions={headerActions}
                />
            }
        >
            <Head title="FAQ編集" />
            <FlashMessage />

            <form onSubmit={handleSubmit} className="w-full">
                <div className="space-y-4">
                    <FaqForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        localErrors={localErrors}
                        setLocalErrors={setLocalErrors}
                        processing={processing}
                        categories={categories}
                        services={services}
                    />

                    {/* アクションボタン */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-end gap-3">
                            <SecondaryButton
                                type="button"
                                href={route("admin.website.faq.index")}
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
