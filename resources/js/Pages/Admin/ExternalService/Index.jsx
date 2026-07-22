import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import SearchBar from "@/Components/SearchBar";
import { PlusIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import ExternalServiceTable from "./_components/ExternalServiceTable";

export default function Index({ services = {}, filters = {}, stats = {} }) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
    });

    const handleSearch = () => {
        get(route("admin.external-service.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const headerActions = [
        {
            label: PageConfig.externalServices.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.external-service.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.externalServices.title}
                    description={PageConfig.externalServices.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.externalServices.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.externalServices.documentTitle} />

            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                <div className="max-w-md">
                    <SearchBar
                        value={data.search}
                        onChange={(value) => setData("search", value)}
                        onSearch={handleSearch}
                        placeholder={PageConfig.externalServices.search.placeholder}
                        disabled={processing}
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.total || 0}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                全体
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {stats.active || 0}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                有効
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                                {stats.inactive || 0}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                無効
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                {stats.apiLinked || 0}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                API連携設定済み
                            </div>
                        </div>
                    </Card>
                </div>

                <ExternalServiceTable services={services} />
                {services.links && <Pagination paginationData={services} />}
            </div>
        </AdminAuthenticatedLayout>
    );
}
