import React, { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// Quote Components
import QuoteForm from "./_components/Form";

export default function Create({
    users,
    serviceCategories,
    serviceItems,
    projectInquiry = null,
}) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: "",
        company_id: "",
        subject: "",
        message: "",
        valid_until: "",
        notes: "",
        status: "draft",
        discount_type: "fixed",
        discount_amount: 0,
        tax_rate: 10,
        base_amount: 0,
        tax_amount: 0,
        total_amount: 0,
        items: [],
        from_inquiry_id: projectInquiry?.id || null,
    });

    // ProjectInquiryから見積もりを作成する場合、初期値を設定
    useEffect(() => {
        if (projectInquiry) {
            setData({
                ...data,
                user_id: projectInquiry.user_id,
                subject:
                    projectInquiry.title ||
                    `${projectInquiry.service?.name} - ${projectInquiry.service_plan?.name}`,
                message: projectInquiry.summary || "",
                notes: `見積もり依頼 ${projectInquiry.inquiry_code} から作成\n概算金額: ¥${projectInquiry.estimated_price?.toLocaleString()}\n想定納期: 約${projectInquiry.estimated_days}日`,
                from_inquiry_id: projectInquiry.id,
            });
        }
    }, [projectInquiry]);

    const submit = () => {
        post(route("admin.quote.store"));
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.quotes.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.quote.index"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "見積もり一覧", href: route("admin.quote.index") },
        { label: "新規作成", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="見積もり新規作成"
                    description="新しい見積もりを作成します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.quotes.create} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl">
                <QuoteForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.quote.index")}
                    users={users}
                    serviceCategories={serviceCategories}
                    serviceItems={serviceItems}
                    projectInquiry={projectInquiry}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
