import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Form from "./_components/Form";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Page Config
const PageConfig = {
    title: "🔖 新しいテンプレートを作成",
    description: "新しい返答テンプレートを作成します",
    documentTitle: "テンプレートを作成",
    breadcrumbs: [
        { label: "ダッシュボード", href: route("admin.dashboard") },
        {
            label: "返答テンプレート",
            href: route("admin.response.template.index"),
        },
        { label: "新規作成", href: "#" },
    ],
};

export default function Create() {
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
                <Form isEditing={false} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
