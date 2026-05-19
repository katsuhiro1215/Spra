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

export default function Edit() {
    const {
        contact,
        response,
        templates = [],
        placeholders = [],
    } = usePage().props;
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const { data, setData, processing, errors } = useForm({
        subject: response.subject || "",
        body: response.body || "",
    });

    const handleSubmit = (e, sendNow = false) => {
        e.preventDefault();

        const submitData = {
            ...data,
            send_now: sendNow,
        };

        router.patch(
            route("admin.contact.responses.update", [contact.id, response.id]),
            submitData,
            {
                preserveScroll: true,
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
        {
            label: `お問い合わせ詳細: ${contact.name}`,
            route: route("admin.contact.show", contact.id),
        },
        {
            label: "返信編集",
            route: route("admin.contact.responses.edit", [
                contact.id,
                response.id,
            ]),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`返信編集: ${contact.name}`}
                    description="下書きの返信を編集します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`返信編集 - ${contact.name}`} />

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
                isEdit={true}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
            />
        </AdminAuthenticatedLayout>
    );
}
