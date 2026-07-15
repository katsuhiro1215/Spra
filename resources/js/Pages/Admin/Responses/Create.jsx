import React, { useState } from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";
// Layouts
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import ResponseForm from "./_components/ResponseForm";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Create() {
    const {
        contact,
        templates = [],
        placeholders = [],
    } = usePage().props;
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const { data, setData, processing, errors } = useForm({
        response_template_id: "",
        subject: "",
        body: "",
        send_now: false,
    });

    const handleSubmit = (e, sendNow = false) => {
        e.preventDefault();

        const submitData = {
            ...data,
            send_now: sendNow,
        };

        router.post(
            route("admin.contact.response.store", contact.id),
            submitData,
            {
                preserveScroll: true,
                onSuccess: () => {
                    // 成功時の処理はリダイレクトで行われる
                },
            },
        );
    };

    const headerActions = [
        {
            label: "お問い合わせに戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.contact.show", contact.id),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.contacts.breadcrumbs,
        contact.name,
        PageConfig.responses.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`返信作成: ${contact.name}`}
                    description="お問い合わせに対する返信を作成します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`返信作成 - ${contact.name}`} />

            <FlashMessage />

            <ResponseForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                templates={templates}
                placeholders={placeholders}
                contact={contact}
                onSubmit={handleSubmit}
                isEdit={false}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
            />
        </AdminAuthenticatedLayout>
    );
}
