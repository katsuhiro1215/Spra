import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import ServicePlanForm from "./_components/Form";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function Create({
    services,
    billingCycles,
    statuses,
    service_id,
}) {
    const { data, setData, post, processing, errors } = useForm({
        service_id: service_id || "",
        name: "",
        slug: "",
        description: "",
        details: "",
        base_price: "",
        discount_amount: 0,
        billing_cycle: "one_time",
        setup_fee: "",
        max_revisions: "",
        max_carryover_tickets: "",
        estimated_delivery_days: "",
        is_featured: false,
        status: "active",
        is_displayed: true,
        sort_order: 0,
        color: "#3B82F6",
        badge_text: "",
        icon: "",
    });

    const submit = () => {
        // 送信前にデータをクリーンアップ
        if (data.sort_order === "" || data.sort_order === null) {
            setData("sort_order", 0);
        }

        post(route("admin.service.plan.store"));
    };

    const headerActions = [
        {
            label: PageConfig.servicePlans.actions.back,
            route: route("admin.service.plan.index"),
            variant: "ghost",
            icon: ArrowLeftIcon,
        },
    ];

    const breadcrumbs = [
        ...PageConfig.servicePlans.breadcrumbs,
        PageConfig.servicePlans.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.servicePlans.pages.create.title}
                    description={
                        PageConfig.servicePlans.pages.create.description
                    }
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.servicePlans.pages.create.title} />

            <FlashMessage />

            <div className="w-full">
                <ServicePlanForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.service.plan.index")}
                    services={services}
                    billingCycles={billingCycles}
                    statuses={statuses}
                    mode="create"
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
