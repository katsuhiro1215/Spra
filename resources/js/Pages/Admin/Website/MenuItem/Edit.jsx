import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import MenuItemForm from "./_components/MenuItemForm";
import * as validation from "./_components/validation";

export default function Edit({ menu, menuItem, pages, menuItems }) {
    const { data, setData, put, processing, errors } = useForm({
        parent_id: menuItem.parent_id || "",
        label: menuItem.label || "",
        url: menuItem.url || "",
        description: menuItem.description || "",
        image_path: menuItem.image_path || "",
        page_id: menuItem.page_id || "",
        target: menuItem.target || "_self",
        is_active: menuItem.is_active ?? true,
        sort_order: menuItem.sort_order || 0,
    });

    const [localErrors, setLocalErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        // バリデーション
        const tempData = { ...data, errors: {} };
        validation.validateMenuItemForm(tempData);

        if (validation.hasMenuItemFormErrors(tempData.errors)) {
            setLocalErrors(tempData.errors);
            return;
        }

        put(route("admin.website.menu.item.update", [menu.id, menuItem.id]));
    };

    const headerActions = [
        {
            label: "キャンセル",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.menu.item.index", menu.id),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`${menu.name} - アイテム編集`}
                    description={`「${menuItem.label}」を編集します`}
                    actions={headerActions}
                />
            }
        >
            <Head title={`${menu.name} - アイテム編集 - ${menuItem.label}`} />
            <FlashMessage />

            <form onSubmit={handleSubmit} className="w-full">
                <div className="space-y-4">
                    <MenuItemForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        localErrors={localErrors}
                        setLocalErrors={setLocalErrors}
                        processing={processing}
                        pages={pages}
                        menuItems={menuItems}
                    />

                    {/* アクションボタン */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-end gap-3">
                            <SecondaryButton
                                type="button"
                                href={route(
                                    "admin.website.menu.item.index",
                                    menu.id,
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
