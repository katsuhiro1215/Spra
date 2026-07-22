import React from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { PageConfig } from "@/Constants/PageConfig";
import {
    CONTRACT_TEMPLATE_TYPE_OPTIONS,
    CONTRACT_TEMPLATE_STATUS_OPTIONS,
} from "@/Constants/SelectOptions";
import { PencilIcon, ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Show({ template }) {
    const templateTypeLabel =
        CONTRACT_TEMPLATE_TYPE_OPTIONS.find(
            (opt) => opt.value === template.template_type,
        )?.label || template.template_type;

    const handleDelete = () => {
        const confirmed = confirm(
            `${template.name} を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(
                route("admin.contract.template.destroy", template.id),
            );
        }
    };

    const headerActions = [
        {
            label: PageConfig.contractTemplates.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contract.template.index"),
        },
        {
            label: PageConfig.contractTemplates.actions.edit,
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.contract.template.edit", template.id),
        },
        {
            label: PageConfig.contractTemplates.actions.delete,
            icon: TrashIcon,
            variant: "danger",
            onClick: handleDelete,
        },
    ];

    const breadcrumbs = [
        ...PageConfig.contractTemplates.breadcrumbs,
        PageConfig.contractTemplates.pages.show.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={template.name}
                    description={PageConfig.contractTemplates.pages.show.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={template.name} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="space-y-6">
                {/* 基本情報 */}
                <Card>
                    <CardHeader>基本情報</CardHeader>
                    <CardBody>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    テンプレート名
                                </dt>
                                <dd className="text-base text-slate-900 dark:text-slate-100">
                                    {template.name}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    テンプレート種別
                                </dt>
                                <dd>
                                    <Badge variant="default">
                                        {templateTypeLabel}
                                    </Badge>
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    ステータス
                                </dt>
                                <dd>
                                    {template.status === "active" ? (
                                        <Badge variant="success">
                                            アクティブ
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary">
                                            非アクティブ
                                        </Badge>
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    表示順
                                </dt>
                                <dd className="text-base text-slate-900 dark:text-slate-100">
                                    {template.sort_order}
                                </dd>
                            </div>

                            {template.description && (
                                <div className="md:col-span-2">
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        説明
                                    </dt>
                                    <dd className="text-base text-slate-900 dark:text-slate-100 whitespace-pre-line">
                                        {template.description}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </CardBody>
                </Card>

                {/* 契約条項 */}
                <Card>
                    <CardHeader>契約条項</CardHeader>
                    <CardBody>
                        {template.terms_and_conditions ? (
                            <p className="text-sm text-slate-900 dark:text-slate-100 whitespace-pre-line">
                                {template.terms_and_conditions}
                            </p>
                        ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                契約条項は設定されていません
                            </p>
                        )}
                    </CardBody>
                </Card>

                {/* 特別条項 */}
                <Card>
                    <CardHeader>特別条項</CardHeader>
                    <CardBody>
                        {template.special_provisions ? (
                            <p className="text-sm text-slate-900 dark:text-slate-100 whitespace-pre-line">
                                {template.special_provisions}
                            </p>
                        ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                特別条項は設定されていません
                            </p>
                        )}
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
