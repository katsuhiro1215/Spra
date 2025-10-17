import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import PageHeader from "@/Components/Layout/PageHeader";
// ServiceTypePriceItems Components
import PriceItemBasicInfoSection from "./Components/PriceItemBasicInfoSection";
import PriceItemPricingSection from "./Components/PriceItemPricingSection";
import PriceItemOptionsSection from "./Components/PriceItemOptionsSection";
import PriceItemFormActions from "./Components/PriceItemFormActions";

export default function Edit({ serviceType, priceItem, categories, units }) {
    const { data, setData, patch, processing, errors } = useForm({
        category: priceItem.category || "",
        name: priceItem.name || "",
        description: priceItem.description || "",
        price: priceItem.price || "",
        unit: priceItem.unit || "式",
        quantity: priceItem.quantity || 1,
        is_optional: priceItem.is_optional || false,
        is_variable: priceItem.is_variable || false,
        sort_order: priceItem.sort_order || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(
            route("admin.service.priceItem.update", {
                serviceType: serviceType.id,
                priceItem: priceItem.id,
            })
        );
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(price);
    };

    const headerActions = [
        {
            label: "← 価格項目一覧に戻る",
            variant: "secondary",
            route: route("admin.service.priceItem.index", {
                serviceType: serviceType.id,
            }),
        },
    ];

    return (
        <AdminLayout>
            <Head title="価格項目編集" />

            <FlashMessage />

            <div className="space-y-6">
                <PageHeader
                    title="価格項目編集"
                    description={`${serviceType.name} - ${serviceType.service_category?.name}`}
                    actions={headerActions}
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <PriceItemBasicInfoSection
                                data={data}
                                setData={setData}
                                errors={errors}
                                categories={categories}
                                units={units}
                            />

                            <PriceItemPricingSection
                                data={data}
                                setData={setData}
                                errors={errors}
                                units={units}
                                formatPrice={formatPrice}
                            />
                        </div>

                        <div className="space-y-6">
                            <PriceItemOptionsSection
                                data={data}
                                setData={setData}
                                errors={errors}
                            />

                            <PriceItemFormActions
                                processing={processing}
                                serviceType={serviceType}
                                isEdit={true}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
