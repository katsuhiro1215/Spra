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
    contact = null,
    user = null,
    company = null,
}) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: "",
        contact_id: "",
        company_id: "",
        title: "",
        requirements: "",
        expires_at: "",
        custom_specifications: "",
        status: "draft",
        discount_amount: 0,
        tax_rate: 10,
        base_amount: 0,
        tax_amount: 0,
        total_amount: 0,
        items: [],
        from_inquiry_id: projectInquiry?.id || null,
    });

    // 初期値を設定
    useEffect(() => {
        const updates = {};

        // ProjectInquiryから見積もりを作成する場合
        if (projectInquiry) {
            updates.user_id = projectInquiry.user_id;
            updates.title =
                projectInquiry.title ||
                `${projectInquiry.service?.name} - ${projectInquiry.service_plan?.name}`;
            updates.requirements = projectInquiry.summary || "";
            updates.custom_specifications = `見積もり依頼 ${projectInquiry.inquiry_code} から作成\n概算金額: ¥${projectInquiry.estimated_price?.toLocaleString()}\n想定納期: 約${projectInquiry.estimated_days}日`;
            updates.from_inquiry_id = projectInquiry.id;
        }

        // Contactから見積もりを作成する場合
        if (contact) {
            updates.contact_id = contact.id;
            updates.user_id = contact.user_id || "";
            updates.title = contact.subject || "";
            updates.requirements = `お問い合わせ内容:\n${contact.message}`;
            updates.custom_specifications = `お問い合わせから作成\n連絡先: ${contact.name}\nメール: ${contact.email}\n電話: ${contact.phone || "なし"}\n会社: ${contact.company || "なし"}`;
        }

        // Userから見積もりを作成する場合
        if (user && !contact) {
            updates.user_id = user.id;
            if (user.companies && user.companies.length > 0) {
                updates.company_id = user.companies[0].id;
            }
            updates.title = `${user.profile?.full_name || user.email} 様への見積もり`;
        }

        // Companyから見積もりを作成する場合
        if (company && !user && !contact) {
            updates.company_id = company.id;
            updates.title = `${company.name} 様への見積もり`;
        }

        if (Object.keys(updates).length > 0) {
            setData((prev) => ({ ...prev, ...updates }));
        }
    }, [projectInquiry, contact, user, company]);

    const submit = () => {
        const submitData = {
            ...data,
            custom_specifications: data.custom_specifications
                ? JSON.stringify(data.custom_specifications)
                : null,
        };
        post(route("admin.quote.store"), {
            data: submitData,
        });
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

    // タイトルをコンテキストに応じて変更
    const getTitle = () => {
        if (contact) return `${contact.name} 様への見積もり作成`;
        if (user)
            return `${user.profile?.full_name || user.email} 様への見積もり作成`;
        if (company) return `${company.name} 様への見積もり作成`;
        if (projectInquiry) return `見積もり依頼から見積もり作成`;
        return "見積もり新規作成";
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={getTitle()}
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
