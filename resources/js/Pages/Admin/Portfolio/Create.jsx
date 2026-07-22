import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import PortfolioForm from "./_components/Form";
import { PageConfig } from "@/Constants/PageConfig";

export default function Create({ services, mediaList }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        media_id: "",
        url: "",
        completed_at: "",
        is_displayed: true,
        sort_order: 0,
        service_ids: [],
    });

    const submit = () => {
        post(route("admin.portfolio.store"));
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.portfolios.actions.back,
            icon: ArrowLeftIcon,
            variant: "default",
            route: route("admin.portfolio.index"),
        },
    ];

    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.portfolios.breadcrumbs,
        PageConfig.portfolios.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.portfolios.pages.create.title}
                    description={PageConfig.portfolios.pages.create.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.portfolios.pages.create.title} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-4xl">
                <PortfolioForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.portfolio.index")}
                    services={services}
                    mediaList={mediaList}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
