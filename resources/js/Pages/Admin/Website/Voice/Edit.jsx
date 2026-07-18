import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import VoiceForm from "./_components/VoiceForm";
import * as validation from "./_components/validation";

export default function Edit({ voice, services, users, mediaList }) {
    const { data, setData, put, processing, errors } = useForm({
        user_id: voice.user_id || "",
        service_id: voice.service_id || "",
        avatar_id: voice.avatar_id || "",
        author_name: voice.author_name || "",
        author_title: voice.author_title || "",
        company_name: voice.company_name || "",
        rating: voice.rating || "",
        content: voice.content || "",
        sort_order: voice.sort_order || 0,
        is_featured: voice.is_featured ?? false,
        is_published: voice.is_published ?? true,
    });

    const [localErrors, setLocalErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        const tempData = { ...data, errors: {} };
        validation.validateVoiceForm(tempData);

        if (validation.hasVoiceFormErrors(tempData.errors)) {
            setLocalErrors(tempData.errors);
            return;
        }

        put(route("admin.website.voice.update", voice.id));
    };

    const headerActions = [
        {
            label: "キャンセル",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.voice.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="お客様の声を編集"
                    description={`「${voice.author_name}」を編集します`}
                    actions={headerActions}
                />
            }
        >
            <Head title="お客様の声を編集" />
            <FlashMessage />

            <form onSubmit={handleSubmit} className="w-full">
                <div className="space-y-4">
                    <VoiceForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        localErrors={localErrors}
                        setLocalErrors={setLocalErrors}
                        processing={processing}
                        services={services}
                        users={users}
                        mediaList={mediaList}
                    />

                    {/* アクションボタン */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-end gap-3">
                            <SecondaryButton
                                type="button"
                                href={route("admin.website.voice.index")}
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
