import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ProjectForm from "./_components/ProjectForm";

export default function Create({
    contract,
    contracts = [],
    users = [],
    companies = [],
    admins = [],
    technologiesByContract = {},
}) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        status: "planning",
        priority: "medium",
        contract_id: contract?.id || "",
        user_id: contract?.user_id || "",
        company_id: contract?.company_id || "",
        admins: [{ admin_id: "", role: "leader" }],
        start_date: new Date().toISOString().split("T")[0],
        estimated_end_date: "",
        actual_end_date: "",
        is_client_visible: true,
        client_visible_notes: "",
        internal_notes: "",
        technology_ids: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.project.store"));
    };

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.project.index"),
        },
    ];

    const breadcrumbs = [
        { label: "プロジェクト", href: route("admin.project.index") },
        { label: "新規作成" },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="プロジェクト新規作成"
                    description="新しいプロジェクトを作成"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="プロジェクト新規作成" />

            <FlashMessage />

            <div className="max-w-5xl py-6 px-4 sm:px-6 lg:px-8">
                <form onSubmit={submit} className="space-y-6">
                    {/* 契約情報（表示用） */}
                    {contract && (
                        <Card>
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                                    契約情報
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            契約名
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                            {contract.title}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            契約者
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                            {contract.user?.profile?.name ||
                                                contract.user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* プロジェクト情報 */}
                    <Card>
                        <div className="p-6">
                            <ProjectForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                contracts={contracts}
                                users={users}
                                companies={companies}
                                admins={admins}
                                technologiesByContract={
                                    technologiesByContract
                                }
                                isEditMode={false}
                            />
                        </div>
                    </Card>

                    {/* 送信ボタン */}
                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => window.history.back()}>
                            キャンセル
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? "処理中..." : "プロジェクト作成"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminAuthenticatedLayout>
    );
}
