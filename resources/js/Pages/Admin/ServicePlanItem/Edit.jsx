import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import ServicePlanItemForm from "./_components/Form";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Edit({
    servicePlan,
    servicePlanItems = [],
    available_items = [],
}) {
    // 既存アイテムを初期化
    const initialItems = servicePlanItems.map((item) => ({
        id: item.id,
        service_item_id: item.service_item_id,
        name: item.serviceItem?.name || "",
        item_type: item.serviceItem?.item_type || "",
        standard_price: item.serviceItem?.standard_price || 0,
        quantity: item.quantity || 1,
        estimated_days: item.estimated_days || 0,
        sort_order: item.sort_order || 0,
    }));

    console.log("servicePlanItems:", servicePlanItems);
    console.log("initialItems:", initialItems);

    const { data, setData, put, processing, errors } = useForm({
        items: initialItems,
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
        { label: "アイテムを編集" },
    ];

    // 新規アイテムのみで利用可能
    const getAvailableItemsForNew = () => {
        const existingIds = servicePlanItems.map((i) => i.service_item_id);
        return available_items.filter((item) => !existingIds.includes(item.id));
    };

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
        put(route("admin.service.plan.items.update", servicePlan.id), {
            transform: (data) => ({
                items: data.items.map((item) => ({
                    id: item.id || null,
                    service_item_id: item.service_item_id,
                    quantity: item.quantity || 1,
                    estimated_days: item.estimated_days || 0,
                    sort_order: item.sort_order || 0,
                })),
                discount_amount: discountAmount,
            }),
        });
    };

    // 新規アイテム用のavailable_itemsのみを使用
    const filteredAvailableItems = getAvailableItemsForNew();

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="サービスプラン - アイテムを編集"
                    description={`${servicePlan.name}のサービスアイテムを編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`アイテムを編集 - ${servicePlan.name}`} />

            <FlashMessage />

            <ServicePlanItemForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={handleSubmit}
                cancelRoute={route("admin.service.plan.show", servicePlan.id)}
                servicePlan={servicePlan}
                available_items={getAvailableItemsForNew()}
                mode="edit"
            />
        </AdminAuthenticatedLayout>
    );
}
