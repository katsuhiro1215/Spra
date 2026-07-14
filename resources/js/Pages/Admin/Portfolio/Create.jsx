import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import PortfolioForm from "./_components/Form";

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
            header={<PageHeader title="実績の作成" actions={headerActions} />}
        >
            <Head title="実績の作成" />

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
