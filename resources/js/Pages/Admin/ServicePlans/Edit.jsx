import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import ServicePlanForm from "./_components/Form";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function Edit({
    servicePlan,
    services,
    billingCycles,
    statuses,
}) {
    const { data, setData, patch, processing, errors } = useForm({
        service_id: servicePlan.service_id || "",
        name: servicePlan.name || "",
        slug: servicePlan.slug || "",
        description: servicePlan.description || "",
        details: servicePlan.details || "",
        base_price: servicePlan.base_price || "",
        discount_amount: servicePlan.discount_amount || 0,
        billing_cycle: servicePlan.billing_cycle || "one_time",
        setup_fee: servicePlan.setup_fee || "",
        max_revisions: servicePlan.max_revisions || "",
        max_carryover_tickets: servicePlan.max_carryover_tickets ?? "",
        estimated_delivery_days: servicePlan.estimated_delivery_days || "",
        is_featured: servicePlan.is_featured || false,
        status: servicePlan.status || "active",
        is_displayed: servicePlan.is_displayed ?? true,
        sort_order: servicePlan.sort_order || 0,
        color: servicePlan.color || "#3B82F6",
        badge_text: servicePlan.badge_text || "",
        icon: servicePlan.icon || "",
    });

    const submit = () => {
        // 送信前にデータをクリーンアップ
        if (data.sort_order === "" || data.sort_order === null) {
            setData("sort_order", 0);
        }

        patch(route("admin.service.plan.update", servicePlan.id));
    };

    const headerActions = [
        {
            label: PageConfig.servicePlans.actions.back,
            route: route("admin.service.plan.show", servicePlan.id),
            variant: "ghost",
            icon: ArrowLeftIcon,
        },
    ];

    const breadcrumbs = [
        ...PageConfig.servicePlans.breadcrumbs,
        servicePlan.name,
        PageConfig.servicePlans.pages.edit.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.servicePlans.pages.edit.title}
                    description={`"${servicePlan.name}" を編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head
                title={`${PageConfig.servicePlans.pages.edit.title} - ${servicePlan.name}`}
            />

            <FlashMessage />

            <div className="w-full">
                <ServicePlanForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route(
                        "admin.service.plan.show",
                        servicePlan.id,
                    )}
                    services={services}
                    billingCycles={billingCycles}
                    statuses={statuses}
                    mode="edit"
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
