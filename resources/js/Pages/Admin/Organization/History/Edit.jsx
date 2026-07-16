import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import HistoryForm from "./_components/HistoryForm";

export default function Edit({ history }) {
    const { data, setData, put, processing, errors } = useForm({
        event_date: history.event_date ? history.event_date.slice(0, 10) : "",
        title: history.title || "",
        description: history.description || "",
        sort_order: history.sort_order || 0,
        is_published: history.is_published ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.organization.history.update", history.id));
    };

    const headerActions = [
        {
            label: "キャンセル",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.organization.history.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="沿革編集"
                    description={`「${history.title}」を編集します`}
                    actions={headerActions}
                />
            }
        >
            <Head title="沿革編集" />
            <FlashMessage />

            <form onSubmit={handleSubmit} className="w-full">
                <div className="space-y-4">
                    <HistoryForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                    />

                    <div className="flex items-center justify-end gap-3">
                        <SecondaryButton
                            type="button"
                            href={route(
                                "admin.organization.history.index",
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
            </form>
        </AdminAuthenticatedLayout>
    );
}
