import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { IconButton } from "@/Components/Buttons";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function Index({ categories }) {
    const handleDelete = (category) => {
        if (confirm(`「${category.name}」を削除しますか？`)) {
            router.delete(route("admin.task-category.destroy", category.id));
        }
    };

    const headerActions = [
        {
            label: "新規作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.task-category.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={<PageHeader title="タスクカテゴリ" description="タスクの分類マスタを管理します" actions={headerActions} />}
        >
            <Head title="タスクカテゴリ" />
            <FlashMessage />
            <Card>
                <div className="divide-y">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: category.color || "#9CA3AF" }}
                                />
                                <span>{category.name}</span>
                            </div>
                            <div className="flex gap-2">
                                <Link href={route("admin.task-category.edit", category.id)}>
                                    <IconButton icon={PencilIcon} />
                                </Link>
                                <IconButton
                                    icon={TrashIcon}
                                    variant="danger-text"
                                    onClick={() => handleDelete(category)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </AdminAuthenticatedLayout>
    );
}
