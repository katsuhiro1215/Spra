import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import ServicePlanItemForm from "./_components/Form";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Create({ servicePlan, available_items = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        items: [],
        discount_amount: 0,
    });

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "default",
            href: route("admin.service.plan.show", servicePlan.id),
        },
    ];

    const breadcrumbs = [
        { label: "サービス管理", href: route("admin.service.index") },
        { label: "プラン一覧", href: route("admin.service.plan.index") },
        {
            label: servicePlan.name,
            href: route("admin.service.plan.show", servicePlan.id),
        },
        { label: "アイテムを追加" },
    ];

    const handleSubmit = () => {
        // 割引額を計算
        const basePrice = parseFloat(servicePlan.base_price) || 0;
        const itemsTotal = data.items.reduce((sum, item) => {
            if (item.item_type === "included") return sum;
            return (
                sum +
                (parseFloat(item.standard_price) || 0) * (item.quantity || 1)
            );
        }, 0);
        const discountAmount = Math.max(0, itemsTotal - basePrice);

        // transform を使って送信データを整形
        post(route("admin.service.plan.items.store", servicePlan.id), {
            transform: (data) => ({
                items: data.items.map((item) => ({
                    service_item_id: item.service_item_id,
                    quantity: item.quantity || 1,
                    estimated_days: item.estimated_days || 0,
                    sort_order: item.sort_order || 0,
                })),
                discount_amount: discountAmount,
            }),
        });
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="サービスプラン - アイテムを追加"
                    description={`${servicePlan.name}にサービスアイテムを追加します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`アイテムを追加 - ${servicePlan.name}`} />

            <FlashMessage />

            <ServicePlanItemForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={handleSubmit}
                cancelRoute={route("admin.service.plan.show", servicePlan.id)}
                servicePlan={servicePlan}
                available_items={available_items}
                mode="create"
            />
        </AdminAuthenticatedLayout>
    );
}
