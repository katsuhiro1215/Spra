import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import Form from "./_components/Form";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function Edit({ template }) {
    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.responseTemplates.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.response.template.index"),
        },
    ];

    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.responseTemplates.breadcrumbs,
        template.name,
        PageConfig.responseTemplates.pages.edit.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`🔖 テンプレートを編集`}
                    description={`「${template.name}」を編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`テンプレートを編集 - ${template.name}`} />

            <FlashMessage />

            {/* フォーム */}
            <div className="max-w-7xl">
                <Form template={template} isEditing={true} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
