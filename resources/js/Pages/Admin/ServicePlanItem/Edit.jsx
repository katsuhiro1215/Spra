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
        slug: item.serviceItem?.slug || "",
        item_type: item.serviceItem?.item_type || "",
        standard_price: item.serviceItem?.standard_price || 0,
        quantity: item.quantity || 1,
        estimated_days: item.estimated_days || 0,
        sort_order: item.sort_order || 0,
    }));

    const { data, setData, put, transform, processing, errors } = useForm({
        items: initialItems,
        discount_amount: 0,
    });

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "default",
            route: route("admin.service.plan.show", servicePlan.id),
        },
    ];

    const breadcrumbs = [
        "サービス管理",
        "プラン一覧",
        servicePlan.name,
        "アイテムを設定",
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
        // ※ put() のオプションではなく、useForm() の transform() メソッドとして
        //   呼び出す必要がある（put()のオプションに渡しても無視される）
        transform((data) => ({
            items: data.items.map((item) => ({
                id: item.id || null,
                service_item_id: item.service_item_id,
                quantity: item.quantity || 1,
                estimated_days: item.estimated_days || 0,
                sort_order: item.sort_order || 0,
            })),
            discount_amount: discountAmount,
        }));

        put(route("admin.service.plan.items.update", servicePlan.id));
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="サービスプラン - アイテムを設定"
                    description={`${servicePlan.name}のサービスアイテムを設定します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`アイテムを設定 - ${servicePlan.name}`} />

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
                mode="edit"
            />
        </AdminAuthenticatedLayout>
    );
}
