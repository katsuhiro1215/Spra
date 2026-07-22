import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import MenuForm from "./_components/MenuForm";
import * as validation from "./_components/validation";

export default function Edit({ menu }) {
    const { data, setData, put, processing, errors } = useForm({
        name: menu.name || "",
        slug: menu.slug || "",
        description: menu.description || "",
        location: menu.location || "",
    });

    const [localErrors, setLocalErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        // バリデーション
        const tempData = { ...data, errors: {} };
        validation.validateMenuForm(tempData);

        if (validation.hasMenuFormErrors(tempData.errors)) {
            setLocalErrors(tempData.errors);
            return;
        }

        put(route("admin.website.menu.update", menu.id));
    };

    const headerActions = [
        {
            label: "キャンセル",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.menu.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="メニュー編集"
                    description={`「${menu.name}」を編集します`}
                    actions={headerActions}
                />
            }
        >
            <Head title={`メニュー編集 - ${menu.name}`} />
            <FlashMessage />

            <form onSubmit={handleSubmit} className="w-full">
                <div className="space-y-4">
                    <MenuForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        localErrors={localErrors}
                        setLocalErrors={setLocalErrors}
                        processing={processing}
                    />

                    {/* アクションボタン */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-end gap-3">
                            <SecondaryButton
                                type="button"
                                href={route("admin.website.menu.index")}
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
