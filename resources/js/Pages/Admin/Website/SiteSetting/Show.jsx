import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function Show({ setting }) {
    const displayValue =
        typeof setting.value === "object" && setting.value !== null
            ? JSON.stringify(setting.value, null, 2)
            : String(setting.value ?? "-");

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={setting.key}
                    description={PageConfig.siteSettings.description}
                    actions={[
                        {
                            label: "サイト設定一覧",
                            icon: ArrowLeftIcon,
                            variant: "secondary",
                            route: route("admin.website.siteSetting.index"),
                        },
                        {
                            label: "編集",
                            icon: PencilIcon,
                            variant: "primary",
                            route: route(
                                "admin.website.siteSetting.edit",
                                setting.id,
                            ),
                        },
                    ]}
                    breadcrumbs={[
                        ...PageConfig.siteSettings.breadcrumbs,
                        PageConfig.siteSettings.pages.show.breadcrumb,
                    ]}
                />
            }
        >
            <Head title={`${PageConfig.siteSettings.documentTitle} - ${setting.key}`} />

            <FlashMessage />

            <Card className="max-w-3xl">
                <CardHeader>設定情報</CardHeader>
                <CardBody>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                キー
                            </dt>
                            <dd className="mt-1 text-sm font-mono text-slate-900 dark:text-slate-100">
                                {setting.key}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                型
                            </dt>
                            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                {setting.type}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                グループ
                            </dt>
                            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                {setting.group || "-"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                説明
                            </dt>
                            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                {setting.description || "-"}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-6">
                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                            値
                        </dt>
                        <dd className="text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 rounded-md p-3 whitespace-pre-wrap">
                            {displayValue}
                        </dd>
                    </div>
                </CardBody>
            </Card>
        </AdminAuthenticatedLayout>
    );
}
