import React from "react";
import { Head, usePage, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import SearchBar from "@/Components/SearchBar";
// Icons
import { PlusIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// Components
import ApiClientTable from "./_components/ApiClientTable";
import SnippetBox from "./_components/SnippetBox";

export default function Index({ clients = {}, filters = {}, stats = {} }) {
    const { flash } = usePage().props;
    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
    });

    const handleSearch = () => {
        get(route("admin.contact.api-client.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const headerActions = [
        {
            label: PageConfig.contactApiClients.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.contact.api-client.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.contactApiClients.title}
                    description={PageConfig.contactApiClients.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.contactApiClients.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.contactApiClients.documentTitle} />

            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {flash?.apiKeyReveal && (
                    <SnippetBox
                        reveal={flash.apiKeyReveal}
                        onClose={() =>
                            router.reload({ only: ["clients"] })
                        }
                    />
                )}

                <Card>
                    <div className="p-4">
                        <div className="max-w-md">
                            <SearchBar
                                value={data.search}
                                onChange={(value) => setData("search", value)}
                                onSearch={handleSearch}
                                placeholder={
                                    PageConfig.contactApiClients.search
                                        .placeholder
                                }
                                disabled={processing}
                            />
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-3 gap-4">
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
                </div>

                <ApiClientTable clients={clients} />
                {clients.links && <Pagination paginationData={clients} />}
            </div>
        </AdminAuthenticatedLayout>
    );
}
