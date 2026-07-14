import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Form from "./_components/Form";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Edit({ template }) {
    // Page Config
    const PageConfig = {
        title: "🔖 テンプレートを編集",
        description: `「${template.name}」を編集します`,
        documentTitle: "テンプレートを編集",
        breadcrumbs: [
            { label: "ダッシュボード", href: route("admin.dashboard") },
            {
                label: "返答テンプレート",
                href: route("admin.response.template.index"),
            },
            { label: template.name, href: "#" },
        ],
    };

    return (
        <AdminAuthenticatedLayout>
            <Head title={PageConfig.documentTitle} />

            {/* ページヘッダー */}
            <PageHeader
                title={PageConfig.title}
                description={PageConfig.description}
                breadcrumbs={PageConfig.breadcrumbs}
                action={{
                    icon: ArrowLeftIcon,
                    label: "戻る",
                    href: route("admin.response.template.index"),
                    variant: "secondary",
                }}
            />

            {/* フォーム */}
            <div className="mt-8">
                <Form template={template} isEditing={true} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
