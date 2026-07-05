import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import ServicePlanForm from "./_components/Form";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Edit({
    servicePlan,
    services,
    billingCycles,
    statuses,
    available_items,
    service_plan_items,
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
        estimated_delivery_days: servicePlan.estimated_delivery_days || "",
        is_featured: servicePlan.is_featured || false,
        status: servicePlan.status || "active",
        sort_order: servicePlan.sort_order || 0,
        color: servicePlan.color || "#3B82F6",
        badge_text: servicePlan.badge_text || "",
        icon: servicePlan.icon || "",
        service_items: service_plan_items || [],
    });

    const submit = () => {
        // 送信前にデータをクリーンアップ
        if (data.sort_order === "" || data.sort_order === null) {
            setData("sort_order", 0);
        }

        // discount_amount を計算: アイテム合計 - 基本料金（ゼロ以上）
        const basePrice = parseFloat(data.base_price) || 0;
        const itemsTotal = data.service_items.reduce((sum, item) => {
            // included は価格を 0 にする
            if (item.item_type === "included") {
                return sum;
            }
            return (
                sum +
                (parseFloat(item.standard_price) || 0) * (item.quantity || 1)
            );
        }, 0);

        // バリデーション：割引額が基本料金を超える場合は送信しない
        const discountAmount = Math.max(0, itemsTotal - basePrice);
        if (discountAmount > basePrice) {
            alert(
                "エラー：割引額が基本料金を超えています。アイテムを削除してください。",
            );
            return;
        }

        setData("discount_amount", discountAmount);

        patch(route("admin.service.plan.update", servicePlan.id));
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
                    title="サービスプラン編集"
                    description={`"${servicePlan.name}" を編集します`}
                    actions={headerActions}
                />
            }
        >
            <Head title="サービスプラン編集" />

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
                    available_items={available_items}
                    mode="edit"
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
