import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import ServicePlanForm from "./_components/Form";
// Icons
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
        estimated_delivery_days: "",
        is_featured: false,
        status: "active",
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

        console.log("Submitting form data:", data);

        post(route("admin.service.plan.store"));
    };

    const headerActions = [
        {
            label: "一覧に戻る",
            href: route("admin.service.plan.index"),
            variant: "ghost",
            icon: ArrowLeftIcon,
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="サービスプラン作成"
                    description="新しいプランを作成します"
                    actions={headerActions}
                />
            }
        >
            <Head title="サービスプラン作成" />

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
