import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import PortfolioForm from "./_components/Form";

export default function Edit({ portfolio, services, mediaList }) {
    const { data, setData, put, processing, errors } = useForm({
        title: portfolio.title || "",
        description: portfolio.description || "",
        media_id: portfolio.media_id || "",
        url: portfolio.url || "",
        completed_at: portfolio.completed_at || "",
        is_displayed: portfolio.is_displayed ?? true,
        sort_order: portfolio.sort_order || 0,
        service_ids: portfolio.services?.map((service) => service.id) || [],
    });

    const submit = () => {
        put(route("admin.portfolio.update", portfolio.id));
    };

    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "default",
            route: route("admin.portfolio.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`実績の編集: ${portfolio.title}`}
                    actions={headerActions}
                />
            }
        >
            <Head title={`実績の編集 - ${portfolio.title}`} />

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
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
