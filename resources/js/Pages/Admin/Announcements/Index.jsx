import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { TextInput, SelectInput } from "@/Components/Forms";
import Pagination from "@/Components/Layout/Pagination";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import AnnouncementsTable from "./_components/AnnouncementsTable";

const STATUS_OPTIONS = [
    { value: "", label: "すべてのステータス" },
    { value: "draft", label: "下書き" },
    { value: "sent", label: "配信済み" },
];

export default function Index({ announcements, filters }) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        status: filters.status || "",
    });

    const handleSearch = (e) => {
        e?.preventDefault();
        get(route("admin.announcement.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (announcement) => {
        if (confirm(`お知らせ「${announcement.title}」を削除しますか？`)) {
            router.delete(
                route("admin.announcement.destroy", announcement.id),
                { preserveScroll: true },
            );
        }
    };

    const headerActions = [
        {
            label: "お知らせ作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.announcement.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="お知らせ配信"
                    description="契約中のユーザーなどへ、メールとダッシュボード通知でお知らせを配信します"
                    actions={headerActions}
                />
            }
        >
            <Head title="お知らせ配信" />
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                <form
                    onSubmit={handleSearch}
                    className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-wrap gap-3 items-end"
                >
                    <div className="flex-1 min-w-[200px]">
                        <TextInput
                            value={data.search}
                            onChange={(e) =>
                                setData("search", e.target.value)
                            }
                            placeholder="タイトルで検索"
                        />
                    </div>
                    <div className="w-48">
                        <SelectInput
                            value={data.status}
                            onChange={(e) => {
                                setData("status", e.target.value);
                                router.get(
                                    route("admin.announcement.index"),
                                    { search: data.search, status: e.target.value },
                                    { preserveState: true, preserveScroll: true },
                                );
                            }}
                            options={STATUS_OPTIONS}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                        検索
                    </button>
                </form>

                <AnnouncementsTable
                    announcements={announcements}
                    onDelete={handleDelete}
                />

                {announcements?.last_page > 1 && (
                    <Pagination paginationData={announcements} />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
