import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { PrimaryButton } from "@/Components/Buttons";
import { Card} from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import { PlusIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Index({}) {
    const headerActions = [
        {
            label: PageConfig.pages.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.website.page.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.websiteDashboard.title}
                    description={PageConfig.websiteDashboard.description}
                    actions={headerActions}
                />
            }
        >
            <Head title={PageConfig.websiteDashboard.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full">
                {/* Webサイト管理のコンテンツ */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                test
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
