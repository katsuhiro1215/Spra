import React, { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import QuoteForm from "./_components/Form";

export default function Create({
    users,
    companies = [],
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
        custom_specifications: "",
        status: "draft",
    });

    // 初期値を設定
    useEffect(() => {
        const updates = {};

        // Contactから見積もりを作成する場合
        if (contact) {
            updates.contact_id = contact.id;
            updates.user_id = contact.user_id || "";
            updates.title = contact.subject || "";
            updates.requirements = `お問い合わせ内容:\n${contact.message}`;
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
    }, [contact, user, company]);

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
        ...PageConfig.quotes.breadcrumbs,
        PageConfig.quotes.pages.create.breadcrumb,
    ];

    // タイトルをコンテキストに応じて変更
    const getTitle = () => {
        if (contact) return `${contact.name} 様への見積もり作成`;
        if (user)
            return `${user.profile?.full_name || user.email} 様への見積もり作成`;
        if (company) return `${company.name} 様への見積もり作成`;
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
            <Head title={getTitle()} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full">
                <QuoteForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.quote.index")}
                    users={users}
                    companies={companies}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
